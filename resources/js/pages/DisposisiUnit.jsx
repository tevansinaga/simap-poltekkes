import React from 'react';

export default function DisposisiUnit({
    disposisis,
}) {
    const safeData = Array.isArray(disposisis)
        ? disposisis
        : [];

    const formatTanggal = (value) => {
        if (!value) return '-';

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const getStatusLabel = (status) => {
        if (status === 'terkirim') return 'Terkirim';
        if (status === 'in_progress') return 'Dalam Proses';
        if (status === 'selesai') return 'Selesai';

        return '-';
    };

    return (
        <div className="min-h-screen bg-slate-50">

            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                    <div>
                        <p className="text-sm font-semibold text-emerald-600">
                            SIMAP POLTEKKES MALUKU
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-slate-900">
                            Disposisi Unit
                        </h1>
                    </div>

                    <div className="flex gap-3">

                        <a
                            href="/unit/dashboard"
                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Dashboard
                        </a>

                    </div>

                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900">
                        Disposisi yang Diterima
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Daftar tugas atau instruksi yang ditujukan kepada unit Anda.
                    </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {safeData.length === 0 ? (

                        <div className="px-6 py-16 text-center">

                            <p className="font-semibold text-slate-700">
                                Belum ada disposisi
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Belum ada disposisi yang masuk ke unit Anda.
                            </p>

                        </div>

                    ) : (

                        <div className="divide-y divide-slate-100">

                            {safeData.map((item) => (

                                <a
                                    key={item.id}
                                    href={`/unit/disposisi/${item.id}`}
                                    className="block p-6 transition hover:bg-slate-50"
                                >

                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                        <div className="min-w-0 flex-1">

                                            <div className="flex flex-wrap items-center gap-2">

                                                <h3 className="font-semibold text-slate-900">
                                                    {item.surat_masuk?.perihal || 'Tanpa perihal'}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        item.status === 'selesai'
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : item.status === 'in_progress'
                                                                ? 'bg-blue-50 text-blue-700'
                                                                : 'bg-amber-50 text-amber-700'
                                                    }`}
                                                >
                                                    {getStatusLabel(item.status)}
                                                </span>

                                            </div>

                                            <div className="mt-3 grid gap-2 text-sm text-slate-500 md:grid-cols-3">

                                                <p>
                                                    <span className="font-medium text-slate-700">
                                                        No. Surat:
                                                    </span>{' '}
                                                    {item.surat_masuk?.nomor_surat || '-'}
                                                </p>

                                                <p>
                                                    <span className="font-medium text-slate-700">
                                                        Dari:
                                                    </span>{' '}
                                                    {item.dari_user?.name || '-'}
                                                </p>

                                                <p>
                                                    <span className="font-medium text-slate-700">
                                                        Tanggal:
                                                    </span>{' '}
                                                    {formatTanggal(item.tanggal_disposisi)}
                                                </p>

                                            </div>

                                            <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                                                {item.instruksi || '-'}
                                            </p>

                                        </div>

                                        <span className="text-sm font-semibold text-emerald-600">
                                            Lihat detail →
                                        </span>

                                    </div>

                                </a>

                            ))}

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}