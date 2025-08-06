// app/checkout/page.tsx
import PaymentLinkButton from '@/components/PaymentLinkButton';

interface Product {
  name: string;
  price: string;
  description: string;
}

export default function CheckoutPage() {
  const product: Product = {
    name: 'Formation Next.js',
    price: '99.00',
    description: 'Formation Next.js - Accès complet'
  };

  const handlePaymentSuccess = (orderId: string): void => {
    console.log('Payment initiated successfully:', orderId);
  };

  const handlePaymentError = (error: string): void => {
    console.error('Payment error:', error);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Finaliser votre commande</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Résumé de la commande</h2>
        <div className="flex justify-between items-center mb-2">
          <span>{product.name}</span>
          <span>{product.price}€</span>
        </div>
        <div className="flex justify-between items-center font-bold">
          <span>Total</span>
          <span>{product.price}€</span>
        </div>
      </div>
      
      <PaymentLinkButton 
        amount={product.price}
        description={product.description}
        className="w-full"
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}