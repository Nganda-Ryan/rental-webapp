'use client';

import { useState } from 'react';
import { CreatePaymentLinkRequest, CreatePaymentLinkResponse } from '@/types/paypal';

interface PaymentLinkButtonProps {
  amount: string;
  description?: string;
  className?: string;
  currency?: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
}

export default function PaymentLinkButton({ 
  amount, 
  description, 
  className = '',
  currency = 'EUR',
  onSuccess,
  onError
}: PaymentLinkButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const requestBody: CreatePaymentLinkRequest = {
        amount,
        currency,
        description,
        returnUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`
      };

      const response = await fetch('/api/paypal/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CreatePaymentLinkResponse = await response.json();

      if (data.approvalUrl) {
        // Sauvegarder l'ID de commande pour la vérification ultérieure
        if (typeof window !== 'undefined') {
          localStorage.setItem('paypal_order_id', data.orderId);
        }
        
        onSuccess?.(data.orderId);
        
        // Rediriger vers PayPal
        window.location.href = data.approvalUrl;
      } else {
        const errorMessage = 'Erreur lors de la création du lien de paiement';
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Payment link error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors ${className}`}
      >
        {loading ? 'Création du lien...' : `Payer ${amount}€ avec PayPal`}
      </button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}