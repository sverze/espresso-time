'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EspressoShot, EspressoShotFormData, Toast } from './types';
import { EspressoShotAPI } from './api/espressoShotApi';
import { config } from './config';

// Use API client for browser requests
const espressoShotAPI = new EspressoShotAPI();

interface DataContextType {
  shots: EspressoShot[];
  loading: boolean;
  error: string | null;
  addShot: (formData: EspressoShotFormData) => Promise<void>;
  updateShot: (id: string, formData: EspressoShotFormData) => Promise<void>;
  deleteShot: (id: string) => Promise<void>;
  refreshShots: () => Promise<void>;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [shots, setShots] = useState<EspressoShot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load shots from DynamoDB on mount
  const refreshShots = async () => {
    try {
      setLoading(true);
      setError(null);
      const allShots = await espressoShotAPI.getAllShots();
      setShots(allShots);
    } catch (err) {
      console.error('Failed to load espresso shots:', err);
      setError('Failed to load espresso shots');
      addToast({
        type: 'error',
        message: 'Failed to load espresso shots',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    if (config.isLocal) {
      // For local development, check if DynamoDB is available
      refreshShots().catch(() => {
        console.warn('DynamoDB not available, falling back to mock data');
        // Fall back to mock data if DynamoDB is not available
        import('./mockData').then((module) => {
          setShots(module.mockEspressoShots);
          setLoading(false);
        });
      });
    } else {
      refreshShots();
    }
  }, []);

  const addShot = async (formData: EspressoShotFormData) => {
    try {
      setError(null);
      const newShot = await espressoShotAPI.createShot(formData);
      setShots(prev => [newShot, ...prev]);
      addToast({
        type: 'success',
        message: 'Espresso shot added successfully!',
        duration: 3000
      });
    } catch (err) {
      console.error('Failed to add espresso shot:', err);
      addToast({
        type: 'error',
        message: 'Failed to add espresso shot',
        duration: 5000
      });
      throw err;
    }
  };

  const updateShot = async (id: string, formData: EspressoShotFormData) => {
    try {
      setError(null);
      const updatedShot = await espressoShotService.updateShot(id, formData);
      setShots(prev => prev.map(shot => 
        shot.id === id ? updatedShot : shot
      ));
      addToast({
        type: 'success',
        message: 'Espresso shot updated successfully!',
        duration: 3000
      });
    } catch (err) {
      console.error('Failed to update espresso shot:', err);
      addToast({
        type: 'error',
        message: 'Failed to update espresso shot',
        duration: 5000
      });
      throw err;
    }
  };

  const deleteShot = async (id: string) => {
    try {
      setError(null);
      await espressoShotService.deleteShot(id);
      setShots(prev => prev.filter(shot => shot.id !== id));
      addToast({
        type: 'success',
        message: 'Espresso shot deleted successfully!',
        duration: 3000
      });
    } catch (err) {
      console.error('Failed to delete espresso shot:', err);
      addToast({
        type: 'error',
        message: 'Failed to delete espresso shot',
        duration: 5000
      });
      throw err;
    }
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    if (toast.duration) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <DataContext.Provider value={{
      shots,
      loading,
      error,
      addShot,
      updateShot,
      deleteShot,
      refreshShots,
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}