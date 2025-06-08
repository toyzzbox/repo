// types/checkout.ts

export const steps = ["address", "delivery", "payment", "summary"] as const;
export type Step = typeof steps[number];

export interface FormData {
  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  delivery: {
    method: string;
    date: string;
  };
  payment: {
    method: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}

export interface AddressSectionProps {
  data: FormData['address'];
  onChange: (data: FormData['address']) => void;
  errors: Record<string, string>;
}

export interface DeliverySectionProps {
  data: FormData['delivery'];
  onChange: (data: FormData['delivery']) => void;
}

export interface PaymentSectionProps {
  data: FormData['payment'];
  onChange: (data: FormData['payment']) => void;
  errors: Record<string, string>;
}

export interface CheckoutSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  formData: FormData;
}

export interface ProgressBarProps {
  step: Step;
}