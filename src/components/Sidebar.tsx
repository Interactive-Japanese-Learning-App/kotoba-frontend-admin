import {
  LayoutDashboard,
  Users,
  BookOpen,
  Image,
  LogOut,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import logo from "../assets/kotoba-logo.png";

function Sidebar() {

  const location = useLocation();

  const navigate = useNavigate();

  //
  // GET ADMIN LOGIN
  //
  const adminData =
    localStorage.getItem("admin");

  const admin = adminData
    ? JSON.parse(adminData)
    : null;

  // username dari email
  const username = admin?.email
    ? admin.email.split("@")[0]
    : "Administrator";

  //
  // MENU
  //
  const menus = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Pengguna",
      path: "/users",
      icon: <Users size={18} />,
    },
    {
      name: "Konten Belajar",
      path: "/learning-content",
      icon: <BookOpen size={18} />,
    },
    {
      name: "Perpustakaan Media",
      path: "/media",
      icon: <Image size={18} />,
    },
  ];

  //
  // HANDLE LOGOUT
  //
  const handleLogout = () => {

    const confirmLogout =
      window.confirm(
        "Yakin ingin logout?"
      );

    if (!confirmLogout) return;

    // hapus auth
    localStorage.removeItem("token");

    localStorage.removeItem("admin");

    // redirect login
    navigate("/");
  };

  return (
    <div
      className="
        w-[250px]
        min-w-[250px]
        bg-white
        border-r
        border-[#e5e7eb]
        h-screen
        sticky
        top-0
        flex
        flex-col
        justify-between
      "
    >

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="px-6 pt-6 pb-8">

          <div className="flex items-center gap-3">

            <img
              src={logo}
              alt="Kotoba Logo"
              className="w-[42px]"
            />

            <div>

              <h1
                className="
                  text-[24px]
                  font-extrabold
                  text-[#123b5d]
                  tracking-wide
                "
              >
                KOTOBA
              </h1>

              <p
                className="
                  text-[12px]
                  text-gray-400
                  -mt-1
                "
              >
                Admin Console
              </p>

            </div>

          </div>

        </div>

        {/* MENU */}
        <div className="flex flex-col gap-2 px-4">

          {menus.map((menu) => {

            const active =
              location.pathname === menu.path;

            return (

              <Link
                key={menu.name}
                to={menu.path}
              >

                <button
                  className={`
                    relative
                    w-full
                    h-[48px]
                    flex
                    items-center
                    gap-3
                    px-4
                    rounded-2xl
                    text-[14px]
                    transition-all
                    duration-200
                    ${
                      active
                        ? "bg-[#eef3f7] text-[#123b5d] font-semibold"
                        : "text-gray-600 hover:bg-[#f8fafc]"
                    }
                  `}
                >

                  {/* ACTIVE LINE */}
                  {active && (

                    <div
                      className="
                        absolute
                        left-0
                        top-[8px]
                        w-[4px]
                        h-[32px]
                        bg-[#123b5d]
                        rounded-r-full
                      "
                    />

                  )}

                  {/* ICON */}
                  <div
                    className={`
                      w-8
                      h-8
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      ${
                        active
                          ? "bg-white text-[#123b5d]"
                          : "bg-[#f8fafc] text-gray-500"
                      }
                    `}
                  >
                    {menu.icon}
                  </div>

                  {/* TEXT */}
                  <span>{menu.name}</span>

                </button>

              </Link>

            );
          })}

        </div>

      </div>

      {/* BOTTOM */}
      <div className="p-4 flex flex-col gap-3">

        {/* PROFILE */}
        <div
          className="
            bg-[#f8fafc]
            rounded-2xl
            p-3
            flex
            items-center
            gap-3
            border
            border-[#eeeeee]
          "
        >

          {/* AVATAR */}
          <div
            className="
              w-11
              h-11
              rounded-full
              bg-[#123b5d]
              text-white
              flex
              items-center
              justify-center
              font-bold
              text-[18px]
            "
          >
            {username.charAt(0).toUpperCase()}
          </div>

          {/* INFO */}
          <div>

            <h2
              className="
                text-[14px]
                font-semibold
                text-[#111827]
              "
            >
              {username}
            </h2>

            <p
              className="
                text-[12px]
                text-gray-400
              "
            >
              {admin?.email || "-"}
            </p>

          </div>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            h-[48px]
            flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-[#fff1f1]
            text-[#b31e23]
            text-[14px]
            font-semibold
            hover:bg-[#ffe5e5]
            transition-all
          "
        >

          <LogOut size={17} />

          Logout

        </button>

      </div>

    </div>
  );
}

export default Sidebar;