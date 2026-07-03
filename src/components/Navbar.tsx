import {
  LogOut,
  User,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const adminData =
    localStorage.getItem("admin");

  const admin = adminData
    ? JSON.parse(adminData)
    : null;

  const username = admin?.email
    ? admin.email.split("@")[0]
    : "Administrator";

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Yakin ingin logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    navigate("/");
  };

  return (
    <header
      className="
        h-[70px]
        bg-white
        border-b
        border-slate-200
        px-8
        flex
        items-center
        justify-end
      "
    >
      <div className="flex items-center gap-5">

        {/* Profile */}
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              w-10
              h-10
              rounded-full
              bg-[#123b5d]
              text-white
              flex
              items-center
              justify-center
            "
          >
            <User size={18} />
          </div>

          <div className="leading-tight">
            <h2 className="text-[13px] font-semibold text-slate-800">
              {username.toLowerCase()}
            </h2>

            <p className="text-[11px] text-slate-500">
              {(admin?.email || "-").toLowerCase()}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            h-[42px]
            px-5
            rounded-xl
            bg-[#b31e23]
            text-white
            flex
            items-center
            gap-2
            text-[14px]
            font-semibold
            transition-all
            duration-200
            hover:bg-[#991b1b]
            hover:shadow-md
            active:scale-95
          "
        >
          <LogOut size={16} />
          Logout
        </button>

      </div>
    </header>
  );
}

export default Navbar;