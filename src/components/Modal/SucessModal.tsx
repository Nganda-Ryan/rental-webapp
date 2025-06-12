import React from "react";
import { CheckCircle } from "lucide-react";
interface SuccessModalProps {
  onClose: () => void;
  message: string;
}
export const SuccessModal = ({
  onClose,
  message,
}: SuccessModalProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm max-h-[75vh] overflow-y-auto p-6 mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2 dark:text-white">
          {message}
        </h3>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};
