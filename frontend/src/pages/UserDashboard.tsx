import React from 'react';
import { ChevronRight, ArrowUpRight, Clock, BarChart3, Users, Activity } from 'lucide-react';
import { Project } from '../types';
import PieChart from '../components/PieChart';
import TransactionCard from '../components/TransactionCard';
import { useHeirs } from '../context/HeirContext';

const PROJECT_DATA: Project = {
    id: '1',
    name: 'Primary Arbitrum Holdings',
    description: 'Main Arbitrum wallet holdings and NFT collection',
    totalValue: 12.45,
    currency: 'ARB',
    createdAt: '2024-12-10',
};

const RECENT_TRANSACTIONS = [
    {
        id: '1',
        type: 'add' as const,
        heirName: 'Sarah Johnson',
        date: '2025-05-02',
        status: 'confirmed' as const,
    },
    {
        id: '2',
        type: 'update' as const,
        heirName: 'Michael Davis',
        date: '2025-05-01',
        status: 'pending' as const,
    },
    {
        id: '3',
        type: 'remove' as const,
        heirName: 'Jessica Williams',
        date: '2025-04-28',
        status: 'confirmed' as const,
    },
];

const Dashboard: React.FC = () => {
    const { heirs } = useHeirs();

    const totalAllocated = heirs.reduce((sum, heir) => sum + heir.percentage, 0);
    const remainingAllocation = 100 - totalAllocated;

    return (
        <div>
            <div className="mb-6 p-8">
                <h1 className="text-4xl font-bold text-gray-900">Shardeum Inheritance</h1>
                <p className="text-xl text-gray-600 mt-2 text-gray-300">
                    Manage your beneficiaries and allocations
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="md:col-span-2 space-y-6">
                    {/* Project card */}
                    <div className="card-red p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">{PROJECT_DATA.name}</h2>
                                <p className="text-gray/80 mt-1">{PROJECT_DATA.description}</p>
                            </div>
                            <span className="text-2xl font-bold">
                                {PROJECT_DATA.totalValue} {PROJECT_DATA.currency}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                            <div className="bg-gray-300 p-4 rounded-lg">
                                <div className="flex items-center text-black/80 mb-1">
                                    <Users size={16} className="mr-2" />
                                    <span className="text-sm">Total Heirs</span>
                                </div>
                                <p className="text-2xl font-bold text-black">{heirs.length}</p>
                            </div>

                            <div className="bg-gray-300 p-4 rounded-lg">
                                <div className="flex items-center text-black/80 mb-1">
                                    <BarChart3 size={16} className="mr-2" />
                                    <span className="text-sm">Allocated</span>
                                </div>
                                <p className="text-2xl font-bold text-black">{totalAllocated}%</p>
                            </div>

                            <div className="bg-gray-300 p-4 rounded-lg">
                                <div className="flex items-center text-black/80 mb-1">
                                    <Activity size={16} className="mr-2" />
                                    <span className="text-sm">Remaining</span>
                                </div>
                                <p className="text-2xl font-bold text-black">{remainingAllocation}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent transactions */}
                    <div className="card-white overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>

                            <div className="space-y-3">
                                {RECENT_TRANSACTIONS.map((transaction) => (
                                    <TransactionCard key={transaction.id} transaction={transaction} />
                                ))}
                            </div>
                        </div>

                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                            <a href="#" className="text-sm text-purple-600 flex items-center hover:text-purple-800">
                                View all transactions <ChevronRight size={16} className="ml-1" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    {/* Allocation chart */}
                    <div className="card-white overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Distribution</h2>

                            {heirs.length > 0 ? (
                                <div>
                                    <PieChart heirs={heirs} size={220} />

                                    <div className="mt-4 space-y-3">
                                        {heirs.map((heir, index) => (
                                            <div key={heir.id} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-3 h-3 rounded-full mr-2"
                                                        style={{ backgroundColor: ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'][index % 6] }}
                                                    ></div>
                                                    <span className="text-sm text-gray-700">{heir.name}</span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{heir.percentage}%</span>
                                            </div>
                                        ))}

                                        {remainingAllocation > 0 && (
                                            <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
                                                    <span className="text-sm text-gray-700">Unallocated</span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{remainingAllocation}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-gray-500">No heirs added yet</p>
                                    <a
                                        href="/heirs"
                                        className="mt-3 inline-block px-4 py-2 bg-[#FF3B30] text-white rounded-md hover:bg-[#E6352B] transition-colors"
                                    >
                                        Add Heirs
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;