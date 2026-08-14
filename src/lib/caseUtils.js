import { PACKAGES } from "./packages";

// Count chargeable units for a stored Case record (snake_case fields).
// Each primary address + each additional respondent is charged at full package price.
export const chargeableUnits = (c) => {
  const primaryAddresses = [c.respondent_address, ...(c.additional_addresses || [])]
    .filter((a) => a && a.trim()).length;
  const additionalRespondents = (c.additional_respondents || []).length;
  return Math.max(1, primaryAddresses) + additionalRespondents;
};

// Find per-unit package price by package_name, then service_type fallback.
export const getUnitPrice = (c) => {
  const pkg =
    PACKAGES.find((p) => p.name === c.package_name) ||
    PACKAGES.find((p) => p.serviceType === c.service_type);
  return pkg ? parseFloat(pkg.price) : 0;
};

// Calculate the correct total the customer should have been charged.
export const calculateCaseTotal = (c) => {
  const unitPrice = getUnitPrice(c);
  if (unitPrice > 0) return unitPrice * chargeableUnits(c);
  return parseFloat(c.package_price) || 0;
};