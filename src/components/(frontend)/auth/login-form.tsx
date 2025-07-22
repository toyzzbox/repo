"use client";

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { LoginSchema } from '@/schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/actions/login';
import { useRouter } from 'next/navigation';

import CardWrapper from './card-wrapper';
import GoogleLogin from './google-button';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormError } from './form-error';
import { FormSuccess } from './form-success';

const LoginForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    try {
      const result = await login(data);

      if (result?.error) {
        setError(result.error);
      }

      if (result?.success) {
        setSuccess(result.success);

        // ✅ Oturum davranışını güncellemek için yönlendir + refresh
        startTransition(() => {
          router.push("/hesabim");
          router.refresh();
        });
      }
    } catch {
      setError("Beklenmedik bir hata oluştu");
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
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="ornek@mail.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
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

            <Button size="sm" variant="link" asChild className="px-0 font-normal">
              <Link href="/login/reset">Parolamı unuttum</Link>
            </Button>
          </div>

          {/* Success & Error Messages */}
          <FormSuccess message={success} />
          <FormError message={error} />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </Button>
        </form>
      </Form>

      {/* Google Login Butonu */}
      <GoogleLogin />
    </CardWrapper>
  );
};

export default LoginForm;
