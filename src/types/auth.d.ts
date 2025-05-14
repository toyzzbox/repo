// types/auth.d.ts

import { NextAuthConfig as NAC } from "next-auth";
import { OAuthConfig } from "next-auth/providers";
import { CredentialsConfig } from "next-auth/providers/credentials";

// Kullanıcı nesnesi için özel bir arayüz tanımlayın
interface User {
  id: string;
  name?: string;
  email?: string;
  // Gerekirse ek alanlar ekleyin
}

// Google sağlayıcısı için OAuth yapılandırması
declare module "auth/providers/google" {
  const GoogleProvider: (options: {
    clientId: string;
    clientSecret: string;
  }) => OAuthConfig<User>;
  export default GoogleProvider;
}

// Credentials sağlayıcısı için yapılandırma
declare module "auth/providers/credentials" {
  const CredentialsProvider: (config: CredentialsConfig<{
    email: string;
    password: string;
  }>) => CredentialsConfig<{
    email: string;
    password: string;
  }>;
  export default CredentialsProvider;
}

// NextAuth yapılandırması
declare module "auth" {
  export type NextAuthConfig = NAC;

  const NextAuth: (config: NAC) => {
    handlers: {
      GET: (...args: any[]) => any;
      POST: (...args: any[]) => any;
    };
    signIn: (provider: string, options?: any) => Promise<void>;
    signOut: (options?: any) => Promise<void>;
    auth: (options?: any) => Promise<void>;
  };

  export default NextAuth;
}
