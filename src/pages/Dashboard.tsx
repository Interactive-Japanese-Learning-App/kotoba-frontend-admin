import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  Eye,
  Film,
  Play,
  Shield,
  Users,
  Video,
  Layers,
  BookOpen,
  ExternalLink,
  ThumbsUp,
} from "lucide-react";
import api from "../services/api";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

type AnyRecord = Record<string, unknown>;

type DashboardUser = {
  _id: string;
  email: string;
  role: string;
  createdAt: string | number | Date;
};

type YouTubeVideo = AnyRecord & {
  _id?: string;
  title?: string;
  video_url?: string;
  videoUrl?: string;
  url?: string;
  thumbnail?: string;
  video_thumbnail?: string;
  channel_name?: string;
  channelName?: string;
  channel?: string;
  score?: number;
  views?: number;
  likes?: number;
};

type YouTubeChannel = AnyRecord & {
  _id?: string;
  channel_name?: string;
  channelName?: string;
  channel?: string;
  subscribers?: number;
  total_views?: number;
  views?: number;
  score?: number;
};



function Dashboard() {
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalAdmins: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalContent: 0,
    recentUsers: [] as DashboardUser[],
    chartData: [] as { name: string; count: number }[],
    avgContentPerCategory: 0,
  });
  const [loading, setLoading] = useState(true);

  // YouTube analytics (ambil dari MediaLibrary backend: GET /youtube)
  const [ytLoading, setYtLoading] = useState(true);
  const [ytVideos, setYtVideos] = useState<YouTubeVideo[]>([]);
  const [ytTopChannels, setYtTopChannels] = useState<YouTubeChannel[]>([]);

  const getChannelName = (item: AnyRecord) => {
    return (
      (item as YouTubeChannel | YouTubeVideo).channel_name ||
      (item as YouTubeChannel | YouTubeVideo).channelName ||
      (item as YouTubeChannel | YouTubeVideo).channel ||
      "Unknown Channel"
    );
  };


  const ytRankedTopChannels = useMemo(() => {
    const list = Array.isArray(ytTopChannels) ? ytTopChannels : [];
    return [...list]
      .map((item) => {
        const subscribers = Number(item?.subscribers ?? 0);
        const views = Number(item?.total_views ?? item?.views ?? 0);
        const score = Number(item?.score ?? 0);
        const rankValue = subscribers > 0 ? subscribers : views > 0 ? views : score;
        return { item, rankValue };
      })
      .sort((a, b) => b.rankValue - a.rankValue)
      .slice(0, 8);
  }, [ytTopChannels]);

  const ytChartData = useMemo(() => {
    return ytRankedTopChannels.map(({ item, rankValue }, idx) => ({
      rank: idx + 1,
      name: getChannelName(item),
      value: rankValue,
    }));
  }, [ytRankedTopChannels]);

  const ytRankedVideos = useMemo(() => {
    const list = Array.isArray(ytVideos) ? ytVideos : [];
    return [...list]
      .map((item) => {
        const score = Number(item?.score ?? 0);
        const views = Number(item?.views ?? 0);
        const rankValue = score > 0 ? score : views;
        return { item, rankValue };
      })
      .sort((a, b) => b.rankValue - a.rankValue)
      .slice(0, 6)
      .map(({ item }) => item);
  }, [ytVideos]);


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

  useEffect(() => {
    const fetchYouTubeAnalytics = async () => {
      try {
        setYtLoading(true);
        const response = await api.get("/youtube");
        const ytData = response.data?.data || response.data || {};
        setYtVideos(ytData.videos || []);
        setYtTopChannels(ytData.topChannels || []);
      } catch (error) {
        console.error("Gagal mengambil data YouTube untuk dashboard:", error);
      } finally {
        setYtLoading(false);
      }
    };

    fetchYouTubeAnalytics();
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <div className="p-10 text-center font-bold text-[#264d6d]">Memuat Data Sistem...</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="w-full p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#264d6d] tracking-tight">Dashboard Admin</h1>
              <p className="text-sm text-slate-500 mt-0.5">Ringkasan operasional, konten, dan analitik media.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#264d6d] bg-[#eaf4fb] border border-[#dbeafe] px-3 py-2 rounded-2xl">
                <Shield size={14} /> Online
              </span>
            </div>
          </div>
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
          {/* LEFT: Distribusi Materi */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Distribusi Materi</h2>
            <div className="h-64 w-full px-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} interval={0} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                  <Bar dataKey="count" fill="#264d6d" radius={[6, 6, 0, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CENTER: Top Channel Chart */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Top Channels</h2>
                <p className="text-xs text-slate-400 mt-0.5">Ranking by subscribers (fallback views/score)</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#eaf4fb] flex items-center justify-center text-[#264d6d]">
                <Video size={18} />
              </div>
            </div>

            {ytLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="text-xs font-bold text-slate-400">Memuat chart...</div>
              </div>
            ) : ytChartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center">
                <div className="text-xs font-medium text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-center">
                  Tidak ada data Top Channel dari API.
                </div>
              </div>
            ) : (
              <div className="h-64 w-full px-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ytChartData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide domain={[0, "dataMax"]} />
                    <YAxis dataKey="name" type="category" width={110} fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                      formatter={(value: any) => Number(value).toLocaleString("id-ID")}
                    />
                    <Bar dataKey="value" fill="#264d6d" radius={[8, 8, 8, 8]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* RIGHT: Top Video list + recent users */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Top Video</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Ranking by score (fallback views)</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#fff1f1] flex items-center justify-center text-[#b31e23]">
                  <Film size={18} />
                </div>
              </div>

              {ytLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-slate-50 animate-pulse" />
                  ))}
                </div>
              ) : ytRankedVideos.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">Tidak ada video.</div>
              ) : (
                <div className="space-y-3">
                  {ytRankedVideos.map((v: any, idx: number) => {
                    const title = v?.title || "Untitled Video";
                    const channelName = getChannelName(v);
                    const url = v?.video_url || v?.videoUrl || v?.url || "#";
                    const score = Number(v?.score ?? 0);
                    const views = Number(v?.views ?? 0);
                    const displayScore = score > 0 ? score : views;
                    const thumb = v?.thumbnail || v?.video_thumbnail;
                    return (
                      <div key={v?._id || idx} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-slate-100/60">
                        <div className="w-12 h-12 rounded-lg bg-[#eaf4fb] overflow-hidden flex items-center justify-center text-[#264d6d] text-xs font-bold shrink-0">
                          {thumb ? (
                            <img src={thumb} alt={title} className="w-full h-full object-cover" />
                          ) : (
                            <Play size={16} fill="#264d6d" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-slate-700 truncate">#{idx + 1} {title}</p>
                              <p className="text-[9px] text-slate-400 mt-0.5 truncate">{channelName}</p>
                            </div>
                            <span className="text-[10px] font-black text-[#264d6d] bg-[#eaf4fb] border border-[#dbeafe] px-2 py-0.5 rounded-md shrink-0">
                              {Number(displayScore).toLocaleString("id-ID")}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
                            <span className="inline-flex items-center gap-1"><Eye size={12} /> {views.toLocaleString("id-ID")}</span>
                            <span className="inline-flex items-center gap-1"><ThumbsUp size={11} /> {Number(v?.likes ?? 0).toLocaleString("id-ID")}</span>
                          </div>
                        </div>
                        <a href={url} target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline inline-flex items-center gap-1 text-[11px]">
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
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

      </div>
    </AdminLayout>
  );
}

export default Dashboard;