'use client';

import { useState } from 'react';

interface PaymentButtonProps {
  approvalUrl: string;
  orderId: string;
  executeUrl: string;
  className?: string;
}

export default function PaymentButton({
  approvalUrl,
  orderId,
  executeUrl,
  className = ''
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleRedirect = () => {
    localStorage.setItem('paypal_order_id', orderId);
    localStorage.setItem('paypal_execute_url', executeUrl);

    setLoading(true);
    window.location.href = approvalUrl;
  };

  return (
    <button
      onClick={handleRedirect}
      disabled={loading}
      className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors ${className}`}
    >
      {loading ? 'Redirection...' : 'Payer avec PayPal'}
    </button>
  );
}
