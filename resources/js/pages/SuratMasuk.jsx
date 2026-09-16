import React, {
    useMemo,
    useState,
} from 'react';

export default function SuratMasuk({
    suratMasuk = [],
}) {
    // =====================================================
    // STATE
    // =====================================================

    const [search, setSearch] =
        useState('');

    const [sifatFilter, setSifatFilter] =
        useState('Semua');

    const [statusFilter, setStatusFilter] =
        useState('Semua');

    // =====================================================
    // SAFE DATA
    // =====================================================

    const data = Array.isArray(
        suratMasuk
    )
        ? suratMasuk
        : [];

    // =====================================================
    // ROUTE SEKRETARIS
    // =====================================================

    const SEKRETARIS_DASHBOARD =
        '/sekretaris/dashboard';

    const SEKRETARIS_SURAT_MASUK =
        '/sekretaris/surat-masuk';

    const SEKRETARIS_SURAT_CREATE =
        '/sekretaris/surat-masuk/create';

    // =====================================================
    // CSRF
    // =====================================================

    const csrfToken =
        document
            .querySelector(
                'meta[name="csrf-token"]'
            )
            ?.getAttribute('content') || '';

    // =====================================================
    // FORMAT DATE ONLY
    // =====================================================

    const formatDate = (
        value
    ) => {
        if (!value) {
            return '-';
        }

        const text =
            String(value).trim();

        const match =
            text.match(
                /^(\d{4})-(\d{2})-(\d{2})/
            );

        if (!match) {
            return String(value);
        }

        const year =
            Number(match[1]);

        const month =
            Number(match[2]);

        const day =
            Number(match[3]);

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
            return String(value);
        }

        const maxDay =
            new Date(
                year,
                month,
                0
            ).getDate();

        if (
            day > maxDay
        ) {
            return String(value);
        }

        return `${String(day).padStart(
            2,
            '0'
        )} ${
            monthNames[
                month - 1
            ]
        } ${year}`;
    };

    // =====================================================
    // STATUS EFFECTIVE
    // =====================================================
    /*
    |------------------------------------------------------
    | Kalau backend sudah mengirim relasi disposisis,
    | gunakan data tersebut sebagai pengecekan tambahan.
    |
    | Prioritas:
    |
    | 1. Semua disposisi selesai → surat selesai
    | 2. Ada disposisi aktif → sudah didisposisi
    | 3. Fallback ke status surat
    |------------------------------------------------------
    */

    const getEffectiveStatus = (
        surat
    ) => {
        const disposisis =
            Array.isArray(
                surat?.disposisis
            )
                ? surat.disposisis
                : [];

        if (
            disposisis.length > 0
        ) {
            const allSelesai =
                disposisis.every(
                    (item) =>
                        item?.status ===
                        'selesai'
                );

            if (allSelesai) {
                return 'selesai';
            }

            const adaDisposisiAktif =
                disposisis.some(
                    (item) =>
                        [
                            'terkirim',
                            'in_progress',
                        ].includes(
                            item?.status
                        )
                );

            if (
                adaDisposisiAktif
            ) {
                return 'sudah_didisposisi';
            }
        }

        return (
            surat?.status ||
            'menunggu_disposisi'
        );
    };

    // =====================================================
    // STATUS TEXT
    // =====================================================

    const statusText = (
        status
    ) => {
        switch (status) {
            case 'menunggu_disposisi':
                return 'Menunggu Disposisi';

            case 'sudah_didisposisi':
                return 'Sudah Didisposisi';

            case 'selesai':
                return 'Selesai';

            default:
                return (
                    status ||
                    'Belum Ada Status'
                );
        }
    };

    // =====================================================
    // STATUS STYLE
    // =====================================================

    const statusStyle = (
        status
    ) => {
        switch (status) {
            case 'menunggu_disposisi':
                return {
                    background:
                        '#fff7ed',
                    color:
                        '#c2410c',
                    border:
                        '1px solid #fed7aa',
                };

            case 'sudah_didisposisi':
                return {
                    background:
                        '#eff6ff',
                    color:
                        '#1d4ed8',
                    border:
                        '1px solid #bfdbfe',
                };

            case 'selesai':
                return {
                    background:
                        '#f0fdf4',
                    color:
                        '#15803d',
                    border:
                        '1px solid #bbf7d0',
                };

            default:
                return {
                    background:
                        '#f8fafc',
                    color:
                        '#475569',
                    border:
                        '1px solid #e2e8f0',
                };
        }
    };

    // =====================================================
    // SIFAT STYLE
    // =====================================================

    const sifatStyle = (
        sifat
    ) => {
        switch (sifat) {
            case 'Sangat Penting':
                return {
                    background:
                        '#fef2f2',
                    color:
                        '#b91c1c',
                    border:
                        '1px solid #fecaca',
                };

            case 'Penting':
                return {
                    background:
                        '#fff7ed',
                    color:
                        '#c2410c',
                    border:
                        '1px solid #fed7aa',
                };

            case 'Rahasia':
                return {
                    background:
                        '#f5f3ff',
                    color:
                        '#6d28d9',
                    border:
                        '1px solid #ddd6fe',
                };

            default:
                return {
                    background:
                        '#eff6ff',
                    color:
                        '#1d4ed8',
                    border:
                        '1px solid #bfdbfe',
                };
        }
    };

    // =====================================================
    // FILTER DATA
    // =====================================================

    const filteredData =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            return data.filter(
                (surat) => {
                    const nomor =
                        String(
                            surat?.nomor_surat ||
                                ''
                        ).toLowerCase();

                    const perihal =
                        String(
                            surat?.perihal ||
                                ''
                        ).toLowerCase();

                    const pengirim =
                        String(
                            surat?.pengirim ||
                                ''
                        ).toLowerCase();

                    const effectiveStatus =
                        getEffectiveStatus(
                            surat
                        );

                    const matchesSearch =
                        !keyword ||
                        nomor.includes(
                            keyword
                        ) ||
                        perihal.includes(
                            keyword
                        ) ||
                        pengirim.includes(
                            keyword
                        );

                    const matchesSifat =
                        sifatFilter ===
                            'Semua' ||
                        surat?.sifat ===
                            sifatFilter;

                    const matchesStatus =
                        statusFilter ===
                            'Semua' ||
                        effectiveStatus ===
                            statusFilter;

                    return (
                        matchesSearch &&
                        matchesSifat &&
                        matchesStatus
                    );
                }
            );
        }, [
            data,
            search,
            sifatFilter,
            statusFilter,
        ]);

    // =====================================================
    // STATISTIK
    // =====================================================

    const totalSurat =
        data.length;

    const totalMenunggu =
        data.filter(
            (surat) =>
                getEffectiveStatus(
                    surat
                ) ===
                'menunggu_disposisi'
        ).length;

    const totalDidisposisi =
        data.filter(
            (surat) =>
                getEffectiveStatus(
                    surat
                ) ===
                'sudah_didisposisi'
        ).length;

    const totalSelesai =
        data.filter(
            (surat) =>
                getEffectiveStatus(
                    surat
                ) ===
                'selesai'
        ).length;

    // =====================================================
    // ICON
    // =====================================================

    const Icon = ({
        name,
        size = 18,
    }) => {
        const common = {
            width: size,
            height: size,
            viewBox:
                '0 0 24 24',
            fill: 'none',
            stroke:
                'currentColor',
            strokeWidth: 1.8,
            strokeLinecap:
                'round',
            strokeLinejoin:
                'round',
        };

        const icons = {
            mail: (
                <>
                    <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                    />
                    <path d="m4 7 8 6 8-6" />
                </>
            ),

            search: (
                <>
                    <circle
                        cx="11"
                        cy="11"
                        r="7"
                    />
                    <path d="m20 20-4-4" />
                </>
            ),

            plus: (
                <>
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                </>
            ),

            arrow: (
                <>
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                </>
            ),

            eye: (
                <>
                    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                    <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                    />
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

            filter: (
                <>
                    <path d="M4 6h16" />
                    <path d="M7 12h10" />
                    <path d="M10 18h4" />
                </>
            ),

            check: (
                <>
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                    />
                    <path d="m8.5 12 2.3 2.3 4.7-5" />
                </>
            ),
        };

        return (
            <svg {...common}>
                {
                    icons[
                        name
                    ]
                }
            </svg>
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            <style>{`

                * {
                    box-sizing: border-box;
                }

                .surat-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(
                            circle at 5% 0%,
                            rgba(37,99,235,.04),
                            transparent 25%
                        ),
                        #f4f7fb;
                    color: #0f172a;
                    font-family:
                        Inter,
                        ui-sans-serif,
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }

                /* =================================================
                   HEADER
                ================================================= */

                .surat-header {
                    height: 74px;
                    background:
                        rgba(
                            255,
                            255,
                            255,
                            .96
                        );
                    backdrop-filter:
                        blur(12px);
                    border-bottom:
                        1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 28px;
                    position: sticky;
                    top: 0;
                    z-index: 30;
                }

                .surat-header-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    text-decoration: none;
                }

                .surat-brand-logo {
                    width: 44px;
                    height: 44px;
                    border-radius: 11px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 5px;
                    overflow: hidden;
                    box-shadow:
                        0 5px 15px
                        rgba(
                            15,
                            39,
                            71,
                            .07
                        );
                }

                .surat-brand-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                }

                .surat-brand-title {
                    font-weight: 800;
                    font-size: 18px;
                    color: #0f2747;
                    line-height: 1.1;
                }

                .surat-brand-subtitle {
                    font-size: 10px;
                    color: #64748b;
                    margin-top: 4px;
                }

                .surat-role {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 12px;
                    border-radius: 999px;
                    background: #eff6ff;
                    color: #1d4ed8;
                    font-size: 10px;
                    font-weight: 700;
                    border:
                        1px solid #dbeafe;
                }

                .surat-role-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background:
                        #2563eb;
                }

                /* =================================================
                   MAIN
                ================================================= */

                .surat-main {
                    padding:
                        30px 28px 45px;
                    max-width: 1500px;
                    margin: 0 auto;
                }

                .surat-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: #94a3b8;
                    font-size: 11px;
                    margin-bottom: 10px;
                }

                .surat-breadcrumb a {
                    color: #64748b;
                    text-decoration: none;
                    font-weight: 600;
                }

                .surat-breadcrumb a:hover {
                    color: #2563eb;
                }

                .surat-title-row {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 20px;
                    margin-bottom: 24px;
                }

                .surat-kicker {
                    display: inline-flex;
                    align-items: center;
                    padding:
                        5px 9px;
                    margin-bottom: 9px;
                    border-radius: 999px;
                    background: #f8fafc;
                    border:
                        1px solid #e2e8f0;
                    color: #64748b;
                    font-size: 9px;
                    font-weight: 800;
                    text-transform:
                        uppercase;
                    letter-spacing:
                        .45px;
                }

                .surat-title {
                    margin: 0;
                    font-size: 31px;
                    line-height: 1.2;
                    font-weight: 850;
                    color: #0f2747;
                    letter-spacing: -.7px;
                }

                .surat-description {
                    margin:
                        8px 0 0;
                    font-size: 13px;
                    line-height: 1.65;
                    color: #64748b;
                }

                .surat-add-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding:
                        12px 17px;
                    border-radius: 11px;
                    background:
                        linear-gradient(
                            135deg,
                            #0f2747,
                            #174a7e
                        );
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 800;
                    white-space: nowrap;
                    box-shadow:
                        0 8px 20px
                        rgba(
                            15,
                            39,
                            71,
                            .14
                        );
                    transition:
                        transform .18s ease,
                        box-shadow .18s ease;
                }

                .surat-add-button:hover {
                    transform:
                        translateY(-1px);
                    box-shadow:
                        0 12px 25px
                        rgba(
                            15,
                            39,
                            71,
                            .19
                        );
                }

                /* =================================================
                   STATISTICS
                ================================================= */

                .surat-stat-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(
                            4,
                            minmax(0,1fr)
                        );
                    gap: 14px;
                    margin-bottom: 18px;
                }

                .surat-stat {
                    position: relative;
                    overflow: hidden;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 17px;
                    box-shadow:
                        0 4px 16px
                        rgba(
                            15,
                            23,
                            42,
                            .025
                        );
                }

                .surat-stat::after {
                    content: "";
                    position: absolute;
                    width: 90px;
                    height: 90px;
                    right: -42px;
                    top: -42px;
                    border-radius: 50%;
                    background:
                        #f8fafc;
                }

                .surat-stat-top {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 10px;
                }

                .surat-stat-label {
                    font-size: 10px;
                    font-weight: 750;
                    color: #64748b;
                }

                .surat-stat-value {
                    margin-top: 8px;
                    font-size: 28px;
                    line-height: 1;
                    font-weight: 850;
                    color: #0f2747;
                }

                .surat-stat-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                /* =================================================
                   FILTER
                ================================================= */

                .surat-filter-card {
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 17px;
                    margin-bottom: 18px;
                    box-shadow:
                        0 4px 16px
                        rgba(
                            15,
                            23,
                            42,
                            .025
                        );
                }

                .surat-filter-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    margin-bottom: 11px;
                }

                .surat-filter-title {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: #0f2747;
                    font-size: 13px;
                    font-weight: 800;
                }

                .surat-filter-caption {
                    margin-top: 3px;
                    color: #94a3b8;
                    font-size: 10px;
                }

                .surat-filter-row {
                    display: grid;
                    grid-template-columns:
                        minmax(0,1fr)
                        180px
                        210px;
                    gap: 10px;
                }

                .surat-search-wrap {
                    position: relative;
                }

                .surat-search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform:
                        translateY(-50%);
                    color: #94a3b8;
                    pointer-events: none;
                }

                .surat-input,
                .surat-select {
                    width: 100%;
                    height: 43px;
                    box-sizing: border-box;
                    border:
                        1px solid #dbe3ee;
                    border-radius: 10px;
                    background: #ffffff;
                    outline: none;
                    color: #334155;
                    font-size: 12px;
                    transition: .15s ease;
                }

                .surat-input {
                    padding:
                        0 13px 0 39px;
                }

                .surat-select {
                    padding:
                        0 12px;
                }

                .surat-input:hover,
                .surat-select:hover {
                    border-color:
                        #cbd5e1;
                }

                .surat-input:focus,
                .surat-select:focus {
                    border-color:
                        #60a5fa;
                    box-shadow:
                        0 0 0 3px
                        rgba(
                            59,
                            130,
                            246,
                            .08
                        );
                }

                /* =================================================
                   LIST
                ================================================= */

                .surat-list-card {
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 17px;
                    overflow: hidden;
                    box-shadow:
                        0 5px 18px
                        rgba(
                            15,
                            23,
                            42,
                            .025
                        );
                }

                .surat-list-header {
                    padding:
                        18px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                    border-bottom:
                        1px solid #eef2f7;
                }

                .surat-list-title {
                    font-size: 15px;
                    font-weight: 800;
                    color: #0f2747;
                }

                .surat-list-subtitle {
                    margin-top: 4px;
                    font-size: 10px;
                    color: #94a3b8;
                }

                .surat-result-count {
                    padding:
                        6px 10px;
                    border-radius: 999px;
                    background: #f8fafc;
                    color: #475569;
                    border:
                        1px solid #e2e8f0;
                    font-size: 10px;
                    font-weight: 750;
                    white-space: nowrap;
                }

                .surat-table-wrap {
                    overflow-x: auto;
                }

                .surat-table {
                    width: 100%;
                    min-width: 1080px;
                    border-collapse:
                        collapse;
                }

                .surat-table th {
                    text-align: left;
                    padding:
                        12px 16px;
                    background: #f8fafc;
                    color: #64748b;
                    font-size: 9px;
                    font-weight: 850;
                    text-transform:
                        uppercase;
                    letter-spacing:
                        .5px;
                    white-space:
                        nowrap;
                }

                .surat-table td {
                    padding:
                        16px;
                    border-top:
                        1px solid #f1f5f9;
                    vertical-align:
                        middle;
                }

                .surat-table tbody tr {
                    transition:
                        background .15s ease;
                }

                .surat-table tbody tr:hover {
                    background:
                        #fbfdff;
                }

                .surat-number {
                    color: #0f2747;
                    font-size: 11px;
                    font-weight: 800;
                    line-height: 1.55;
                    max-width: 180px;
                }

                .surat-sender {
                    color: #475569;
                    font-size: 11px;
                    font-weight: 600;
                    max-width: 190px;
                    line-height: 1.55;
                }

                .surat-subject {
                    color: #1e293b;
                    font-size: 12px;
                    font-weight: 750;
                    max-width: 300px;
                    line-height: 1.55;
                }

                .surat-date {
                    color: #64748b;
                    font-size: 10px;
                    white-space:
                        nowrap;
                    line-height: 1.5;
                }

                .surat-badge {
                    display: inline-flex;
                    align-items: center;
                    border-radius: 999px;
                    padding:
                        5px 8px;
                    font-size: 9px;
                    font-weight: 750;
                    white-space:
                        nowrap;
                }

                .surat-actions {
                    display: flex;
                    justify-content:
                        flex-end;
                    align-items:
                        center;
                    gap: 6px;
                }

                .surat-action {
                    height: 32px;
                    padding:
                        0 9px;
                    display: inline-flex;
                    align-items: center;
                    justify-content:
                        center;
                    gap: 5px;
                    border-radius: 8px;
                    text-decoration:
                        none;
                    font-size: 9px;
                    font-weight: 750;
                    border:
                        1px solid transparent;
                    white-space:
                        nowrap;
                    transition: .15s ease;
                }

                .surat-action-detail {
                    background:
                        #eff6ff;
                    color:
                        #1d4ed8;
                    border-color:
                        #dbeafe;
                }

                .surat-action-detail:hover {
                    background:
                        #dbeafe;
                }

                .surat-action-edit {
                    background:
                        #f8fafc;
                    color:
                        #475569;
                    border-color:
                        #e2e8f0;
                }

                .surat-action-edit:hover {
                    background:
                        #f1f5f9;
                }

                .surat-action-delete {
                    background:
                        #fef2f2;
                    color:
                        #dc2626;
                    border-color:
                        #fecaca;
                    cursor:
                        pointer;
                }

                .surat-action-delete:hover {
                    background:
                        #fee2e2;
                }

                /* =================================================
                   EMPTY
                ================================================= */

                .surat-empty {
                    padding:
                        75px 20px;
                    text-align:
                        center;
                }

                .surat-empty-icon {
                    width: 60px;
                    height: 60px;
                    margin:
                        0 auto 14px;
                    border-radius: 17px;
                    display: flex;
                    align-items:
                        center;
                    justify-content:
                        center;
                    background:
                        #eff6ff;
                    color:
                        #2563eb;
                    border:
                        1px solid #dbeafe;
                }

                .surat-empty-title {
                    font-size: 14px;
                    font-weight: 750;
                    color: #475569;
                }

                .surat-empty-text {
                    margin-top: 5px;
                    font-size: 10px;
                    color: #94a3b8;
                    line-height: 1.6;
                }

                .surat-footer {
                    text-align:
                        center;
                    padding:
                        25px 0 8px;
                    font-size: 10px;
                    color: #94a3b8;
                }

                /* =================================================
                   RESPONSIVE
                ================================================= */

                @media (max-width: 1100px) {
                    .surat-stat-grid {
                        grid-template-columns:
                            repeat(
                                2,
                                minmax(0,1fr)
                            );
                    }

                    .surat-filter-row {
                        grid-template-columns:
                            1fr 1fr;
                    }

                    .surat-search-wrap {
                        grid-column:
                            1 / -1;
                    }
                }

                @media (max-width: 700px) {
                    .surat-header {
                        padding:
                            0 16px;
                    }

                    .surat-brand-subtitle,
                    .surat-role {
                        display:
                            none;
                    }

                    .surat-main {
                        padding:
                            22px 15px 35px;
                    }

                    .surat-title-row {
                        flex-direction:
                            column;
                        align-items:
                            stretch;
                    }

                    .surat-add-button {
                        width:
                            100%;
                    }

                    .surat-filter-row {
                        grid-template-columns:
                            1fr;
                    }

                    .surat-search-wrap {
                        grid-column:
                            auto;
                    }
                }

                @media (max-width: 480px) {
                    .surat-stat-grid {
                        grid-template-columns:
                            1fr;
                    }

                    .surat-title {
                        font-size:
                            26px;
                    }
                }

            `}</style>

            <div className="surat-page">

                {/* =================================================
                   HEADER
                ================================================= */}

                <header className="surat-header">

                    <a
                        href={
                            SEKRETARIS_DASHBOARD
                        }
                        className="surat-header-brand"
                    >

                        <div className="surat-brand-logo">

                            <img
                                src="/images/poltekkes-icon.png"
                                alt="Logo Poltekkes Maluku"
                            />

                        </div>

                        <div>

                            <div className="surat-brand-title">
                                SIMAP
                            </div>

                            <div className="surat-brand-subtitle">
                                Poltekkes Maluku
                            </div>

                        </div>

                    </a>

                    <div className="surat-role">

                        <span className="surat-role-dot" />

                        Sekretaris Direktur

                    </div>

                </header>

                {/* =================================================
                   MAIN
                ================================================= */}

                <main className="surat-main">

                    <div className="surat-breadcrumb">

                        <a
                            href={
                                SEKRETARIS_DASHBOARD
                            }
                        >
                            Dashboard Sekretaris
                        </a>

                        <span>
                            ›
                        </span>

                        <span>
                            Surat Masuk
                        </span>

                    </div>

                    <div className="surat-title-row">

                        <div>

                            <div className="surat-kicker">
                                Administrasi Sekretaris Direktur
                            </div>

                            <h1 className="surat-title">
                                Surat Masuk
                            </h1>

                            <p className="surat-description">
                                Kelola, periksa,
                                dan tindak lanjuti
                                surat yang masuk
                                ke Direktur.
                            </p>

                        </div>

                        <a
                            href={
                                SEKRETARIS_SURAT_CREATE
                            }
                            className="surat-add-button"
                        >

                            <Icon
                                name="plus"
                                size={16}
                            />

                            Tambah Surat

                        </a>

                    </div>

                    {/* =================================================
                       FLASH
                    ================================================= */}

                    {window.flashSuccess && (

                        <div
                            style={{
                                marginBottom:
                                    '18px',
                                padding:
                                    '13px 15px',
                                borderRadius:
                                    '11px',
                                background:
                                    '#f0fdf4',
                                border:
                                    '1px solid #bbf7d0',
                                color:
                                    '#15803d',
                                fontSize:
                                    '11px',
                                fontWeight:
                                    650,
                            }}
                        >

                            {window.flashSuccess}

                        </div>

                    )}

                    {/* =================================================
                       STATISTICS
                    ================================================= */}

                    <div className="surat-stat-grid">

                        <StatCard
                            label="Total Surat"
                            value={
                                totalSurat
                            }
                            color="#2563eb"
                            background="#eff6ff"
                            icon="mail"
                        />

                        <StatCard
                            label="Menunggu Disposisi"
                            value={
                                totalMenunggu
                            }
                            color="#ea580c"
                            background="#fff7ed"
                            icon="mail"
                        />

                        <StatCard
                            label="Sudah Didisposisi"
                            value={
                                totalDidisposisi
                            }
                            color="#1d4ed8"
                            background="#eff6ff"
                            icon="arrow"
                        />

                        <StatCard
                            label="Selesai"
                            value={
                                totalSelesai
                            }
                            color="#16a34a"
                            background="#f0fdf4"
                            icon="check"
                        />

                    </div>

                    {/* =================================================
                       FILTER
                    ================================================= */}

                    <section className="surat-filter-card">

                        <div className="surat-filter-head">

                            <div>

                                <div className="surat-filter-title">

                                    <Icon
                                        name="filter"
                                        size={15}
                                    />

                                    Filter Surat

                                </div>

                                <div className="surat-filter-caption">
                                    Cari berdasarkan
                                    nomor, pengirim,
                                    perihal, sifat,
                                    atau status.
                                </div>

                            </div>

                        </div>

                        <div className="surat-filter-row">

                            <div className="surat-search-wrap">

                                <div className="surat-search-icon">

                                    <Icon
                                        name="search"
                                        size={16}
                                    />

                                </div>

                                <input
                                    type="text"
                                    className="surat-input"
                                    placeholder="Cari nomor surat, pengirim, atau perihal..."
                                    value={
                                        search
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSearch(
                                            event.target
                                                .value
                                        )
                                    }
                                />

                            </div>

                            <select
                                className="surat-select"
                                value={
                                    sifatFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSifatFilter(
                                        event.target
                                            .value
                                    )
                                }
                            >

                                <option value="Semua">
                                    Semua Sifat
                                </option>

                                <option value="Biasa">
                                    Biasa
                                </option>

                                <option value="Penting">
                                    Penting
                                </option>

                                <option value="Sangat Penting">
                                    Sangat Penting
                                </option>

                                <option value="Rahasia">
                                    Rahasia
                                </option>

                            </select>

                            <select
                                className="surat-select"
                                value={
                                    statusFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setStatusFilter(
                                        event.target
                                            .value
                                    )
                                }
                            >

                                <option value="Semua">
                                    Semua Status
                                </option>

                                <option value="menunggu_disposisi">
                                    Menunggu Disposisi
                                </option>

                                <option value="sudah_didisposisi">
                                    Sudah Didisposisi
                                </option>

                                <option value="selesai">
                                    Selesai
                                </option>

                            </select>

                        </div>

                    </section>

                    {/* =================================================
                       LIST SURAT
                    ================================================= */}

                    <section className="surat-list-card">

                        <div className="surat-list-header">

                            <div>

                                <div className="surat-list-title">
                                    Daftar Surat Masuk
                                </div>

                                <div className="surat-list-subtitle">
                                    Data surat yang
                                    tersimpan dalam
                                    sistem.
                                </div>

                            </div>

                            <div className="surat-result-count">

                                {filteredData.length}{' '}
                                data

                            </div>

                        </div>

                        {filteredData.length ===
                        0 ? (

                            <div className="surat-empty">

                                <div className="surat-empty-icon">

                                    <Icon
                                        name="mail"
                                        size={24}
                                    />

                                </div>

                                <div className="surat-empty-title">
                                    Tidak ada surat ditemukan
                                </div>

                                <div className="surat-empty-text">

                                    {data.length ===
                                    0
                                        ? 'Belum ada surat masuk yang tersimpan.'
                                        : 'Coba ubah kata kunci atau filter yang digunakan.'}

                                </div>

                            </div>

                        ) : (

                            <div className="surat-table-wrap">

                                <table className="surat-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Nomor Surat
                                            </th>

                                            <th>
                                                Pengirim
                                            </th>

                                            <th>
                                                Perihal
                                            </th>

                                            <th>
                                                Tanggal
                                            </th>

                                            <th>
                                                Sifat
                                            </th>

                                            <th>
                                                Status
                                            </th>

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
                                            (surat) => {

                                                const effectiveStatus =
                                                    getEffectiveStatus(
                                                        surat
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            surat.id
                                                        }
                                                    >

                                                        <td>

                                                            <div className="surat-number">
                                                                {
                                                                    surat?.nomor_surat ||
                                                                    '-'
                                                                }
                                                            </div>

                                                        </td>

                                                        <td>

                                                            <div className="surat-sender">
                                                                {
                                                                    surat?.pengirim ||
                                                                    '-'
                                                                }
                                                            </div>

                                                        </td>

                                                        <td>

                                                            <div className="surat-subject">
                                                                {
                                                                    surat?.perihal ||
                                                                    'Tanpa perihal'
                                                                }
                                                            </div>

                                                        </td>

                                                        <td>

                                                            <div className="surat-date">

                                                                <div>
                                                                    {formatDate(
                                                                        surat?.tanggal_surat
                                                                    )}
                                                                </div>

                                                                {surat?.tanggal_diterima && (
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                '4px',
                                                                            color:
                                                                                '#94a3b8',
                                                                            fontSize:
                                                                                '9px',
                                                                        }}
                                                                    >
                                                                        Diterima:{' '}
                                                                        {formatDate(
                                                                            surat.tanggal_diterima
                                                                        )}
                                                                    </div>
                                                                )}

                                                            </div>

                                                        </td>

                                                        <td>

                                                            <span
                                                                className="surat-badge"
                                                                style={sifatStyle(
                                                                    surat?.sifat
                                                                )}
                                                            >
                                                                {
                                                                    surat?.sifat ||
                                                                    'Biasa'
                                                                }
                                                            </span>

                                                        </td>

                                                        <td>

                                                            <span
                                                                className="surat-badge"
                                                                style={statusStyle(
                                                                    effectiveStatus
                                                                )}
                                                            >

                                                                {effectiveStatus ===
                                                                    'selesai' && (
                                                                    <span
                                                                        style={{
                                                                            display:
                                                                                'inline-flex',
                                                                            marginRight:
                                                                                '4px',
                                                                        }}
                                                                    >
                                                                        <Icon
                                                                            name="check"
                                                                            size={10}
                                                                        />
                                                                    </span>
                                                                )}

                                                                {statusText(
                                                                    effectiveStatus
                                                                )}

                                                            </span>

                                                        </td>

                                                        <td>

                                                            <div className="surat-actions">

                                                                <a
                                                                    href={`${SEKRETARIS_SURAT_MASUK}/${surat.id}`}
                                                                    className="
                                                                        surat-action
                                                                        surat-action-detail
                                                                    "
                                                                >

                                                                    <Icon
                                                                        name="eye"
                                                                        size={13}
                                                                    />

                                                                    Detail

                                                                </a>

                                                                <a
                                                                    href={`${SEKRETARIS_SURAT_MASUK}/${surat.id}/edit`}
                                                                    className="
                                                                        surat-action
                                                                        surat-action-edit
                                                                    "
                                                                >

                                                                    <Icon
                                                                        name="edit"
                                                                        size={13}
                                                                    />

                                                                    Edit

                                                                </a>

                                                                <form
                                                                    method="POST"
                                                                    action={`${SEKRETARIS_SURAT_MASUK}/${surat.id}`}
                                                                    style={{
                                                                        display:
                                                                            'inline',
                                                                        margin: 0,
                                                                    }}
                                                                    onSubmit={(
                                                                        event
                                                                    ) => {

                                                                        const confirmed =
                                                                            window.confirm(
                                                                                `Yakin ingin menghapus surat "${surat?.perihal || 'ini'}"?`
                                                                            );

                                                                        if (
                                                                            !confirmed
                                                                        ) {
                                                                            event.preventDefault();
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
                                                                        className="
                                                                            surat-action
                                                                            surat-action-delete
                                                                        "
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

                    <div className="surat-footer">
                        SIMAP Poltekkes Maluku
                    </div>

                </main>

            </div>
        </>
    );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
    label,
    value,
    color,
    background,
    icon,
}) {
    const icons = {
        mail: (
            <>
                <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                />

                <path d="m4 7 8 6 8-6" />
            </>
        ),

        arrow: (
            <>
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
            </>
        ),

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

        check: (
            <>
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />

                <path d="m8.5 12 2.3 2.3 4.7-5" />
            </>
        ),
    };

    return (
        <div className="surat-stat">

            <div className="surat-stat-top">

                <div>

                    <div className="surat-stat-label">
                        {label}
                    </div>

                    <div
                        className="surat-stat-value"
                        style={{
                            color,
                        }}
                    >
                        {value}
                    </div>

                </div>

                <div
                    className="surat-stat-icon"
                    style={{
                        background,
                        color,
                    }}
                >

                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {
                            icons[
                                icon
                            ]
                        }
                    </svg>

                </div>

            </div>

        </div>
    );
}