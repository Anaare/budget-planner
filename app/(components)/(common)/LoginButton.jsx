"use client";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="hover:cursor-pointer"
      title="sign in"
    >
      Sign in with Google
    </button>
  );
}
