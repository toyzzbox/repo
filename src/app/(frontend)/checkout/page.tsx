import CheckoutForm from "@/components/(frontend)/checkout/CheckoutForm";

export default function CheckoutPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Siparişi Tamamla</h1>
      <CheckoutForm />
    </main>
  );
}