import React from "react";
import { AlertTriangle } from "lucide-react";

interface DeletePropertyModalProps {
  onClose: () => void;
  onConfirm: () => void;
  propertyAddress: string;
}

export const DeletePropertyModal = ({
  onClose,
  onConfirm,
  propertyAddress,
}: DeletePropertyModalProps) => {
  return (
    <div className="bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-bold">Delete Property</h2>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete the property{" "}
            <span className="font-bold">{propertyAddress}</span>? This action cannot be undone.
          </p>
        </div>
        
        <div className="flex justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete Property
          </button>
        </div>
      </div>
    </div>
  );
};