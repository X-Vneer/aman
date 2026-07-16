export const ROLES = ["Admin", "Marketer", "Seller", "Accountant"] as const

export const PERMISSIONS_OBJ = {
  Overview: false,
  Website_Management: false,
  Coupon: {
    Add: false,
    Edit: false,
    Export: false,
  },
  User: {
    Add: false,
    Edit: false,
    Delete: false,
    Export: false,
  },
  Financial: {
    Edit: false,
    Export: false,
  },
  Awareness: {
    Add: false,
    Edit: false,
    Delete: false,
  },
  Programs: {
    Add: false,
    Edit: false,
    Delete: false,
  },
}
