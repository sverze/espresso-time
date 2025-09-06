'use client';

import { HiExclamationTriangle } from 'react-icons/hi2';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary'
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const confirmButtonStyles = confirmVariant === 'danger' 
    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white'
    : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center">
        {/* Warning Icon */}
        <div className="mx-auto flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
          <HiExclamationTriangle className="w-6 h-6 text-red-600" />
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>
        
        {/* Message */}
        <p className="text-sm text-gray-500 mb-6">
          {message}
        </p>
        
        {/* Actions */}
        <div className="flex justify-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-amber-300 rounded-md hover:bg-amber-50 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-md focus:ring-2 focus:ring-offset-2 ${confirmButtonStyles}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}