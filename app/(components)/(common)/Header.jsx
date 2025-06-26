"use client";
import Image from "next/image";
import { LuLogOut } from "react-icons/lu";
import { FaUser } from "react-icons/fa6";
import { signIn, signOut, useSession } from "next-auth/react";

function Header() {
  const { data: session, status } = useSession();
  console.log(session);

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
          <button>
            <FaUser />
          </button>
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
