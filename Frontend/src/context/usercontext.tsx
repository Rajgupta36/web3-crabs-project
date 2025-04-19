// src/context/UserContext.js
import React, { createContext, useState } from 'react'

// Create context
export const UserContext = createContext()

export const UserProvider = ({ children }) => {
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
        <UserContext.Provider value= {{ userWallet, heirs, totalShare, setHeirPercentage }
}>
    { children }
    </UserContext.Provider>
  )
}
