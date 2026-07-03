import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Users, Shield, BookOpen, Layers } from "lucide-react";
import api from "../services/api";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  LabelList,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

function Dashboard() {
  type RecentUser = {
    _id?: string;
    email?: string;
    role?: string;
    createdAt?: string;
  };

  type GrowthPoint = { name: string; Pendaftar: number };
  type YtVideoPoint = { title: string; Views: number; Likes: number };
  type YtChannelPoint = { channelName: string; TotalViews: number; TotalVideo: number; channelUrl: string };
  type FeatureUsagePoint = { activityType: string; total: number };

  const [stats, setStats] = useState<{
    totalAccounts: number;
    totalAdmins: number;
    totalUsers: number;
    totalCategories: number;
    totalContent: number;
    recentUsers: RecentUser[];
    userGrowthData: GrowthPoint[];
    ytVideosData: YtVideoPoint[];
    ytChannelsData: YtChannelPoint[];
  }>({
    totalAccounts: 0,
    totalAdmins: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalContent: 0,
    recentUsers: [],
    userGrowthData: [],
    ytVideosData: [],
    ytChannelsData: []
  });

  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [featureUsageData, setFeatureUsageData] = useState<FeatureUsagePoint[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<GrowthPoint[]>([]);
  const [showViews, setShowViews] = useState(true);
  const [showLikes, setShowLikes] = useState(true);

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
      const chartData = results.filter((r): r is PromiseFulfilledResult<{ name: string, count: number }> => r.status === 'fulfilled').map(r => r.value);
      const totalContent = chartData.reduce((acc, curr) => acc + curr.count, 0);

      const ytRes = await api.get("/youtube").catch(() => ({ data: { data: { videos: [], topChannels: [] } } }));
      const ytData = ytRes.data.data || { videos: [], topChannels: [] };

      const ytVideosData = (ytData.videos || []).slice(0, 5).map((v: any) => ({
        title: v.title.length > 14 ? v.title.substring(0, 14) + "..." : v.title,
        "Views": v.views || 0,
        "Likes": v.likes || 0
      }));

      const ytChannelsData = (ytData.topChannels || []).slice(0, 5).map((c: any) => ({
        channelName:
          c.channel_name.length > 12
            ? c.channel_name.substring(0, 12) + "..."
            : c.channel_name,

        TotalViews: c.total_views || 0,
        TotalVideo: c.total_videos || 0,

        channelUrl: c.channel_url || "",
      }));

      const totalAdmins = accounts.filter((a: any) => a.role === "admin").length;
      const totalUsersOnly = accounts.filter((a: any) => a.role !== "admin").length;

      const userGrowthData = [
        { name: "Jan", Pendaftar: 5 },
        { name: "Feb", Pendaftar: 12 },
        { name: "Mar", Pendaftar: 24 },
        { name: "Apr", Pendaftar: 38 },
        { name: "Mei", Pendaftar: 42 },
        { name: "Jun", Pendaftar: accounts.length || 55 }
      ];

      setStats({
        totalAccounts: accounts.length,
        totalAdmins,
        totalUsers: totalUsersOnly,
        totalCategories: targetModels.length,
        totalContent,
        recentUsers: accounts.slice(-5).reverse(),
        userGrowthData,
        ytVideosData,
        ytChannelsData
      });

    } catch (error) {
      console.error("Gagal memuat dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatureUsage = async (date: string) => {
    try {
      const res = await api.get(
        `/activity/statistics?date=${date}`
      );

      const defaultData = [
        { activityType: "Nihongo Dasar", total: 0 },
        { activityType: "Deteksi Objek", total: 0 },
        { activityType: "Kanvas Menulis", total: 0 },
        { activityType: "Pelafalan Suara", total: 0 },
        { activityType: "Kuis", total: 0 },
      ];

      const colors: Record<string, string> = {
        learning: "Nihongo Dasar",
        object_detection: "Deteksi Objek",
        kana_writing: "Kanvas Menulis",
        pronunciation: "Pelafalan Suara",
        quiz: "Kuis",
      };

      const formatted = defaultData.map((feature) => {
        const found = res.data.data.find(
          (item: any) =>
            colors[item.activityType] === feature.activityType
        );

        return {
          activityType: feature.activityType,
          total: found ? found.total : 0,
        };
      });

      setFeatureUsageData(formatted);

    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserGrowth = async (date: string) => {
    try {
      const res = await api.get(`/account/user-growth?date=${date}`);

      setUserGrowthData(res.data.data);
    } catch (err) {
      console.error(err);

      setUserGrowthData([
        { name: "Sen", Pendaftar: 0 },
        { name: "Sel", Pendaftar: 0 },
        { name: "Rab", Pendaftar: 0 },
        { name: "Kam", Pendaftar: 0 },
        { name: "Jum", Pendaftar: 0 },
        { name: "Sab", Pendaftar: 0 },
        { name: "Min", Pendaftar: 0 },
      ]);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchFeatureUsage(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    fetchUserGrowth(selectedDate);
  }, [selectedDate]);

  const formatYAxis = (value: number | string) => {
    const tick = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(tick)) return "0";
    if (tick >= 1000000) return `${(tick / 1000000).toFixed(1)}M`;
    if (tick >= 1000) return `${(tick / 1000).toFixed(0)}K`;
    return tick.toString();
  };

  const handleLegendClick = (e: unknown) => {
    const dataKey = (e as { dataKey?: unknown })?.dataKey;
    if (dataKey === "Views") setShowViews((prev) => !prev);
    if (dataKey === "Likes") setShowLikes((prev) => !prev);
  };

  if (loading) return <AdminLayout><div className="p-10 text-center font-bold text-[#264d6d] tracking-wider animate-pulse">MEMUAT ANALISIS SISTEM...</div></AdminLayout>;

  return (
    <AdminLayout>
      {/* Efek Warna Gradien */}
      <svg className="hidden">
        <defs>
          <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#264d6d" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#264d6d" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorBarVideo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.95} />
          </linearGradient>
        </defs>
      </svg>

      <div className="w-full p-6 flex flex-col gap-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#264d6d] tracking-tight">Dashboard</h1>
            <p className="text-xs text-slate-400 mt-0.5">Metrik performa basis data platform dan analitik streaming terintegrasi.</p>
          </div>

        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: "Total Pengguna", val: stats.totalAccounts, sub: `${stats.totalAdmins} Admin, ${stats.totalUsers} User`, icon: Users, color: "#264d6d", bg: "#eaf4fb" },
            { title: "Total Materi", val: stats.totalContent, sub: "Repositori Konten Lokal", icon: BookOpen, color: "#10b981", bg: "#f0fdf4" },
            { title: "Kategori Aktif", val: stats.totalCategories, sub: "Arsitektur Model Data", icon: Layers, color: "#d97706", bg: "#fffbeb" },
            { title: "Status Sistem", val: "Online", sub: "API Gateway Connected", icon: Shield, color: "#06b6d4", bg: "#ecfeff" }
          ].map((item, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: item.bg, color: item.color }}><item.icon size={18} /></div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600">{item.title}</p>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{item.val}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* BARIS 1: USER PENGGUNA (AREA CHART + LOG AKTIVITAS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AREA AKUISISI USER */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">Retensi & Akuisisi Pengguna Baru</h2>
            <div className="flex justify-end mb-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="
                  border border-[#264D6D]
                  rounded-lg
                  px-3 py-2
                  text-xs
                  text-[#264D6D]
                  bg-[#eaf4fb]
                  font-medium
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#264D6D]
                "
              />
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData} margin={{ top: 35, right: 15, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" fontSize={11} fontWeight={500} tickLine={false} axisLine={false} stroke="#64748b" dy={10} />
                  <YAxis fontSize={11} fontWeight={500} tickLine={false} axisLine={false} stroke="#64748b" dx={-5} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "2px solid #4CAF50",
                      backgroundColor: "#ffffff",
                      color: "#EDBC1D",
                    }}
                    itemStyle={{
                      color: "#4CAF50",
                      fontWeight: 100,
                    }}
                    labelStyle={{
                      color: "#4CAF50",
                      fontWeight: 700,
                    }}
                    cursor={{
                      stroke: "#4CAF50",
                      strokeWidth: 2,
                    }}
                  />
                  <Area type="monotone" dataKey="Pendaftar" stroke="#264d6d" fillOpacity={1} fill="url(#colorUser)" strokeWidth={3} name="Jumlah Pendaftar" animationDuration={1000}>
                    {/* Label nilai langsung pada ujung garis area chart */}
                    <LabelList dataKey="Pendaftar" position="top" offset={10} fontSize={10} fontWeight={600} fill="#264d6d" />
                  </Area>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LOG REGISTRASI BARU */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-5">Log Registrasi Baru</h2>
              <div className="space-y-3">
                {stats.recentUsers.length > 0 ? (
                  stats.recentUsers.map((user: any, idx) => (
                    <div key={user._id || idx} className="flex items-center justify-between p-3 bg-slate-50/70 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all duration-150">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#264d6d]/10 text-[#264d6d] flex items-center justify-center text-xs font-bold">
                          {user.email ? user.email[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">{user.email ? user.email.split("@")[0] : "User"}</p>
                          <p className="text-[9px] text-slate-400 font-mono tracking-wide uppercase mt-0.5">{user.role || "user"}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <p className="text-[10px] font-mono text-slate-500 leading-tight">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                            : "-"}
                        </p>
                        <p className="text-[9px] font-mono text-slate-400 leading-tight">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                            : "-"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 text-center py-16">Belum ada aktivitas user baru.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BARIS 3 : FEATURE USAGE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Analisis Penggunaan Fitur
              </h2>
              <p className="text-[10px] text-slate-400 mt-1">
                Aktivitas pengguna berdasarkan fitur.
              </p>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="
                border border-[#264D6D]
                rounded-lg
                px-3 py-2
                text-xs
                text-[#264D6D]
                font-medium
                bg-[#eaf4fb]
                focus:outline-none
                focus:ring-2
                focus:ring-[#264D6D]
                focus:border-[#264D6D]
                cursor-pointer
                calendar-blue
              "
            />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={featureUsageData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 10,
                  bottom: 10
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="activityType"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickCount={6}
                />
                <Tooltip
                  formatter={(value) => [
                    Number(value).toLocaleString("id-ID"),
                    "Jumlah Aktivitas",
                  ]}
                />
                <Bar
                  dataKey="total"
                  radius={[8, 8, 0, 0]}
                >
                  {featureUsageData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={[
                        "#264D6D",
                        "#B31E23",
                        "#EDBC1D",
                        "#4CAF50",
                        "#686868",
                      ][index % 5]}
                    />
                  ))}
                  <LabelList
                    dataKey="total"
                    position="top"
                    fontSize={11}
                    fontWeight={700}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BARIS 2: YOUTUBE BIG DATA (2 KOLOM JELAS & PRESISI DATA) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* GRAFIK 2: AREA CHART PERFORMA VIDEO (VIEWS & LIKES) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Video Trending
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Top video berdasarkan performa (Views & Likes).
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.ytVideosData}
                  margin={{
                    top: 20,
                    right: 25,
                    left: 10,
                    bottom: 40,
                  }}
                >
                  {/* Gradient */}
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#264D6D" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#264D6D" stopOpacity={0.05} />
                    </linearGradient>

                    <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EDBC1D" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#EDBC1D" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#cbd5e1"
                  />

                  <XAxis
                    dataKey="title"
                    angle={-20}
                    textAnchor="end"
                    height={55}
                    dy={12}
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                  />

                  {/* YAxis Views */}
                  <YAxis
                    yAxisId="left"
                    tickFormatter={formatYAxis}
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                    stroke="#264D6D"
                  />

                  {/* YAxis Likes */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={formatYAxis}
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                    stroke="#EDBC1D"
                  />

                  <Tooltip
                    formatter={(value, name) => {
                      if (typeof value === "number") {
                        return [value.toLocaleString("id-ID"), name];
                      }

                      return [String(value), name];
                    }}
                  />

                  <Legend
                    onClick={handleLegendClick}
                    wrapperStyle={{
                      fontSize: "11px",
                      paddingTop: "15px",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  />

                  {/* Views */}
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="Views"
                    hide={!showViews}
                    stroke="#264D6D"
                    strokeWidth={3}
                    fill="url(#viewsGradient)"
                    fillOpacity={1}
                    activeDot={{ r: 6 }}
                    name="Views"
                  />

                  {/* Likes */}
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="Likes"
                    hide={!showLikes}
                    stroke="#EDBC1D"
                    strokeWidth={3}
                    fill="url(#likesGradient)"
                    fillOpacity={1}
                    activeDot={{ r: 6 }}
                    name="Likes"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GRAFIK 3: DONUT CHART CHANNEL TRENDING */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Channel Trending
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Klik salah satu bagian grafik untuk membuka channel YouTube.
                </p>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.ytChannelsData}
                    dataKey="TotalViews"
                    nameKey="channelName"
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={2}
                    style={{ cursor: "pointer" }}
                    onClick={(data: any) => {
                      if (data.channelUrl) {
                        window.open(data.channelUrl, "_blank", "noopener,noreferrer");
                      }
                    }}
                  >
                    {stats.ytChannelsData.map((_: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={[
                          "#264D6D",
                          "#B31E23",
                          "#EDBC1D",
                          "#4CAF50",
                          "#686868",
                        ][index % 5]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) => Number(value).toLocaleString("id-ID")}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="rect"
                    wrapperStyle={{
                      fontSize: "11px",
                      paddingTop: "20px",
                      lineHeight: "20px",
                    }}
                    formatter={(value) => (
                      <span
                        style={{
                          display: "inline-block",
                          maxWidth: "180px",
                          whiteSpace: "normal",
                          overflowWrap: "break-word",
                          verticalAlign: "middle",
                        }}
                      >
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;