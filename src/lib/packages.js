export const PACKAGES = [
  {
    id: "standard",
    name: "Standard Service",
    price: "80.00",
    turnaround: "Up to 3 days",
    description: "Three documented service attempts over three consecutive days, with certified proof of service upon completion.",
    features: ["Three attempts over three days", "Certified proof of service", "Email confirmation"],
    serviceType: "Standard Service",
  },
  {
    id: "rush",
    name: "Rush Service",
    price: "120.00",
    turnaround: "24 hours",
    description: "Priority handling for time-sensitive legal deadlines",
    features: ["24-hour turnaround", "Real-time status updates", "Priority server assignment"],
    serviceType: "Rush Service",
    popular: true,
  },
  {
    id: "same_day",
    name: "Same-Day Service",
    price: "160.00",
    turnaround: "Same day",
    description: "Urgent same-day service for critical filings",
    features: ["Same-day completion", "Dedicated process server", "Immediate confirmation"],
    serviceType: "Same-Day Service",
  },
  {
    id: "substitute",
    name: "Substitute Service",
    price: "95.00",
    turnaround: "3–5 business days",
    description: "Court-authorized alternative service methods",
    serviceType: "Substitute Service",
  },
  {
    id: "corporate",
    name: "Corporate Service",
    price: "110.00",
    turnaround: "3–5 business days",
    description: "Service on registered agents and corporate entities",
    serviceType: "Corporate Service",
  },
  {
    id: "eviction",
    name: "Eviction Notice",
    price: "95.00",
    turnaround: "24–48 hours",
    description: "Eviction and unlawful detainer notice delivery",
    serviceType: "Eviction Notice",
  },
  {
    id: "subpoena",
    name: "Subpoena Service",
    price: "95.00",
    turnaround: "3–5 business days",
    description: "Civil and criminal subpoena service statewide",
    serviceType: "Subpoena Service",
  },
  {
    id: "skip_tracing",
    name: "Skip Tracing",
    price: "59.00",
    turnaround: "1–3 business days",
    description: "Locate hard-to-find recipients for successful service",
    serviceType: "Skip Tracing",
  },
];

export const FEATURED_IDS = ["standard", "rush", "same_day"];

export const FEATURED_PACKAGES = PACKAGES.filter((p) => FEATURED_IDS.includes(p.id));

export const getPackage = (id) => PACKAGES.find((p) => p.id === id) || PACKAGES[0];