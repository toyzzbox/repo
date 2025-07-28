"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setIsLoading(true);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      toast.error("E-posta veya şifre hatalı");
    } else {
      toast.success("Giriş başarılı");
      router.push("/hesabim");
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* E-posta */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">E-posta</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="ornek@mail.com"
                  disabled={isLoading}
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
              <FormLabel htmlFor="password">Şifre</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Şifremi unuttum */}
        <div className="text-right">
          <Link href="/login/reset" className="text-sm text-blue-600 hover:underline">
            Parolamı unuttum
          </Link>
        </div>

        {/* Giriş Butonu */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>
    </Form>
  );
}
