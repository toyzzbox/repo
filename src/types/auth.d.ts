// types/auth.d.ts

declare module "auth" {
    import { NextAuthConfig as NAC } from "next-auth";
  
    export type NextAuthConfig = NAC;
  
    const NextAuth: (config: NAC) => {
      handlers: unkonwn;
      signIn: unkonwn;
      signOut: unkonwn;
      auth: unkonwn;
    };
  
    export default NextAuth;
  }
  
  declare module "auth/providers/google" {
    import { OAuthConfig } from "next-auth/providers";
    const GoogleProvider: (options: {
      clientId: string;
      clientSecret: string;
    }) => OAuthConfig<string>;
    export default GoogleProvider;
  }
  
  declare module "auth/providers/credentials" {
    import { CredentialsConfig } from "next-auth/providers";
    const CredentialsProvider: (config: CredentialsConfig<string>) => CredentialsConfig<string>;
    export default CredentialsProvider;
  }
  