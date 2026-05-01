import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './config' // Initialize ForgeRock SDK
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'

function MainPage() {
  const auth = useAuth()
  
  // Add safety check
  if (!auth) {
    console.error('Auth context is null')
    return <LandingPage />
  }
  
  const { isAuthenticated, isLoading } = auth
  
  if (isLoading) {
    return null // Let AuthContext handle loading state
  }
  
  // Show Dashboard if authenticated, otherwise show Landing Page
  return isAuthenticated ? <Dashboard /> : <LandingPage />
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
