
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


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="logo" variant={"user"} className="flex items-center gap-2 py-2 px-4 rounded">
        <User />
           "Giriş Yap"
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-white text-black">
      
         
            <DropdownMenuLabel>Hoş geldiniz</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">Giriş Yap</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/register">Üye Ol</Link>
            </DropdownMenuItem>
          
      
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
