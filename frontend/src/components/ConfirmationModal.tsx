import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />,
          buttonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />,
          buttonClass: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 dark:bg-yellow-700 dark:hover:bg-yellow-800'
        };
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-500" />,
          buttonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800'
        };
    }
  };

  const { icon, buttonClass } = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md relative animate-fade-in">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        
        <div className="p-6">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0">{icon}</div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-5 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${buttonClass} focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;