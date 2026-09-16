import React, { useEffect, useRef, useState } from 'react';
import '../../css/app.css';

const stats = [
    {
        title: 'Surat Masuk',
        value: '24',
        description: 'surat bulan ini',
        icon: '✉',
    },
    {
        title: 'Agenda Hari Ini',
        value: '08',
        description: 'agenda Direktur',
        icon: '◷',
    },
    {
        title: 'Disposisi',
        value: '12',
        description: 'menunggu tindak lanjut',
        icon: '↗',
    },
    {
        title: 'Unit',
        value: '09',
        description: 'unit aktif',
        icon: '▦',
    },
];

const agendas = [
    {
        time: '08:30',
        title: 'Rapat Pimpinan',
        location: 'Ruang Direktur',
        type: 'Rapat',
    },
    {
        time: '10:00',
        title: 'Menerima Tamu',
        location: 'Ruang Direktur',
        type: 'Tamu',
    },
    {
        time: '13:30',
        title: 'Rapat Evaluasi Program',
        location: 'Ruang Rapat Utama',
        type: 'Rapat',
    },
    {
        time: '15:00',
        title: 'Penandatanganan Dokumen',
        location: 'Ruang Direktur',
        type: 'Dokumen',
    },
];

const letters = [
    {
        number: '001/UND/IX/2026',
        title: 'Undangan Rapat Koordinasi',
        sender: 'Poltekkes Kemenkes Maluku',
        status: 'Baru',
    },
    {
        number: '014/DIR/IX/2026',
        title: 'Permohonan Kerja Sama',
        sender: 'Institusi Mitra',
        status: 'Diproses',
    },
    {
        number: '021/EXT/IX/2026',
        title: 'Surat Pemberitahuan',
        sender: 'Instansi Pemerintah',
        status: 'Diteruskan',
    },
];

export default function Dashboard() {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();

        const csrfToken = document.querySelector(
            'meta[name="csrf-token"]'
        )?.getAttribute('content');

        const form = document.createElement('form');

        form.method = 'POST';
        form.action = '/logout';

        if (csrfToken) {
            const csrfInput = document.createElement('input');

            csrfInput.type = 'hidden';
            csrfInput.name = '_token';
            csrfInput.value = csrfToken;

            form.appendChild(csrfInput);
        }

        document.body.appendChild(form);

        form.submit();
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

                <div className="flex h-16 items-center justify-between px-4 sm:px-6">

                    {/* Logo */}
                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-sm">
                            S
                        </div>

                        <div>
                            <h1 className="text-sm font-bold text-slate-900">
                                SIMAP
                            </h1>

                            <p className="text-xs text-slate-500">
                                Poltekkes Maluku
                            </p>
                        </div>

                    </div>

                    {/* User Area */}
                    <div className="flex items-center gap-3">

                        {/* Notification */}
                        <button
                            type="button"
                            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                        >
                            <span className="text-lg">
                                🔔
                            </span>

                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                        </button>

                        {/* User Dropdown */}
                        <div
                            ref={userMenuRef}
                            className="relative"
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setUserMenuOpen(
                                        !userMenuOpen
                                    )
                                }
                                className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-slate-100"
                            >

                                <div className="hidden text-right sm:block">

                                    <p className="text-sm font-semibold text-slate-800">
                                        Administrator
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Super Admin
                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700">
                                    A
                                </div>

                                <span className="hidden text-xs text-slate-400 sm:block">
                                    {userMenuOpen ? '▲' : '▼'}
                                </span>

                            </button>

                            {/* Dropdown */}
                            {userMenuOpen && (
                                <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                                    {/* User Info */}
                                    <div className="border-b border-slate-100 p-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
                                                A
                                            </div>

                                            <div className="min-w-0">

                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    Administrator
                                                </p>

                                                <p className="truncate text-xs text-slate-500">
                                                    Super Admin
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    {/* Menu */}
                                    <div className="p-2">

                                        <a
                                            href="#"
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                                                👤
                                            </span>

                                            <div>
                                                <p className="font-medium">
                                                    Profil Saya
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    Kelola profil
                                                </p>
                                            </div>
                                        </a>

                                        <a
                                            href="#"
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                                                ⚙
                                            </span>

                                            <div>
                                                <p className="font-medium">
                                                    Pengaturan
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    Pengaturan akun
                                                </p>
                                            </div>
                                        </a>

                                        <div className="my-2 border-t border-slate-100" />

                                        {/* LOGOUT */}
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                                        >

                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                                                ↪
                                            </span>

                                            <div>
                                                <p className="font-semibold">
                                                    Keluar
                                                </p>

                                                <p className="text-xs text-red-400">
                                                    Keluar dari akun
                                                </p>
                                            </div>

                                        </button>

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </header>

            {/* =====================================================
                BODY
            ====================================================== */}

            <div className="flex">

                {/* =================================================
                    SIDEBAR
                ================================================== */}

                <aside className="hidden min-h-[calc(100vh-64px)] w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">

                    <nav className="space-y-1">

                        <p className="mb-3 px-3 pt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Menu Utama
                        </p>

                        <a
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-medium text-white"
                        >
                            <span>⌂</span>
                            Dashboard
                        </a>

                        <a
                            href="#"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                            <span>✉</span>
                            Surat Masuk
                        </a>

                        <a
                            href="#"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                            <span>◷</span>
                            Agenda Direktur
                        </a>

                        <a
                            href="#"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                            <span>↗</span>
                            Disposisi
                        </a>

                        <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Administrasi
                        </p>

                        <a
                            href="#"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                            <span>▦</span>
                            Unit
                        </a>

                        <a
                            href="#"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                            <span>♙</span>
                            Pengguna
                        </a>

                        <a
                            href="#"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                            <span>⚙</span>
                            Pengaturan
                        </a>

                    </nav>

                    {/* Sidebar Info */}
                    <div className="mt-10 rounded-2xl bg-slate-900 p-4 text-white">

                        <p className="text-xs font-semibold text-slate-300">
                            SIMAP
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                            Sistem Manajemen
                            <br />
                            Administrasi Poltekkes
                        </p>

                        <p className="mt-3 text-xs leading-5 text-slate-400">
                            Kelola surat, agenda, disposisi,
                            dan komunikasi antar unit.
                        </p>

                    </div>

                </aside>

                {/* =================================================
                    CONTENT
                ================================================== */}

                <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

                    <div className="mx-auto max-w-7xl">

                        {/* Welcome */}
                        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Selasa, 8 September 2026
                                </p>

                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                    Selamat datang, Administrator
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Pantau aktivitas administrasi dan agenda
                                    Poltekkes Maluku hari ini.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                            >
                                + Buat Agenda
                            </button>

                        </div>

                        {/* Statistics */}
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                            {stats.map((stat) => (
                                <div
                                    key={stat.title}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >

                                    <div className="flex items-start justify-between">

                                        <div>

                                            <p className="text-sm font-medium text-slate-500">
                                                {stat.title}
                                            </p>

                                            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                                {stat.value}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {stat.description}
                                            </p>

                                        </div>

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-lg">
                                            {stat.icon}
                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>

                        {/* Main Grid */}
                        <div className="mt-6 grid gap-6 xl:grid-cols-3">

                            {/* Agenda */}
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white xl:col-span-2">

                                <div className="flex items-center justify-between border-b border-slate-100 p-5">

                                    <div>

                                        <h3 className="font-bold text-slate-900">
                                            Agenda Direktur
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Jadwal kegiatan hari ini
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                                    >
                                        Lihat semua →
                                    </button>

                                </div>

                                <div className="divide-y divide-slate-100">

                                    {agendas.map((agenda) => (
                                        <div
                                            key={agenda.time}
                                            className="flex items-center gap-4 p-5 transition hover:bg-slate-50"
                                        >

                                            <div className="w-14 shrink-0 text-sm font-bold text-slate-900">
                                                {agenda.time}
                                            </div>

                                            <div className="h-10 w-px bg-slate-200" />

                                            <div className="min-w-0 flex-1">

                                                <h4 className="truncate text-sm font-semibold text-slate-800">
                                                    {agenda.title}
                                                </h4>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {agenda.location}
                                                </p>

                                            </div>

                                            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:block">
                                                {agenda.type}
                                            </span>

                                        </div>
                                    ))}

                                </div>

                            </section>

                            {/* Quick Action */}
                            <section className="rounded-2xl bg-slate-900 p-6 text-white">

                                <p className="text-sm font-semibold text-slate-300">
                                    Akses Cepat
                                </p>

                                <h3 className="mt-2 text-xl font-bold">
                                    Apa yang ingin Anda lakukan?
                                </h3>

                                <div className="mt-6 space-y-3">

                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-3 rounded-xl bg-white/10 p-4 text-left transition hover:bg-white/15"
                                    >

                                        <span className="text-xl">
                                            ✉
                                        </span>

                                        <div>

                                            <p className="text-sm font-semibold">
                                                Surat Masuk
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                Catat surat baru
                                            </p>

                                        </div>

                                    </button>

                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-3 rounded-xl bg-white/10 p-4 text-left transition hover:bg-white/15"
                                    >

                                        <span className="text-xl">
                                            ◷
                                        </span>

                                        <div>

                                            <p className="text-sm font-semibold">
                                                Agenda
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                Tambahkan agenda Direktur
                                            </p>

                                        </div>

                                    </button>

                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-3 rounded-xl bg-white/10 p-4 text-left transition hover:bg-white/15"
                                    >

                                        <span className="text-xl">
                                            ↗
                                        </span>

                                        <div>

                                            <p className="text-sm font-semibold">
                                                Disposisi
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                Teruskan surat ke unit
                                            </p>

                                        </div>

                                    </button>

                                </div>

                            </section>

                        </div>

                        {/* Letters */}
                        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">

                            <div className="flex items-center justify-between border-b border-slate-100 p-5">

                                <div>

                                    <h3 className="font-bold text-slate-900">
                                        Surat Terbaru
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Surat masuk yang baru diterima
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    Semua surat →
                                </button>

                            </div>

                            <div className="overflow-x-auto">

                                <table className="w-full text-left">

                                    <thead>

                                        <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">

                                            <th className="px-5 py-4 font-semibold">
                                                Nomor
                                            </th>

                                            <th className="px-5 py-4 font-semibold">
                                                Perihal
                                            </th>

                                            <th className="px-5 py-4 font-semibold">
                                                Pengirim
                                            </th>

                                            <th className="px-5 py-4 font-semibold">
                                                Status
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-slate-100">

                                        {letters.map((letter) => (
                                            <tr
                                                key={letter.number}
                                                className="transition hover:bg-slate-50"
                                            >

                                                <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">
                                                    {letter.number}
                                                </td>

                                                <td className="px-5 py-4">

                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {letter.title}
                                                    </p>

                                                </td>

                                                <td className="px-5 py-4 text-sm text-slate-500">
                                                    {letter.sender}
                                                </td>

                                                <td className="px-5 py-4">

                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                        {letter.status}
                                                    </span>

                                                </td>

                                            </tr>
                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </section>

                    </div>

                </main>

            </div>

        </div>
    );
}