import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './Components/LandingPage'
import Login from './Components/Login'
import Signup from './Components/SignUp'
import App from './App'
import ForgotPassword from './Components/ForgotPassword'
import AIChat from './Components/AIChat'
import ContactChoice from './Components/ContactChoice'

export default function Router() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/app" element={<App />} />
        <Route path="/ai" element={<AIChat/>} />
        <Route path="/contact-choice" element={<ContactChoice />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </div>
  )
}
