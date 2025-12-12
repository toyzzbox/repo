// src/app/(frontend)/reset-password/page.tsx
import { notFound } from "next/navigation";
import ResetPasswordForm from "./ResetPasswordForm";
import { resetPassword } from "@/actions/auth/resetPassword";

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const sp = (searchParams ? await searchParams : {}) as SearchParams;

  const tokenRaw = sp.token;
  const token = Array.isArray(tokenRaw) ? tokenRaw[0] : tokenRaw;

  if (!token) return notFound(); // token yoksa 404

  return <ResetPasswordForm action={resetPassword} token={token} />;
}
