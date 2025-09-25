// components/(frontend)/header/UserMobileMenuClient.tsx
"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";

interface UserMobileMenuClientProps {
  session: any;
}

const UserMobileMenuClient = ({ session }: UserMobileMenuClientProps) => {
  const href = session?.user ? "/hesabim" : "/login";
  
  return (
    <Link href={href} className="relative flex items-center text-3xl">
      <UserRound />
    </Link>
  );
};

export default UserMobileMenuClient;