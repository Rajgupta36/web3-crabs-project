import { Wallet, Shield, Share2, Clock, Lock } from "lucide-react";
import React from "react";
const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            <main>
                {/* Hero Section */}
                <section className="min-h-[80vh] pt-32 px-6 bg-gradient-to-br from-white via-gray-50 to-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
                                    Secure Your Crypto Legacy <br />
                                    <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">For Your Loved Ones</span>
                                </h1>
                                <p className="text-xl text-gray-800">
                                    A secure and seamless way to ensure your digital assets are passed on to your heirs. Set up smart inheritance rules for your cryptocurrency.
                                </p>
                                <div className="flex items-center gap-4 pt-4">
                                    <button className="px-6 py-3 bg-black text-white hover:bg-gray-900 rounded-md">
                                        Start Planning Now
                                    </button>
                                </div>
                            </div>
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1518770660439-4636190af475"
                                    alt="Secure Crypto Inheritance"
                                    className="rounded-lg shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="px-6 pb-20 bg-gradient-to-br from-white to-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl font-bold text-center mb-16">
                            How It <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Works</span>
                        </h2>
                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: Wallet,
                                    title: "Connect Your Wallet",
                                    description: "Link your crypto wallet securely to start setting up your inheritance plan."
                                },
                                {
                                    icon: Shield,
                                    title: "Set Up Beneficiaries",
                                    description: "Add your heirs and specify their wallet addresses for asset distribution."
                                },
                                {
                                    icon: Share2,
                                    title: "Allocate Assets",
                                    description: "Define how your crypto assets should be distributed among beneficiaries."
                                },
                                {
                                    icon: Clock,
                                    title: "Time-Lock Settings",
                                    description: "Set conditions for when assets should be transferred to your heirs."
                                }
                            ].map((step, index) => (
                                <div key={index} className="text-center space-y-4">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-black flex items-center justify-center">
                                        <step.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Rules Section */}
                <section className="py-20 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold mb-12">
                                    Platform <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Rules</span>
                                </h2>
                                <div className="space-y-6">
                                    {[
                                        {
                                            icon: Shield,
                                            title: "Security First",
                                            description: "All transactions are secured by smart contracts on the blockchain, ensuring complete transparency and security."
                                        },
                                        {
                                            icon: Lock,
                                            title: "Access Control",
                                            description: "Only authorized beneficiaries can claim their allocated assets when conditions are met."
                                        },
                                        {
                                            icon: Clock,
                                            title: "Time-Based Execution",
                                            description: "Assets are automatically transferred based on predefined conditions and timeframes."
                                        }
                                    ].map((rule, index) => (
                                        <div key={index} className="p-6 bg-white shadow-sm hover:shadow-lg transition-shadow rounded-lg border border-gray-100">
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1">
                                                    <rule.icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-2">{rule.title}</h3>
                                                    <p className="text-gray-600">{rule.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0"
                                    alt="Blockchain Security"
                                    className="rounded-lg shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;