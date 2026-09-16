import React, { useMemo } from 'react';

export default function SekretarisDashboard({
    user = null,
    stats = {},
    suratTerbaru = [],
    agendaHariIniData = [],
    disposisiTerbaru = [],
}) {
    // =====================================================
    // DATA AMAN
    // =====================================================

    const safeStats =
        stats &&
        typeof stats === 'object'
            ? stats
            : {};

    const safeSurat =
        Array.isArray(suratTerbaru)
            ? suratTerbaru.filter(Boolean)
            : [];

    const safeAgenda =
        Array.isArray(agendaHariIniData)
            ? agendaHariIniData.filter(Boolean)
            : [];

    const safeDisposisi =
        Array.isArray(disposisiTerbaru)
            ? disposisiTerbaru.filter(Boolean)
            : [];

    const userName =
        user?.name ||
        'Sekretaris Direktur';

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
    // WIT
    // =====================================================

    const todayKey = useMemo(() => {
        return new Intl.DateTimeFormat(
            'en-CA',
            {
                timeZone: 'Asia/Jayapura',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }
        ).format(new Date());
    }, []);

    const todayLabel = useMemo(() => {
        return new Intl.DateTimeFormat(
            'id-ID',
            {
                timeZone: 'Asia/Jayapura',
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }
        ).format(new Date());
    }, []);

    // =====================================================
    // DATE ONLY
    // =====================================================

    const getDateKey = (value) => {
        if (!value) {
            return '';
        }

        const text = String(value).trim();

        const match = text.match(
            /^(\d{4}-\d{2}-\d{2})/
        );

        return match
            ? match[1]
            : '';
    };

    const formatDate = (value) => {
        if (!value) {
            return '-';
        }

        const dateKey =
            getDateKey(value);

        const match =
            dateKey.match(
                /^(\d{4})-(\d{2})-(\d{2})$/
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

        const months = [
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

        return `${String(day).padStart(2, '0')} ${months[month - 1]} ${year}`;
    };

    // =====================================================
    // DATETIME WIT
    // =====================================================

    const formatDateTime = (value) => {
        if (!value) {
            return '-';
        }

        const parsed =
            new Date(value);

        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return String(value);
        }

        return new Intl.DateTimeFormat(
            'id-ID',
            {
                timeZone: 'Asia/Jayapura',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }
        ).format(parsed);
    };

    // =====================================================
    // TIME
    // =====================================================

    const formatTime = (value) => {
        if (!value) {
            return '--:--';
        }

        const text =
            String(value).trim();

        if (
            /^\d{2}:\d{2}:\d{2}$/.test(
                text
            )
        ) {
            return text.slice(0, 5);
        }

        if (
            /^\d{2}:\d{2}$/.test(
                text
            )
        ) {
            return text;
        }

        const match =
            text.match(
                /(\d{2}:\d{2})/
            );

        return match
            ? match[1]
            : text;
    };

    // =====================================================
    // SURAT STATUS
    // =====================================================

    const getSuratStatus = (status) => {
        switch (status) {
            case 'menunggu_disposisi':
                return {
                    text: 'Menunggu',
                    className: 'waiting',
                };

            case 'sudah_didisposisi':
                return {
                    text: 'Didisposisi',
                    className: 'processed',
                };

            case 'selesai':
                return {
                    text: 'Selesai',
                    className: 'done',
                };

            default:
                return {
                    text: status || '-',
                    className: 'default',
                };
        }
    };

    // =====================================================
    // DISPOSISI STATUS
    // =====================================================

    const getDisposisiStatus = (status) => {
        switch (status) {
            case 'terkirim':
                return {
                    text: 'Terkirim',
                    className: 'sent',
                };

            case 'in_progress':
                return {
                    text: 'Dalam Proses',
                    className: 'progress',
                };

            case 'selesai':
                return {
                    text: 'Selesai',
                    className: 'done',
                };

            default:
                return {
                    text: status || '-',
                    className: 'default',
                };
        }
    };

    // =====================================================
    // TARGET DISPOSISI
    // =====================================================

    const getDisposisiTujuan = (item) => {
        if (
            item?.tujuan_type ===
            'direktur'
        ) {
            return 'Direktur';
        }

        return (
            item?.unit?.name ||
            'Unit belum ditentukan'
        );
    };

    // =====================================================
    // DEADLINE
    // =====================================================

    const isTerlambat = (item) => {
        if (
            !item?.batas_waktu ||
            item?.status === 'selesai'
        ) {
            return false;
        }

        const deadline =
            getDateKey(
                item.batas_waktu
            );

        if (!deadline) {
            return false;
        }

        return deadline < todayKey;
    };

    // =====================================================
    // AGENDA HARI INI
    // =====================================================

    const agendaHariIni = useMemo(() => {
        return safeAgenda
            .filter(
                (item) =>
                    getDateKey(
                        item?.tanggal
                    ) === todayKey
            )
            .sort(
                (a, b) =>
                    String(
                        a?.waktu_mulai || ''
                    ).localeCompare(
                        String(
                            b?.waktu_mulai || ''
                        )
                    )
            );
    }, [
        safeAgenda,
        todayKey,
    ]);

    // =====================================================
    // TOTAL TERLAMBAT
    // =====================================================

    const totalTerlambat =
        useMemo(() => {
            return safeDisposisi.filter(
                (item) =>
                    isTerlambat(item)
            ).length;
        }, [
            safeDisposisi,
            todayKey,
        ]);

    // =====================================================
    // STATISTIK
    // =====================================================

    const agendaHariIniCount =
        Number(
            safeStats.agendaHariIni ??
                agendaHariIni.length ??
                0
        );

    const statsCards = [
        {
            key: 'totalSurat',
            label: 'Total Surat',
            value: Number(
                safeStats.totalSurat ?? 0
            ),
            description:
                'Seluruh surat masuk',
            icon: 'mail',
            tone: 'blue',
        },
        {
            key: 'suratMenunggu',
            label: 'Menunggu Disposisi',
            value: Number(
                safeStats.suratMenunggu ?? 0
            ),
            description:
                'Perlu segera diproses',
            icon: 'send',
            tone: 'orange',
        },
        {
            key: 'inProgress',
            label: 'Dalam Proses',
            value: Number(
                safeStats.disposisiInProgress ?? 0
            ),
            description:
                'Sedang ditindaklanjuti',
            icon: 'clock',
            tone: 'amber',
        },
        {
            key: 'selesai',
            label: 'Selesai',
            value: Number(
                safeStats.disposisiSelesai ?? 0
            ),
            description:
                'Tindak lanjut selesai',
            icon: 'check',
            tone: 'green',
        },
        {
            key: 'agendaHariIni',
            label: 'Agenda Hari Ini',
            value: agendaHariIniCount,
            description:
                'Agenda Direktur hari ini',
            icon: 'calendar',
            tone: 'indigo',
        },
        {
            key: 'agendaMendatang',
            label: 'Agenda Mendatang',
            value: Number(
                safeStats.agendaMendatang ?? 0
            ),
            description:
                'Setelah hari ini',
            icon: 'calendar',
            tone: 'purple',
        },
    ];

    // =====================================================
    // ICON
    // =====================================================

    const Icon = ({
        name,
        size = 20,
    }) => {
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
            home: (
                <>
                    <path d="M3 10.5 12 3l9 7.5" />
                    <path d="M5.5 9.5V21h13V9.5" />
                    <path d="M9.5 21v-6h5v6" />
                </>
            ),

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

            send: (
                <>
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                </>
            ),

            calendar: (
                <>
                    <rect
                        x="3"
                        y="4.5"
                        width="18"
                        height="16"
                        rx="2.5"
                    />
                    <path d="M16 2.5v4M8 2.5v4M3 9h18" />
                </>
            ),

            plus: (
                <>
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                </>
            ),

            logout: (
                <>
                    <path d="M9 5H5.5A1.5 1.5 0 0 0 4 6.5v11A1.5 1.5 0 0 0 5.5 19H9" />
                    <path d="M15 8l4 4-4 4" />
                    <path d="M19 12H9" />
                </>
            ),

            clock: (
                <>
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                    />
                    <path d="M12 7v5l3 2" />
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

            building: (
                <>
                    <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
                    <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
                    <path d="M9 21v-3h6v3" />
                </>
            ),

            note: (
                <>
                    <rect
                        x="4"
                        y="3"
                        width="16"
                        height="18"
                        rx="2"
                    />
                    <path d="M8 8h8M8 12h8M8 16h5" />
                </>
            ),

            alert: (
                <>
                    <path d="M10.3 3.8 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                </>
            ),

            arrow: (
                <>
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                </>
            ),

            arrowUpRight: (
                <>
                    <path d="M7 17 17 7" />
                    <path d="M8 7h9v9" />
                </>
            ),

            chevronRight: (
                <>
                    <path d="m9 18 6-6-6-6" />
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
    // RENDER
    // =====================================================

    return (
        <>
            <style>{`

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                }

                .sek-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(
                            circle at top left,
                            rgba(37,99,235,.055),
                            transparent 25%
                        ),
                        #f5f7fb;
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

                /* =====================================================
                   HEADER
                ===================================================== */

                .sek-header {
                    height: 76px;
                    position: sticky;
                    top: 0;
                    z-index: 50;

                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    padding: 0 28px;

                    background: rgba(255,255,255,.96);
                    backdrop-filter: blur(16px);

                    border-bottom:
                        1px solid #e4e9f0;
                }

                .sek-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                }

                .sek-logo {
                    width: 46px;
                    height: 46px;
                    padding: 5px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border:
                        1px solid #e2e8f0;
                    border-radius: 12px;

                    background: #fff;

                    box-shadow:
                        0 6px 16px
                        rgba(15,39,71,.065);
                }

                .sek-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .sek-brand-title {
                    color: #0f2747;
                    font-size: 20px;
                    line-height: 1;
                    font-weight: 850;
                }

                .sek-brand-subtitle {
                    margin-top: 5px;
                    color: #64748b;
                    font-size: 11px;
                }

                .sek-header-right {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .sek-role {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;

                    padding:
                        9px 13px;

                    border-radius: 999px;

                    background: #eff6ff;
                    border:
                        1px solid #dbeafe;

                    color: #1d4ed8;

                    font-size: 11px;
                    font-weight: 750;
                }

                .sek-role-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #2563eb;
                }

                .sek-logout-form {
                    margin: 0;
                }

                .sek-logout {
                    height: 40px;
                    padding: 0 13px;

                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;

                    border-radius: 10px;
                    border:
                        1px solid #fecaca;

                    background: #fff7f7;
                    color: #dc2626;

                    font-size: 11px;
                    font-weight: 750;

                    cursor: pointer;

                    transition: .18s ease;
                }

                .sek-logout:hover {
                    background: #fee2e2;
                    border-color: #fca5a5;
                }

                /* =====================================================
                   LAYOUT
                ===================================================== */

                .sek-layout {
                    display: flex;
                    min-height:
                        calc(100vh - 76px);
                }

                .sek-sidebar {
                    width: 248px;
                    flex-shrink: 0;

                    padding: 22px 15px;

                    background: #ffffff;
                    border-right:
                        1px solid #e4e9f0;
                }

                .sek-menu-label {
                    padding:
                        0 12px 10px;

                    color: #94a3b8;

                    font-size: 10px;
                    font-weight: 850;

                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                .sek-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .sek-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 10px;

                    padding:
                        11px 12px;

                    border-radius: 10px;

                    color: #526176;
                    text-decoration: none;

                    font-size: 13px;
                    font-weight: 650;

                    transition: .17s ease;
                }

                .sek-nav-link:hover {
                    background: #f8fafc;
                    color: #0f2747;
                }

                .sek-nav-link.active {
                    color: #ffffff;
                    background:
                        linear-gradient(
                            135deg,
                            #0f2747,
                            #174a7e
                        );

                    box-shadow:
                        0 8px 18px
                        rgba(15,39,71,.12);
                }

                .sek-sidebar-info {
                    margin-top: 22px;
                    padding: 15px;

                    border:
                        1px solid #e4e9f0;
                    border-radius: 13px;

                    background:
                        linear-gradient(
                            135deg,
                            #f8fafc,
                            #ffffff
                        );
                }

                .sek-sidebar-info-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    color: #0f2747;

                    font-size: 11px;
                    font-weight: 800;
                }

                .sek-sidebar-info-text {
                    margin-top: 8px;

                    color: #64748b;

                    font-size: 11px;
                    line-height: 1.65;
                }

                /* =====================================================
                   MAIN
                ===================================================== */

                .sek-content {
                    flex: 1;
                    min-width: 0;
                    padding: 28px;
                }

                .sek-container {
                    width: 100%;
                    max-width: 1450px;
                    margin: 0 auto;
                }

                /* =====================================================
                   HERO
                ===================================================== */

                .sek-hero {
                    position: relative;
                    overflow: hidden;

                    min-height: 190px;

                    padding:
                        30px 31px;

                    border-radius: 21px;

                    background:
                        linear-gradient(
                            135deg,
                            #0d2747 0%,
                            #174a7e 58%,
                            #24658e 100%
                        );

                    box-shadow:
                        0 18px 40px
                        rgba(15,39,71,.14);
                }

                .sek-hero-circle-a {
                    position: absolute;

                    width: 230px;
                    height: 230px;

                    top: -125px;
                    right: -80px;

                    border-radius: 50%;

                    background:
                        rgba(255,255,255,.055);
                }

                .sek-hero-circle-b {
                    position: absolute;

                    width: 125px;
                    height: 125px;

                    right: 140px;
                    bottom: -85px;

                    border-radius: 50%;

                    background:
                        rgba(125,211,252,.075);
                }

                .sek-hero-content {
                    position: relative;
                    z-index: 2;

                    max-width: 800px;
                }

                .sek-hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;

                    padding:
                        7px 11px;

                    border-radius: 999px;

                    background:
                        rgba(255,255,255,.10);

                    border:
                        1px solid
                        rgba(255,255,255,.12);

                    color: #e0ecff;

                    font-size: 10px;
                    font-weight: 800;
                }

                .sek-hero-title {
                    margin:
                        17px 0 0;

                    color: #ffffff;

                    font-size: 32px;
                    line-height: 1.15;

                    font-weight: 850;
                    letter-spacing: -.7px;
                }

                .sek-hero-date {
                    margin-top: 8px;

                    color: #c7dcf5;

                    font-size: 13px;
                }

                .sek-hero-text {
                    margin:
                        12px 0 0;

                    max-width: 700px;

                    color: #dceafa;

                    font-size: 13px;
                    line-height: 1.75;
                }

                .sek-hero-button {
                    position: absolute;
                    right: 30px;
                    bottom: 28px;

                    z-index: 3;

                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;

                    min-height: 43px;

                    padding:
                        0 16px;

                    border-radius: 10px;

                    background: #ffffff;
                    color: #0f2747;

                    text-decoration: none;

                    font-size: 11px;
                    font-weight: 800;

                    box-shadow:
                        0 8px 18px
                        rgba(0,0,0,.08);

                    transition: .17s ease;
                }

                .sek-hero-button:hover {
                    background: #eff6ff;
                    transform:
                        translateY(-1px);
                }

                /* =====================================================
                   STATISTICS
                ===================================================== */

                .sek-stats {
                    display: grid;

                    grid-template-columns:
                        repeat(
                            6,
                            minmax(0,1fr)
                        );

                    gap: 13px;

                    margin-top: 16px;
                }

                .sek-stat {
                    position: relative;
                    overflow: hidden;

                    min-height: 125px;

                    padding: 18px;

                    border:
                        1px solid #e2e8f0;
                    border-radius: 15px;

                    background: #ffffff;

                    box-shadow:
                        0 6px 19px
                        rgba(15,23,42,.025);
                }

                .sek-stat-top {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 10px;
                }

                .sek-stat-label {
                    color: #64748b;

                    font-size: 12px;
                    line-height: 1.4;

                    font-weight: 750;
                }

                .sek-stat-value {
                    margin-top: 9px;

                    font-size: 31px;
                    line-height: 1;

                    font-weight: 850;
                }

                .sek-stat-description {
                    margin-top: 8px;

                    color: #94a3b8;

                    font-size: 10px;
                    line-height: 1.45;
                }

                .sek-stat-icon {
                    width: 42px;
                    height: 42px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 11px;
                }

                /* =====================================================
                   PRIMARY GRID
                ===================================================== */

                .sek-primary-grid {
                    display: grid;

                    grid-template-columns:
                        minmax(0,1.32fr)
                        minmax(320px,.68fr);

                    gap: 16px;

                    margin-top: 16px;
                }

                .sek-panel {
                    overflow: hidden;

                    border:
                        1px solid #e2e8f0;
                    border-radius: 17px;

                    background: #ffffff;

                    box-shadow:
                        0 6px 20px
                        rgba(15,23,42,.025);
                }

                .sek-panel-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;

                    padding:
                        20px 21px;

                    border-bottom:
                        1px solid #edf1f5;
                }

                .sek-panel-title {
                    color: #0f2747;

                    font-size: 16px;
                    font-weight: 820;
                }

                .sek-panel-subtitle {
                    margin-top: 5px;

                    color: #94a3b8;

                    font-size: 11px;
                    line-height: 1.5;
                }

                .sek-panel-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;

                    color: #2563eb;

                    text-decoration: none;

                    font-size: 11px;
                    font-weight: 750;

                    white-space: nowrap;
                }

                .sek-panel-link:hover {
                    color: #1d4ed8;
                }

                /* =====================================================
                   SURAT TERBARU
                ===================================================== */

                .sek-surat-list {
                    padding:
                        12px 15px 15px;
                }

                .sek-surat-item {
                    display: flex;
                    align-items: center;
                    gap: 13px;

                    padding: 14px 13px;
                    margin-bottom: 8px;

                    border:
                        1px solid #edf2f7;
                    border-radius: 12px;

                    background: #fbfcfe;

                    text-decoration: none;
                    color: inherit;

                    transition: .17s ease;
                }

                .sek-surat-item:last-child {
                    margin-bottom: 0;
                }

                .sek-surat-item:hover {
                    background: #f8fbff;
                    border-color: #cfe0f6;
                    transform:
                        translateX(2px);
                }

                .sek-surat-icon {
                    width: 42px;
                    height: 42px;

                    flex-shrink: 0;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 11px;

                    background: #eff6ff;
                    color: #2563eb;
                }

                .sek-surat-main {
                    flex: 1;
                    min-width: 0;
                }

                .sek-surat-title {
                    color: #1e293b;

                    font-size: 13px;
                    font-weight: 800;

                    line-height: 1.45;

                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .sek-surat-meta {
                    margin-top: 5px;

                    color: #64748b;

                    font-size: 10px;
                    line-height: 1.45;

                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .sek-status {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;

                    padding:
                        6px 9px;

                    border-radius: 999px;

                    font-size: 9px;
                    font-weight: 800;

                    white-space: nowrap;
                }

                .sek-status.waiting {
                    background: #fff7ed;
                    border:
                        1px solid #fed7aa;
                    color: #c2410c;
                }

                .sek-status.processed {
                    background: #eff6ff;
                    border:
                        1px solid #dbeafe;
                    color: #1d4ed8;
                }

                .sek-status.done {
                    background: #f0fdf4;
                    border:
                        1px solid #bbf7d0;
                    color: #15803d;
                }

                .sek-status.default {
                    background: #f8fafc;
                    border:
                        1px solid #e2e8f0;
                    color: #64748b;
                }

                /* =====================================================
                   SUMMARY RIGHT
                ===================================================== */

                .sek-summary-body {
                    padding: 17px;
                }

                .sek-today-card {
                    padding: 16px;

                    border-radius: 13px;

                    background:
                        linear-gradient(
                            135deg,
                            #eff6ff,
                            #f8fbff
                        );

                    border:
                        1px solid #dbeafe;
                }

                .sek-today-heading {
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    color: #1d4ed8;

                    font-size: 11px;
                    font-weight: 850;
                }

                .sek-today-date {
                    margin-top: 8px;

                    color: #334155;

                    font-size: 13px;
                    font-weight: 800;
                    line-height: 1.55;
                }

                .sek-today-count {
                    margin-top: 5px;

                    color: #64748b;

                    font-size: 10px;
                }

                .sek-quick-grid {
                    display: grid;

                    grid-template-columns:
                        repeat(
                            2,
                            minmax(0,1fr)
                        );

                    gap: 9px;

                    margin-top: 10px;
                }

                .sek-quick-card {
                    padding: 13px;

                    border:
                        1px solid #e5e9ef;
                    border-radius: 11px;

                    background: #ffffff;
                }

                .sek-quick-label {
                    color: #94a3b8;
                    font-size: 10px;
                }

                .sek-quick-value {
                    margin-top: 5px;

                    font-size: 23px;
                    font-weight: 850;
                }

                .sek-alert {
                    margin-top: 10px;

                    padding: 13px;

                    border-radius: 11px;

                    background: #fff7ed;

                    border:
                        1px solid #fed7aa;
                }

                .sek-alert-title {
                    display: flex;
                    align-items: center;
                    gap: 7px;

                    color: #c2410c;

                    font-size: 10px;
                    font-weight: 850;
                }

                .sek-alert-text {
                    margin-top: 5px;

                    color: #9a3412;

                    font-size: 10px;
                    line-height: 1.6;
                }

                .sek-shortcuts {
                    display: grid;
                    gap: 7px;

                    margin-top: 10px;
                }

                .sek-shortcut {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    padding:
                        11px 12px;

                    border-radius: 10px;

                    background: #f8fafc;
                    border:
                        1px solid #e5e9ef;

                    color: #475569;

                    text-decoration: none;

                    font-size: 10px;
                    font-weight: 750;

                    transition: .16s ease;
                }

                .sek-shortcut-left {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                }

                .sek-shortcut:hover {
                    background: #eff6ff;
                    border-color: #dbeafe;
                    color: #1d4ed8;
                }

                /* =====================================================
                   AGENDA HARI INI
                ===================================================== */

                .sek-agenda-panel {
                    margin-top: 16px;
                }

                .sek-agenda-list {
                    padding:
                        8px 21px 15px;
                }

                .sek-agenda-item {
                    display: grid;

                    grid-template-columns:
                        86px
                        minmax(0,1fr)
                        24px;

                    gap: 13px;

                    align-items: center;

                    padding: 15px 0;

                    color: inherit;
                    text-decoration: none;

                    transition: .15s ease;
                }

                .sek-agenda-item:not(:last-child) {
                    border-bottom:
                        1px solid #f0f3f7;
                }

                .sek-agenda-item:hover
                    .sek-agenda-main {
                    transform:
                        translateX(2px);
                }

                .sek-agenda-time {
                    padding:
                        10px 7px;

                    text-align: center;

                    border-radius: 10px;

                    background: #eff6ff;

                    border:
                        1px solid #dbeafe;
                }

                .sek-agenda-time-main {
                    color: #1d4ed8;

                    font-size: 15px;
                    font-weight: 850;
                }

                .sek-agenda-time-zone {
                    margin-top: 4px;

                    color: #94a3b8;

                    font-size: 9px;
                    font-weight: 700;
                }

                .sek-agenda-main {
                    min-width: 0;

                    transition:
                        transform .15s ease;
                }

                .sek-agenda-title {
                    color: #1e293b;

                    font-size: 13px;
                    font-weight: 800;

                    line-height: 1.5;
                }

                .sek-agenda-meta {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 6px;

                    margin-top: 6px;

                    color: #64748b;

                    font-size: 10px;
                }

                .sek-agenda-source {
                    margin-top: 6px;

                    color: #94a3b8;

                    font-size: 9px;
                }

                .sek-agenda-source.surat {
                    color: #2563eb;
                }

                .sek-agenda-arrow {
                    color: #a0a9b8;
                }

                .sek-agenda-item:hover
                    .sek-agenda-arrow {
                    color: #2563eb;
                }

                /* =====================================================
                   MONITORING
                ===================================================== */

                .sek-monitoring-panel {
                    margin-top: 16px;
                }

                .sek-monitoring-list {
                    padding:
                        11px 15px 15px;
                }

                .sek-monitoring-item {
                    display: block;

                    padding: 15px;

                    margin-bottom: 9px;

                    border:
                        1px solid #edf1f5;
                    border-radius: 12px;

                    background: #fbfcfe;

                    text-decoration: none;
                    color: inherit;

                    transition: .16s ease;
                }

                .sek-monitoring-item:last-child {
                    margin-bottom: 0;
                }

                .sek-monitoring-item:hover {
                    background: #f8fbff;
                    border-color: #cfe0f6;
                }

                .sek-monitoring-top {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;

                    gap: 18px;
                }

                .sek-monitoring-title {
                    color: #0f2747;

                    font-size: 12px;
                    font-weight: 820;

                    line-height: 1.55;
                }

                .sek-monitoring-meta {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;

                    gap: 7px;

                    margin-top: 8px;
                }

                .sek-monitoring-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;

                    padding:
                        5px 8px;

                    border-radius: 7px;

                    background: #f8fafc;
                    border:
                        1px solid #e1e7ee;

                    color: #64748b;

                    font-size: 9px;
                    font-weight: 700;
                }

                .sek-monitoring-status {
                    flex-shrink: 0;

                    padding:
                        6px 9px;

                    border-radius: 999px;

                    font-size: 9px;
                    font-weight: 800;

                    white-space: nowrap;
                }

                .sek-monitoring-status.sent {
                    background: #eff6ff;
                    border:
                        1px solid #dbeafe;
                    color: #1d4ed8;
                }

                .sek-monitoring-status.progress {
                    background: #fff7ed;
                    border:
                        1px solid #fed7aa;
                    color: #c2410c;
                }

                .sek-monitoring-status.done {
                    background: #f0fdf4;
                    border:
                        1px solid #bbf7d0;
                    color: #15803d;
                }

                .sek-monitoring-status.default {
                    background: #f8fafc;
                    border:
                        1px solid #e2e8f0;
                    color: #64748b;
                }

                .sek-deadline {
                    margin-top: 9px;

                    color: #64748b;

                    font-size: 10px;
                }

                .sek-late {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;

                    margin-top: 8px;

                    padding:
                        5px 8px;

                    border-radius: 999px;

                    background: #fef2f2;
                    border:
                        1px solid #fecaca;

                    color: #dc2626;

                    font-size: 9px;
                    font-weight: 850;
                }

                .sek-note {
                    margin-top: 9px;

                    padding: 11px 12px;

                    border-radius: 9px;

                    background: #f0fdf4;
                    border:
                        1px solid #dcfce7;

                    color: #166534;

                    font-size: 10px;
                    line-height: 1.6;
                }

                .sek-empty {
                    padding:
                        48px 20px;

                    text-align: center;

                    color: #94a3b8;

                    font-size: 12px;
                }

                /* =====================================================
                   FOOTER
                ===================================================== */

                .sek-footer {
                    padding:
                        28px 0 8px;

                    text-align: center;

                    color: #94a3b8;

                    font-size: 10px;
                }

                /* =====================================================
                   RESPONSIVE
                ===================================================== */

                @media (max-width: 1400px) {

                    .sek-stats {
                        grid-template-columns:
                            repeat(
                                3,
                                minmax(0,1fr)
                            );
                    }

                }

                @media (max-width: 1120px) {

                    .sek-primary-grid {
                        grid-template-columns:
                            1fr;
                    }

                }

                @media (max-width: 850px) {

                    .sek-sidebar {
                        display: none;
                    }

                    .sek-content {
                        padding:
                            21px 17px 38px;
                    }

                    .sek-hero {
                        min-height: auto;
                    }

                    .sek-hero-button {
                        position: static;
                        margin-top: 17px;
                    }

                }

                @media (max-width: 650px) {

                    .sek-header {
                        padding: 0 15px;
                    }

                    .sek-brand-subtitle,
                    .sek-role {
                        display: none;
                    }

                    .sek-logout {
                        width: 40px;
                        padding: 0;
                    }

                    .sek-logout-text {
                        display: none;
                    }

                    .sek-stats {
                        grid-template-columns:
                            repeat(
                                2,
                                minmax(0,1fr)
                            );
                    }

                    .sek-hero-title {
                        font-size: 25px;
                    }

                    .sek-hero-text {
                        font-size: 12px;
                    }

                    .sek-agenda-item {
                        grid-template-columns:
                            72px
                            minmax(0,1fr)
                            18px;
                    }

                    .sek-monitoring-top {
                        flex-direction: column;
                    }

                }

                @media (max-width: 450px) {

                    .sek-stats {
                        grid-template-columns: 1fr;
                    }

                    .sek-panel-header {
                        padding:
                            17px 16px;
                    }

                    .sek-surat-item {
                        align-items: flex-start;
                    }

                    .sek-status {
                        display: none;
                    }

                    .sek-agenda-item {
                        grid-template-columns:
                            64px
                            minmax(0,1fr);
                    }

                    .sek-agenda-arrow {
                        display: none;
                    }

                }

            `}</style>


            <div className="sek-page">

                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="sek-header">

                    <a
                        href="/sekretaris/dashboard"
                        className="sek-brand"
                    >

                        <div className="sek-logo">

                            <img
                                src="/images/poltekkes-icon.png"
                                alt="Logo Poltekkes Maluku"
                            />

                        </div>

                        <div>

                            <div className="sek-brand-title">
                                SIMAP
                            </div>

                            <div className="sek-brand-subtitle">
                                Poltekkes Maluku
                            </div>

                        </div>

                    </a>


                    <div className="sek-header-right">

                        <div className="sek-role">

                            <span className="sek-role-dot" />

                            Sekretaris Direktur

                        </div>


                        <form
                            method="POST"
                            action="/logout"
                            className="sek-logout-form"
                        >

                            <input
                                type="hidden"
                                name="_token"
                                value={csrfToken}
                            />

                            <button
                                type="submit"
                                className="sek-logout"
                                title="Keluar dari SIMAP"
                            >

                                <Icon
                                    name="logout"
                                    size={16}
                                />

                                <span>
                                    Logout
                                </span>

                            </button>

                        </form>

                    </div>

                </header>


                <div className="sek-layout">

                    {/* =================================================
                        SIDEBAR
                    ================================================= */}

                    <aside className="sek-sidebar">

                        <div className="sek-menu-label">
                            Menu Utama
                        </div>

                        <nav className="sek-nav">

                            <a
                                href="/sekretaris/dashboard"
                                className="sek-nav-link active"
                            >

                                <Icon
                                    name="home"
                                    size={18}
                                />

                                Dashboard

                            </a>


                            <a
                                href="/sekretaris/surat-masuk"
                                className="sek-nav-link"
                            >

                                <Icon
                                    name="mail"
                                    size={18}
                                />

                                Surat Masuk

                            </a>


                            <a
                                href="/sekretaris/disposisi"
                                className="sek-nav-link"
                            >

                                <Icon
                                    name="send"
                                    size={18}
                                />

                                Disposisi

                            </a>


                            <a
                                href="/sekretaris/agenda"
                                className="sek-nav-link"
                            >

                                <Icon
                                    name="calendar"
                                    size={18}
                                />

                                Agenda Direktur

                            </a>

                        </nav>


                        <div
                            className="sek-menu-label"
                            style={{
                                marginTop:
                                    '27px',
                            }}
                        >
                            Informasi
                        </div>


                        <div className="sek-sidebar-info">

                            <div className="sek-sidebar-info-title">

                                <Icon
                                    name="calendar"
                                    size={16}
                                />

                                Administrasi Direktur

                            </div>

                            <div className="sek-sidebar-info-text">

                                Kelola surat masuk,
                                disposisi, agenda,
                                dan tindak lanjut
                                Direktur dari satu
                                dashboard.

                            </div>

                        </div>

                    </aside>


                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <main className="sek-content">

                        <div className="sek-container">

                            {/* =================================================
                                HERO
                            ================================================= */}

                            <section className="sek-hero">

                                <div className="sek-hero-circle-a" />
                                <div className="sek-hero-circle-b" />

                                <div className="sek-hero-content">

                                    <div className="sek-hero-badge">

                                        <Icon
                                            name="home"
                                            size={13}
                                        />

                                        Dashboard Sekretaris Direktur

                                    </div>

                                    <h1 className="sek-hero-title">
                                        Selamat datang, {userName}
                                    </h1>

                                    <div className="sek-hero-date">
                                        {todayLabel} · WIT
                                    </div>

                                    <p className="sek-hero-text">
                                        Pantau surat masuk,
                                        disposisi, agenda,
                                        dan tindak lanjut
                                        Direktur dari satu
                                        tempat.
                                    </p>

                                </div>


                                <a
                                    href="/sekretaris/surat-masuk/create"
                                    className="sek-hero-button"
                                >

                                    <Icon
                                        name="plus"
                                        size={15}
                                    />

                                    Input Surat Masuk

                                </a>

                            </section>


                            {/* =================================================
                                STATISTICS
                            ================================================= */}

                            <section className="sek-stats">

                                {statsCards.map(
                                    (item) => {

                                        const tone = {
                                            blue: {
                                                color:
                                                    '#2563eb',
                                                bg:
                                                    '#eff6ff',
                                            },

                                            orange: {
                                                color:
                                                    '#ea580c',
                                                bg:
                                                    '#fff7ed',
                                            },

                                            amber: {
                                                color:
                                                    '#c2410c',
                                                bg:
                                                    '#fff7ed',
                                            },

                                            green: {
                                                color:
                                                    '#16a34a',
                                                bg:
                                                    '#f0fdf4',
                                            },

                                            indigo: {
                                                color:
                                                    '#4f46e5',
                                                bg:
                                                    '#eef2ff',
                                            },

                                            purple: {
                                                color:
                                                    '#7c3aed',
                                                bg:
                                                    '#f5f3ff',
                                            },
                                        }[
                                            item.tone
                                        ];

                                        return (
                                            <div
                                                key={
                                                    item.key
                                                }
                                                className="sek-stat"
                                            >

                                                <div className="sek-stat-top">

                                                    <div>

                                                        <div className="sek-stat-label">
                                                            {
                                                                item.label
                                                            }
                                                        </div>

                                                        <div
                                                            className="sek-stat-value"
                                                            style={{
                                                                color:
                                                                    tone.color,
                                                            }}
                                                        >
                                                            {
                                                                item.value
                                                            }
                                                        </div>

                                                        <div className="sek-stat-description">
                                                            {
                                                                item.description
                                                            }
                                                        </div>

                                                    </div>


                                                    <div
                                                        className="sek-stat-icon"
                                                        style={{
                                                            background:
                                                                tone.bg,

                                                            color:
                                                                tone.color,
                                                        }}
                                                    >

                                                        <Icon
                                                            name={
                                                                item.icon
                                                            }
                                                            size={
                                                                19
                                                            }
                                                        />

                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </section>


                            {/* =================================================
                                PRIMARY GRID
                            ================================================= */}

                            <div className="sek-primary-grid">

                                {/* =================================================
                                    SURAT TERBARU
                                ================================================= */}

                                <section className="sek-panel">

                                    <div className="sek-panel-header">

                                        <div>

                                            <div className="sek-panel-title">
                                                Surat Terbaru
                                            </div>

                                            <div className="sek-panel-subtitle">
                                                Surat masuk yang
                                                baru dicatat
                                                dalam sistem.
                                            </div>

                                        </div>


                                        <a
                                            href="/sekretaris/surat-masuk"
                                            className="sek-panel-link"
                                        >

                                            Lihat semua

                                            <Icon
                                                name="arrow"
                                                size={12}
                                            />

                                        </a>

                                    </div>


                                    {safeSurat.length === 0 ? (

                                        <div className="sek-empty">
                                            Belum ada surat masuk.
                                        </div>

                                    ) : (

                                        <div className="sek-surat-list">

                                            {safeSurat
                                                .slice(0, 7)
                                                .map(
                                                    (surat) => {

                                                        const status =
                                                            getSuratStatus(
                                                                surat.status
                                                            );

                                                        return (
                                                            <a
                                                                key={
                                                                    surat.id
                                                                }
                                                                href={`/sekretaris/surat-masuk/${surat.id}`}
                                                                className="sek-surat-item"
                                                            >

                                                                <div className="sek-surat-icon">

                                                                    <Icon
                                                                        name="mail"
                                                                        size={19}
                                                                    />

                                                                </div>


                                                                <div className="sek-surat-main">

                                                                    <div className="sek-surat-title">

                                                                        {
                                                                            surat.perihal ||
                                                                            'Tanpa perihal'
                                                                        }

                                                                    </div>

                                                                    <div className="sek-surat-meta">

                                                                        {
                                                                            surat.nomor_surat ||
                                                                            '-'
                                                                        }

                                                                        {' • '}

                                                                        {
                                                                            surat.pengirim ||
                                                                            '-'
                                                                        }

                                                                        {' • '}

                                                                        {
                                                                            formatDate(
                                                                                surat.tanggal_diterima
                                                                            )
                                                                        }

                                                                    </div>

                                                                </div>


                                                                <span
                                                                    className={`sek-status ${status.className}`}
                                                                >
                                                                    {
                                                                        status.text
                                                                    }
                                                                </span>

                                                            </a>
                                                        );
                                                    }
                                                )}

                                        </div>

                                    )}

                                </section>


                                {/* =================================================
                                    RINGKASAN
                                ================================================= */}

                                <section className="sek-panel">

                                    <div className="sek-panel-header">

                                        <div>

                                            <div className="sek-panel-title">
                                                Ringkasan Hari Ini
                                            </div>

                                            <div className="sek-panel-subtitle">
                                                Kondisi administrasi
                                                dan pekerjaan hari ini.
                                            </div>

                                        </div>

                                    </div>


                                    <div className="sek-summary-body">

                                        <div className="sek-today-card">

                                            <div className="sek-today-heading">

                                                <Icon
                                                    name="calendar"
                                                    size={16}
                                                />

                                                Hari Ini

                                            </div>


                                            <div className="sek-today-date">
                                                {todayLabel}
                                            </div>


                                            <div className="sek-today-count">
                                                {agendaHariIniCount}
                                                {' '}
                                                agenda Direktur
                                                hari ini
                                            </div>

                                        </div>


                                        <div className="sek-quick-grid">

                                            <div className="sek-quick-card">

                                                <div className="sek-quick-label">
                                                    Menunggu
                                                </div>

                                                <div
                                                    className="sek-quick-value"
                                                    style={{
                                                        color:
                                                            '#ea580c',
                                                    }}
                                                >
                                                    {
                                                        Number(
                                                            safeStats.suratMenunggu ??
                                                                0
                                                        )
                                                    }
                                                </div>

                                            </div>


                                            <div className="sek-quick-card">

                                                <div className="sek-quick-label">
                                                    Terlambat
                                                </div>

                                                <div
                                                    className="sek-quick-value"
                                                    style={{
                                                        color:
                                                            totalTerlambat >
                                                            0
                                                                ? '#dc2626'
                                                                : '#16a34a',
                                                    }}
                                                >
                                                    {
                                                        totalTerlambat
                                                    }
                                                </div>

                                            </div>

                                        </div>


                                        {totalTerlambat > 0 && (

                                            <div className="sek-alert">

                                                <div className="sek-alert-title">

                                                    <Icon
                                                        name="alert"
                                                        size={14}
                                                    />

                                                    Perlu Perhatian

                                                </div>

                                                <div className="sek-alert-text">

                                                    Ada {
                                                        totalTerlambat
                                                    } disposisi
                                                    yang telah
                                                    melewati batas
                                                    waktu.

                                                </div>

                                            </div>

                                        )}


                                        <div className="sek-shortcuts">

                                            <a
                                                href="/sekretaris/surat-masuk/create"
                                                className="sek-shortcut"
                                            >

                                                <span className="sek-shortcut-left">

                                                    <Icon
                                                        name="plus"
                                                        size={13}
                                                    />

                                                    Input Surat Masuk

                                                </span>

                                                <Icon
                                                    name="chevronRight"
                                                    size={14}
                                                />

                                            </a>


                                            <a
                                                href="/sekretaris/disposisi"
                                                className="sek-shortcut"
                                            >

                                                <span className="sek-shortcut-left">

                                                    <Icon
                                                        name="send"
                                                        size={13}
                                                    />

                                                    Monitoring Disposisi

                                                </span>

                                                <Icon
                                                    name="chevronRight"
                                                    size={14}
                                                />

                                            </a>


                                            <a
                                                href="/sekretaris/agenda"
                                                className="sek-shortcut"
                                            >

                                                <span className="sek-shortcut-left">

                                                    <Icon
                                                        name="calendar"
                                                        size={13}
                                                    />

                                                    Agenda Direktur

                                                </span>

                                                <Icon
                                                    name="chevronRight"
                                                    size={14}
                                                />

                                            </a>

                                        </div>

                                    </div>

                                </section>

                            </div>


                            {/* =================================================
                                AGENDA HARI INI
                            ================================================= */}

                            <section className="sek-panel sek-agenda-panel">

                                <div className="sek-panel-header">

                                    <div>

                                        <div className="sek-panel-title">
                                            Agenda Hari Ini
                                        </div>

                                        <div className="sek-panel-subtitle">
                                            Jadwal Direktur
                                            yang berlangsung
                                            hari ini.
                                        </div>

                                    </div>


                                    <a
                                        href="/sekretaris/agenda"
                                        className="sek-panel-link"
                                    >

                                        Lihat agenda

                                        <Icon
                                            name="arrow"
                                            size={12}
                                        />

                                    </a>

                                </div>


                                {agendaHariIni.length === 0 ? (

                                    <div className="sek-empty">
                                        Belum ada agenda hari ini.
                                    </div>

                                ) : (

                                    <div className="sek-agenda-list">

                                        {agendaHariIni
                                            .slice(0, 10)
                                            .map(
                                                (
                                                    agenda
                                                ) => {

                                                    const hasSource =
                                                        Boolean(
                                                            agenda
                                                                ?.surat_masuk
                                                                ?.nomor_surat
                                                        );

                                                    return (
                                                        <a
                                                            key={
                                                                agenda.id
                                                            }
                                                            href={`/sekretaris/agenda/${agenda.id}`}
                                                            className="sek-agenda-item"
                                                        >

                                                            <div className="sek-agenda-time">

                                                                <div className="sek-agenda-time-main">
                                                                    {
                                                                        formatTime(
                                                                            agenda.waktu_mulai
                                                                        )
                                                                    }
                                                                </div>

                                                                <div className="sek-agenda-time-zone">
                                                                    WIT
                                                                </div>

                                                            </div>


                                                            <div className="sek-agenda-main">

                                                                <div className="sek-agenda-title">
                                                                    {
                                                                        agenda.judul ||
                                                                        'Tanpa judul'
                                                                    }
                                                                </div>


                                                                <div className="sek-agenda-meta">

                                                                    <Icon
                                                                        name="calendar"
                                                                        size={12}
                                                                    />

                                                                    {
                                                                        agenda.jenis ||
                                                                        'Agenda'
                                                                    }

                                                                    <span>
                                                                        •
                                                                    </span>

                                                                    {
                                                                        agenda.lokasi ||
                                                                        'Lokasi belum ditentukan'
                                                                    }

                                                                </div>


                                                                <div
                                                                    className={`sek-agenda-source ${
                                                                        hasSource
                                                                            ? 'surat'
                                                                            : ''
                                                                    }`}
                                                                >

                                                                    {hasSource
                                                                        ? `Surat ${agenda.surat_masuk.nomor_surat}`
                                                                        : 'Agenda manual'}

                                                                </div>

                                                            </div>


                                                            <div className="sek-agenda-arrow">

                                                                <Icon
                                                                    name="arrowUpRight"
                                                                    size={15}
                                                                />

                                                            </div>

                                                        </a>
                                                    );
                                                }
                                            )}

                                    </div>

                                )}

                            </section>


                            {/* =================================================
                                MONITORING
                            ================================================= */}

                            <section className="sek-panel sek-monitoring-panel">

                                <div className="sek-panel-header">

                                    <div>

                                        <div className="sek-panel-title">
                                            Monitoring Disposisi
                                        </div>

                                        <div className="sek-panel-subtitle">
                                            Pantau progres dan hasil
                                            tindak lanjut unit.
                                        </div>

                                    </div>


                                    <a
                                        href="/sekretaris/disposisi"
                                        className="sek-panel-link"
                                    >

                                        Lihat semua

                                        <Icon
                                            name="arrow"
                                            size={12}
                                        />

                                    </a>

                                </div>


                                {safeDisposisi.length === 0 ? (

                                    <div className="sek-empty">
                                        Belum ada disposisi.
                                    </div>

                                ) : (

                                    <div className="sek-monitoring-list">

                                        {safeDisposisi
                                            .slice(0, 10)
                                            .map(
                                                (
                                                    item
                                                ) => {

                                                    const status =
                                                        getDisposisiStatus(
                                                            item.status
                                                        );

                                                    const terlambat =
                                                        isTerlambat(
                                                            item
                                                        );

                                                    return (
                                                        <a
                                                            key={
                                                                item.id
                                                            }
                                                            href={`/sekretaris/disposisi/${item.id}/detail`}
                                                            className="sek-monitoring-item"
                                                        >

                                                            <div className="sek-monitoring-top">

                                                                <div
                                                                    style={{
                                                                        minWidth:
                                                                            0,
                                                                    }}
                                                                >

                                                                    <div className="sek-monitoring-title">

                                                                        {
                                                                            item
                                                                                .surat_masuk
                                                                                ?.perihal ||
                                                                            'Tanpa perihal'
                                                                        }

                                                                    </div>


                                                                    <div className="sek-monitoring-meta">

                                                                        <span className="sek-monitoring-chip">

                                                                            <Icon
                                                                                name="building"
                                                                                size={11}
                                                                            />

                                                                            {
                                                                                getDisposisiTujuan(
                                                                                    item
                                                                                )
                                                                            }

                                                                        </span>


                                                                        {item.sifat && (

                                                                            <span className="sek-monitoring-chip">

                                                                                Sifat:
                                                                                {' '}

                                                                                {
                                                                                    item.sifat
                                                                                }

                                                                            </span>

                                                                        )}


                                                                        {item.tanggal_disposisi && (

                                                                            <span className="sek-monitoring-chip">

                                                                                <Icon
                                                                                    name="clock"
                                                                                    size={11}
                                                                                />

                                                                                {
                                                                                    formatDateTime(
                                                                                        item.tanggal_disposisi
                                                                                    )
                                                                                }

                                                                            </span>

                                                                        )}

                                                                    </div>

                                                                </div>


                                                                <span
                                                                    className={`sek-monitoring-status ${status.className}`}
                                                                >
                                                                    {
                                                                        status.text
                                                                    }
                                                                </span>

                                                            </div>


                                                            {item.batas_waktu && (

                                                                <div className="sek-deadline">

                                                                    Batas waktu:
                                                                    {' '}

                                                                    <strong>
                                                                        {
                                                                            formatDate(
                                                                                item.batas_waktu
                                                                            )
                                                                        }
                                                                    </strong>

                                                                </div>

                                                            )}


                                                            {terlambat && (

                                                                <div className="sek-late">

                                                                    <Icon
                                                                        name="alert"
                                                                        size={11}
                                                                    />

                                                                    Terlambat

                                                                </div>

                                                            )}


                                                            {item.catatan_tindak_lanjut && (

                                                                <div className="sek-note">

                                                                    <div
                                                                        style={{
                                                                            display:
                                                                                'flex',
                                                                            alignItems:
                                                                                'center',
                                                                            gap:
                                                                                '6px',
                                                                            marginBottom:
                                                                                '4px',
                                                                            fontWeight:
                                                                                850,
                                                                        }}
                                                                    >

                                                                        <Icon
                                                                            name="note"
                                                                            size={11}
                                                                        />

                                                                        Catatan Tindak Lanjut

                                                                    </div>

                                                                    {
                                                                        item.catatan_tindak_lanjut
                                                                    }

                                                                </div>

                                                            )}

                                                        </a>
                                                    );
                                                }
                                            )}

                                    </div>

                                )}

                            </section>


                            {/* =================================================
                                FOOTER
                            ================================================= */}

                            <div className="sek-footer">
                                SIMAP Poltekkes Maluku
                            </div>

                        </div>

                    </main>

                </div>

            </div>
        </>
    );
}