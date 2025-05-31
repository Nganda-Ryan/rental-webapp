"use client"
import React, { useState } from 'react'
import { X, AlertTriangle, CheckCircle } from 'lucide-react'
interface ActionConfirmationModalProps {
  onClose: () => void
  onConfirm: (comment: string) => void
  title: string
  type: 'APPROVED' | 'DECLINED'| 'CANCEL'
}
export const ActionConfirmationModal = ({
  onClose,
  onConfirm,
  title,
  type,
}: ActionConfirmationModalProps) => {
  const [comment, setComment] = useState('')
  return (
    <div className="bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-96 w-full p-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {type === 'APPROVED' ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <AlertTriangle className="text-red-500" size={24} />
              )}
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
          </div>

          <div className="space-y-4 min-w-80">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  type === 'APPROVED'
                    ? 'Add any approval comments...'
                    : 'Please provide a reason for rejection...'
                }
                required={type !== 'APPROVED'}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(comment)}
                className={`px-4 py-2 text-white rounded-lg ${type === 'APPROVED' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {type === 'APPROVED' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
