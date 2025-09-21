import OrdersList from "./OrderList";


export const metadata = {
  title: 'Siparişlerim | E-ticaret',
  description: 'Sipariş geçmişinizi görüntüleyin ve takip edin',
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Siparişlerim</h1>
        <OrdersList/>
      </div>
    </div>
  );
}