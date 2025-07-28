import { useSession } from "next-auth/react";

export default function TestComponent() {
  const { data: session, status } = useSession();
  
  console.log("Session Status:", status);
  console.log("Session Data:", session);
  
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Please sign in</div>;
  
  return (
    <div>
      <h1>Welcome {session?.user?.name}</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Role: {(session?.user as any)?.role}</p>
    </div>
  );
}