"use client"
import React, { useEffect, useState, useRef } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import Image from 'next/image'
const AVATARS = [
  {
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&h=250&q=80',
    alt: 'Professional male avatar',
  },
  {
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&h=250&q=80',
    alt: 'Professional female avatar',
  },
  {
    url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&h=250&q=80',
    alt: 'Business male avatar',
  },
  {
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&h=250&q=80',
    alt: 'Business female avatar',
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&h=250&q=80',
    alt: 'Casual male avatar',
  },
  {
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&h=250&q=80',
    alt: 'Casual female avatar',
  },
]
interface AvatarSelectorProps {
  selected: string
  onChange: (url: string) => void
}
export const AvatarSelector = ({ selected, onChange }: AvatarSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const selectedAvatar =
    AVATARS.find((avatar) => avatar.url === selected) || AVATARS[0]
  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Avatar
      </label>
      <button
        type="button"
        className="relative w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Image
                src={selectedAvatar.url}
                alt={selectedAvatar.alt}
                width={64}
                height={64}
                className="h-10 w-10 rounded-full object-cover"
            />
          <span className="ml-3 block truncate text-gray-900">
            {selectedAvatar.alt}
          </span>
          <ChevronDown className="ml-auto h-5 w-5 text-gray-400" />
        </div>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          <div className="grid grid-cols-2 gap-2 p-2">
            {AVATARS.map((avatar) => (
              <button
                key={avatar.url}
                className={`relative rounded-lg p-2 hover:bg-gray-50 flex flex-col items-center ${selected === avatar.url ? 'bg-blue-50 ring-2 ring-blue-900' : ''}`}
                onClick={() => {
                  onChange(avatar.url)
                  setIsOpen(false)
                }}
              >
                <Image
                  src={avatar.url}
                  alt={avatar.alt}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
                {selected === avatar.url && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-900 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <span className="mt-2 text-sm text-gray-700">{avatar.alt}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
