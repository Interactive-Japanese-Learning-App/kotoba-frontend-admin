import AdminLayout from "../layouts/AdminLayout";
import StatCard from "../components/StatCard";

import { Users, BookOpen, Image } from "lucide-react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    Tooltip,
    BarChart,
    Bar,
    LineChart,
    Line,
} from "recharts";

const userData = [
    { day: "Sen", users: 120 },
    { day: "Sel", users: 210 },
    { day: "Rab", users: 180 },
    { day: "Kam", users: 320 },
    { day: "Jum", users: 280 },
    { day: "Sab", users: 390 },
    { day: "Min", users: 340 },
];

const channelData = [
    { day: "Sen", total: 12 },
    { day: "Sel", total: 18 },
    { day: "Rab", total: 15 },
    { day: "Kam", total: 25 },
    { day: "Jum", total: 20 },
    { day: "Sab", total: 28 },
    { day: "Min", total: 24 },
];

const videoData = [
    { day: "Sen", views: 40 },
    { day: "Sel", views: 55 },
    { day: "Rab", views: 70 },
    { day: "Kam", views: 60 },
    { day: "Jum", views: 90 },
    { day: "Sab", views: 120 },
    { day: "Min", views: 100 },
];

function Dashboard() {
    return (
        <AdminLayout>

            <div className="page-container">

                {/* HEADER */}
                <div>
                    <h1 className="page-title">Selamat Datang, Admin</h1>
                    <p className="page-subtitle">
                        Ringkasan statistik platform Kotoba hari ini.
                    </p>
                </div>

                {/* STATS */}
                <div className="stats-grid-3">

                    <StatCard
                        title="Total Pengguna"
                        value="12,482"
                        subtitle="Pengguna aktif"
                        icon={<Users size={22} />}
                        iconBg="#eaf4fb"
                        iconColor="#264d6d"
                    />

                    <StatCard
                        title="Konten Belajar"
                        value="324"
                        subtitle="Materi tersedia"
                        icon={<BookOpen size={22} />}
                        iconBg="#fff7da"
                        iconColor="#edbc1d"
                    />

                    <StatCard
                        title="Media Upload"
                        value="1,203"
                        subtitle="Total media"
                        icon={<Image size={22} />}
                        iconBg="#fde8e8"
                        iconColor="#b31e23"
                    />

                </div>

                {/* CHART 1 */}
                <div className="card p-5">
                    <h2 className="card-title">Grafik User</h2>
                    <p className="card-subtitle">Statistik pengguna aktif mingguan</p>

                    <div className="h-[280px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={userData}>
                                <XAxis dataKey="day" />
                                <Tooltip />
                                <Area dataKey="users" stroke="#264d6d" fill="#dbe8f1" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CHART 2-3 */}
                <div className="grid grid-cols-2 gap-4">

                    <div className="card p-5">
                        <h2 className="card-title">Grafik Channel</h2>

                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={channelData}>
                                <XAxis dataKey="day" />
                                <Tooltip />
                                <Bar dataKey="total" fill="#edbc1d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card p-5">
                        <h2 className="card-title">Grafik Video</h2>

                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={videoData}>
                                <XAxis dataKey="day" />
                                <Tooltip />
                                <Line dataKey="views" stroke="#b31e23" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                </div>

            </div>

        </AdminLayout>
    );
}

export default Dashboard;