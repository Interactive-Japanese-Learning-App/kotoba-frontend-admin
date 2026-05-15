import type { ReactNode } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

type Props = {
  children: ReactNode;
};

function AdminLayout({ children }: Props) {
  return (
    <div className="bg-[#f3f3f5] h-screen flex overflow-hidden">

      {/* Sidebar FIXED */}
      <div className="fixed left-0 top-0 h-screen z-50">

        <Sidebar />

      </div>

      {/* Main Content */}
      <div className="flex-1 ml-[250px] flex flex-col h-screen">

        {/* Navbar */}
        <Navbar />

        {/* Scroll Area */}
        <main
          className="
            flex-1
            overflow-y-auto
            p-6
          "
        >
          {children}
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;