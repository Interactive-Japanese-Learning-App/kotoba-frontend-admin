import {
  LogOut,
  User,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";


function Navbar() {

  const navigate = useNavigate();


  const [
    showLogoutModal,
    setShowLogoutModal,
  ] = useState(false);



  const adminData =
    localStorage.getItem("admin");


  const admin = adminData
    ? JSON.parse(adminData)
    : null;



  const username = admin?.email
    ? admin.email.split("@")[0]
    : "Administrator";



  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    setShowLogoutModal(false);

    navigate("/");

  };



  return (

    <>

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

        <div
          className="
            flex
            items-center
            gap-5
          "
        >



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




            <div
              className="
                leading-tight
              "
            >

              <h2
                className="
                  text-[13px]
                  font-semibold
                  text-slate-800
                "
              >

                {username.toLowerCase()}

              </h2>



              <p
                className="
                  text-[11px]
                  text-slate-500
                "
              >

                {(admin?.email || "-").toLowerCase()}

              </p>


            </div>


          </div>





          {/* Logout Button */}

          <button

            onClick={() =>
              setShowLogoutModal(true)
            }


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


      {/* LOGOUT MODAL */}

      {
        showLogoutModal && (

          <div
            className="
              fixed
              inset-0
              bg-black/40
              flex
              items-center
              justify-center
              z-50
            "
          >


            <div
              className="
                bg-white
                rounded-2xl
                p-6
                w-[350px]
                shadow-xl
              "
            >


              <h2
                className="
                  text-lg
                  font-bold
                  text-[#264d6d]
                "
              >

                Logout

              </h2>



              <p
                className="
                  text-sm
                  text-gray-500
                  mt-3
                "
              >

                Yakin ingin keluar dari akun ini?

              </p>




              <div
                className="
                  flex
                  justify-end
                  gap-3
                  mt-6
                "
              >



                <button

                  onClick={() =>
                    setShowLogoutModal(false)
                  }


                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-gray-100
                    text-gray-700
                    text-sm
                  "

                >

                  Batal

                </button>





                <button

                  onClick={handleLogout}


                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-[#b31e23]
                    text-white
                    text-sm
                  "

                >

                  Logout

                </button>




              </div>



            </div>



          </div>

        )
      }



    </>

  );

}


export default Navbar;