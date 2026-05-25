import { useEffect, useState } from "react";

import AdminLayout from "../layouts/AdminLayout";

import {
  Shield,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";

import api from "../services/api";

import { useNavigate } from "react-router-dom";

function Users() {

  const navigate = useNavigate();

  const [accounts, setAccounts] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  //
  // FETCH ACCOUNTS
  //
  const fetchAccounts = async () => {

    try {

      const response =
        await api.get(
          "/account/accounts"
        );

      setAccounts(
        response.data.accounts
      );

    } catch (error: any) {

      console.log(error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {

        localStorage.removeItem(
          "token"
        );

        navigate("/");
      }

    } finally {

      setLoading(false);

    }
  };

  //
  // DELETE ACCOUNT
  //
  const handleDelete = async (
    id: string
  ) => {

    const confirmDelete =
      window.confirm(
        "Yakin ingin menghapus akun?"
      );

    if (!confirmDelete) return;

    try {

      await api.delete(
        `/account/accounts/${id}`
      );

      fetchAccounts();

    } catch (error: any) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Gagal menghapus akun"
      );

    }
  };

  //
  // CHANGE ROLE
  //
  const handleChangeRole = async (
    account: any,
    newRole: string
  ) => {

    try {

      if (
        account.role === newRole
      ) {
        return;
      }

      await api.patch(
        `/account/accounts/${account._id}/role`,
        {
          role: newRole,
        }
      );

      fetchAccounts();

    } catch (error: any) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Gagal mengubah role"
      );

    }
  };

  //
  // CHECK LOGIN
  //
  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {

      navigate("/");
      return;
    }

    fetchAccounts();

  }, []);

  return (
    <AdminLayout>

      <div className="page-container">

        {/* HEADER */}
        <div>

          <h1 className="page-title">
            Pengguna
          </h1>

          <p className="page-subtitle">
            Kelola semua akun
          </p>

        </div>

        {/* STATS */}
        <div className="stats-grid-3">

          {/* TOTAL */}
          <div className="stats-card">

            <div>

              <p className="text-muted">
                Total Akun
              </p>

              <h2
                className="
                  text-[24px]
                  font-bold
                  text-[#264d6d]
                  mt-1
                "
              >
                {accounts.length}
              </h2>

            </div>

            <div
              className="
                icon-box
                bg-[#eaf4fb]
                text-[#264d6d]
              "
            >
              <UsersIcon size={22} />
            </div>

          </div>

          {/* ADMIN */}
          <div className="stats-card">

            <div>

              <p className="text-muted">
                Total Admin
              </p>

              <h2
                className="
                  text-[24px]
                  font-bold
                  text-[#b31e23]
                  mt-1
                "
              >
                {
                  accounts.filter(
                    (a) =>
                      a.role === "admin"
                  ).length
                }
              </h2>

            </div>

            <div
              className="
                icon-box
                bg-[#fff1f1]
                text-[#b31e23]
              "
            >
              <Shield size={22} />
            </div>

          </div>

        </div>

        {/* TABLE */}
        <div className="card">

          <div className="card-header">

            <div>

              <h2 className="card-title">
                Semua Akun
              </h2>

              <p className="card-subtitle">
                Total {accounts.length} akun
              </p>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-[#f9fafb]">

                  <th className="table-head">
                    Username
                  </th>

                  <th className="table-head">
                    Email
                  </th>

                  <th className="table-head">
                    Role
                  </th>

                  <th className="table-head">
                    Created
                  </th>

                  <th className="table-head text-center">
                    Aksi
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan={5}
                      className="
                        text-center
                        py-10
                      "
                    >
                      Loading...
                    </td>
                  </tr>

                ) : accounts.length === 0 ? (

                  <tr>
                    <td
                      colSpan={5}
                      className="
                        text-center
                        py-10
                      "
                    >
                      Tidak ada data
                    </td>
                  </tr>

                ) : (

                  accounts.map((account) => {

                    const username =
                      account.email.split("@")[0];

                    return (

                      <tr
                        key={account._id}
                        className="
                          table-row
                          hover:bg-[#f8fafc]
                        "
                      >

                        {/* USERNAME */}
                        <td className="table-cell">

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

                            <div
                              className="
                                icon-box
                                bg-[#eef3f7]
                                text-[#264d6d]
                                font-bold
                              "
                            >
                              {username
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <p
                              className="
                                font-semibold
                                text-[14px]
                              "
                            >
                              {username}
                            </p>

                          </div>

                        </td>

                        {/* EMAIL */}
                        <td className="table-cell">
                          {account.email}
                        </td>

                        {/* ROLE */}
                        <td className="table-cell">

                          <select
                            value={account.role}
                            onChange={(e) =>
                              handleChangeRole(
                                account,
                                e.target.value
                              )
                            }
                            className="
                              border
                              rounded-lg
                              px-2
                              py-1
                            "
                          >
                            <option value="user">
                              USER
                            </option>

                            <option value="admin">
                              ADMIN
                            </option>

                          </select>

                        </td>

                        {/* DATE */}
                        <td
                          className="
                            table-cell
                            text-muted
                          "
                        >
                          {new Date(
                            account.createdAt
                          ).toLocaleDateString()}
                        </td>

                        {/* ACTION */}
                        <td className="table-cell">

                          <div
                            className="
                              flex
                              justify-center
                            "
                          >

                            <button
                              onClick={() =>
                                handleDelete(
                                  account._id
                                )
                              }
                              className="
                                btn-secondary
                                hover:bg-red-50
                                text-red-500
                              "
                            >
                              <Trash2 size={14} />
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}

export default Users;