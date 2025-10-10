// app/(frontend)/checkout/layout.tsx
import { ReactNode } from "react";
import Header from "./header";

export const metadata = {
  title: "Checkout",
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (

        <main className="min-h-screen">
          <Header/>
          {children}</main>

  );
}
