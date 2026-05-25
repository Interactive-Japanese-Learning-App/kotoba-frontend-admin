import { useEffect, useState } from "react";

import AdminLayout from "../layouts/AdminLayout";
import StatCard from "../components/StatCard";

import {
  Users,
  Shield,
} from "lucide-react";

import api from "../services/api";

import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const [
    totalAccounts,
    setTotalAccounts,
  ] = useState(0);

  const [
    totalAdmins,
    setTotalAdmins,
  ] = useState(0);

  const [loading, setLoading] =
    useState(true);

  //
  // FETCH DATA
  //
  const fetchAccounts = async () => {

    try {

      const response =
        await api.get(
          "/account/accounts"
        );

      const accounts =
        response.data.accounts;

      setTotalAccounts(
        response.data.total
      );

      setTotalAdmins(
        accounts.filter(
          (a: any) =>
            a.role === "admin"
        ).length
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
            Dashboard Admin
          </h1>

          <p className="page-subtitle">
            Ringkasan data pengguna
          </p>

        </div>

        {/* STATS */}
        <div className="stats-grid-3">

          <StatCard
            title="Total Akun"
            value={
              loading
                ? "Loading..."
                : totalAccounts
            }
            subtitle="Semua pengguna"
            icon={<Users size={22} />}
            iconBg="#eaf4fb"
            iconColor="#264d6d"
          />

          <StatCard
            title="Total Admin"
            value={
              loading
                ? "Loading..."
                : totalAdmins
            }
            subtitle="Administrator"
            icon={<Shield size={22} />}
            iconBg="#fff1f1"
            iconColor="#b31e23"
          />

        </div>

      </div>

    </AdminLayout>
  );
}

export default Dashboard;