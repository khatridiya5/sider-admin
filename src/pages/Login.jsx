import { useState } from 'react'

const ADMIN_USER = 'diya'
const ADMIN_PASS = 'siders@admin2025'

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handle = (e) => {
    e.preventDefault()
    if (form.username === ADMIN_USER && form.password === ADMIN_PASS) {
      localStorage.setItem('admin_token', 'local-auth')
      onLogin()
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-green-400 mb-1">SIDERS</h1>
        <p className="text-gray-500 text-sm mb-6">Admin Panel</p>
        <form onSubmit={handle} className="space-y-4">
          <input
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-green-500"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-2 rounded-lg text-sm transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}