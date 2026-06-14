import { Users, Key, CheckCircle, AlertCircle } from 'lucide-react'

const stats = [
  { label: 'Total Clients', value: '1', icon: Users, color: 'text-blue-400' },
  { label: 'Active Licenses', value: '1', icon: Key, color: 'text-green-400' },
  { label: 'Expiring Soon', value: '0', icon: AlertCircle, color: 'text-yellow-400' },
  { label: 'Expired', value: '0', icon: CheckCircle, color: 'text-red-400' },
]

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Dashboard</h2>
      <p className="text-gray-500 text-sm mb-8">Welcome back, Diya</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <Icon size={20} className={`${color} mb-3`} />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-gray-500 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Current Client</h3>
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-white font-medium">Auto Parts Manufacturer</p>
            <p className="text-gray-500">Surat, Gujarat</p>
          </div>
          <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs">Active</span>
        </div>
      </div>
    </div>
  )
}