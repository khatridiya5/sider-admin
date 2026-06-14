const BASE = "https://gst-manufacturing-backend.onrender.com"

export const api = {
  // Licenses
  createLicense: async (data) => {
    const res = await fetch(`${BASE}/api/license/admin/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  getLicenses: async () => {
    const res = await fetch(`${BASE}/api/license/admin/list`)
    return res.json()
  },

  revokeLicense: async (licenseKey) => {
    const res = await fetch(`${BASE}/api/license/admin/revoke/${licenseKey}`, {
      method: "POST"
    })
    return res.json()
  }
}