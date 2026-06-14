import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Key, LogOut } from 'lucide-react'

export default function Layout({ children }) {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('admin_token')
    window.location.reload()
  }

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 flex flex-col border-r border-gray-800">
        <div className="p-5 border-b border-gray-800">
          <h1 className="text-xl font-bold text-green-400">SIDERS</h1>
          <p className="text-xs text-gray-500 mt-1">Super Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/clients', icon: Users, label: 'Clients' },
            { to: '/licenses', icon: Key, label: 'Licenses' },
          ].map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-green-500/10 text-green-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-7 py-4 text-sm text-gray-500 hover:text-red-400 border-t border-gray-800"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}