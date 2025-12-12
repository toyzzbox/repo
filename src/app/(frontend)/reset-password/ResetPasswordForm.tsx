"use client";

import { ResetPasswordResult } from "@/actions/auth/resetPassword";
import { useFormState, useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Gönderiliyor..." : "Şifreyi Güncelle"}
    </button>
  );
}

type Props = {
  action: (
    prevState: ResetPasswordResult,
    formData: FormData
  ) => Promise<ResetPasswordResult>;

  token: string; // ✅ BU EKSİKTİ
};

const initialState: ResetPasswordResult = {
  error: null,
  success: null,
};

export default function ResetPasswordForm({ action, token }: Props) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction}>
      {/* token mutlaka formda gönderilmeli */}
      <input type="hidden" name="token" value={token} />

      <input
        type="password"
        name="password"
        placeholder="Yeni şifre"
        required
      />

      {state.error && <p style={{ color: "red" }}>{state.error}</p>}
      {state.success && <p style={{ color: "green" }}>{state.success}</p>}

      <SubmitButton />
    </form>
  );
}
