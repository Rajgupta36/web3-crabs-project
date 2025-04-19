import React from 'react';
import { ArrowUpRight, Clock } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'add' | 'remove' | 'update';
  heirName: string;
  walletAddress: string;
  date: string;
  status: 'pending' | 'confirmed' | 'failed';
}

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const getStatusColor = () => {
    switch (transaction.status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getTypeText = () => {
    switch (transaction.type) {
      case 'add': return 'Added Heir';
      case 'remove': return 'Removed Heir';
      case 'update': return 'Updated Heir';
      default: return 'Transaction';
    }
  };

  return (
    <div className=" dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-3 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{getTypeText()}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{transaction.heirName}</p>
          <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-1">
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
            {transaction.status === 'pending' && <Clock size={12} className="inline mr-1" />}
            {transaction.status}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
            <Clock size={12} className="mr-1" />
            {transaction.date}
          </span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <a
          href="#"
          className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center"
        >
          View on Explorer <ArrowUpRight size={12} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default TransactionCard;