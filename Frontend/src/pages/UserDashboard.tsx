// src/pages/UserDashboard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

function UserDashboard({ userWallet, totalShare }) {
    return (
        <div className="flex flex-col items-center space-y-6">
            <h1 className="text-4xl font-bold">Ancestral Transfer Dashboard</h1>
            <p className="text-lg">Wallet: {userWallet}</p>
            <p className="text-lg">Total Share Distributed: {totalShare}%</p>
            <Link to="/manage-heirs" className="mt-4 px-6 py-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700">
                Manage Heirs
            </Link>
        </div>
    )
}

export default UserDashboard
