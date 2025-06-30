import { FaChartBar } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import Image from "next/image";
import Link from "next/link";

function SideBar() {
  return (
    <div className="side-bar flex flex-col mt-10 ml-3">
      <Image
        src="/logo.png"
        className="w-30 h-auto ml-15"
        alt="App Logo"
        width={96}
        height={96}
      />

      <ul className="side-bar-links">
        <li className="side-bar-link">
          <FaChartBar />
          <Link href="/dashboard">Dashboard</Link>
        </li>

        <li className="side-bar-link">
          <GrTransaction />
          <Link href="/transactions">Transactions</Link>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
