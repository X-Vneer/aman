export const ROLES = ["Admin", "Marketer"] as const

export const PERMISSIONS_OBJ = {
  Overview: false,
  Website_Management: false,
  User: {
    Add: false,
    Edit: false,
    Delete: false,
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
