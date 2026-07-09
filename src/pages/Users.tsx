import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Shield, Trash2, Users as UsersIcon, User } from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Users() {

  const navigate = useNavigate();

  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // MODAL DELETE
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);


  const fetchAccounts = async () => {

    try {

      setLoading(true);

      const response = await api.get(
        "/account/accounts"
      );

      setAccounts(
        response.data.accounts || []
      );


    } catch (error: any) {

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {

        localStorage.removeItem("token");
        navigate("/");

      }

    } finally {

      setLoading(false);

    }

  };



  // DELETE ACCOUNT
  const handleDelete = async () => {

    if (!selectedAccount) return;


    try {

      await api.delete(
        `/account/accounts/${selectedAccount._id}`
      );


      setShowDeleteModal(false);
      setSelectedAccount(null);


      fetchAccounts();


    } catch (error: any) {

      console.log(
        error.response?.data?.message ||
        "Gagal menghapus akun"
      );

    }

  };




  // CHANGE ROLE
  const handleChangeRole = async (
    account: any,
    newRole: string
  ) => {

    setActiveDropdown(null);


    if (account.role === newRole)
      return;


    try {


      await api.patch(
        `/account/accounts/${account._id}/role`,
        {
          role: newRole
        }
      );


      fetchAccounts();


    } catch (error: any) {

      console.log(
        error.response?.data?.message ||
        "Gagal mengubah role"
      );

    }

  };



  useEffect(() => {

    const token =
      localStorage.getItem("token");


    if (!token) {

      navigate("/");
      return;

    }


    fetchAccounts();


  }, []);



  return (

    <AdminLayout>


      <div
        className="
          w-full
          p-6
          flex
          flex-col
          gap-6
        "
      >


        {/* HEADER */}

        <div>

          <h1
            className="
              text-2xl
              font-bold
              text-[#264d6d]
              tracking-tight
            "
          >
            Pengguna
          </h1>


          <p
            className="
              text-sm
              text-slate-500
              mt-0.5
            "
          >
            Kelola akses dan data seluruh akun pengguna
          </p>


        </div>





        {/* STATS */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          "
        >


          <div
            className="
              bg-white
              p-5
              rounded-2xl
              border
              border-gray-200
              shadow-sm
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Total Akun
              </p>


              <h3
                className="
                  text-2xl
                  font-bold
                  text-[#264d6d]
                  mt-1
                "
              >
                {
                  loading
                    ? "..."
                    : accounts.length
                }
              </h3>


            </div>


            <div
              className="
                p-3
                bg-[#eaf4fb]
                text-[#264d6d]
                rounded-xl
              "
            >
              <UsersIcon size={20}/>
            </div>


          </div>





          <div
            className="
              bg-white
              p-5
              rounded-2xl
              border
              border-gray-200
              shadow-sm
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Total Admin
              </p>


              <h3
                className="
                  text-2xl
                  font-bold
                  text-[#b31e23]
                  mt-1
                "
              >

                {
                  loading
                    ? "..."
                    : accounts.filter(
                        (a) =>
                          a.role === "admin"
                      ).length
                }

              </h3>


            </div>


            <div
              className="
                p-3
                bg-[#fff1f1]
                text-[#b31e23]
                rounded-xl
              "
            >

              <Shield size={20}/>

            </div>


          </div>


        </div>





        {/* TABLE */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            shadow-sm
            overflow-hidden
          "
        >

          <div
            className="
              p-6
              border-b
              border-gray-100
            "
          >

            <h2
              className="
                text-lg
                font-bold
                text-gray-900
              "
            >
              Daftar Pengguna
            </h2>

          </div>



          <div className="overflow-x-auto">

            <table className="w-full text-left">


              <thead>

                <tr className="bg-gray-50/50">


                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                    Username
                  </th>


                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                    Email
                  </th>


                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                    Role
                  </th>


                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                    Bergabung
                  </th>


                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-center">
                    Aksi
                  </th>


                </tr>

              </thead>





              <tbody
                className="
                  divide-y
                  divide-gray-100
                "
              >


              {
                loading

                ?

                [...Array(3)].map(
                  (_,i)=>(

                    <tr key={i}>

                      <td
                        colSpan={5}
                        className="p-8"
                      >

                        <div
                          className="
                            h-4
                            bg-gray-100
                            rounded-full
                          "
                        />

                      </td>

                    </tr>

                  )
                )


                :


                accounts.map(
                  (account)=>{

                    const isAdmin =
                      account.role === "admin";


                    return (

                    <tr
                      key={account._id}
                      className="
                        hover:bg-gray-50/50
                        transition-colors
                      "
                    >


                      <td
                        className="
                          px-6
                          py-4
                          font-bold
                          text-gray-700
                          capitalize
                          text-sm
                        "
                      >
                        {account.email.split("@")[0]}
                      </td>



                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          text-gray-500
                        "
                      >
                        {account.email}
                      </td>





                      <td className="px-6 py-4">


                        <div className="relative inline-block">


                          <button

                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === account._id
                                ? null
                                : account._id
                              )
                            }

                            className={`
                              px-3
                              py-1
                              rounded-full
                              text-[11px]
                              font-bold
                              border
                              flex
                              items-center
                              gap-1.5

                              ${
                              isAdmin

                              ? "bg-[#fff1f1] text-[#b31e23] border-red-100"

                              : "bg-[#eaf4fb] text-[#264d6d] border-blue-100"
                              }
                            `}
                          >

                            {
                              isAdmin
                              ?
                              <Shield size={12}/>
                              :
                              <User size={12}/>
                            }

                            {account.role.toUpperCase()}


                          </button>





                          {
                            activeDropdown === account._id && (

                              <div
                                className="
                                  absolute
                                  left-0
                                  top-full
                                  mt-1
                                  w-28
                                  bg-white
                                  border
                                  border-gray-200
                                  rounded-lg
                                  shadow-lg
                                  z-50
                                  overflow-hidden
                                "
                              >

                                <button
                                  onClick={() =>
                                    handleChangeRole(
                                      account,
                                      "user"
                                    )
                                  }
                                  className="
                                    w-full
                                    px-4
                                    py-2
                                    text-left
                                    text-xs
                                    hover:bg-gray-100
                                  "
                                >
                                  USER
                                </button>



                                <button
                                  onClick={() =>
                                    handleChangeRole(
                                      account,
                                      "admin"
                                    )
                                  }
                                  className="
                                    w-full
                                    px-4
                                    py-2
                                    text-left
                                    text-xs
                                    hover:bg-gray-100
                                  "
                                >
                                  ADMIN
                                </button>


                              </div>

                            )
                          }


                        </div>


                      </td>





                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          text-gray-400
                        "
                      >

                        {
                          new Date(
                            account.createdAt
                          )
                          .toLocaleDateString("id-ID")
                        }

                      </td>





                      <td
                        className="
                          px-6
                          py-4
                          text-center
                        "
                      >

                        <button

                          onClick={() => {

                            setSelectedAccount(account);
                            setShowDeleteModal(true);

                          }}

                          className="
                            p-2
                            text-gray-400
                            hover:text-red-600
                            hover:bg-red-50
                            rounded-lg
                          "
                        >

                          <Trash2 size={16}/>

                        </button>


                      </td>



                    </tr>

                    );

                  }

                )

              }


              </tbody>


            </table>


          </div>


        </div>


      </div>





      {/* DELETE MODAL */}

      {
        showDeleteModal && (

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
                Hapus Akun
              </h2>


              <p
                className="
                  text-sm
                  text-gray-500
                  mt-3
                "
              >

                Yakin ingin menghapus akun{" "}
                
                <b>
                  {selectedAccount?.email}
                </b>

                ?

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

                  onClick={() => {

                    setShowDeleteModal(false);
                    setSelectedAccount(null);

                  }}

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

                  onClick={handleDelete}

                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-[#b31e23]
                    text-white
                    text-sm
                  "
                >

                  Hapus

                </button>


              </div>


            </div>


          </div>

        )
      }



    </AdminLayout>

  );

}


export default Users;