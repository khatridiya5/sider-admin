import { useState, useEffect } from 'react'
import { Plus, X, Eye, EyeOff } from 'lucide-react'
import { api } from '../api'

const STATES = [
  { name: 'Andhra Pradesh', code: '37' },
  { name: 'Arunachal Pradesh', code: '12' },
  { name: 'Assam', code: '18' },
  { name: 'Bihar', code: '10' },
  { name: 'Chhattisgarh', code: '22' },
  { name: 'Goa', code: '30' },
  { name: 'Gujarat', code: '24' },
  { name: 'Haryana', code: '06' },
  { name: 'Himachal Pradesh', code: '02' },
  { name: 'Jharkhand', code: '20' },
  { name: 'Karnataka', code: '29' },
  { name: 'Kerala', code: '32' },
  { name: 'Madhya Pradesh', code: '23' },
  { name: 'Maharashtra', code: '27' },
  { name: 'Manipur', code: '14' },
  { name: 'Meghalaya', code: '17' },
  { name: 'Mizoram', code: '15' },
  { name: 'Nagaland', code: '13' },
  { name: 'Odisha', code: '21' },
  { name: 'Punjab', code: '03' },
  { name: 'Rajasthan', code: '08' },
  { name: 'Sikkim', code: '11' },
  { name: 'Tamil Nadu', code: '33' },
  { name: 'Telangana', code: '36' },
  { name: 'Tripura', code: '16' },
  { name: 'Uttar Pradesh', code: '09' },
  { name: 'Uttarakhand', code: '05' },
  { name: 'West Bengal', code: '19' },
  { name: 'Delhi', code: '07' },
]

const EMPTY_FORM = {
  company_name: '',
  gstin: '',
  state: '',
  pan: '',
  address: '',
  phone: '',
  company_email: '',
  admin_name: '',
  admin_email: '',
  admin_password: '',
}

export default function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [created, setCreated] = useState(null) // { company_name, admin_email, admin_password }

  const fetchClients = async () => {
    setLoading(true)
    try {
      const data = await api.getClients()
      setClients(Array.isArray(data) ? data : [])
    } catch (e) {
      setError('Failed to load clients')
    }
    setLoading(false)
  }

  useEffect(() => { fetchClients() }, [])

  const stateCode = (stateName) => STATES.find(s => s.name === stateName)?.code || '00'

  const add = async () => {
    setError('')
    const required = ['company_name', 'gstin', 'state', 'admin_name', 'admin_email', 'admin_password']
    for (const key of required) {
      if (!form[key]) {
        setError('Please fill all required fields')
        return
      }
    }
    if (form.admin_password.length < 8) {
      setError('Admin password must be at least 8 characters')
      return
    }
    if (form.gstin.length !== 15) {
      setError('GSTIN must be exactly 15 characters')
      return
    }
    if (form.pan && form.pan.length !== 10) {
      setError('PAN must be exactly 10 characters')
      return
    }

    try {
      const res = await api.createClient({
        company_name: form.company_name,
        gstin: form.gstin,
        state: form.state,
        state_code: stateCode(form.state),
        pan: form.pan || null,
        address: form.address || null,
        phone: form.phone || null,
        company_email: form.company_email || null,
        admin_name: form.admin_name,
        admin_email: form.admin_email,
        admin_password: form.admin_password,
      })

      if (res.status === 'ok') {
        setCreated({
          company_name: form.company_name,
          admin_email: form.admin_email,
          admin_password: form.admin_password,
        })
        setForm(EMPTY_FORM)
        setShowForm(false)
        fetchClients()
      } else {
        let msg = 'Failed to create client'
        if (typeof res.detail === 'string') {
          msg = res.detail
        } else if (Array.isArray(res.detail)) {
          msg = res.detail.map(d => `${d.loc?.slice(-1)[0]}: ${d.msg}`).join('; ')
        }
        setError(msg)
      }
    } catch (e) {
      setError('Network error: ' + e.message)
    }
  }

  const toggle = async (userId) => {
    setError('')
    try {
      const res = await api.toggleClientAdmin(userId)
      if (res.status !== 'ok') {
        setError(res.detail || 'Failed to update status')
        return
      }
      fetchClients()
    } catch (e) {
      setError('Network error: ' + e.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Clients</h2>
          <p className="text-gray-500 text-sm">Manage your SIDERS clients</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setCreated(null) }}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg text-sm"
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {created && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-3 mb-6">
          <p className="font-semibold mb-1">Client created: {created.company_name}</p>
          <p>Admin login — Email: <code className="text-white">{created.admin_email}</code></p>
          <p>Password: <code className="text-white">{created.admin_password}</code></p>
          <p className="text-green-500/70 mt-1 text-xs">Save these credentials now — the password won't be shown again.</p>
        </div>
      )}

      {/* Add Client Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">New Client</h3>
            <button onClick={() => { setShowForm(false); setError('') }}><X size={16} className="text-gray-500" /></button>
          </div>

          <p className="text-gray-500 text-xs uppercase mb-2">Company Details</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
              placeholder="Company Name *"
              value={form.company_name}
              onChange={e => setForm({ ...form, company_name: e.target.value })}
            />
            <input
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
              placeholder="GSTIN * (15 characters)"
              maxLength={15}
              value={form.gstin}
              onChange={e => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
            />
            <select
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
              value={form.state}
              onChange={e => setForm({ ...form, state: e.target.value })}
            >
              <option value="">Select State *</option>
              {STATES.map(s => (
                <option key={s.code} value={s.name}>{s.name}</option>
              ))}
            </select>
            <input
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
              placeholder="PAN (10 characters)"
              maxLength={10}
              value={form.pan}
              onChange={e => setForm({ ...form, pan: e.target.value.toUpperCase() })}
            />
            <input
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
              placeholder="Phone"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
              placeholder="Company Email"
              value={form.company_email}
              onChange={e => setForm({ ...form, company_email: e.target.value })}
            />
            <input
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500 col-span-2"
              placeholder="Address"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <p className="text-gray-500 text-xs uppercase mb-2">Admin Login</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
              placeholder="Admin Name *"
              value={form.admin_name}
              onChange={e => setForm({ ...form, admin_name: e.target.value })}
            />
            <input
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
              placeholder="Admin Email *"
              value={form.admin_email}
              onChange={e => setForm({ ...form, admin_email: e.target.value })}
            />
            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 col-span-2">
              <input
                type={showPassword ? 'text' : 'password'}
                className="bg-transparent text-white text-sm outline-none flex-1"
                placeholder="Admin Password (min 8 chars) *"
                value={form.admin_password}
                onChange={e => setForm({ ...form, admin_password: e.target.value })}
              />
              <button onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={14} className="text-gray-500" /> : <Eye size={14} className="text-gray-500" />}
              </button>
            </div>
          </div>

          <button onClick={add}
            className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-2 rounded-lg text-sm">
            Create Client & Admin
          </button>
        </div>
      )}

      {/* Clients Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-gray-500 text-sm p-5">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-left">
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">GSTIN</th>
                <th className="px-5 py-3">State</th>
                <th className="px-5 py-3">Admin</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => {
                const admin = c.admins?.[0]
                return (
                  <tr key={c.id} className="border-b border-gray-800 last:border-0">
                    <td className="px-5 py-3 text-white">{c.name}</td>
                    <td className="px-5 py-3 text-gray-400">
                      <code className="text-xs">{c.gstin}</code>
                    </td>
                    <td className="px-5 py-3 text-gray-300">{c.state}</td>
                    <td className="px-5 py-3 text-gray-400">{admin ? admin.email : '—'}</td>
                    <td className="px-5 py-3">
                      {admin ? (
                        <button
                          onClick={() => toggle(admin.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            admin.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </button>
                      ) : '—'}
                    </td>
                  </tr>
                )
              })}
              {clients.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-600">No clients yet</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}