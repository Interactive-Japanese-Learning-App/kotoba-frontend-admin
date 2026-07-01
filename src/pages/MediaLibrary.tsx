import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  Play,
  Eye,
  Video,
  Clapperboard,
  TrendingUp,
  ThumbsUp,
  ExternalLink,
  Search,
} from "lucide-react";
import api from "../services/api";

function MediaLibrary() {
  const [activeTab, setActiveTab] = useState<"videos" | "topChannels" | "channels">("videos");
  const [videos, setVideos] = useState<any[]>([]);
  const [topChannels, setTopChannels] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/youtube");
        const ytData = response.data?.data || {};

        setVideos(ytData.videos || []);
        setTopChannels(ytData.topChannels || []);
        setChannels(ytData.channels || []);
      } catch (error) {
        console.error("Gagal mengambil data analitik YouTube:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  // Ambil nama channel dengan aman dari berbagai kemungkinan nama field di backend
  const getChannelName = (item: any) => {
    return item?.channel_name || item?.channelName || item?.channel || "Unknown Channel";
  };

  const getFilteredData = () => {
    if (activeTab === "videos") {
      return videos.filter((item) =>
        (item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        getChannelName(item).toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === "topChannels") {
      return topChannels.filter((item) =>
        getChannelName(item).toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return channels.filter((item) =>
        getChannelName(item).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  // Helper pembuat inisial huruf yang rapi & presisi 2 karakter
  const getInitial = (item: any) => {
    const name = getChannelName(item);
    if (name === "Unknown Channel") return "YT";
    return name.trim().substring(0, 2).toUpperCase();
  };

  const filteredItems = getFilteredData();

  return (
    <AdminLayout>
      <div className="w-full p-6 flex flex-col gap-6">
        
        {/* HEADER (Sama Persis dengan LearningContent) */}
        <div>
          <h1 className="text-2xl font-bold text-[#264d6d] tracking-tight">Perpustakaan Media</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Analisis data multi-koleksi MongoDB secara real-time dengan visualisasi kartu modern.
          </p>
        </div>

        {/* STATS COUNTER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Video</p>
              <h2 className="text-2xl font-bold text-[#b31e23] mt-1">{videos.length} Baris</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Koleksi: `videos`</p>
            </div>
            <div className="w-[52px] h-[52px] rounded-2xl bg-[#fff1f1] flex items-center justify-center text-[#b31e23]">
              <Clapperboard size={24} />
            </div>
          </div>

          <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Channel</p>
              <h2 className="text-2xl font-bold text-[#264d6d] mt-1">{topChannels.length} Baris</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Koleksi: `top_channels`</p>
            </div>
            <div className="w-[52px] h-[52px] rounded-2xl bg-[#eaf4fb] flex items-center justify-center text-[#264d6d]">
              <Video size={24} />
            </div>
          </div>

          <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matriks Channel</p>
              <h2 className="text-2xl font-bold text-amber-600 mt-1">{channels.length} Baris</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Koleksi: `channels`</p>
            </div>
            <div className="w-[52px] h-[52px] rounded-2xl bg-[#fffbeb] flex items-center justify-center text-amber-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* CONTAINER UTAMA BANNER */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          
          {/* CONTROL BAR & TABS */}
          <div className="p-6 border-b border-slate-100 bg-white flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">Galeri Media Interaktif</h2>
                <p className="text-xs text-slate-400 mt-0.5">Manajemen visual metrik data dari ekosistem YouTube</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Cari di tab ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#264d6d] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* NAV TAB LINK */}
            <div className="flex gap-2 border-b border-slate-100 pb-px">
              <button
                onClick={() => { setActiveTab("videos"); setSearchTerm(""); }}
                className={`pb-2 px-4 text-xs font-bold transition-all border-b-2 ${
                  activeTab === "videos" ? "border-[#264d6d] text-[#264d6d]" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Galeri Video ({videos.length})
              </button>
              <button
                onClick={() => { setActiveTab("topChannels"); setSearchTerm(""); }}
                className={`pb-2 px-4 text-xs font-bold transition-all border-b-2 ${
                  activeTab === "topChannels" ? "border-[#264d6d] text-[#264d6d]" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Profil Channel ({topChannels.length})
              </button>
              <button
                onClick={() => { setActiveTab("channels"); setSearchTerm(""); }}
                className={`pb-2 px-4 text-xs font-bold transition-all border-b-2 ${
                  activeTab === "channels" ? "border-[#264d6d] text-[#264d6d]" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Matriks Kontribusi ({channels.length})
              </button>
            </div>
          </div>

          {/* AREA GRID KONTEN UTAMA */}
          <div className="p-6 bg-slate-50/50">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white h-60 rounded-3xl border border-slate-100" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-12 text-center text-xs font-medium text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                Tidak ada data media yang cocok dengan pencarian Anda.
              </div>
            ) : (
              <>
                {/* TAB 1: VIDEOS */}
                {activeTab === "videos" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item, index) => {
                      const videoLink = item.video_url || item.videoUrl || item.url || "#";
                      const hasThumb = item.thumbnail || item.video_thumbnail;
                      
                      return (
                        <div key={item._id || index} className="bg-white border border-[#eeeeee] rounded-3xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group">
                          <div>
                            <div className="relative aspect-video bg-[#eaf4fb] flex items-center justify-center overflow-hidden border-b border-slate-100">
                              {hasThumb ? (
                                <img src={hasThumb} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#eaf4fb] to-[#d3e9f7] flex flex-col items-center justify-center text-[#264d6d] p-4 text-center">
                                  <div className="w-10 h-10 rounded-full bg-white/80 shadow-sm flex items-center justify-center mb-1 text-[#264d6d]">
                                    <Play size={16} fill="#264d6d" />
                                  </div>
                                  <span className="text-[10px] font-bold tracking-wide uppercase opacity-75">No Thumbnail</span>
                                </div>
                              )}
                              <span className="absolute top-3 left-3 bg-[#b31e23] text-white font-extrabold text-[9px] px-2 py-0.5 rounded-md shadow-sm">
                                SCORE {Math.round(item.score || 0)}
                              </span>
                            </div>
                            <div className="p-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eaf4fb] text-[#264d6d] uppercase tracking-wider">
                                {getChannelName(item)}
                              </span>
                              <h3 className="mt-2 text-xs font-bold leading-relaxed text-slate-700 line-clamp-2 min-h-[36px] group-hover:text-[#264d6d] transition-colors">
                                {item.title || "Untitled Video Data"}
                              </h3>
                            </div>
                          </div>
                          <div className="px-4 pb-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
                            <div className="flex items-center gap-2.5">
                              <span className="flex items-center gap-0.5"><Eye size={12} /> {(item.views || 0).toLocaleString("id-ID")}</span>
                              <span className="flex items-center gap-0.5"><ThumbsUp size={11} /> {(item.likes || 0).toLocaleString("id-ID")}</span>
                            </div>
                            <a href={videoLink} target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline inline-flex items-center gap-0.5">
                              Tonton <ExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TAB 2: TOP CHANNELS */}
                {activeTab === "topChannels" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item, index) => {
                      const channelLink = item.channel_url || item.channelUrl || "#";
                      
                      return (
                        <div key={item._id || index} className="bg-white border border-[#eeeeee] rounded-3xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between p-5 group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              {item.thumbnail || item.channel_thumbnail ? (
                                <img src={item.thumbnail || item.channel_thumbnail} alt={getChannelName(item)} className="w-11 h-11 rounded-full border border-slate-100 object-cover" />
                              ) : (
                                <div className="w-11 h-11 rounded-full bg-[#fff1f1] text-[#b31e23] flex items-center justify-center font-bold text-xs border border-[#ffdddd] shadow-sm shrink-0">
                                  {getInitial(item)}
                                </div>
                              )}
                              <div>
                                <h3 className="text-xs font-bold text-slate-700 line-clamp-1 group-hover:text-[#264d6d] transition-colors">
                                  {getChannelName(item)}
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-0.5">Koleksi: `top_channels`</p>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-[#f0fdf4] border border-emerald-100 text-[#16a34a] font-black text-[9px]">
                              SCORE {Math.round(item.score || 0)}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 bg-[#f0fdf4] border border-emerald-100/40 rounded-2xl p-2.5 my-3.5 text-center text-[11px]">
                            <div>
                              <p className="text-[9px] text-emerald-700/70 font-bold uppercase tracking-tight">Subs</p>
                              <p className="font-bold text-[#16a34a] mt-0.5">{(item.subscribers || 0).toLocaleString("id-ID")}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-emerald-700/70 font-bold uppercase tracking-tight">Views</p>
                              <p className="font-bold text-[#16a34a] mt-0.5">{(item.total_views || item.views || 0).toLocaleString("id-ID")}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-emerald-700/70 font-bold uppercase tracking-tight">Video</p>
                              <p className="font-bold text-[#16a34a] mt-0.5">{item.total_videos || item.video_count || 0}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <a href={channelLink} target="_blank" rel="noreferrer" className="text-[11px] text-blue-500 font-bold hover:underline inline-flex items-center gap-1">
                              Buka Channel <ExternalLink size={11} />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TAB 3: CHANNELS MATRIKS */}
                {activeTab === "channels" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item, index) => (
                      <div key={item._id || index} className="bg-white border border-[#eeeeee] rounded-3xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col justify-between group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[#fffbeb] text-amber-600 flex items-center justify-center font-bold text-xs border border-[#fde68a] shadow-sm shrink-0">
                              {getInitial(item)}
                            </div>
                            <h3 className="text-xs font-bold text-slate-700 line-clamp-1 group-hover:text-[#264d6d] transition-colors">
                              {getChannelName(item)}
                            </h3>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-[#f3e8ff] border border-purple-100 text-[#9333ea] font-bold text-[9px]">
                            {Math.round(item.score || 0)} Pts
                          </span>
                        </div>

                        <div className="border-t border-slate-100 mt-3.5 pt-3 flex flex-col gap-1.5 text-xs">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400">Total Pelanggan:</span>
                            <span className="font-bold text-slate-600">{(item.subscribers || 0).toLocaleString("id-ID")}</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400">Jumlah Konten:</span>
                            <span className="font-bold text-slate-600">{item.video_count || item.total_videos || 0} Video</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400">Akumulasi Views:</span>
                            <span className="font-bold text-[#264d6d]">{(item.total_views || item.views || 0).toLocaleString("id-ID")}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

export default MediaLibrary;