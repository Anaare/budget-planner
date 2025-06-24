import Image from "next/image";
import { LuLogOut } from "react-icons/lu";
import { FaUser } from "react-icons/fa6";

function Header() {
  return (
    <div className="header">
      <Image
        src="/default-user.jpg"
        className="rounded-full w-10"
        width={80}
        height={80}
        alt="user profile icon"
      />
      <p>Username</p>
      <button>
        <FaUser />
      </button>
      <button title="logout">
        <LuLogOut className="text-lg" />
      </button>
    </div>
  );
}

export default Header;
