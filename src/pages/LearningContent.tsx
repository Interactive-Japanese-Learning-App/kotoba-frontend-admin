import { useState, useEffect } from "react";

import AdminLayout from "../layouts/AdminLayout";
import StatCard from "../components/StatCard";

import {
  BookOpen,
  Languages,
  Hash,
  Calendar,
  Smile,
  Plus,
} from "lucide-react";

type ContentType = {
  id: number;
  title: string;
  icon: string;
};

const DEFAULT_DATA: ContentType[] = [
  { id: 1, title: "Hiragana", icon: "あ" },
  { id: 2, title: "Katakana", icon: "カ" },
  { id: 3, title: "Angka", icon: "1" },
  { id: 4, title: "Bulan & Tanggal", icon: "日" },
  { id: 5, title: "Keluarga", icon: "家" },
  { id: 6, title: "Makanan", icon: "食" },
  { id: 7, title: "Benda", icon: "物" },
];

function LearningContent() {
  const [data, setData] = useState<ContentType[]>(DEFAULT_DATA);

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");

  // LOAD + MERGE
  useEffect(() => {
    const saved = localStorage.getItem("learning-content");

    if (saved) {
      const parsed: ContentType[] = JSON.parse(saved);

      const merged = [
        ...DEFAULT_DATA,
        ...parsed.filter(
          (item) => !DEFAULT_DATA.some((d) => d.title === item.title)
        ),
      ];

      setData(merged);
    }
  }, []);

  // SAVE (custom only)
  useEffect(() => {
    const customOnly = data.filter(
      (item) => !DEFAULT_DATA.some((d) => d.title === item.title)
    );

    localStorage.setItem("learning-content", JSON.stringify(customOnly));
  }, [data]);

  // ADD
  const handleAdd = () => {
    if (!title || !icon) return alert("Isi dulu!");

    const newItem: ContentType = {
      id: Date.now(),
      title,
      icon,
    };

    setData((prev) => [newItem, ...prev]);

    setTitle("");
    setIcon("");
  };

  return (
    <AdminLayout>
      <div className="page-container">

        {/* HEADER */}
        <div>
          <h1 className="page-title">Konten Pembelajaran</h1>
          <p className="page-subtitle">
            Kelola seluruh materi pembelajaran bahasa Jepang.
          </p>
        </div>

        {/* STATS (TIDAK DIUBAH) */}
        <div className="stats-grid-5">

          <StatCard title="Hiragana" value="46" subtitle="Karakter"
            icon={<BookOpen size={22} />} iconBg="#eaf4fb" iconColor="#264d6d"
          />

          <StatCard title="Katakana" value="46" subtitle="Karakter"
            icon={<Languages size={22} />} iconBg="#fff1f1" iconColor="#dc2626"
          />

          <StatCard title="Angka" value="100" subtitle="Materi"
            icon={<Hash size={22} />} iconBg="#eefbf1" iconColor="#15803d"
          />

          <StatCard title="Bulan" value="24" subtitle="Materi"
            icon={<Calendar size={22} />} iconBg="#fff8e7" iconColor="#a16207"
          />

          <StatCard title="Kosakata" value="320" subtitle="Kata"
            icon={<Smile size={22} />} iconBg="#f3e8ff" iconColor="#7c3aed"
          />

        </div>

        {/* CARD */}
        <div className="card overflow-hidden">

          {/* HEADER + FORM INLINE */}
          <div className="card-header flex items-center justify-between">

            {/* LEFT */}
            <div>
              <h2 className="card-title">Daftar Konten</h2>
              <p className="card-subtitle">
                Manajemen materi pembelajaran Jepang
              </p>
            </div>

            {/* RIGHT - ADD FORM */}
            <div className="flex gap-2 items-center">

              <input
                className="input"
                placeholder="Judul"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                className="input w-[90px]"
                placeholder="Icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />

              <button
                onClick={handleAdd}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={16} />
                Tambah
              </button>

            </div>

          </div>

          {/* TABLE (TIDAK DIUBAH ISINYA) */}
          <table className="w-full">

            <tbody>

              {data.map((item) => (
                <tr
                  key={item.id}
                  className="table-row hover:bg-[#fafafa] transition"
                >

                  <td className="table-cell">

                    <div className="flex items-center gap-4">

                      <div className="w-[56px] h-[56px] rounded-2xl bg-[#eef3f7] flex items-center justify-center text-[#264d6d] text-[24px] font-bold">
                        {item.icon}
                      </div>

                      <div>

                        <p className="font-semibold text-[15px] text-[#111827]">
                          {item.title}
                        </p>

                        <p className="text-muted mt-1">
                          Materi pembelajaran dasar Jepang
                        </p>

                      </div>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </AdminLayout>
  );
}

export default LearningContent;