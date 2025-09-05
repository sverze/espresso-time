'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import Dashboard from '@/components/Dashboard';
import Entries from '@/components/Entries';
import Modal from '@/components/Modal';
import AddEspressoShotForm from '@/components/AddEspressoShotForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import ToastContainer from '@/components/ToastContainer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { DataProvider, useData } from '@/lib/dataContext';
import { TabType, EspressoShotFormData, EspressoShot } from '@/lib/types';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingShot, setEditingShot] = useState<EspressoShot | undefined>(undefined);
  const [deletingShot, setDeletingShot] = useState<EspressoShot | undefined>(undefined);
  const { shots, addShot, updateShot, deleteShot } = useData();

  const handleAddShot = () => {
    setEditingShot(undefined);
    setIsAddModalOpen(true);
  };

  const handleEditShot = (shot: EspressoShot) => {
    setEditingShot(shot);
    setIsAddModalOpen(true);
  };

  const handleDeleteShot = (shot: EspressoShot) => {
    setDeletingShot(shot);
  };

  const confirmDelete = async () => {
    if (deletingShot) {
      try {
        await deleteShot(deletingShot.id);
        setDeletingShot(undefined);
      } catch (error) {
        console.error('Failed to delete shot:', error);
        // Error is handled by the data context with toast notifications
      }
    }
  };

  const handleFormSubmit = async (formData: EspressoShotFormData) => {
    try {
      if (editingShot) {
        await updateShot(editingShot.id, formData);
      } else {
        await addShot(formData);
      }
      setIsAddModalOpen(false);
      setEditingShot(undefined);
    } catch (error) {
      console.error('Failed to submit form:', error);
      // Error is handled by the data context with toast notifications
      // Keep modal open so user can retry
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingShot(undefined);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'entries':
        return <Entries onEditShot={handleEditShot} onDeleteShot={handleDeleteShot} />;
      case 'insights':
        return (
          <div className="max-w-[1344px] mx-auto px-8 py-8">
            <div className="text-center text-gray-500 text-lg">
              Insights content coming soon...
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        entryCount={shots.length} 
        onAddShot={handleAddShot} 
      />
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      {renderTabContent()}
      
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        title={editingShot ? 'Edit Espresso Shot' : 'Add Espresso Shot'}
        size="xl"
      >
        <AddEspressoShotForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          editingShot={editingShot}
        />
      </Modal>
      
      <ConfirmDialog
        isOpen={!!deletingShot}
        onClose={() => setDeletingShot(undefined)}
        onConfirm={confirmDelete}
        title="Delete Espresso Shot"
        message={`Are you sure you want to delete this espresso shot? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
      
      <ToastContainer />
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ProtectedRoute>
  );
}