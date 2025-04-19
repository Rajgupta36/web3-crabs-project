import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Heir } from '../types';
import PercentageSlider from './PercentageSlider';

interface AddHeirModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (heir: Omit<Heir, 'id' | 'dateAdded'>) => void;
  editHeir?: Heir;
  remainingPercentage?: number;
}

const AddHeirModal: React.FC<AddHeirModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  editHeir,
  remainingPercentage = 100
}) => {
  const [name, setName] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [relationship, setRelationship] = useState('');

  useEffect(() => {
    if (editHeir) {
      setName(editHeir.name);
      setPercentage(editHeir.percentage);
      setRelationship(editHeir.relationship);
    } else {
      setName('');
      setPercentage(Math.min(remainingPercentage, 100));
      setRelationship('');
    }
  }, [editHeir, isOpen, remainingPercentage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      name,
      percentage,
      relationship
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md relative animate-fade-in">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        
        <div className="px-6 py-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {editHeir ? 'Edit Heir' : 'Add New Heir'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Relationship
                </label>
                <select
                  id="relationship"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Inheritance Percentage
                </label>
                <PercentageSlider 
                  value={percentage} 
                  onChange={setPercentage}
                  max={editHeir ? 100 : remainingPercentage}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-purple-700 dark:hover:bg-purple-800"
              >
                {editHeir ? 'Save Changes' : 'Add Heir'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHeirModal;