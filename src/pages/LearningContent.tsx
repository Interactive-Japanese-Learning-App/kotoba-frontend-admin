import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

// Import ikon Lucide
import { Search } from "lucide-react";

type CategoryType = {
  name: string;
  key: string;
  icon: string;
  count: number;
  desc: string;
  bgIcon: string;
  textColor: string;
};

function LearningContent() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  // State pencarian kategori
  const [searchTerm, setSearchTerm] = useState("");

  // METADATA MAPPER UNTUK STYLE & LABEL KATEGORI (Kosakatamodel dihapus)
  const getModelMeta = (modelName: string) => {
    const meta: any = {
      hiraganamodel: { label: "Hiragana", icon: "あ", unit: "Karakter", bg: "bg-[#eaf4fb]", text: "text-[#264d6d]" },
      katakanamodel: { label: "Katakana", icon: "カ", unit: "Karakter", bg: "bg-[#fff1f1]", text: "text-[#b31e23]" },
      numbermodel: { label: "Angka", icon: "1", unit: "Materi", bg: "bg-[#f0fdf4]", text: "text-[#16a34a]" },
      datemodel: { label: "Tanggal", icon: "日", unit: "Materi", bg: "bg-[#fffbeb]", text: "text-[#d97706]" },
      monthmodel: { label: "Bulan", icon: "月", unit: "Materi", bg: "bg-[#fffbeb]", text: "text-[#d97706]" },
      familymodel: { label: "Keluarga", icon: "家", unit: "Kata", bg: "bg-[#f3e8ff]", text: "text-[#9333ea]" },
      animalmodel: { label: "Hewan", icon: "動", unit: "Kata", bg: "bg-[#eaf4fb]", text: "text-[#264d6d]" },
      foodmodel: { label: "Makanan", icon: "食", unit: "Kata", bg: "bg-[#f0fdf4]", text: "text-[#16a34a]" },
      drinkmodel: { label: "Minuman", icon: "茶", unit: "Kata", bg: "bg-[#fffbeb]", text: "text-[#d97706]" },
      jobmodel: { label: "Pekerjaan", icon: "仕", unit: "Kata", bg: "bg-[#f3e8ff]", text: "text-[#9333ea]" },
      objectmodel: { label: "Benda", icon: "物", unit: "Kata", bg: "bg-slate-100", text: "text-slate-700" },
    };

    const key = modelName.toLowerCase();
    return meta[key] || { label: modelName, icon: "文", unit: "Materi", bg: "bg-slate-50", text: "text-slate-600" };
  };

  // Helper pencocokan endpoint yang sama persis dengan LearningDetail
  const getBackendCategoryKey = (paramType: string): string => {
    const cleanType = paramType.toLowerCase().replace("model", "");
    const mapping: Record<string, string> = {
      hiragana: "hiragana", katakana: "katakana", number: "numbers",
      date: "dates", month: "months", family: "family", animal: "animals",
      food: "foods", drink: "drinks", job: "jobs", object: "object_vocab"
    };
    return mapping[cleanType] || cleanType;
  };

  // FETCH DATA LANGSUNG DARI ENDPOINT DETAIL SECARA PARALEL (Tanpa KosakataModel)
  const fetchContentData = async () => {
    const targetModels = [
      "HiraganaModel", "KatakanaModel", "NumberModel", "DateModel",
      "MonthModel", "FamilyModel", "AnimalModel",
      "FoodModel", "DrinkModel", "JobModel", "ObjectModel"
    ];

    try {
      setLoading(true);

      const requests = targetModels.map(async (model) => {
        const meta = getModelMeta(model);
        const endpointKey = getBackendCategoryKey(model);

        let countResult = 0;
        try {
          const response = await api.get(`/nihongo/${endpointKey}`);
          if (response.data && response.data.data) {
            countResult = response.data.data.length;
          }
        } catch (err) {
          console.error(`Gagal mengambil count untuk endpoint /nihongo/${endpointKey}`, err);
          countResult = 0;
        }

        return {
          name: model === "ObjectModel" ? "Kosakata Benda" : meta.label,
          key: model,
          icon: meta.icon,
          count: countResult,
          desc: `Materi pembelajaran dasar ${meta.label.toLowerCase()} bahasa Jepang`,
          bgIcon: meta.bg,
          textColor: meta.text,
        };
      });

      const formattedCategories = await Promise.all(requests);
      setCategories(formattedCategories);

    } catch (error) {
      console.error("Gagal melakukan mapping data silabus:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetchContentData();
  }, [navigate]);

  const filteredCategories = categories.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="w-full p-6 flex flex-col gap-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-[#264d6d] tracking-tight">
            Nihongo Dasar
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola daftar materi pembelajaran dasar bahasa Jepang.
          </p>
        </div>

        {/* CONTAINER KARTU UTAMA */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">

          {/* CONTROL HEADER & INLINE MANAGE FORM */}
          <div className="p-6 border-b border-gray-200 bg-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Daftar Konten Dasar</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manajemen silabus materi pembelajaran Nihongo</p>
            </div>

            {/* Form Kontrol Dinamis */}
            <div className="relative w-full max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Cari kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-[#264d6d] focus:bg-white"
              />
            </div>
          </div>

          {/* VERTIKAL LIST VIEW KATEGORI KONTEN */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="p-5 flex items-center gap-4 animate-pulse"
                >
                  <div className="w-11 h-11 bg-gray-100 rounded-xl" />

                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-100 rounded-md w-1/4" />
                    <div className="h-3 bg-gray-100 rounded-md w-1/3" />
                  </div>
                </div>
              ))
            ) : filteredCategories.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                Tidak ada kategori ditemukan.
              </div>
            ) : (
              filteredCategories.map((item) => (
                <div
                  key={item.key}
                  onClick={() =>
                    navigate(`/learning-content/${item.key.toLowerCase()}`)
                  }
                  className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">

                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base border transition-transform duration-150 group-hover:scale-105 ${item.bgIcon} ${item.textColor} border-gray-100`}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800 text-sm group-hover:text-[#264d6d]">
                        {item.name}
                      </h3>

                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.desc}
                      </p>
                    </div>

                  </div>

                  <span className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                    {item.count} {getModelMeta(item.key).unit}
                  </span>

                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </AdminLayout>
  );
}

export default LearningContent;
