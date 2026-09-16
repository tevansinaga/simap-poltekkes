import React, { useMemo, useState } from 'react';

export default function Agenda({ agenda = [] }) {
    const [search, setSearch] = useState('');
    const [jenisFilter, setJenisFilter] = useState('Semua');
    const [periodeFilter, setPeriodeFilter] = useState('Semua');

    const data = Array.isArray(agenda) ? agenda : [];

    // =====================================================
    // CSRF
    // =====================================================

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '';

    // =====================================================
    // TANGGAL HARI INI - WIT
    // =====================================================

    const today = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jayapura',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());

    // =====================================================
    // FLASH / ERROR
    // =====================================================

    const flashSuccess = window.flashSuccess || '';

    const errors = Array.isArray(window.agendaErrors)
        ? window.agendaErrors
        : [];

    // =====================================================
    // ICON
    // =====================================================

    const Icon = ({ name, size = 18 }) => {
        const common = {
            width: size,
            height: size,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 1.8,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
        };

        const icons = {
            calendar: (
                <>
                    <rect
                        x="3"
                        y="4.5"
                        width="18"
                        height="16"
                        rx="2"
                    />
                    <path d="M16 2.5v4M8 2.5v4M3 9h18" />
                </>
            ),

            search: (
                <>
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                </>
            ),

            plus: (
                <>
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                </>
            ),

            eye: (
                <>
                    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                    <circle cx="12" cy="12" r="2.5" />
                </>
            ),

            edit: (
                <>
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                </>
            ),

            trash: (
                <>
                    <path d="M4 7h16" />
                    <path d="M9 7V4h6v3" />
                    <path d="M6 7l1 13h10l1-13" />
                    <path d="M10 11v5M14 11v5" />
                </>
            ),

            clock: (
                <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                </>
            ),

            logout: (
                <>
                    <path d="M9 5H5.5A1.5 1.5 0 0 0 4 6.5v11A1.5 1.5 0 0 0 5.5 19H9" />
                    <path d="M15 8l4 4-4 4" />
                    <path d="M19 12H9" />
                </>
            ),

            file: (
                <>
                    <path d="M14 2.5H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5Z" />
                    <path d="M14 2.5v6h6" />
                    <path d="M8 13h8M8 17h5" />
                </>
            ),
        };

        return (
            <svg {...common}>
                {icons[name]}
            </svg>
        );
    };

    // =====================================================
    // NORMALISASI TANGGAL
    // =====================================================

    const getDateKey = (date) => {
        if (!date) {
            return '';
        }

        const value = String(date).trim();

        /*
        |--------------------------------------------------------------------------
        | DATE ONLY
        |--------------------------------------------------------------------------
        | 2026-09-20
        |
        | Jangan menggunakan new Date() untuk tanggal seperti ini.
        |--------------------------------------------------------------------------
        */

        const dateOnlyMatch =
            value.match(
                /^(\d{4}-\d{2}-\d{2})/
            );

        if (dateOnlyMatch) {
            return dateOnlyMatch[1];
        }

        const parsed = new Date(value);

        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return '';
        }

        return new Intl.DateTimeFormat(
            'en-CA',
            {
                timeZone: 'Asia/Jayapura',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }
        ).format(parsed);
    };

    // =====================================================
    // FORMAT TANGGAL
    // =====================================================

    const formatDate = (date) => {
        const dateKey = getDateKey(date);

        if (!dateKey) {
            return '-';
        }

        const match =
            dateKey.match(
                /^(\d{4})-(\d{2})-(\d{2})$/
            );

        if (!match) {
            return dateKey;
        }

        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);

        const monthNames = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
        ];

        if (
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > 31
        ) {
            return dateKey;
        }

        return `${String(day).padStart(2, '0')} ${monthNames[month - 1]} ${year}`;
    };

    // =====================================================
    // FORMAT WAKTU
    // =====================================================

    const formatTime = (time) => {
        if (!time) {
            return '--:--';
        }

        const value = String(time);

        if (/^\d{2}:\d{2}:\d{2}$/.test(value)) {
            return value.slice(0, 5);
        }

        if (/^\d{2}:\d{2}$/.test(value)) {
            return value;
        }

        return value;
    };

    // =====================================================
    // JENIS STYLE
    // =====================================================

    const jenisStyle = (jenis) => {
        switch (jenis) {
            case 'Rapat':
                return {
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe',
                };

            case 'Kegiatan':
                return {
                    background: '#f0fdf4',
                    color: '#15803d',
                    border: '1px solid #bbf7d0',
                };

            case 'Dinas':
                return {
                    background: '#fff7ed',
                    color: '#c2410c',
                    border: '1px solid #fed7aa',
                };

            case 'Acara':
                return {
                    background: '#f5f3ff',
                    color: '#6d28d9',
                    border: '1px solid #ddd6fe',
                };

            default:
                return {
                    background: '#f8fafc',
                    color: '#475569',
                    border: '1px solid #e2e8f0',
                };
        }
    };

    // =====================================================
    // OPTIONS JENIS
    // =====================================================

    const jenisOptions = useMemo(() => {
        const values = data
            .map((item) => item?.jenis)
            .filter(Boolean);

        return [...new Set(values)].sort(
            (a, b) =>
                String(a).localeCompare(
                    String(b),
                    'id'
                )
        );
    }, [data]);

    // =====================================================
    // FILTER
    // =====================================================

    const filteredData = useMemo(() => {
        const keyword =
            search.trim().toLowerCase();

        return data.filter((item) => {
            const judul = String(
                item?.judul || ''
            ).toLowerCase();

            const lokasi = String(
                item?.lokasi || ''
            ).toLowerCase();

            const jenis = String(
                item?.jenis || ''
            ).toLowerCase();

            const keterangan = String(
                item?.keterangan || ''
            ).toLowerCase();

            const nomorSurat = String(
                item?.surat_masuk?.nomor_surat || ''
            ).toLowerCase();

            const pengirim = String(
                item?.surat_masuk?.pengirim || ''
            ).toLowerCase();

            const perihal = String(
                item?.surat_masuk?.perihal || ''
            ).toLowerCase();

            const dateKey =
                getDateKey(item?.tanggal);

            const matchesSearch =
                !keyword ||
                judul.includes(keyword) ||
                lokasi.includes(keyword) ||
                jenis.includes(keyword) ||
                keterangan.includes(keyword) ||
                nomorSurat.includes(keyword) ||
                pengirim.includes(keyword) ||
                perihal.includes(keyword);

            const matchesJenis =
                jenisFilter === 'Semua' ||
                item?.jenis === jenisFilter;

            let matchesPeriode = true;

            if (
                periodeFilter ===
                'Hari Ini'
            ) {
                matchesPeriode =
                    dateKey === today;
            }

            if (
                periodeFilter ===
                'Mendatang'
            ) {
                matchesPeriode =
                    dateKey > today;
            }

            if (
                periodeFilter ===
                'Lewat'
            ) {
                matchesPeriode =
                    dateKey < today;
            }

            return (
                matchesSearch &&
                matchesJenis &&
                matchesPeriode
            );
        });
    }, [
        data,
        search,
        jenisFilter,
        periodeFilter,
        today,
    ]);

    // =====================================================
    // STATISTIK
    // =====================================================

    const totalAgenda = data.length;

    const agendaHariIni =
        data.filter(
            (item) =>
                getDateKey(item?.tanggal) ===
                today
        ).length;

    const agendaMendatang =
        data.filter(
            (item) =>
                getDateKey(item?.tanggal) >
                today
        ).length;

    const agendaLewat =
        data.filter(
            (item) =>
                getDateKey(item?.tanggal) <
                today
        ).length;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            <style>{`

                .agenda-page {
                    min-height: 100vh;
                    background: #f4f7fb;
                    color: #0f172a;
                    font-family:
                        Inter,
                        ui-sans-serif,
                        system-ui,
                        sans-serif;
                }

                .agenda-header {
                    height: 76px;
                    background: #ffffff;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 28px;
                    position: sticky;
                    top: 0;
                    z-index: 30;
                }

                .agenda-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    text-decoration: none;
                }

                .agenda-brand-logo {
                    width: 44px;
                    height: 44px;
                    border-radius: 11px;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    padding: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    box-shadow:
                        0 4px 12px rgba(15,23,42,.05);
                }

                .agenda-brand-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                }

                .agenda-brand-title {
                    font-size: 18px;
                    font-weight: 850;
                    color: #0f2747;
                    line-height: 1;
                }

                .agenda-brand-subtitle {
                    margin-top: 5px;
                    color: #64748b;
                    font-size: 10px;
                }

                .agenda-header-right {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .agenda-role {
                    padding: 8px 12px;
                    border-radius: 999px;
                    background: #eff6ff;
                    border: 1px solid #dbeafe;
                    color: #1d4ed8;
                    font-size: 10px;
                    font-weight: 700;
                }

                .agenda-logout-form {
                    margin: 0;
                }

                .agenda-logout-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    height: 38px;
                    padding: 0 12px;
                    border: 1px solid #fecaca;
                    border-radius: 9px;
                    background: #ffffff;
                    color: #dc2626;
                    font-size: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: .18s ease;
                }

                .agenda-logout-button:hover {
                    background: #fef2f2;
                    border-color: #fca5a5;
                }

                .agenda-main {
                    max-width: 1500px;
                    margin: 0 auto;
                    padding: 30px 28px 40px;
                }

                .agenda-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    margin-bottom: 10px;
                    color: #94a3b8;
                    font-size: 11px;
                }

                .agenda-breadcrumb a {
                    color: #64748b;
                    text-decoration: none;
                }

                .agenda-title-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 20px;
                    margin-bottom: 24px;
                }

                .agenda-kicker {
                    font-size: 12px;
                    color: #64748b;
                    margin-bottom: 5px;
                }

                .agenda-title {
                    margin: 0;
                    font-size: 30px;
                    line-height: 1.2;
                    font-weight: 800;
                    color: #0f2747;
                }

                .agenda-description {
                    margin: 8px 0 0;
                    color: #64748b;
                    font-size: 13px;
                }

                .agenda-add {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px 17px;
                    border-radius: 10px;
                    background: #0f2747;
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 700;
                    white-space: nowrap;
                }

                .agenda-add:hover {
                    background: #174a7e;
                }

                .agenda-alert {
                    margin-bottom: 18px;
                    padding: 13px 15px;
                    border-radius: 11px;
                    font-size: 11px;
                    line-height: 1.6;
                }

                .agenda-alert-success {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    color: #15803d;
                }

                .agenda-alert-error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #b91c1c;
                }

                .agenda-stat-grid {
                    display: grid;
                    grid-template-columns: repeat(4,minmax(0,1fr));
                    gap: 14px;
                    margin-bottom: 18px;
                }

                .agenda-stat {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 15px;
                    padding: 16px;
                    box-shadow:
                        0 4px 16px rgba(15,23,42,.025);
                }

                .agenda-stat-label {
                    color: #64748b;
                    font-size: 11px;
                    font-weight: 700;
                }

                .agenda-stat-value {
                    margin-top: 7px;
                    font-size: 25px;
                    font-weight: 800;
                }

                .agenda-filter {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 15px;
                    padding: 15px;
                    margin-bottom: 18px;
                }

                .agenda-filter-label {
                    margin-bottom: 9px;
                    color: #475569;
                    font-size: 11px;
                    font-weight: 700;
                }

                .agenda-filter-row {
                    display: grid;
                    grid-template-columns:
                        minmax(0,1fr)
                        190px
                        180px;
                    gap: 10px;
                }

                .agenda-search {
                    position: relative;
                }

                .agenda-search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                }

                .agenda-input,
                .agenda-select {
                    width: 100%;
                    height: 43px;
                    border: 1px solid #dbe3ee;
                    border-radius: 10px;
                    background: #ffffff;
                    outline: none;
                    color: #334155;
                    font-size: 12px;
                }

                .agenda-input {
                    padding: 0 13px 0 39px;
                }

                .agenda-select {
                    padding: 0 12px;
                }

                .agenda-input:focus,
                .agenda-select:focus {
                    border-color: #93c5fd;
                    box-shadow:
                        0 0 0 3px rgba(59,130,246,.08);
                }

                .agenda-list {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    overflow: hidden;
                }

                .agenda-list-header {
                    padding: 17px 20px;
                    border-bottom: 1px solid #eef2f7;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                }

                .agenda-list-title {
                    font-size: 15px;
                    font-weight: 800;
                    color: #0f2747;
                }

                .agenda-list-subtitle {
                    margin-top: 3px;
                    color: #94a3b8;
                    font-size: 11px;
                }

                .agenda-count {
                    padding: 6px 10px;
                    border-radius: 999px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    color: #475569;
                    font-size: 10px;
                    font-weight: 700;
                }

                .agenda-table-wrap {
                    overflow-x: auto;
                }

                .agenda-table {
                    width: 100%;
                    min-width: 1180px;
                    border-collapse: collapse;
                }

                .agenda-table th {
                    padding: 12px 16px;
                    background: #f8fafc;
                    color: #64748b;
                    font-size: 10px;
                    font-weight: 800;
                    text-align: left;
                    text-transform: uppercase;
                    letter-spacing: .45px;
                }

                .agenda-table td {
                    padding: 15px 16px;
                    border-top: 1px solid #f1f5f9;
                    vertical-align: middle;
                }

                .agenda-table tbody tr:hover {
                    background: #fbfdff;
                }

                .agenda-date-box {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                }

                .agenda-date-icon {
                    width: 34px;
                    height: 34px;
                    border-radius: 9px;
                    background: #eff6ff;
                    color: #2563eb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .agenda-date-text {
                    color: #334155;
                    font-size: 11px;
                    font-weight: 700;
                }

                .agenda-time {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 6px 8px;
                    border-radius: 8px;
                    background: #f8fafc;
                    color: #475569;
                    border: 1px solid #e2e8f0;
                    font-size: 10px;
                    font-weight: 700;
                }

                .agenda-subject {
                    max-width: 290px;
                    color: #1e293b;
                    font-size: 12px;
                    font-weight: 800;
                    line-height: 1.5;
                }

                .agenda-location {
                    max-width: 220px;
                    color: #64748b;
                    font-size: 11px;
                    line-height: 1.5;
                }

                .agenda-source {
                    margin-top: 6px;
                    display: flex;
                    gap: 5px;
                    max-width: 330px;
                    color: #64748b;
                    font-size: 9px;
                    line-height: 1.45;
                }

                .agenda-source a {
                    color: #2563eb;
                    text-decoration: none;
                    font-weight: 700;
                }

                .agenda-source a:hover {
                    text-decoration: underline;
                }

                .agenda-source-muted {
                    color: #94a3b8;
                }

                .agenda-badge {
                    display: inline-flex;
                    padding: 5px 8px;
                    border-radius: 999px;
                    font-size: 10px;
                    font-weight: 700;
                }

                .agenda-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 7px;
                }

                .agenda-action {
                    height: 32px;
                    padding: 0 9px;
                    border-radius: 8px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    font-size: 10px;
                    font-weight: 700;
                    text-decoration: none;
                }

                .agenda-action-detail {
                    background: #eff6ff;
                    color: #1d4ed8;
                    border: 1px solid #dbeafe;
                }

                .agenda-action-edit {
                    background: #f8fafc;
                    color: #475569;
                    border: 1px solid #e2e8f0;
                }

                .agenda-action-delete {
                    background: #fef2f2;
                    color: #dc2626;
                    border: 1px solid #fecaca;
                    cursor: pointer;
                }

                .agenda-empty {
                    padding: 75px 20px;
                    text-align: center;
                }

                .agenda-empty-icon {
                    width: 58px;
                    height: 58px;
                    margin: 0 auto 13px;
                    border-radius: 16px;
                    background: #f8fafc;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #e2e8f0;
                }

                .agenda-empty-title {
                    color: #475569;
                    font-size: 14px;
                    font-weight: 700;
                }

                .agenda-empty-text {
                    margin-top: 5px;
                    color: #94a3b8;
                    font-size: 11px;
                }

                .agenda-footer {
                    padding: 24px 0 8px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 10px;
                }

                @media (max-width: 1100px) {
                    .agenda-filter-row {
                        grid-template-columns:
                            minmax(0,1fr)
                            180px;
                    }

                    .agenda-filter-row
                    .agenda-select:last-child {
                        grid-column: 1 / -1;
                    }
                }

                @media (max-width: 1000px) {
                    .agenda-stat-grid {
                        grid-template-columns:
                            repeat(2,minmax(0,1fr));
                    }
                }

                @media (max-width: 700px) {
                    .agenda-header {
                        padding: 0 16px;
                    }

                    .agenda-brand-subtitle,
                    .agenda-role {
                        display: none;
                    }

                    .agenda-header-right {
                        gap: 0;
                    }

                    .agenda-logout-button {
                        width: 38px;
                        padding: 0;
                    }

                    .agenda-logout-text {
                        display: none;
                    }

                    .agenda-main {
                        padding: 22px 15px 35px;
                    }

                    .agenda-title-row {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .agenda-add {
                        width: 100%;
                    }

                    .agenda-filter-row {
                        grid-template-columns: 1fr;
                    }

                    .agenda-filter-row
                    .agenda-select:last-child {
                        grid-column: auto;
                    }
                }

                @media (max-width: 480px) {
                    .agenda-stat-grid {
                        grid-template-columns: 1fr;
                    }

                    .agenda-title {
                        font-size: 25px;
                    }
                }
            `}</style>

            <div className="agenda-page">

                {/* HEADER */}

                <header className="agenda-header">

                    <a
                        href="/sekretaris/dashboard"
                        className="agenda-brand"
                    >

                        <div className="agenda-brand-logo">
                            <img
                                src="/images/poltekkes-icon.png"
                                alt="Logo Poltekkes Maluku"
                            />
                        </div>

                        <div>

                            <div className="agenda-brand-title">
                                SIMAP
                            </div>

                            <div className="agenda-brand-subtitle">
                                Poltekkes Maluku
                            </div>

                        </div>

                    </a>

                    <div className="agenda-header-right">

                        <div className="agenda-role">
                            Sekretaris Direktur
                        </div>

                        <form
                            method="POST"
                            action="/logout"
                            className="agenda-logout-form"
                        >

                            <input
                                type="hidden"
                                name="_token"
                                value={csrfToken}
                            />

                            <button
                                type="submit"
                                className="agenda-logout-button"
                            >

                                <Icon
                                    name="logout"
                                    size={15}
                                />

                                <span className="agenda-logout-text">
                                    Logout
                                </span>

                            </button>

                        </form>

                    </div>

                </header>

                <main className="agenda-main">

                    {/* BREADCRUMB */}

                    <div className="agenda-breadcrumb">

                        <a href="/sekretaris/dashboard">
                            Dashboard
                        </a>

                        <span>›</span>

                        <span>Agenda Direktur</span>

                    </div>

                    {/* TITLE */}

                    <div className="agenda-title-row">

                        <div>

                            <div className="agenda-kicker">
                                Administrasi Sekretaris Direktur
                            </div>

                            <h1 className="agenda-title">
                                Agenda Direktur
                            </h1>

                            <p className="agenda-description">
                                Kelola jadwal, rapat, kegiatan,
                                dan agenda Direktur.
                            </p>

                        </div>

                        <a
                            href="/sekretaris/agenda/create"
                            className="agenda-add"
                        >

                            <Icon
                                name="plus"
                                size={16}
                            />

                            Buat Agenda

                        </a>

                    </div>

                    {/* FLASH */}

                    {flashSuccess && (
                        <div className="agenda-alert agenda-alert-success">
                            {flashSuccess}
                        </div>
                    )}

                    {errors.length > 0 && (
                        <div className="agenda-alert agenda-alert-error">

                            {errors.map(
                                (error, index) => (
                                    <div key={index}>
                                        {error}
                                    </div>
                                )
                            )}

                        </div>
                    )}

                    {/* STATISTIK */}

                    <div className="agenda-stat-grid">

                        <div className="agenda-stat">

                            <div className="agenda-stat-label">
                                Total Agenda
                            </div>

                            <div className="agenda-stat-value">
                                {totalAgenda}
                            </div>

                        </div>

                        <div className="agenda-stat">

                            <div className="agenda-stat-label">
                                Hari Ini
                            </div>

                            <div
                                className="agenda-stat-value"
                                style={{
                                    color: '#2563eb',
                                }}
                            >
                                {agendaHariIni}
                            </div>

                        </div>

                        <div className="agenda-stat">

                            <div className="agenda-stat-label">
                                Mendatang
                            </div>

                            <div
                                className="agenda-stat-value"
                                style={{
                                    color: '#16a34a',
                                }}
                            >
                                {agendaMendatang}
                            </div>

                        </div>

                        <div className="agenda-stat">

                            <div className="agenda-stat-label">
                                Agenda Lewat
                            </div>

                            <div
                                className="agenda-stat-value"
                                style={{
                                    color: '#64748b',
                                }}
                            >
                                {agendaLewat}
                            </div>

                        </div>

                    </div>

                    {/* FILTER */}

                    <section className="agenda-filter">

                        <div className="agenda-filter-label">
                            Filter Agenda
                        </div>

                        <div className="agenda-filter-row">

                            <div className="agenda-search">

                                <div className="agenda-search-icon">
                                    <Icon
                                        name="search"
                                        size={17}
                                    />
                                </div>

                                <input
                                    type="text"
                                    className="agenda-input"
                                    placeholder="Cari judul, lokasi, surat, pengirim..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <select
                                className="agenda-select"
                                value={jenisFilter}
                                onChange={(e) =>
                                    setJenisFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="Semua">
                                    Semua Jenis
                                </option>

                                {jenisOptions.map(
                                    (jenis) => (
                                        <option
                                            key={jenis}
                                            value={jenis}
                                        >
                                            {jenis}
                                        </option>
                                    )
                                )}

                            </select>

                            <select
                                className="agenda-select"
                                value={periodeFilter}
                                onChange={(e) =>
                                    setPeriodeFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="Semua">
                                    Semua Periode
                                </option>

                                <option value="Hari Ini">
                                    Hari Ini
                                </option>

                                <option value="Mendatang">
                                    Mendatang
                                </option>

                                <option value="Lewat">
                                    Agenda Lewat
                                </option>

                            </select>

                        </div>

                    </section>

                    {/* LIST */}

                    <section className="agenda-list">

                        <div className="agenda-list-header">

                            <div>

                                <div className="agenda-list-title">
                                    Daftar Agenda
                                </div>

                                <div className="agenda-list-subtitle">
                                    Data agenda yang tersimpan
                                    dalam sistem
                                </div>

                            </div>

                            <div className="agenda-count">
                                {filteredData.length} data
                            </div>

                        </div>

                        {filteredData.length === 0 ? (

                            <div className="agenda-empty">

                                <div className="agenda-empty-icon">

                                    <Icon
                                        name="calendar"
                                        size={24}
                                    />

                                </div>

                                <div className="agenda-empty-title">
                                    Tidak ada agenda ditemukan
                                </div>

                                <div className="agenda-empty-text">
                                    {data.length === 0
                                        ? 'Belum ada agenda yang tersimpan.'
                                        : 'Coba ubah pencarian, jenis, atau periode agenda.'}
                                </div>

                            </div>

                        ) : (

                            <div className="agenda-table-wrap">

                                <table className="agenda-table">

                                    <thead>

                                        <tr>

                                            <th>Tanggal</th>
                                            <th>Waktu</th>
                                            <th>Agenda</th>
                                            <th>Lokasi</th>
                                            <th>Jenis</th>

                                            <th
                                                style={{
                                                    textAlign:
                                                        'right',
                                                }}
                                            >
                                                Aksi
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredData.map(
                                            (item) => {

                                                const surat =
                                                    item?.surat_masuk ||
                                                    null;

                                                return (
                                                    <tr
                                                        key={
                                                            item.id
                                                        }
                                                    >

                                                        <td>

                                                            <div className="agenda-date-box">

                                                                <div className="agenda-date-icon">

                                                                    <Icon
                                                                        name="calendar"
                                                                        size={16}
                                                                    />

                                                                </div>

                                                                <div className="agenda-date-text">
                                                                    {formatDate(
                                                                        item.tanggal
                                                                    )}
                                                                </div>

                                                            </div>

                                                        </td>

                                                        <td>

                                                            <span className="agenda-time">

                                                                <Icon
                                                                    name="clock"
                                                                    size={13}
                                                                />

                                                                {formatTime(
                                                                    item.waktu_mulai
                                                                )}

                                                                {item.waktu_selesai &&
                                                                    ` - ${formatTime(
                                                                        item.waktu_selesai
                                                                    )}`}

                                                            </span>

                                                        </td>

                                                        <td>

                                                            <div className="agenda-subject">
                                                                {item.judul ||
                                                                    'Tanpa judul'}
                                                            </div>

                                                            {item.keterangan && (
                                                                <div
                                                                    style={{
                                                                        marginTop:
                                                                            '4px',
                                                                        color:
                                                                            '#94a3b8',
                                                                        fontSize:
                                                                            '10px',
                                                                        maxWidth:
                                                                            '300px',
                                                                        overflow:
                                                                            'hidden',
                                                                        textOverflow:
                                                                            'ellipsis',
                                                                        whiteSpace:
                                                                            'nowrap',
                                                                    }}
                                                                >
                                                                    {
                                                                        item.keterangan
                                                                    }
                                                                </div>
                                                            )}

                                                            {surat ? (

                                                                <div className="agenda-source">

                                                                    <Icon
                                                                        name="file"
                                                                        size={12}
                                                                    />

                                                                    <span>

                                                                        Sumber:{' '}

                                                                        <a
                                                                            href={`/sekretaris/surat-masuk/${surat.id}`}
                                                                        >
                                                                            {surat.nomor_surat ||
                                                                                'Surat masuk'}
                                                                        </a>

                                                                    </span>

                                                                </div>

                                                            ) : (

                                                                <div className="agenda-source agenda-source-muted">
                                                                    Agenda manual
                                                                </div>

                                                            )}

                                                        </td>

                                                        <td>

                                                            <div className="agenda-location">
                                                                {item.lokasi ||
                                                                    'Lokasi belum ditentukan'}
                                                            </div>

                                                        </td>

                                                        <td>

                                                            <span
                                                                className="agenda-badge"
                                                                style={jenisStyle(
                                                                    item.jenis
                                                                )}
                                                            >
                                                                {item.jenis ||
                                                                    'Lainnya'}
                                                            </span>

                                                        </td>

                                                        <td>

                                                            <div className="agenda-actions">

                                                                <a
                                                                    href={`/sekretaris/agenda/${item.id}`}
                                                                    className="agenda-action agenda-action-detail"
                                                                >

                                                                    <Icon
                                                                        name="eye"
                                                                        size={13}
                                                                    />

                                                                    Detail

                                                                </a>

                                                                <a
                                                                    href={`/sekretaris/agenda/${item.id}/edit`}
                                                                    className="agenda-action agenda-action-edit"
                                                                >

                                                                    <Icon
                                                                        name="edit"
                                                                        size={13}
                                                                    />

                                                                    Edit

                                                                </a>

                                                                <form
                                                                    method="POST"
                                                                    action={`/sekretaris/agenda/${item.id}`}
                                                                    style={{
                                                                        display:
                                                                            'inline',
                                                                        margin: 0,
                                                                    }}
                                                                    onSubmit={(e) => {

                                                                        if (
                                                                            !window.confirm(
                                                                                `Yakin ingin menghapus agenda "${item.judul || 'ini'}"?`
                                                                            )
                                                                        ) {
                                                                            e.preventDefault();
                                                                        }

                                                                    }}
                                                                >

                                                                    <input
                                                                        type="hidden"
                                                                        name="_token"
                                                                        value={
                                                                            csrfToken
                                                                        }
                                                                    />

                                                                    <input
                                                                        type="hidden"
                                                                        name="_method"
                                                                        value="DELETE"
                                                                    />

                                                                    <button
                                                                        type="submit"
                                                                        className="agenda-action agenda-action-delete"
                                                                    >

                                                                        <Icon
                                                                            name="trash"
                                                                            size={13}
                                                                        />

                                                                        Hapus

                                                                    </button>

                                                                </form>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>

                    <div className="agenda-footer">
                        SIMAP Poltekkes Maluku
                    </div>

                </main>

            </div>
        </>
    );
}