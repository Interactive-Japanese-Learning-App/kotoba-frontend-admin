import {
  LayoutDashboard,
  Users,
  BookOpen,
  Image,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import logo from "../assets/kotoba-logo.png";

function Sidebar() {
  const location = useLocation();

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

  return (
    <aside
      className="
        w-[250px]
        min-w-[250px]
        h-screen
        sticky
        top-0
        bg-white
        border-r
        border-slate-200
        flex
        flex-col
      "
    >
      {/* LOGO */}
      <div className="px-6 pt-6 pb-8">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Kotoba Logo"
            className="w-[42px]"
          />

          <div>
            <h1 className="text-[24px] font-extrabold tracking-wide text-[#123b5d]">
              KOTOBA
            </h1>

            <p className="text-[12px] text-gray-400 -mt-1">
              Admin Console
            </p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2 px-4">
        {menus.map((menu) => {
          const active = location.pathname === menu.path;

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

                <span>{menu.name}</span>
              </button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;