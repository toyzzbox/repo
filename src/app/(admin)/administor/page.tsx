import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  // const session = await auth();

  // if (!session || session.user.role !== "admin") {
  //   redirect("/403"); // veya anasayfa
  // }

  return <div>👑 Admin Paneline Hoş Geldin!</div>;
}