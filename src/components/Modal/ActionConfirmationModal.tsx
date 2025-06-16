"use client"
import React, { useState } from 'react'
import { X, AlertTriangle, CheckCircle } from 'lucide-react'
import Button from '../ui/Button'
interface ActionConfirmationModalProps {
  onClose: () => void
  onConfirm: (comment: string) => void
  title: string
  type: 'APPROVED' | 'DECLINED'| 'CANCEL' | ""
  showCommentInput?: boolean
  message?: string
}
export const ActionConfirmationModal = ({
  onClose,
  onConfirm,
  title,
  type,
  showCommentInput = true,
  message
}: ActionConfirmationModalProps) => {
  const [comment, setComment] = useState('');
  const [isTerminateLease, setIsterminateLease] = useState(false);

  const handleSubmit = () => {
    setIsterminateLease(true);
    onConfirm(comment)
  }

  return (
    <div className="rounded-lg w-full max-h-[75vh] overflow-y-auto max-w-sm mx-auto bg-white dark:bg-gray-800">
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
          {message && 
            <div className='my-7'>
              {message}
            </div>
          }
            <div className="space-y-4 min-w-80">
              {showCommentInput &&
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
              }
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <Button variant={type === 'APPROVED' ? 'neutral' : 'danger'} disable={isTerminateLease} isSubmitBtn={false} fullWidth={false} loading={isTerminateLease} onClick={handleSubmit}>
                  {type === 'APPROVED' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </div>
          
        </div>
      </div>
    </div>
  )
}
