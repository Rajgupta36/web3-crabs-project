"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const Page = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen flex items-center justify-center bg-black/100 text-white p-4">
            <div className="max-w-3xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-8 p-8 rounded-xl bg-black/100 backdrop-blur-sm border border-slate-700/50 shadow-xl"
                >
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-gray-500"
                    >
                        Coming Soon
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-xl text-slate-300 max-w-xl mx-auto"
                    >
                        We're working hard to bring you something amazing. Our new site will be here soon.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        className="pt-6"
                    >
                        <div className="inline-flex items-center justify-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-gray-400 animate-pulse"></div>
                            <div className="w-3 h-3 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                            <div className="w-3 h-3 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="pt-8"
                    >
                        {/* You can add buttons, links, or email input here if needed */}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default Page
