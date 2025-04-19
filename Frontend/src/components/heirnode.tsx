// src/components/HeirNode.jsx
import React from 'react'

function HeirNode({ data }) {
    return (
        <div className="p-4 bg-blue-600 rounded-xl shadow-lg text-white text-center">
            <h3 className="text-xl font-bold">{data.label}</h3>
        </div>
    )
}

export default HeirNode
