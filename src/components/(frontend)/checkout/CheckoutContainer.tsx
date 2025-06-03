"use client";

import CheckoutSummary from "./CheckoutSummary";
import CheckoutForm from "./CheckoutForm";

export default function CheckoutContainer() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CheckoutForm />
      </div>
      <div>
        <CheckoutSummary />
      </div>
    </div>
  );
}
