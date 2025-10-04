import OrderConfirmationPage from "./OrderConfirmationPage";

interface Props {
  params: { id: string };
}

export default async function OrderPage({ params }: Props) {
  const { id } = params;
  return <OrderConfirmationPage orderId={id} />;
}
