import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Users, Shield, BookOpen, Layers } from "lucide-react";
import api from "../services/api";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalAdmins: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalContent: 0,
    recentUsers: [],
    chartData: [] as any[],
    avgContentPerCategory: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userRes = await api.get("/account/accounts").catch(() => ({ data: { accounts: [] } }));
      const accounts = userRes.data.accounts || [];

      const targetModels = ["HiraganaModel", "KatakanaModel", "NumberModel", "DateModel", "MonthModel", "FamilyModel", "AnimalModel", "FoodModel", "DrinkModel", "JobModel", "ObjectModel"];
      
      const getEndpoint = (model: string) => {
        const mapping: Record<string, string> = { HiraganaModel: "hiragana", KatakanaModel: "katakana", NumberModel: "numbers", DateModel: "dates", MonthModel: "months", FamilyModel: "family", AnimalModel: "animals", FoodModel: "foods", DrinkModel: "drinks", JobModel: "jobs", ObjectModel: "object_vocab" };
        return mapping[model] || model.toLowerCase().replace("model", "");
      };

      const results = await Promise.allSettled(
        targetModels.map(async (model) => {
          const endpoint = getEndpoint(model);
          const response = await api.get(`/nihongo/${endpoint}`);
          const dataArr = response.data.data || response.data || [];
          return { name: model.replace("Model", ""), count: Array.isArray(dataArr) ? dataArr.length : 0 };
        })
      );

      const chartData = results.filter((r): r is PromiseFulfilledResult<{name: string, count: number}> => r.status === 'fulfilled').map(r => r.value);
      const totalContent = chartData.reduce((acc, curr) => acc + curr.count, 0);

      setStats({
        totalAccounts: accounts.length,
        totalAdmins: accounts.filter((a: any) => a.role === "admin").length,
        totalUsers: accounts.filter((a: any) => a.role !== "admin").length,
        totalCategories: targetModels.length,
        totalContent: totalContent,
        recentUsers: accounts.slice(-5).reverse(),
        chartData: chartData,
        avgContentPerCategory: Math.round(totalContent / targetModels.length)
      });
    } catch (error) {
      console.error("Gagal memuat dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (loading) return <AdminLayout><div className="p-10 text-center font-bold text-[#264d6d]">Memuat Data Sistem...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="w-full p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#264d6d] tracking-tight">Dashboard Admin</h1>
          <p className="text-sm text-slate-500 mt-0.5">Ringkasan operasional dan statistik konten terkini.</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Total Pengguna", val: stats.totalAccounts, sub: `${stats.totalAdmins} Admin, ${stats.totalUsers} User`, icon: Users, color: "#264d6d", bg: "#eaf4fb" },
            { title: "Total Materi", val: stats.totalContent, sub: `Rata-rata ${stats.avgContentPerCategory} per kategori`, icon: BookOpen, color: "#16a34a", bg: "#f0fdf4" },
            { title: "Kategori Aktif", val: stats.totalCategories, sub: "Model data terintegrasi", icon: Layers, color: "#d97706", bg: "#fffbeb" },
            { title: "Status Sistem", val: "Online", sub: "Semua API terhubung", icon: Shield, color: "#0891b2", bg: "#ecfeff" }
          ].map((item, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 rounded-xl" style={{backgroundColor: item.bg, color: item.color}}><item.icon size={18} /></div>
                <p className="text-[10px] font-bold uppercase text-slate-400">{item.title}</p>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{item.val}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* CHART & ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CHART SECTION - DIPERBAIKI */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Distribusi Materi</h2>
            
            {/* Wrapper ini memaksa grafik berada di tengah kartu */}
            <div className="h-64 w-full px-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    interval={0} // Memaksa semua label kategori tampil
                  />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#264d6d" 
                    radius={[6, 6, 0, 0]} 
                    barSize={25} // Ukuran bar disesuaikan agar tidak terlalu lebar
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pengguna Terbaru</h2>
            <div className="space-y-4">
              {stats.recentUsers.map((user: any) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#264d6d] text-white flex items-center justify-center text-xs font-bold">{user.email[0].toUpperCase()}</div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{user.email.split("@")[0]}</p>
                      <p className="text-[9px] text-gray-400">{user.role}</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 text-right">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {day: 'numeric', month: 'short'})} <br/>
                    {new Date(user.createdAt).toLocaleTimeString("id-ID", {hour: '2-digit', minute: '2-digit'})}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;