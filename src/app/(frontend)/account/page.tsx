import { auth } from "@/auth";

export default async function AccountPage() {
  const session = await auth();

  if (!session) {
    return <div>Giriş yapmadınız</div>;
  }

  return <div>Hoş geldin {session.user.name}</div>;
}