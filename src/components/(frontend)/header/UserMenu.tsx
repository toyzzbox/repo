import { auth } from "@/auth"; // v5 Auth.js'deki server fonksiyon
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignOutButton from "../auth/SignOut";

export default async function UserMenu() {
  const session = await auth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="logo" variant={"user"} className="flex items-center gap-2 py-2 px-4 rounded">
          <User />
          {session?.user?.name?.split(" ")[0] ?? "Giriş Yap"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-white text-black">
        {session?.user ? (
          <>
            <DropdownMenuLabel>{session.user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ayarlar</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/api/auth/signout">
                <LogOut className="mr-2 h-4 w-4" />
               <SignOutButton/>
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Hoş geldiniz</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/api/auth/signin">Giriş Yap</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/register">Üye Ol</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
