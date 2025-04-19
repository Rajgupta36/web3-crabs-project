import React, { useState } from 'react';
import { Plus, AlertTriangle, Users } from 'lucide-react';
import { Heir } from '../types';
import HeirCard from '../components/HeirCard';
import AddHeirModal from '../components/AddHeirModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { useHeirs } from '../context/HeirContext';

const HeirsManagement: React.FC = () => {
    const { heirs, addHeir, removeHeir, updateHeir } = useHeirs();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingHeir, setEditingHeir] = useState<Heir | undefined>(undefined);
    const [heirToDelete, setHeirToDelete] = useState<string | null>(null);

    const totalAllocated = heirs.reduce((sum, heir) => sum + heir.percentage, 0);
    const remainingPercentage = 100 - totalAllocated;

    const handleAddHeir = (newHeir: Omit<Heir, 'id' | 'dateAdded'>) => {
        if (editingHeir) {
            updateHeir(editingHeir.id, newHeir);
        } else {
            addHeir(newHeir);
        }

        setEditingHeir(undefined);
        setIsAddModalOpen(false);
    };

    const handleEditHeir = (id: string) => {
        const heir = heirs.find(h => h.id === id);
        if (heir) {
            setEditingHeir(heir);
            setIsAddModalOpen(true);
        }
    };

    const handleDeleteHeir = (id: string) => {
        setHeirToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteHeir = () => {
        if (heirToDelete) {
            removeHeir(heirToDelete);
            setHeirToDelete(null);
        }
    };

    const handleUpdatePercentage = (id: string, percentage: number) => {
        const heir = heirs.find(h => h.id === id);
        if (heir) {
            updateHeir(id, { ...heir, percentage });
        }
    };

    return (
        <div className='p-8'>
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-black ">Manage Heirs</h1>
                    <p className="text-gray-600  mt-1">
                        Add or modify beneficiaries and their allocations
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingHeir(undefined);
                        setIsAddModalOpen(true);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-800 transition-colors flex items-center"
                    disabled={remainingPercentage <= 0 && !editingHeir}
                >
                    <Plus size={18} className="mr-1" />
                    Add Heir
                </button>
            </div>

            {totalAllocated > 100 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 dark:bg-yellow-900/30 dark:border-yellow-600">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700 dark:text-yellow-200">
                                Total allocation exceeds 100%. Please adjust the percentages.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 overflow-hidden">
                <div className="p-5">
                    <h2 className="text-lg font-medium text-black dark:text-white mb-4">Allocation Summary</h2>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-3">
                        <div
                            className={`h-4 rounded-full ${totalAllocated > 100 ? 'bg-red-500' : 'bg-gray-400'}`}
                            style={{ width: `${Math.min(totalAllocated, 100)}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-black dark:text-white">{totalAllocated}%</span> allocated
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-black dark:text-white">{100 - totalAllocated}%</span> remaining
                        </span>
                    </div>
                </div>
            </div>

            {heirs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {heirs.map((heir) => (
                        <HeirCard
                            key={heir.id}
                            heir={heir}
                            onEdit={handleEditHeir}
                            onDelete={handleDeleteHeir}
                            onUpdatePercentage={handleUpdatePercentage}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Users size={30} className="text-gray-700 dark:text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-black dark:text-white mb-2">No heirs added yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Add your first heir to start setting up your inheritance plan.
                    </p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors inline-flex items-center"
                    >
                        <Plus size={18} className="mr-1" />
                        Add Your First Heir
                    </button>
                </div>
            )}

            <AddHeirModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingHeir(undefined);
                }}
                onSave={handleAddHeir}
                editHeir={editingHeir}
                remainingPercentage={editingHeir ? 100 : remainingPercentage}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteHeir}
                title="Remove Heir"
                message="Are you sure you want to remove this heir? This action cannot be undone."
                confirmText="Remove"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default HeirsManagement;
