import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Returns a short-lived, signed URL for a single client document.
// Admin-only: documents live in private storage, so the link is generated
// on demand for an authenticated admin rather than stored anywhere.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { caseId, index } = await req.json();
    if (!caseId || typeof index !== 'number') {
      return Response.json({ error: 'caseId and index are required' }, { status: 400 });
    }

    const record = await base44.asServiceRole.entities.Case.get(caseId);
    const doc = (record?.document_urls || [])[index];
    if (!doc || !doc.url) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }

    // Legacy documents uploaded before private storage was enabled keep their
    // permanent public URL.
    if (typeof doc.url === 'string' && /^https?:\/\//i.test(doc.url)) {
      return Response.json({ url: doc.url });
    }

    const { signed_url } = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
      file_uri: doc.url,
      expires_in: 300,
    });

    if (!signed_url) {
      console.error('getDocumentUrl: no signed_url returned for', caseId, index);
      return Response.json({ error: 'Could not generate a link' }, { status: 500 });
    }

    return Response.json({ url: signed_url });
  } catch (error) {
    console.error('getDocumentUrl error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}