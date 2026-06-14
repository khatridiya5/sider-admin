import { useState } from 'react'
import { Plus, X } from 'lucide-react'

const INITIAL = [
  { id: 1, name: 'Owner', company: 'Auto Parts Manufacturer', email: 'client@example.com', phone: '9876543210', active: true }
]

export default function Clients() {
  const [clients, setClients] = useState(INITIAL)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '' })

  const add = () => {
    if (!form.name || !form.company) return
    setClients([...clients, { id: Date.now(), ...form, active: true }])
    setForm({ name: '', company: '', email: '', phone: '' })
    setShowForm(false)
  }

  const toggle = (id) => setClients(clients.map(c => c.id === id ? { ...c, active: !c.active } : c))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Clients</h2>
          <p className="text-gray-500 text-sm">Manage your SIDERS clients</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg text-sm"
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Add Client Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">New Client</h3>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-gray-500" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'name', placeholder: 'Contact Name' },
              { key: 'company', placeholder: 'Company Name' },
              { key: 'email', placeholder: 'Email' },
              { key: 'phone', placeholder: 'Phone' },
            ].map(({ key, placeholder }) => (
              <input
                key={key}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
                placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
              />
            ))}
          </div>
          <button
            onClick={add}
            className="mt-4 bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-2 rounded-lg text-sm"
          >
            Save Client
          </button>
        </div>
      )}

      {/* Clients Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-left">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Company</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} className="border-b border-gray-800 last:border-0">
                <td className="px-5 py-3 text-white">{c.name}</td>
                <td className="px-5 py-3 text-gray-300">{c.company}</td>
                <td className="px-5 py-3 text-gray-400">{c.email}</td>
                <td className="px-5 py-3 text-gray-400">{c.phone}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggle(c.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      c.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {c.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}