"use client"

import React, { useState } from 'react'
import { X, Upload, Camera, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface LessorRequestFormProps {
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: any
}
export const LessorRequestForm = ({
  onClose,
  onSubmit,
  initialData
}: LessorRequestFormProps) => {
  const t = useTranslations('Renter.LessorRequestForm');
  const [idCardRecto, setIdCardRecto] = useState<File | null>(null)
  const [idCardVerso, setIdCardVerso] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)

  const [rectoPreview, setRectoPreview] = useState(initialData?.image || "");
  const [versoPreview, setVersoPreview] = useState(initialData?.image || "");
  const [selfiePreview, setSelfiePreview] = useState(initialData?.image || "");
  const [description, setDescription] = useState('')
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!idCardRecto || !idCardVerso || !selfie) {
      return;
    }

    const formData = {
      idCardRecto,
      idCardVerso,
      selfie,
      description,
    };

    onSubmit(formData);
  };


  const handleRectoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdCardRecto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setRectoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleVersoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdCardVerso(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVersoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelfieFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfie(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="rounded-lg w-full max-h-[75vh] overflow-y-auto max-w-3xl mx-auto bg-white dark:bg-gray-800">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold dark:text-white">{t('title')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} className="dark:text-white" />
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('idCardRecto')}
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleRectoFileChange}
                className="hidden"
                name="idCardRecto"
                id="idCardRecto"
              />
              {!idCardRecto && <p className="text-xs text-red-500 mt-1">{t('required')}</p>}


              <label
                htmlFor="idCardRecto"
                className="flex flex-col items-center cursor-pointer"
              >

                {
                  rectoPreview ?
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={rectoPreview}
                    alt="Property"
                    className="w-40 h-25 object-cover"
                  />
                  :
                  <FileText size={24} className="text-gray-400 mb-2" />
                }
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {
                    idCardRecto ?
                    idCardRecto.name :
                    t('uploadIdCardFront')
                  }
                </span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('idCardVerso')}
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleVersoFileChange}
                className="hidden"
                id="idCardVerso"
                name="idCardVerso"
              />
              {!idCardVerso && <p className="text-xs text-red-500 mt-1">{t('required')}</p>}

              <label
                htmlFor="idCardVerso"
                className="flex flex-col items-center cursor-pointer"
              >
                {
                  versoPreview ?
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={versoPreview}
                    alt="Property"
                    className="w-40 h-25 object-cover"
                  />
                  :
                  <FileText size={24} className="text-gray-400 mb-2" />
                }
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {idCardVerso ? idCardVerso.name : t('uploadIdCardBack')}
                </span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('selfieWithId')}
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="selfie"
                name="selfie"
                onChange={handleSelfieFileChange}
              />
              {!selfie && <p className="text-xs text-red-500 mt-1">{t('required')}</p>}
              <label
                htmlFor="selfie"
                className="flex flex-col items-center cursor-pointer"
              >
                {
                  selfiePreview ?
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selfiePreview}
                    alt="Property"
                    className="w-40 h-25 object-cover"
                  />
                  :
                  <Camera size={24} className="text-gray-400 mb-2" />
                }
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selfie ? selfie.name : t('uploadSelfie')}
                </span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('description')}
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder={t('descriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#2A4365] text-white rounded-lg hover:bg-blue-800"
          >
            {t('submitRequest')}
          </button>
        </div>
      </form>
    </div>
  )
}
