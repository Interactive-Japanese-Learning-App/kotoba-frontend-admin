import { Bell, Search } from "lucide-react";

function Navbar() {
  return (
    <div
      className="
        h-[70px]
        bg-white
        border-b
        border-[#e5e7eb]
        px-6
        flex
        items-center
        justify-end
      "
    >

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div
          className="
            h-[42px]
            w-[240px]
            bg-[#f3f4f6]
            rounded-xl
            px-4
            flex
            items-center
            gap-2
          "
        >

          <Search
            size={16}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari data..."
            className="
              bg-transparent
              outline-none
              text-[14px]
              w-full
            "
          />

        </div>

        {/* Notification */}
        <button
          className="
            w-[42px]
            h-[42px]
            rounded-xl
            bg-[#f3f4f6]
            flex
            items-center
            justify-center
          "
        >

          <Bell
            size={18}
            className="text-gray-600"
          />

        </button>

      </div>

    </div>
  );
}

export default Navbar;