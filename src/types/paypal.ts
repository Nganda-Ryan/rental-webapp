// app/types/paypal.ts
export interface PayPalAmount {
  currency_code: string;
  value: string;
}

export interface PayPalPurchaseUnit {
  amount: PayPalAmount;
  description?: string;
}

export interface PayPalExperienceContext {
  payment_method_preference: string;
  brand_name: string;
  locale: string;
  landing_page: string;
  shipping_preference: string;
  user_action: string;
  return_url: string;
  cancel_url: string;
}

export interface PayPalPaymentSource {
  paypal: {
    experience_context: PayPalExperienceContext;
  };
}

export interface PayPalOrderRequest {
  intent: string;
  purchase_units: PayPalPurchaseUnit[];
  payment_source: PayPalPaymentSource;
}

export interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: PayPalLink[];
}

export interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: PayPalAmount;
      }>;
    };
  }>;
}

export interface CreatePaymentLinkRequest {
  amount: string;
  currency?: string;
  description?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface CreatePaymentLinkResponse {
  orderId: string;
  approvalUrl: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
  token: string;
  PayerID: string;
}

export interface VerifyPaymentResponse {
  status: 'success' | 'failed';
  data: PayPalCaptureResponse;
}