import AddressSection from "./sections/AddressSection";
import DeliverySection from "./sections/DeliverySection";
import PaymentSection from "./sections/PaymentSection";
import CheckoutSummary from "./sections/CheckoutSummary";

export default function CheckoutForm() {
  // Bunlar ileride context veya server actions ile kontrol edilecek
  const subtotal = 749.9;
  const shipping = 19.9;
  const discount = 20;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <AddressSection />
        <DeliverySection />
        <PaymentSection />
      </div>

      <div>
        <CheckoutSummary
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
        />
      </div>
    </div>
  );
}
