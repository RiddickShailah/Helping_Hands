export const DEMO_ACCOUNTS = {
  donor: {
    email: "donor@helpinghands.dev",
    password: "password123",
    label: "Demo Donor",
    description: "Browse campaigns, donate, and volunteer",
    role: "DONOR" as const,
  },
  organizer: {
    email: "organizer@helpinghands.dev",
    password: "password123",
    label: "Demo Organizer",
    description: "Manage campaigns and review commitments",
    role: "ORGANIZER" as const,
  },
} as const;

export const DEMO_CARD = {
  number: "4242424242424242",
  exp: "12/28",
  cvc: "123",
  zip: "30303",
  brand: "Visa",
} as const;
