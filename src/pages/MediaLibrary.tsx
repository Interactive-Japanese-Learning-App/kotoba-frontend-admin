import AdminLayout from "../layouts/AdminLayout";

import {
  SortDesc,
  Play,
  Eye,
  Video,
  Clapperboard,
  TrendingUp,
  Clock3,
} from "lucide-react";

const mediaData = [
  {
    id: 1,
    title: "Teknik Menghafal Kanji Dasar - Bagian 1",
    level: "N5",
    views: "2.4K",
    date: "03 Okt 2023",
    duration: "12:45",
  },
  {
    id: 2,
    title: "Percakapan Sehari-hari di Restoran",
    level: "N4",
    views: "1.8K",
    date: "10 Okt 2023",
    duration: "09:20",
  },
  {
    id: 3,
    title: "Tips Lulus JLPT dalam 3 Bulan",
    level: "SEMUA LEVEL",
    views: "5.1K",
    date: "28 Sep 2023",
    duration: "15:10",
  },
  {
    id: 4,
    title: "Struktur Kalimat Majemuk Formal",
    level: "N3",
    views: "940",
    date: "25 Sep 2023",
    duration: "21:30",
  },
  {
    id: 5,
    title: "Etiket Bisnis: Memperkenalkan Diri",
    level: "BISNIS",
    views: "3.2K",
    date: "20 Sep 2023",
    duration: "05:45",
  },
];

function MediaLibrary() {
  return (
    <AdminLayout>

      <div className="page-container">

        {/* HEADER */}
        <div>

          <h1 className="page-title">
            Perpustakaan Media
          </h1>

          <p className="page-subtitle">
            Kelola video pembelajaran, materi audio, dan konten Kotoba.
          </p>

        </div>

        {/* STATS */}
        <div className="stats-grid-3">

          {/* CHANNEL */}
          <div className="stats-card flex items-center justify-between">

            <div>

              <p className="text-muted">
                Total Channel
              </p>

              <h2 className="text-[26px] font-bold text-[#264d6d] mt-1">
                128
              </h2>

              <p className="text-[12px] text-gray-400 mt-1">
                +12 minggu ini
              </p>

            </div>

            <div
              className="
                w-[56px]
                h-[56px]
                rounded-2xl
                bg-[#eaf4fb]
                flex
                items-center
                justify-center
                text-[#264d6d]
              "
            >
              <Video size={26} />
            </div>

          </div>

          {/* VIDEO */}
          <div className="stats-card flex items-center justify-between">

            <div>

              <p className="text-muted">
                Total Video
              </p>

              <h2 className="text-[26px] font-bold text-[#b31e23] mt-1">
                1.284
              </h2>

              <p className="text-[12px] text-gray-400 mt-1">
                +34 video baru
              </p>

            </div>

            <div
              className="
                w-[56px]
                h-[56px]
                rounded-2xl
                bg-[#fff1f1]
                flex
                items-center
                justify-center
                text-[#b31e23]
              "
            >
              <Clapperboard size={26} />
            </div>

          </div>

          {/* TRENDING */}
          <div className="stats-card flex items-center justify-between">

            <div>

              <p className="text-muted">
                Trending Minggu Ini
              </p>

              <h2 className="text-[26px] font-bold text-[#edbc1d] mt-1">
                24K
              </h2>

              <p className="text-[12px] text-gray-400 mt-1">
                Total views
              </p>

            </div>

            <div
              className="
                w-[56px]
                h-[56px]
                rounded-2xl
                bg-[#fff8e1]
                flex
                items-center
                justify-center
                text-[#edbc1d]
              "
            >
              <TrendingUp size={26} />
            </div>

          </div>

        </div>

        {/* CONTENT */}
        <div className="card overflow-hidden">

          {/* HEADER */}
          <div className="card-header">

            <div>

              <h2 className="card-title">
                Galeri Video Pembelajaran
              </h2>

              <p className="card-subtitle">
                Kumpulan video belajar bahasa Jepang
              </p>

            </div>

            <button className="btn-secondary flex items-center gap-2">

              <SortDesc size={14} />

              Terbaru

            </button>

          </div>

          {/* GRID */}
          <div className="p-5 grid grid-cols-3 gap-5">

            {mediaData.map((item) => (
              <div
                key={item.id}
                className="
                  bg-white
                  border
                  border-[#eeeeee]
                  rounded-3xl
                  overflow-hidden
                  hover:shadow-lg
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >

                {/* THUMBNAIL */}
                <div className="relative">

                  <div
                    className="
                      h-[180px]
                      bg-gradient-to-br
                      from-[#264d6d]
                      to-[#3d6f96]
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <div
                      className="
                        w-[70px]
                        h-[70px]
                        rounded-full
                        bg-white/20
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <Play
                        size={32}
                        className="text-white ml-1"
                        fill="white"
                      />

                    </div>

                  </div>

                  {/* DURATION */}
                  <div
                    className="
                      absolute
                      bottom-3
                      right-3
                      bg-black/70
                      text-white
                      text-[11px]
                      px-2.5
                      py-1
                      rounded-lg
                      flex
                      items-center
                      gap-1
                    "
                  >

                    <Clock3 size={11} />

                    {item.duration}

                  </div>

                </div>

                {/* CONTENT */}
                <div className="p-4">

                  <span
                    className="
                      inline-flex
                      items-center
                      px-3
                      py-1
                      rounded-full
                      text-[11px]
                      font-semibold
                      bg-[#eef3f7]
                      text-[#264d6d]
                    "
                  >
                    {item.level}
                  </span>

                  <h3
                    className="
                      mt-3
                      text-[15px]
                      font-semibold
                      leading-[22px]
                      text-[#111827]
                      min-h-[44px]
                    "
                  >
                    {item.title}
                  </h3>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mt-4
                      pt-4
                      border-t
                      border-[#f1f1f1]
                    "
                  >

                    <div className="flex items-center gap-1 text-[12px] text-gray-500">

                      <Eye size={13} />

                      {item.views}

                    </div>

                    <div className="text-[12px] text-gray-500">
                      {item.date}
                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}

export default MediaLibrary;