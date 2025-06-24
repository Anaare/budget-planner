// import { Geist, Geist_Mono } from "next/font/google";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "./(components)/(common)/SideBar";
import Header from "./(components)/(common)/Header";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
});

export const metadata = {
  title: "Personal Budgeting App",
  description: "Track your budget",
};

// antialiased
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={spaceMono.className}>
      <body>
        <div className="dashboard">
          <SideBar className="side-bar" />
          <Header className="header" />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
