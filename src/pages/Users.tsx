import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Shield,
    Users as UsersIcon,
} from "lucide-react";

const initialUsers = [
    { id: 1, name: "Budi Santoso", email: "budi@example.com", xp: "45,200 XP", role: "ADMIN", date: "12 Jan 2024" },
    { id: 2, name: "Siti Pertiwi", email: "siti@example.com", xp: "28,900 XP", role: "PENGGUNA", date: "05 Feb 2024" },
    { id: 3, name: "Agus Dermawan", email: "agus@example.com", xp: "4,200 XP", role: "PENGGUNA", date: "20 Mar 2024" },
    { id: 4, name: "Rina Maharani", email: "rina@example.com", xp: "14,500 XP", role: "PENGGUNA", date: "08 Apr 2024" },
    { id: 5, name: "Dewi Lestari", email: "dewi@example.com", xp: "31,000 XP", role: "ADMIN", date: "15 Mei 2024" },
];

function Users() {
    const [users, setUsers] = useState(initialUsers);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        xp: "",
        role: "PENGGUNA",
    });

    const openAdd = () => {
        setEditingUser(null);
        setForm({ name: "", email: "", xp: "", role: "PENGGUNA" });
        setShowModal(true);
    };

    const openEdit = (user: any) => {
        setEditingUser(user);
        setForm({
            name: user.name,
            email: user.email,
            xp: user.xp,
            role: user.role,
        });
        setShowModal(true);
    };

    const handleSubmit = () => {
        if (editingUser) {
            setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...form } : u)));
        } else {
            setUsers([
                ...users,
                {
                    id: Date.now(),
                    ...form,
                    date: "14 Mei 2026",
                },
            ]);
        }
        setShowModal(false);
    };

    const handleDelete = (id: number) => {
        setUsers(users.filter((u) => u.id !== id));
    };

    return (
        <AdminLayout>

            <div className="page-container">

                {/* HEADER */}
                <div>
                    <h1 className="page-title">Pengguna</h1>
                    <p className="page-subtitle">
                        Kelola data pengguna aplikasi Kotoba
                    </p>
                </div>

                {/* STATS */}
                <div className="stats-grid-3">

                    <div className="stats-card">
                        <div>
                            <p className="text-muted">Total Pengguna</p>
                            <h2 className="text-[24px] font-bold text-[#264d6d] mt-1">
                                {users.length}
                            </h2>
                        </div>

                        <div className="icon-box bg-[#eaf4fb] text-[#264d6d]">
                            <UsersIcon size={22} />
                        </div>
                    </div>

                    <div className="stats-card">
                        <div>
                            <p className="text-muted">Total Admin</p>
                            <h2 className="text-[24px] font-bold text-[#b31e23] mt-1">
                                {users.filter(u => u.role === "ADMIN").length}
                            </h2>
                        </div>

                        <div className="icon-box bg-[#fff1f1] text-[#b31e23]">
                            <Shield size={22} />
                        </div>
                    </div>

                </div>

                {/* TABLE CARD */}
                <div className="card">

                    {/* HEADER */}
                    <div className="card-header">

                        <div>
                            <h2 className="card-title">Data Pengguna</h2>
                            <p className="card-subtitle">
                                Total {users.length} pengguna terdaftar
                            </p>
                        </div>

                        <button
                            onClick={openAdd}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Tambah Pengguna
                        </button>

                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>
                                <tr className="bg-[#f9fafb]">
                                    <th className="table-head">Nama</th>
                                    <th className="table-head">XP</th>
                                    <th className="table-head">Tanggal</th>
                                    <th className="table-head">Role</th>
                                    <th className="table-head text-center">Aksi</th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="table-row hover:bg-[#f8fafc] transition"
                                    >

                                        {/* USER */}
                                        <td className="table-cell">
                                            <div className="flex items-center gap-3">

                                                <div className="icon-box bg-[#eef3f7] text-[#264d6d] font-bold">
                                                    {user.name.charAt(0)}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-[14px]">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-muted">{user.email}</p>
                                                </div>

                                            </div>
                                        </td>

                                        <td className="table-cell font-medium">
                                            {user.xp}
                                        </td>

                                        <td className="table-cell text-muted">
                                            {user.date}
                                        </td>

                                        {/* ROLE */}
                                        <td className="table-cell">
                                            <span
                                                className={`px-3 py-1 text-[12px] rounded-full font-semibold ${user.role === "ADMIN"
                                                        ? "bg-[#dcfce7] text-[#15803d]"
                                                        : "bg-[#dbeafe] text-[#2563eb]"
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        {/* ACTION */}
                                        <td className="table-cell">
                                            <div className="flex justify-center gap-2">

                                                <button
                                                    onClick={() => openEdit(user)}
                                                    className="btn-secondary hover:bg-gray-100"
                                                >
                                                    <Pencil size={14} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="btn-secondary hover:bg-red-50 text-red-500"
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

                </div>

                {/* MODAL */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                        <div className="card w-[440px] p-6 animate-in fade-in zoom-in">

                            {/* HEADER */}
                            <div className="flex justify-between items-center mb-5">

                                <h2 className="card-title">
                                    {editingUser ? "Edit Pengguna" : "Tambah Pengguna"}
                                </h2>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X size={18} />
                                </button>

                            </div>

                            {/* FORM */}
                            <div className="flex flex-col gap-3">

                                <input
                                    className="input"
                                    placeholder="Nama"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                />

                                <input
                                    className="input"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                />

                                <input
                                    className="input"
                                    placeholder="XP"
                                    value={form.xp}
                                    onChange={(e) =>
                                        setForm({ ...form, xp: e.target.value })
                                    }
                                />

                                <select
                                    className="input"
                                    value={form.role}
                                    onChange={(e) =>
                                        setForm({ ...form, role: e.target.value })
                                    }
                                >
                                    <option>PENGGUNA</option>
                                    <option>ADMIN</option>
                                </select>

                                <button
                                    className="btn-primary mt-2"
                                    onClick={handleSubmit}
                                >
                                    Simpan Data
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </div>

        </AdminLayout>
    );
}

export default Users;