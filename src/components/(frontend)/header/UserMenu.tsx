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
import { getSession } from "@/lib/session"; // Daha önce oluşturduğumuz utility

export default async function UserMenu() {
  const session = await getSession();

  // Giriş yapmamış kullanıcı için
  if (!session) {
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
            <Link href="/login" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Giriş Yap
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/register" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Üye Ol
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Giriş yapmış kullanıcı için
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="logo" variant={"user"} className="flex items-center gap-2 py-2 px-4 rounded">
          <User />
          {session.user.name || session.user.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white text-black">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{session.user.name || "Kullanıcı"}</p>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Hesabım
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Profil Ayarları
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
        
            Çıkış Yap
   
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}