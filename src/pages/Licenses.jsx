import { useState, useEffect } from 'react'
import { Plus, Copy, X, Eye, EyeOff } from 'lucide-react'
import { api } from '../api'

function generateKey() {
  const seg = () => Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SIDERS-${seg()}-${seg()}-${seg()}`
}

export default function Licenses() {
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    company_id: '',
    machines: 2,
    expiry: '',
    key: generateKey(),
    allowed_username: '',   // ✅ NEW
    allowed_password: '',   // ✅ NEW
  })
  const [showPassword, setShowPassword] = useState(false)  // ✅ NEW
  const [copied, setCopied] = useState(null)
  const [error, setError] = useState('')

  const fetchLicenses = async () => {
    setLoading(true)
    try {
      const data = await api.getLicenses()
      setLicenses(Array.isArray(data) ? data : [])
    } catch (e) {
      setError('Failed to load licenses')
    }
    setLoading(false)
  }

  useEffect(() => { fetchLicenses() }, [])

  const add = async () => {
    // ✅ NEW: validate username/password too
    if (!form.company_id || !form.expiry || !form.allowed_username || !form.allowed_password) {
      setError('All fields including username and password are required')
      return
    }
    if (form.allowed_password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setError('')
    const res = await api.createLicense({
      company_id: parseInt(form.company_id),
      license_key: form.key,
      max_devices: form.machines,
      valid_until: form.expiry,
      allowed_username: form.allowed_username,   // ✅ NEW
      allowed_password: form.allowed_password,   // ✅ NEW
    })
    if (res.status === 'ok') {
      setShowForm(false)
      setForm({ company_id: '', machines: 2, expiry: '', key: generateKey(), allowed_username: '', allowed_password: '' })
      fetchLicenses()
    } else {
      setError(res.detail || 'Failed to create license')
    }
  }

  const revoke = async (key) => {
    if (!confirm('Revoke this license?')) return
    setError('')
    try {
      const res = await api.revokeLicense(key)
      if (res.status !== 'ok') {
        setError(res.detail || 'Failed to revoke license')
        return
      }
      await fetchLicenses()
    } catch (e) {
      setError('Network error while revoking license: ' + e.message)
    }
  }

  const activate = async (key) => {
    if (!confirm('Reactivate this license?')) return
    setError('')
    try {
      const res = await api.activateLicense(key)
      if (res.status !== 'ok') {
        setError(res.detail || 'Failed to activate license')
        return
      }
      await fetchLicenses()
    } catch (e) {
      setError('Network error while activating license: ' + e.message)
    }
  }

  const copy = (key) => {
    navigator.clipboard.writeText(key)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const isExpired = (expiry) => expiry && new Date(expiry) < new Date()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Licenses</h2>
          <p className="text-gray-500 text-sm">Generate and manage license keys</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg text-sm"
        >
          <Plus size={16} /> Generate License
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">New License</h3>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-gray-500" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
              placeholder="Company ID (number)"
              value={form.company_id}
              onChange={e => setForm({ ...form, company_id: e.target.value })}
            />
            <input
              type="number"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
              placeholder="Max Machines"
              value={form.machines}
              onChange={e => setForm({ ...form, machines: parseInt(e.target.value) })}
            />
            <input
              type="date"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
              value={form.expiry}
              onChange={e => setForm({ ...form, expiry: e.target.value })}
            />
            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
              <code className="text-green-400 text-xs flex-1">{form.key}</code>
              <button onClick={() => setForm({ ...form, key: generateKey() })}
                className="text-gray-500 hover:text-white text-xs">↻</button>
            </div>

            {/* ✅ NEW: credential fields */}
            <input
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
              placeholder="Login Username for this license"
              value={form.allowed_username}
              onChange={e => setForm({ ...form, allowed_username: e.target.value })}
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500 pr-10"
                placeholder="Login Password for this license"
                value={form.allowed_password}
                onChange={e => setForm({ ...form, allowed_password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* ✅ hint text */}
          <p className="text-gray-600 text-xs mb-3">
            Only this username + password will work when logging in with this license key.
          </p>

          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
          <button onClick={add}
            className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-2 rounded-lg text-sm">
            Generate
          </button>
        </div>
      )}

      {error && !showForm && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-gray-500 text-sm p-5">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-left">
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">License Key</th>
                <th className="px-5 py-3">Machines</th>
                <th className="px-5 py-3">Expiry</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map(l => (
                <tr key={l.id} className="border-b border-gray-800 last:border-0">
                  <td className="px-5 py-3 text-white">{l.company}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-green-400 text-xs">{l.license_key}</code>
                      <button onClick={() => copy(l.license_key)}>
                        <Copy size={12} className={copied === l.license_key ? 'text-green-400' : 'text-gray-600 hover:text-gray-400'} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-300">{l.devices_used}/{l.max_devices}</td>
                  <td className={`px-5 py-3 ${isExpired(l.valid_until) ? 'text-red-400' : 'text-gray-300'}`}>
                    {l.valid_until || '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      l.status === 'active' && !isExpired(l.valid_until)
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {l.status === 'revoked' ? 'Revoked' : isExpired(l.valid_until) ? 'Expired' : 'Active'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {l.status === 'active' ? (
                      <button onClick={() => revoke(l.license_key)}
                        className="text-red-400 hover:text-red-300 text-xs">
                        Revoke
                      </button>
                    ) : l.status === 'revoked' ? (
                      <button onClick={() => activate(l.license_key)}
                        className="text-green-400 hover:text-green-300 text-xs">
                        Activate
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
              {licenses.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-600">No licenses yet</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}