"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { LoginSchema } from "@/schema";
import CardWrapper from "./card-wrapper";
import GoogleLogin from "./google-button";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "./form-error";

export default function LoginForm() {
  const [error, setError] = useState("");
  const { push } = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setError(""); // önceki hatayı sıfırla

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, // kontrolü kendimiz yapacağız
    });

    if (res?.error) {
      setError("Geçersiz e-posta veya şifre.");
    } else {
      push("/hesabim"); // başarılıysa yönlendir
    }
  };

  return (
    <CardWrapper
      headerLabel=""
      title=""
      backButtonHref="/register"
      backButtonLabel="Henüz bir hesabınız yoksa Üye ol"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* E-posta */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="ornek@mail.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Şifre */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="••••••••" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              size="sm"
              variant="link"
              asChild
              className="px-0 font-normal"
            >
              <Link href="/login/reset">Parolamı unuttum</Link>
            </Button>
          </div>

          {/* Hata mesajı */}
          <FormError message={error} />

          <Button type="submit" className="w-full">
            Giriş Yap
          </Button>
        </form>
      </Form>

      {/* Google ile giriş */}
      <GoogleLogin />
    </CardWrapper>
  );
}
