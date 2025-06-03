import AddressSection from "./sections/AddressSection";
// import DeliverySection from "./sections/DeliverySection";
// import PaymentSection from "./sections/PaymentSection";

export default function CheckoutForm() {
  return (
    <div className="space-y-6">
      <AddressSection />
      {/* <DeliverySection />
      <PaymentSection /> */}
    </div>
  );
}
