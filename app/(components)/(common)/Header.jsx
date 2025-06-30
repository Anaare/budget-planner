"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { LuLogOut } from "react-icons/lu";
import Image from "next/image";

function Header() {
  const { data: session, status } = useSession();

  if (status === "loading") return null; // or a spinner

  return (
    <div className="header">
      {session ? (
        <>
          <Image
            src={session?.user.image || "/default-user.jpg"}
            className="rounded-full w-10"
            width={80}
            height={80}
            alt="user profile icon"
          />
          <p>{session.user.name}</p>
          <button
            title="logout"
            onClick={() => signOut("google")}
            className="hover:cursor-pointer"
          >
            <LuLogOut className="text-lg" />
          </button>
        </>
      ) : (
        <button onClick={() => signIn("google")}>Sign in</button>
      )}
    </div>
  );
}

export default Header;
