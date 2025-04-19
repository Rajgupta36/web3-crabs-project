// src/pages/ManageHeirs.jsx
import React from 'react'
import ReactFlow from 'react-flow-renderer'
import HeirNode from '../components/heirnode'

function ManageHeirs({ heirs, setHeirPercentage }) {
    const elements = heirs.map((heir, index) => ({
        id: `node-${index}`,
        data: { label: `${heir.name} - ${heir.percentage}%` },
        position: { x: 100 * index, y: 100 },
        type: 'custom',
    }))

    return (
        <div className="flex flex-col items-center space-y-4">
            <h2 className="text-3xl font-bold">Manage Heirs</h2>
            <div className="w-full h-96">
                <ReactFlow elements={elements} nodeTypes={{ custom: HeirNode }} />
            </div>
            <button
                onClick={() => setHeirPercentage(0, 50)} // Example: Set 50% for first heir
                className="mt-4 px-6 py-2 bg-green-600 rounded-xl text-white hover:bg-green-700"
            >
                Update Heir Percentage
            </button>
        </div>
    )
}

export default ManageHeirs
