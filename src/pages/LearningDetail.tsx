import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

// Import ikon pendukung
import { Search, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, X } from "lucide-react";

type NihongoItem = {
  _id: string;
  id: number;
  character: string;
  romaji: string;
  meaning: string;
  type: string;
};

function LearningDetail() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  // State manajemen data
  const [data, setData] = useState<NihongoItem[]>([]);
  const [filteredData, setFilteredData] = useState<NihongoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State navigasi halaman (Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // State kendali modal popup
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // State elemen formulir data
  const [formCharacter, setFormCharacter] = useState("");
  const [formRomaji, setFormRomaji] = useState("");
  const [formMeaning, setFormMeaning] = useState("");
  const [formType, setFormType] = useState("Basic");

  const getBackendCategoryKey = (paramType: string | undefined): string => {
    if (!paramType) return "";
    const cleanType = paramType.toLowerCase().replace("model", "");
    const mapping: Record<string, string> = {
      hiragana: "hiragana", katakana: "katakana", number: "numbers",
      date: "dates", month: "months", family: "family", animal: "animals",
      food: "foods", drink: "drinks", job: "jobs", object: "object_vocab",
      object_vocab: "object_vocab", numbers: "numbers", dates: "dates",
      months: "months", animals: "animals", foods: "foods", drinks: "drinks", jobs: "jobs"
    };
    return mapping[cleanType] || cleanType;
  };

  const getCleanTitle = (paramType: string | undefined): string => {
    if (!paramType) return "";
    const clean = paramType.toLowerCase().replace("model", "");
    if (clean === "object_vocab" || clean === "object") return "Kosakata Benda";
    return clean;
  };

  // Mengambil repositori data dari REST API Backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const categoryKey = getBackendCategoryKey(type);
      const response = await api.get(`/nihongo/${categoryKey}`);
      if (response.data && response.data.data) {
        setData(response.data.data);
        setFilteredData(response.data.data);
      }
    } catch (error) {
      console.error("Gagal memuat data objek:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pemfilteran karakter berdasarkan input bar pencarian
  useEffect(() => {
    const results = data.filter(item =>
      (item.character?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (item.romaji?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (item.meaning?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
    setFilteredData(results);
    setCurrentPage(1);
  }, [searchTerm, data]);

  useEffect(() => {
    fetchData();
  }, [type]);

  // Aktivasi dialog tambah entri baru
  const handleOpenAddModal = () => {
    setModalMode("add");
    setSelectedId(null);
    setFormCharacter("");
    setFormRomaji("");
    setFormMeaning("");
    setFormType("Basic");
    setIsModalOpen(true);
  };

  // Aktivasi dialog edit entri berjalan
  const handleOpenEditModal = (item: NihongoItem) => {
    setModalMode("edit");
    setSelectedId(item._id);
    setFormCharacter(item.character || "");
    setFormRomaji(item.romaji || "");
    setFormMeaning(item.meaning || "");
    setFormType(item.type || "Basic");
    setIsModalOpen(true);
  };

  // Eksekusi pengiriman data form (Aksi simpan / ubah)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryKey = getBackendCategoryKey(type);

    const payload = {
      character: formCharacter,
      romaji: formRomaji,
      meaning: formMeaning,
      type: formType,
    };

    try {
      if (modalMode === "add") {
        await api.post(`/nihongo/${categoryKey}`, payload);
      } else if (modalMode === "edit" && selectedId) {
        await api.put(`/nihongo/${categoryKey}/${selectedId}`, payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Gagal melakukan sinkronisasi modifikasi data:", error);
    }
  };

  // Eksekusi penghapusan rekaman data kosakata
  const handleDeleteItem = async (id: string, character: string) => {
    const confirmDelete = window.confirm(`Yakin ingin menghapus data "${character}"?`);
    if (!confirmDelete) return;

    const categoryKey = getBackendCategoryKey(type);
    try {
      await api.delete(`/nihongo/${categoryKey}/${id}`);
      fetchData();
    } catch (error) {
      console.error("Gagal menghapus entri target:", error);
    }
  };

  // Kalkulator pembatas baris data tabel
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="w-full p-6 flex flex-col gap-6">

        {/* BREADCRUMB NAVIGATION */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="cursor-pointer hover:text-[#123b5d] transition-colors" onClick={() => navigate("/learning-content")}>
            Konten Belajar
          </span>
          <span className="text-gray-300">/</span>
          <span className="text-[#123b5d] font-medium capitalize">
            {getCleanTitle(type)}
          </span>
        </div>

        {/* TOP HERO HEADER PANEL */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 text-[#123b5d] flex items-center justify-center text-2xl border border-gray-100">
              ⛩️
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 capitalize tracking-tight">
                Materi {getCleanTitle(type)}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Koleksi data aktif: <span className="font-mono bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded border border-gray-100 text-xs">{getBackendCategoryKey(type)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="h-10 px-4 text-sm font-medium text-white bg-[#123b5d] hover:bg-[#1c4c75] rounded-xl flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus size={16} />
              Tambah Kosakata
            </button>
            <button
              onClick={() => navigate(-1)}
              className="h-10 px-4 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>

        {/* CONTAINER UTAMA TABEL */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">

          {/* SEARCH & ROW FILTER BAR */}
          <div className="p-4 border-b border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400 pointer-events-none">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Cari huruf, romaji, atau arti kata..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-gray-50 focus:outline-none focus:border-[#123b5d] focus:bg-white transition-all"
              />
            </div>
            <div className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
              Menampilkan <span className="text-gray-900 font-semibold">{currentItems.length}</span> dari <span className="text-[#123b5d] font-semibold">{filteredData.length}</span> entri
            </div>
          </div>

          {/* VIEW RENDER DATA */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#123b5d] border-t-transparent mb-3"></div>
              <p className="text-sm text-gray-500">Memuat basis data dari konsol server...</p>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="py-24 text-center text-sm text-gray-400 font-medium">
              Tidak ada kecocokan data kosakata yang ditemukan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 text-center">No</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Character</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">Romaji</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Meaning</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.map((item, index) => (
                    <tr key={item._id || index} className="hover:bg-gray-50/70 transition-colors duration-150 group">
                      <td className="p-4 text-sm text-gray-400 text-center font-mono">
                        {String(indexOfFirstItem + index + 1).padStart(2, '0')}
                      </td>
                      <td className="p-4">
                        <span className="text-base font-bold text-gray-900 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg group-hover:bg-white transition-colors">
                          {item.character || "-"}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-semibold text-[#123b5d]">
                        {item.romaji || "-"}
                      </td>
                      <td className="p-4 text-sm text-gray-600 font-medium">
                        {item.meaning || "-"}
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-0.5 text-xs bg-gray-50 text-gray-500 rounded-md uppercase font-medium inline-block border border-gray-100">
                          {item.type || "Basic"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-[#123b5d] hover:bg-gray-50 hover:border-gray-300 transition-all"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item._id, item.character || item.romaji)}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* COMPONENT CONTROL CONTROLLER PAGINATION */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-between gap-4 mt-auto">
              <span className="text-sm text-gray-500">
                Halaman <span className="text-gray-900 font-medium">{currentPage}</span> dari <span className="text-gray-900 font-medium">{totalPages}</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`h-9 px-3 rounded-xl border text-sm font-medium transition-colors flex items-center gap-1 ${currentPage === 1
                      ? "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>

                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  if (pageNum === 1 || pageNum === totalPages || Math.abs(currentPage - pageNum) <= 1) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 text-sm font-medium rounded-xl transition-colors ${currentPage === pageNum
                            ? "bg-[#123b5d] text-white"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === 2 || pageNum === totalPages - 1) {
                    return <span key={pageNum} className="text-gray-300 px-1 text-sm">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`h-9 px-3 rounded-xl border text-sm font-medium transition-colors flex items-center gap-1 ${currentPage === totalPages
                      ? "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* INTERFACE PANEL MODAL DIALOG CONTAINER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">

            {/* Modal Header Title */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-900 tracking-tight">
                {modalMode === "add" ? "Tambah Data Kosakata" : "Ubah Data Kosakata"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Elements Content Form */}
            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4">

              {/* Field Character */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Character (Kanji / Kana)</label>
                <input
                  type="text"
                  required
                  value={formCharacter}
                  onChange={(e) => setFormCharacter(e.target.value)}
                  placeholder="Contoh: 日本語"
                  className="w-full h-11 px-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-[#123b5d] focus:bg-white transition-all"
                />
              </div>

              {/* Field Romaji */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Romaji</label>
                <input
                  type="text"
                  required
                  value={formRomaji}
                  onChange={(e) => setFormRomaji(e.target.value)}
                  placeholder="Contoh: nihongo"
                  className="w-full h-11 px-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-[#123b5d] focus:bg-white transition-all"
                />
              </div>

              {/* Field Meaning */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Arti (Meaning)</label>
                <input
                  type="text"
                  required
                  value={formMeaning}
                  onChange={(e) => setFormMeaning(e.target.value)}
                  placeholder="Contoh: Bahasa Jepang"
                  className="w-full h-11 px-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-[#123b5d] focus:bg-white transition-all"
                />
              </div>

              {/* Modal Control Footer Action Trigger */}
              <div className="flex items-center justify-end gap-2 mt-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 text-sm font-medium text-white bg-[#123b5d] hover:bg-[#1c4c75] rounded-xl transition-colors shadow-sm"
                >
                  Simpan Data
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default LearningDetail;