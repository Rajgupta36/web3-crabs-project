// src/App.jsx
import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UserDashboard from './pages/UserDashboard'
import ManageHeirs from './pages/ManageHeirs'
import WalletSignUp from './signin'
import Header from './components/header'
import Signup from './signin'
import Home from './components/Home'

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
    <Router>
      <div className="min-h-screen bg-gray-200 ">
        <div ><Header /></div>
        <Routes>
          <Route path="/home" element={<UserDashboard userWallet={userWallet} totalShare={totalShare} />} />
          <Route path='/' element={<Home />} />
          <Route
            path="/manage-heirs"
            element={<ManageHeirs heirs={heirs} setHeirPercentage={setHeirPercentage} />}
          />
          <Route
            path="/sign-up"
            element={<Signup />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
