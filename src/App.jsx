import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import './config' // Initialize ForgeRock SDK
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ApiTestPage from './pages/ApiTestPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/api-test" element={<ApiTestPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
