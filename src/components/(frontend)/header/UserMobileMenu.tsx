import Link from "next/link";
import { UserRound } from "lucide-react";
import { getSession } from "@/lib/session";

const UserMobileMenu = async () => {
  const session = await getSession();
  const href = session?.user ? "/account" : "/login";

  return (
    <Link href={href} className="relative flex items-center text-3xl">
      <UserRound />
    </Link>
  );
};

export default UserMobileMenu;
