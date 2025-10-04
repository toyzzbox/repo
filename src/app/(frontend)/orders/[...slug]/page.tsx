import OrderConfirmationPage from "./OrderConfirmationPage";
import { notFound } from "next/navigation";

interface Props {
  params: { slug?: string[] };
}

export default async function OrderPage({ params }: Props) {
  const slug = params.slug;
  const orderId = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  if (!orderId) return notFound(); // orderId yoksa 404

  return <OrderConfirmationPage orderId={orderId} />;
}
