import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Licenses from './pages/Licenses'
import Layout from './components/Layout'

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('admin_token'))

  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/licenses" element={<Licenses />} />
      </Routes>
    </Layout>
  )
}