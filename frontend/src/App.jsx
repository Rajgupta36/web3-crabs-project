// src/App.jsx
import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UserDashboard from './pages/UserDashboard'
import ManageHeirs from './pages/ManageHeirs'
import WalletSignUp from './signin'
import Header from './components/header'
import Signup from './signin'
import Home from './components/Home'
import HeirsManagement from './pages/ManageHeirs'
import UserProfile from './pages/UserDashboard'
import { HeirProvider } from './context/HeirContext'
import Dashboard from './pages/UserDashboard'

function App() {
  const [userWallet] = useState('0x123...abc') // Example wallet
  const [heirs, setHeirs] = useState([
    { name: 'Alice', address: '0x1...', percentage: 50 },
    { name: 'Bob', address: '0x2...', percentage: 50 },
  ])
  const [totalShare, setTotalShare] = useState(100)

  const setHeirPercentage = (index, newPercentage) => {
    const newHeirs = [...heirs]
    newHeirs[index].percentage = newPercentage
    const newTotalShare = newHeirs.reduce((acc, heir) => acc + heir.percentage, 0)
    setHeirs(newHeirs)
    setTotalShare(newTotalShare)
  }

  return (
    <HeirProvider>
      <Router>
        <div className="min-h-screen bg-gray-200 ">
          <div ><Header /></div>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/' element={<Home />} />
            <Route
              path="/manage-heirs"
              element={<HeirsManagement />}
            />
            <Route
              path="/sign-up"
              element={<Signup />}
            />
          </Routes>
        </div>
      </Router>
    </HeirProvider>
  )
}

export default App
