import Link from "next/link";
import { UserRound } from "lucide-react";

const UserMobileMenu = ({ session }: { session: any }) => {
  const href = session?.user ? "/account" : "/login";

  return (
    <Link href={href} className="relative flex items-center text-3xl">
      <UserRound />
    </Link>
  );
};

export default UserMobileMenu;
