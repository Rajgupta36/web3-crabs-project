import React, { createContext, useContext, useState, useEffect } from 'react';
import { Heir } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Sample data for heirs
const initialHeirs: Heir[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    percentage: 40,
    relationship: 'Spouse',
    dateAdded: '2025-03-15'
  },
  {
    id: '2',
    name: 'Michael Davis',
    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    percentage: 30,
    relationship: 'Child',
    dateAdded: '2025-04-10'
  },
  {
    id: '3',
    name: 'Jessica Williams',
    walletAddress: '0x7890abcdef1234567890abcdef1234567890abcd',
    percentage: 20,
    relationship: 'Sibling',
    dateAdded: '2025-04-21'
  }
];

interface HeirContextType {
  heirs: Heir[];
  addHeir: (heir: Omit<Heir, 'id' | 'dateAdded'>) => void;
  removeHeir: (id: string) => void;
  updateHeir: (id: string, heir: Partial<Omit<Heir, 'id' | 'dateAdded'>>) => void;
}

const HeirContext = createContext<HeirContextType | undefined>(undefined);

export const HeirProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heirs, setHeirs] = useState<Heir[]>(initialHeirs);

  // Load heirs from localStorage if available
  useEffect(() => {
    const savedHeirs = localStorage.getItem('heirs');
    if (savedHeirs) {
      try {
        setHeirs(JSON.parse(savedHeirs));
      } catch (error) {
        console.error('Failed to parse heirs from localStorage:', error);
      }
    }
  }, []);

  // Save heirs to localStorage on changes
  useEffect(() => {
    localStorage.setItem('heirs', JSON.stringify(heirs));
  }, [heirs]);

  const addHeir = (heir: Omit<Heir, 'id' | 'dateAdded'>) => {
    const newHeir: Heir = {
      ...heir,
      id: uuidv4(),
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setHeirs([...heirs, newHeir]);
  };

  const removeHeir = (id: string) => {
    setHeirs(heirs.filter(heir => heir.id !== id));
  };

  const updateHeir = (id: string, updatedFields: Partial<Omit<Heir, 'id' | 'dateAdded'>>) => {
    setHeirs(heirs.map(heir =>
      heir.id === id ? { ...heir, ...updatedFields } : heir
    ));
  };

  return (
    <HeirContext.Provider value={{ heirs, addHeir, removeHeir, updateHeir }}>
      {children}
    </HeirContext.Provider>
  );
};

export const useHeirs = () => {
  const context = useContext(HeirContext);
  if (context === undefined) {
    throw new Error('useHeirs must be used within a HeirProvider');
  }
  return context;
};