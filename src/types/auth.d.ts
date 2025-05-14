// types/auth.d.ts

declare module "auth" {
    import { NextAuthConfig as NAC } from "next-auth";
  
    export type NextAuthConfig = NAC;
  
    const NextAuth: (config: NAC) => {
      handlers: any;
      signIn: any;
      signOut: any;
      auth: any;
    };
  
    export default NextAuth;
  }
  
  declare module "auth/providers/google" {
    import { OAuthConfig } from "next-auth/providers";
    const GoogleProvider: (options: {
      clientId: string;
      clientSecret: string;
    }) => OAuthConfig<any>;
    export default GoogleProvider;
  }
  
  declare module "auth/providers/credentials" {
    import { CredentialsConfig } from "next-auth/providers";
    const CredentialsProvider: (config: CredentialsConfig<any>) => CredentialsConfig<any>;
    export default CredentialsProvider;
  }
  