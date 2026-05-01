import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './config' // Initialize ForgeRock SDK
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return null
  }
  
  return isAuthenticated ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
