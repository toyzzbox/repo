'use client';

import { useActionState } from "react";
import { register } from "@/actions/register";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ActionState = { error: string; success?: undefined } | { success: string; error?: undefined };
const initialState: ActionState = { error: "" };

export const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(register, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">İsim</label>
        <Input id="name" name="name" disabled={isPending} />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">E-posta</label>
        <Input id="email" name="email" type="email" disabled={isPending} />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">Şifre</label>
        <Input id="password" name="password" type="password" disabled={isPending} />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        Kayıt Ol
      </Button>

      {state.error && <p className="text-red-600 text-sm">{state.error}</p>}
      {state.success && <p className="text-green-600 text-sm">{state.success}</p>}
    </form>
  );
};
