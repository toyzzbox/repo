"use client";

import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";

const UserMobileMenu = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login"); // Giriş sayfasının yolu burada
  };

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer flex items-center"
    >
      <div className="text-3xl">
        <UserRound />
      </div>
    </div>
  );
};

export default UserMobileMenu;
