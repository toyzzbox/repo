import { Suspense } from "react";
import NotFoundClient from "./NotFoundClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NotFound() {
  return (
    <Suspense fallback={null}>
      <NotFoundClient />
    </Suspense>
  );
}
