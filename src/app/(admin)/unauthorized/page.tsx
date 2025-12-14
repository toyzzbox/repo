import { Suspense } from "react";
import UnauthorizedClient from "./UnauthorizedClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={null}>
      <UnauthorizedClient />
    </Suspense>
  );
}
