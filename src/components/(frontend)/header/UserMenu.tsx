// components/UserMenu.jsx
import { getSession } from "@/lib/session";
import { logout } from "@/lib/logout";
import UserDropdown from "./UserDropdown"; // Artifact'daki bileşen

export default async function UserMenu() {
  const session = await getSession();
  
  return (
    <UserDropdown 
      isLoggedIn={!!session} 
      user={session?.user}
      onLogout={logout}
    />
  );
}