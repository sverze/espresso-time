'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { EspressoShot, EspressoShotFormData, Toast } from './types';
import { mockEspressoShots } from './mockData';

interface DataContextType {
  shots: EspressoShot[];
  addShot: (formData: EspressoShotFormData) => void;
  updateShot: (id: string, formData: EspressoShotFormData) => void;
  deleteShot: (id: string) => void;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [shots, setShots] = useState<EspressoShot[]>(mockEspressoShots);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addShot = (formData: EspressoShotFormData) => {
    const newShot: EspressoShot = {
      id: Date.now().toString(),
      roasterName: formData.roasterName,
      roastName: formData.roastName,
      roastDate: formData.roastDate || undefined,
      dateTime: new Date().toISOString(),
      grinderSetting: formData.grinderSetting,
      grindTime: formData.grindTime,
      coffeeWeight: formData.coffeeWeight,
      outputWeight: formData.outputWeight,
      extractionTime: formData.extractionTime,
      shotType: formData.shotType,
      rating: formData.rating,
      notes: formData.notes,
      usedMilk: formData.usedMilk,
      createdAt: new Date().toISOString()
    };

    setShots(prev => [newShot, ...prev]);
    addToast({
      type: 'success',
      message: 'Espresso shot added successfully!',
      duration: 3000
    });
  };

  const updateShot = (id: string, formData: EspressoShotFormData) => {
    setShots(prev => prev.map(shot => {
      if (shot.id === id) {
        return {
          ...shot,
          roasterName: formData.roasterName,
          roastName: formData.roastName,
          roastDate: formData.roastDate || undefined,
          grinderSetting: formData.grinderSetting,
          grindTime: formData.grindTime,
          coffeeWeight: formData.coffeeWeight,
          outputWeight: formData.outputWeight,
          extractionTime: formData.extractionTime,
          shotType: formData.shotType,
          rating: formData.rating,
          notes: formData.notes,
          usedMilk: formData.usedMilk
        };
      }
      return shot;
    }));

    addToast({
      type: 'success',
      message: 'Espresso shot updated successfully!',
      duration: 3000
    });
  };

  const deleteShot = (id: string) => {
    setShots(prev => prev.filter(shot => shot.id !== id));
    addToast({
      type: 'success',
      message: 'Espresso shot deleted successfully!',
      duration: 3000
    });
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
      addShot,
      updateShot,
      deleteShot,
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