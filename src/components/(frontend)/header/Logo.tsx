"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/"); // Route to the home page
  };

  return (
    <div className="cursor-pointer" onClick={handleClick}>
      <Image
        src="/logo.png"
        width={150}
        height={100}
        alt="Picture of the author"
      />
    </div>
  );
};

export default Logo;


