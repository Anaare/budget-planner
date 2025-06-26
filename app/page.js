import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import LoginButton from "./(components)/(common)/LoginButton";
import Image from "next/image";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="p-8 flex justify-center items-center flex-col">
      <Image src="/logo.png" width={200} height={200} alt="app logo" />
      <h1 className="text-3xl mb-4">Sign in to continue</h1>
      <div className="border-2 border-foreground p-4 rounded flex gap-3 items-center">
        <FcGoogle className="text-xl" />
        <LoginButton />
      </div>
    </div>
  );
}
