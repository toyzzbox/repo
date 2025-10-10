// app/(frontend)/checkout/layout.tsx
import { ReactNode } from "react";

export const metadata = {
  title: "Checkout",
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (

        <main className="min-h-screen flex flex-col">{children}</main>

  );
}
