// app/payment/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { VerifyPaymentRequest, VerifyPaymentResponse } from '@/types/paypal';

type PaymentStatus = 'loading' | 'success' | 'error';

interface PaymentDetails {
  id: string;
  status: string;
  amount?: {
    currency_code: string;
    value: string;
  };
}

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const searchParams = useSearchParams();
  
  const token = searchParams.get('token');
  const PayerID = searchParams.get('PayerID');

  useEffect(() => {
    if (token && PayerID) {
      verifyPayment();
    }
  }, [token, PayerID]);

  const verifyPayment = async (): Promise<void> => {
    try {
      const orderId = localStorage.getItem('paypal_order_id');
      
      if (!orderId) {
        setStatus('error');
        return;
      }

      if (!token || !PayerID) {
        setStatus('error');
        return;
      }
      
      const requestBody: VerifyPaymentRequest = {
        orderId,
        token,
        PayerID
      };

      const response = await fetch('/api/paypal/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: VerifyPaymentResponse = await response.json();
      
      if (result.status === 'success') {
        setStatus('success');
        setPaymentDetails({
          id: result.data.id,
          status: result.data.status,
          amount: result.data.purchase_units[0]?.payments?.captures[0]?.amount
        });
        localStorage.removeItem('paypal_order_id');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Vérification du paiement en cours...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Paiement réussi !</h1>
            <p className="text-gray-600">Votre commande a été traitée avec succès.</p>
          </div>
          
          {paymentDetails && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm">
              <p><strong>ID de transaction:</strong> {paymentDetails.id}</p>
              <p><strong>Statut:</strong> {paymentDetails.status}</p>
              {paymentDetails.amount && (
                <p><strong>Montant:</strong> {paymentDetails.amount.value} {paymentDetails.amount.currency_code}</p>
              )}
            </div>
          )}
          
          <Link 
            href="/dashboard" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Accéder à votre compte
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Erreur de paiement</h1>
        <p className="text-gray-600 mb-6">Une erreur est survenue lors du traitement de votre paiement.</p>
        
        <Link 
          href="/checkout" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          Réessayer
        </Link>
      </div>
    </div>
  );
}