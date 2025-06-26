import SideBar from "../(components)/(common)/SideBar";
import Header from "../(components)/(common)/Header";
import { Providers } from "../(providers)/providers";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/");

  return (
    <Providers>
      <div className="dashboard">
        <SideBar />
        <Header />
        <main>{children}</main>
      </div>
    </Providers>
  );
}
