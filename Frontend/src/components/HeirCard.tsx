import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Heir } from '../types';
import PercentageSlider from './PercentageSlider';

interface HeirCardProps {
  heir: Heir;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdatePercentage: (id: string, percentage: number) => void;
}

const HeirCard: React.FC<HeirCardProps> = ({
  heir,
  onEdit,
  onDelete,
  onUpdatePercentage,
}) => {
  const formattedDate = new Date(heir.dateAdded).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 transition-shadow hover:shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {heir.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {heir.relationship}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(heir.id)}
              className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Edit heir"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(heir.id)}
              className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-red-900 dark:hover:text-red-300 transition-colors"
              aria-label="Delete heir"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Allocation
            </span>
            <span className="text-sm font-bold text-gray-300 dark:text-gray-400">
              {heir.percentage}%
            </span>
          </div>
          <PercentageSlider
            value={heir.percentage}
            onChange={(value) => onUpdatePercentage(heir.id, value)}
          />
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-750 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
        Added on {formattedDate}
      </div>
    </div>
  );
};

export default HeirCard;
