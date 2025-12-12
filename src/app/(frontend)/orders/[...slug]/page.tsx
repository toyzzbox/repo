import OrderConfirmationPage from "./OrderConfirmationPage";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function OrderPage({ params }: PageProps) {
  const { slug } = await params;

  const orderId = Array.isArray(slug) ? slug[slug.length - 1] : undefined;

  if (!orderId) return notFound(); // orderId yoksa 404

  return <OrderConfirmationPage orderId={orderId} />;
}
