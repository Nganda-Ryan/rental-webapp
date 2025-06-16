'use client';

import { Toaster } from 'react-hot-toast';

export function ToasterProvider() {
  return <Toaster 
    toastOptions={{
    duration: 4000,
    style: {
      background: '#083959',
      color: '#ffffff',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '0.875rem',
      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    },
    success: {
      iconTheme: {
        primary: '#EE382A',
        secondary: '#ffffff',
      },
    },
    error: {
      iconTheme: {
        primary: '#EE382A',
        secondary: '#ffffff',
      },
    },
  }}
  position="top-right" />;
}
