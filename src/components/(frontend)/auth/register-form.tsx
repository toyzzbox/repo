'use client';

import { useActionState } from "react";
import { register } from "@/actions/register";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RegisterSchema } from "@/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Aynı tipi burada da tanımla
type ActionState = { error: string; success?: undefined } | { success: string; error?: undefined };

const initialState: ActionState = { error: "" };

export const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(register, initialState);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormItem>
          <FormLabel>İsim</FormLabel>
          <FormControl>
            <Input name="name" disabled={isPending} />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>E-posta</FormLabel>
          <FormControl>
            <Input type="email" name="email" disabled={isPending} />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Şifre</FormLabel>
          <FormControl>
            <Input type="password" name="password" disabled={isPending} />
          </FormControl>
          <FormMessage />
        </FormItem>

        <Button type="submit" className="w-full" disabled={isPending}>
          Kayıt Ol
        </Button>

        {state.error && <p className="text-red-600 text-sm">{state.error}</p>}
        {state.success && <p className="text-green-600 text-sm">{state.success}</p>}
      </form>
    </Form>
  );
};
