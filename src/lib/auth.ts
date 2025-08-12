import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    async signUp({ name, email, password }: SignUpInput) {
      const hashedPassword = await bcrypt.hash(password, 10);

      // Kullanıcıyı kaydet
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Account'a parola ekleme!
      await prisma.account.create({
        data: {
          userId: user.id,
          providerId: "credential",
          providerAccountId: user.id,
          type: "credentials",
        },
      });

      return user;
    },
  },
});
