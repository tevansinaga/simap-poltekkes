import React from 'react';

export default function AgendaDetail({ agenda = null }) {
    const data = agenda || null;

    const isDirectorPage =
        window.location.pathname.startsWith('/direktur');

    // =====================================================
    // CSRF
    // =====================================================

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '';

    // =====================================================
    // SURAT
    // =====================================================

    const surat =
        data?.surat_masuk ||
        null;

    // =====================================================
    // URL KEMBALI
    // =====================================================

    const backUrl = isDirectorPage
        ? '/direktur/agenda'
        : '/sekretaris/agenda';

    const backLabel = isDirectorPage
        ? 'Agenda Direktur'
        : 'Agenda Sekretaris';

    // =====================================================
    // URL PDF
    // =====================================================

    const pdfUrl = surat?.file_surat
        ? `/storage/${String(
              surat.file_surat
          ).replace(/^\/+/, '')}`
        : null;

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
                    <rect x="3" y="4.5" width="18" height="16" rx="2" />
                    <path d="M16 2.5v4M8 2.5v4M3 9h18" />
                </>
            ),

            clock: (
                <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                </>
            ),

            location: (
                <>
                    <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
                    <circle cx="12" cy="9" r="2.2" />
                </>
            ),

            file: (
                <>
                    <path d="M14 2.5H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5Z" />
                    <path d="M14 2.5v6h6" />
                    <path d="M8 13h8M8 17h5" />
                </>
            ),

            pdf: (
                <>
                    <path d="M14 2.5H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5Z" />
                    <path d="M14 2.5v6h6" />
                    <path d="M7.5 17.5h1.7c1.1 0 1.8-.6 1.8-1.6 0-1-.7-1.6-1.8-1.6H7.5v4.2" />
                    <path d="M12.5 14.3v4.2h1.2c1.4 0 2.2-.8 2.2-2.1 0-1.3-.8-2.1-2.2-2.1h-1.2Z" />
                </>
            ),

            arrowLeft: (
                <>
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                </>
            ),

            arrowRight: (
                <>
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                </>
            ),

            external: (
                <>
                    <path d="M14 5h5v5" />
                    <path d="M19 5l-8 8" />
                    <path d="M19 13v4.5A1.5 1.5 0 0 1 17.5 19h-11A1.5 1.5 0 0 1 5 17.5v-11A1.5 1.5 0 0 1 6.5 5H11" />
                </>
            ),

            edit: (
                <>
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                </>
            ),

            logout: (
                <>
                    <path d="M9 5H5.5A1.5 1.5 0 0 0 4 6.5v11A1.5 1.5 0 0 0 5.5 19H9" />
                    <path d="M15 8l4 4-4 4" />
                    <path d="M19 12H9" />
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
    // TANGGAL
    // =====================================================

    const getDateKey = (value) => {
        if (!value) {
            return '';
        }

        const text =
            String(value).trim();

        const match =
            text.match(
                /^(\d{4}-\d{2}-\d{2})/
            );

        if (match) {
            return match[1];
        }

        const parsed =
            new Date(text);

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
                timeZone:
                    'Asia/Jayapura',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }
        ).format(parsed);
    };

    const formatDate = (value) => {
        const dateKey =
            getDateKey(value);

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

        return `${String(day).padStart(2, '0')} ${months[month - 1]} ${year}`;
    };

    // =====================================================
    // WAKTU
    // =====================================================

    const formatTime = (value) => {
        if (!value) {
            return '--:--';
        }

        const text =
            String(value);

        if (
            /^\d{2}:\d{2}:\d{2}$/.test(
                text
            )
        ) {
            return text.slice(0, 5);
        }

        return text;
    };

    // =====================================================
    // STYLE JENIS
    // =====================================================

    const getJenisStyle = (jenis) => {
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
    // LINKIFY TEXT
    // =====================================================

    const renderTextWithLinks = (text) => {
        if (!text) {
            return (
                <span className="detail-muted">
                    Tidak ada keterangan.
                </span>
            );
        }

        const parts = String(text).split(
            /(https?:\/\/[^\s]+)/gi
        );

        return parts.map(
            (part, index) => {

                if (
                    /^https?:\/\//i.test(
                        part
                    )
                ) {
                    const cleanUrl =
                        part.replace(
                            /[),.;!?]+$/,
                            ''
                        );

                    return (
                        <React.Fragment
                            key={index}
                        >

                            <a
                                href={cleanUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="detail-inline-link"
                            >
                                {cleanUrl}
                            </a>

                            {part.slice(
                                cleanUrl.length
                            )}

                        </React.Fragment>
                    );
                }

                return (
                    <React.Fragment
                        key={index}
                    >
                        {part}
                    </React.Fragment>
                );
            }
        );
    };

    // =====================================================
    // EMPTY
    // =====================================================

    if (!data) {
        return (
            <>
                <style>{`
                    .detail-empty-page {
                        min-height:100vh;
                        background:#f4f7fb;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        padding:30px;
                        font-family:Inter,system-ui,sans-serif;
                    }

                    .detail-empty-card {
                        width:100%;
                        max-width:440px;
                        background:#ffffff;
                        border:1px solid #e2e8f0;
                        border-radius:18px;
                        padding:34px;
                        text-align:center;
                    }

                    .detail-empty-title {
                        font-size:20px;
                        font-weight:800;
                        color:#0f2747;
                    }

                    .detail-empty-text {
                        margin-top:8px;
                        color:#64748b;
                        font-size:13px;
                        line-height:1.6;
                    }

                    .detail-empty-button {
                        margin-top:20px;
                        display:inline-flex;
                        align-items:center;
                        gap:7px;
                        padding:11px 15px;
                        border-radius:9px;
                        background:#0f2747;
                        color:#ffffff;
                        text-decoration:none;
                        font-size:11px;
                        font-weight:700;
                    }
                `}</style>

                <div className="detail-empty-page">

                    <div className="detail-empty-card">

                        <div className="detail-empty-title">
                            Agenda tidak ditemukan
                        </div>

                        <div className="detail-empty-text">
                            Data agenda tidak tersedia
                            atau sudah tidak ditemukan.
                        </div>

                        <a
                            href={backUrl}
                            className="detail-empty-button"
                        >
                            <Icon
                                name="arrowLeft"
                                size={14}
                            />
                            Kembali
                        </a>

                    </div>

                </div>
            </>
        );
    }

    return (
        <>
            <style>{`

                * {
                    box-sizing:border-box;
                }

                .detail-page {
                    min-height:100vh;
                    background:#f4f7fb;
                    color:#0f172a;
                    font-family:
                        Inter,
                        ui-sans-serif,
                        system-ui,
                        sans-serif;
                }

                /* ==========================================
                   HEADER
                ========================================== */

                .detail-header {
                    height:76px;
                    background:#ffffff;
                    border-bottom:1px solid #e2e8f0;
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    padding:0 28px;
                    position:sticky;
                    top:0;
                    z-index:30;
                }

                .detail-brand {
                    display:flex;
                    align-items:center;
                    gap:11px;
                    text-decoration:none;
                }

                .detail-logo {
                    width:44px;
                    height:44px;
                    border-radius:11px;
                    background:#ffffff;
                    border:1px solid #e2e8f0;
                    padding:5px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    overflow:hidden;
                }

                .detail-logo img {
                    width:100%;
                    height:100%;
                    object-fit:contain;
                }

                .detail-brand-title {
                    font-size:18px;
                    font-weight:850;
                    color:#0f2747;
                }

                .detail-brand-subtitle {
                    margin-top:5px;
                    color:#64748b;
                    font-size:10px;
                }

                .detail-header-right {
                    display:flex;
                    align-items:center;
                    gap:10px;
                }

                .detail-role {
                    padding:8px 12px;
                    border-radius:999px;
                    background:#eff6ff;
                    border:1px solid #dbeafe;
                    color:#1d4ed8;
                    font-size:10px;
                    font-weight:700;
                }

                .detail-logout-form {
                    margin:0;
                }

                .detail-logout {
                    display:inline-flex;
                    align-items:center;
                    justify-content:center;
                    gap:7px;
                    height:38px;
                    padding:0 12px;
                    border:1px solid #fecaca;
                    border-radius:9px;
                    background:#ffffff;
                    color:#dc2626;
                    font-size:10px;
                    font-weight:700;
                    cursor:pointer;
                }

                .detail-logout:hover {
                    background:#fef2f2;
                }

                /* ==========================================
                   MAIN
                ========================================== */

                .detail-main {
                    max-width:1160px;
                    margin:0 auto;
                    padding:28px 26px 42px;
                }

                .detail-breadcrumb {
                    display:flex;
                    align-items:center;
                    gap:8px;
                    margin-bottom:10px;
                    color:#94a3b8;
                    font-size:11px;
                }

                .detail-breadcrumb a {
                    color:#64748b;
                    text-decoration:none;
                }

                .detail-breadcrumb a:hover {
                    color:#2563eb;
                }

                .detail-heading {
                    display:flex;
                    align-items:flex-start;
                    justify-content:space-between;
                    gap:18px;
                    margin-bottom:20px;
                }

                .detail-kicker {
                    font-size:11px;
                    color:#64748b;
                    margin-bottom:5px;
                }

                .detail-title {
                    margin:0;
                    color:#0f2747;
                    font-size:30px;
                    line-height:1.2;
                    font-weight:800;
                }

                .detail-title-description {
                    margin:8px 0 0;
                    color:#64748b;
                    font-size:12px;
                }

                .detail-back {
                    flex-shrink:0;
                    display:inline-flex;
                    align-items:center;
                    gap:7px;
                    min-height:38px;
                    padding:0 12px;
                    border-radius:9px;
                    background:#ffffff;
                    border:1px solid #dbe3ee;
                    color:#475569;
                    text-decoration:none;
                    font-size:10px;
                    font-weight:700;
                }

                .detail-back:hover {
                    background:#eff6ff;
                    border-color:#bfdbfe;
                    color:#1d4ed8;
                }

                /* ==========================================
                   CARDS
                ========================================== */

                .detail-card {
                    background:#ffffff;
                    border:1px solid #e2e8f0;
                    border-radius:17px;
                    overflow:hidden;
                    box-shadow:
                        0 7px 22px
                        rgba(15,23,42,.035);
                }

                .detail-card + .detail-card {
                    margin-top:16px;
                }

                .detail-card-header {
                    padding:16px 20px;
                    border-bottom:1px solid #eef2f7;
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:15px;
                }

                .detail-card-title {
                    color:#0f2747;
                    font-size:14px;
                    font-weight:800;
                }

                .detail-card-subtitle {
                    margin-top:3px;
                    color:#94a3b8;
                    font-size:10px;
                }

                .detail-card-body {
                    padding:19px;
                }

                /* ==========================================
                   AGENDA HERO
                ========================================== */

                .detail-agenda-grid {
                    display:grid;
                    grid-template-columns:minmax(0,1.45fr) minmax(280px,.8fr);
                    gap:16px;
                }

                .detail-agenda-main {
                    border:1px solid #e2e8f0;
                    border-radius:14px;
                    padding:20px;
                    background:
                        linear-gradient(
                            135deg,
                            #ffffff,
                            #f8fbff
                        );
                }

                .detail-type {
                    display:inline-flex;
                    align-items:center;
                    padding:5px 9px;
                    border-radius:999px;
                    font-size:9px;
                    font-weight:800;
                    margin-bottom:12px;
                }

                .detail-agenda-title {
                    margin:0;
                    color:#0f2747;
                    font-size:24px;
                    line-height:1.35;
                    font-weight:800;
                    word-break:break-word;
                }

                .detail-description {
                    margin-top:11px;
                    padding:13px 14px;
                    border-radius:11px;
                    background:#f8fafc;
                    border:1px solid #e8edf4;
                    color:#475569;
                    font-size:12px;
                    line-height:1.75;
                    white-space:pre-wrap;
                    overflow-wrap:anywhere;
                }

                .detail-inline-link {
                    color:#2563eb;
                    font-weight:700;
                    text-decoration:underline;
                    text-underline-offset:2px;
                    word-break:break-all;
                }

                .detail-inline-link:hover {
                    color:#1d4ed8;
                }

                .detail-muted {
                    color:#94a3b8;
                }

                /* ==========================================
                   JADWAL PANEL - BARU
                ========================================== */

                .detail-schedule {
                    border-radius:15px;
                    border:1px solid #dbe3ee;
                    background:#ffffff;
                    overflow:hidden;
                }

                .detail-schedule-top {
                    padding:15px 16px;
                    background:#0f2747;
                    color:#ffffff;
                }

                .detail-schedule-caption {
                    color:#bfdbfe;
                    font-size:9px;
                    font-weight:800;
                    text-transform:uppercase;
                    letter-spacing:.5px;
                }

                .detail-schedule-date {
                    margin-top:5px;
                    font-size:20px;
                    font-weight:800;
                    line-height:1.25;
                }

                .detail-schedule-wit {
                    margin-top:4px;
                    color:#dbeafe;
                    font-size:10px;
                }

                .detail-schedule-body {
                    padding:6px 15px;
                }

                .detail-schedule-row {
                    display:flex;
                    align-items:flex-start;
                    gap:10px;
                    padding:13px 0;
                    border-bottom:1px solid #eef2f7;
                }

                .detail-schedule-row:last-child {
                    border-bottom:0;
                }

                .detail-schedule-icon {
                    width:30px;
                    height:30px;
                    border-radius:8px;
                    flex-shrink:0;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#eff6ff;
                    color:#2563eb;
                }

                .detail-schedule-label {
                    color:#94a3b8;
                    font-size:8px;
                    font-weight:800;
                    text-transform:uppercase;
                    letter-spacing:.35px;
                }

                .detail-schedule-value {
                    margin-top:4px;
                    color:#334155;
                    font-size:11px;
                    font-weight:700;
                    line-height:1.45;
                    word-break:break-word;
                }

                /* ==========================================
                   INFO GRID
                ========================================== */

                .detail-info-grid {
                    display:grid;
                    grid-template-columns:repeat(3,minmax(0,1fr));
                    gap:10px;
                    margin-top:15px;
                }

                .detail-info-box {
                    padding:12px;
                    border:1px solid #e8edf4;
                    border-radius:11px;
                    background:#ffffff;
                }

                .detail-info-label {
                    color:#94a3b8;
                    font-size:8px;
                    font-weight:800;
                    text-transform:uppercase;
                    letter-spacing:.35px;
                }

                .detail-info-value {
                    margin-top:5px;
                    color:#334155;
                    font-size:11px;
                    line-height:1.5;
                    font-weight:700;
                    word-break:break-word;
                }

                /* ==========================================
                   SURAT
                ========================================== */

                .detail-surat-grid {
                    display:grid;
                    grid-template-columns:minmax(0,.82fr) minmax(0,1.18fr);
                    gap:17px;
                }

                .detail-surat-info {
                    border:1px solid #e2e8f0;
                    border-radius:13px;
                    padding:16px;
                }

                .detail-surat-row {
                    padding:11px 0;
                    border-bottom:1px solid #eef2f7;
                }

                .detail-surat-row:first-child {
                    padding-top:0;
                }

                .detail-surat-row:last-child {
                    border-bottom:0;
                }

                .detail-surat-label {
                    color:#94a3b8;
                    font-size:8px;
                    font-weight:800;
                    text-transform:uppercase;
                    letter-spacing:.35px;
                }

                .detail-surat-value {
                    margin-top:5px;
                    color:#334155;
                    font-size:11px;
                    font-weight:600;
                    line-height:1.55;
                    word-break:break-word;
                }

                /* CSS TOMBOL DIHAPUS */

                .detail-pdf-box {
                    border:1px solid #dbe3ee;
                    border-radius:13px;
                    overflow:hidden;
                    background:#f8fafc;
                }

                .detail-pdf-header {
                    min-height:45px;
                    padding:0 11px;
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:10px;
                    background:#ffffff;
                    border-bottom:1px solid #e2e8f0;
                }

                .detail-pdf-title {
                    color:#475569;
                    font-size:10px;
                    font-weight:800;
                }

                .detail-pdf-link {
                    display:inline-flex;
                    align-items:center;
                    gap:5px;
                    padding:6px 8px;
                    border-radius:8px;
                    background:#eff6ff;
                    border:1px solid #dbeafe;
                    color:#1d4ed8;
                    text-decoration:none;
                    font-size:9px;
                    font-weight:700;
                }

                .detail-pdf-frame {
                    width:100%;
                    height:470px;
                    display:block;
                    border:0;
                }

                .detail-no-pdf {
                    min-height:300px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    text-align:center;
                    padding:25px;
                    color:#94a3b8;
                    font-size:11px;
                    line-height:1.6;
                }

                /* ==========================================
                   BOTTOM
                ========================================== */

                .detail-bottom {
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:10px;
                    margin-top:16px;
                }

                .detail-action {
                    min-height:38px;
                    display:inline-flex;
                    align-items:center;
                    justify-content:center;
                    gap:7px;
                    padding:0 12px;
                    border-radius:9px;
                    text-decoration:none;
                    font-size:10px;
                    font-weight:700;
                }

                .detail-action-back {
                    background:#ffffff;
                    border:1px solid #dbe3ee;
                    color:#475569;
                }

                .detail-action-back:hover {
                    background:#f8fafc;
                }

                .detail-action-edit {
                    background:#eff6ff;
                    border:1px solid #dbeafe;
                    color:#1d4ed8;
                }

                .detail-footer {
                    text-align:center;
                    color:#94a3b8;
                    font-size:9px;
                    padding:22px 0 6px;
                }

                @media (max-width:900px) {
                    .detail-agenda-grid,
                    .detail-surat-grid {
                        grid-template-columns:1fr;
                    }

                    .detail-info-grid {
                        grid-template-columns:repeat(2,1fr);
                    }
                }

                @media (max-width:650px) {
                    .detail-header {
                        padding:0 15px;
                    }

                    .detail-brand-subtitle,
                    .detail-role {
                        display:none;
                    }

                    .detail-logout {
                        width:38px;
                        padding:0;
                    }

                    .detail-logout-text {
                        display:none;
                    }

                    .detail-main {
                        padding:20px 14px 34px;
                    }

                    .detail-heading {
                        flex-direction:column;
                    }

                    .detail-back {
                        width:100%;
                    }

                    .detail-title {
                        font-size:25px;
                    }

                    .detail-agenda-title {
                        font-size:21px;
                    }

                    .detail-info-grid {
                        grid-template-columns:1fr;
                    }

                    .detail-bottom {
                        flex-direction:column;
                        align-items:stretch;
                    }

                    .detail-action {
                        width:100%;
                    }
                }

            `}</style>

            <div className="detail-page">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <header className="detail-header">

                    <a
                        href={backUrl}
                        className="detail-brand"
                    >

                        <div className="detail-logo">

                            <img
                                src="/images/poltekkes-icon.png"
                                alt="Logo Poltekkes Maluku"
                            />

                        </div>

                        <div>

                            <div className="detail-brand-title">
                                SIMAP
                            </div>

                            <div className="detail-brand-subtitle">
                                Poltekkes Maluku
                            </div>

                        </div>

                    </a>

                    <div className="detail-header-right">

                        <div className="detail-role">
                            {isDirectorPage
                                ? 'Direktur'
                                : 'Sekretaris Direktur'}
                        </div>

                        <form
                            method="POST"
                            action="/logout"
                            className="detail-logout-form"
                        >

                            <input
                                type="hidden"
                                name="_token"
                                value={csrfToken}
                            />

                            <button
                                type="submit"
                                className="detail-logout"
                            >

                                <Icon
                                    name="logout"
                                    size={15}
                                />

                                <span className="detail-logout-text">
                                    Logout
                                </span>

                            </button>

                        </form>

                    </div>

                </header>


                {/* =====================================================
                    MAIN
                ===================================================== */}

                <main className="detail-main">

                    <div className="detail-breadcrumb">

                        <a href={
                            isDirectorPage
                                ? '/direktur/dashboard'
                                : '/sekretaris/dashboard'
                        }>
                            Dashboard
                        </a>

                        <span>›</span>

                        <a href={backUrl}>
                            {isDirectorPage
                                ? 'Agenda Direktur'
                                : 'Agenda'}
                        </a>

                        <span>›</span>

                        <span>Detail</span>

                    </div>


                    <div className="detail-heading">

                        <div>

                            <div className="detail-kicker">
                                {isDirectorPage
                                    ? 'Informasi Agenda Direktur'
                                    : 'Administrasi Agenda'}
                            </div>

                            <h1 className="detail-title">
                                Detail Agenda
                            </h1>

                            <p className="detail-title-description">
                                Informasi lengkap mengenai
                                agenda yang tersimpan dalam SIMAP.
                            </p>

                        </div>

                        <a
                            href={backUrl}
                            className="detail-back"
                        >

                            <Icon
                                name="arrowLeft"
                                size={14}
                            />

                            Kembali

                        </a>

                    </div>


                    {/* =================================================
                        INFORMASI AGENDA
                    ================================================= */}

                    <section className="detail-card">

                        <div className="detail-card-header">

                            <div>

                                <div className="detail-card-title">
                                    Informasi Agenda
                                </div>

                                <div className="detail-card-subtitle">
                                    Detail jadwal dan pelaksanaan
                                </div>

                            </div>

                            <span
                                className="detail-type"
                                style={getJenisStyle(
                                    data.jenis
                                )}
                            >
                                {data.jenis ||
                                    'Lainnya'}
                            </span>

                        </div>

                        <div className="detail-card-body">

                            <div className="detail-agenda-grid">

                                {/* KIRI */}

                                <div className="detail-agenda-main">

                                    <span
                                        className="detail-type"
                                        style={getJenisStyle(
                                            data.jenis
                                        )}
                                    >
                                        {data.jenis ||
                                            'Lainnya'}
                                    </span>

                                    <h2 className="detail-agenda-title">
                                        {data.judul ||
                                            'Tanpa judul'}
                                    </h2>

                                    <div className="detail-description">
                                        {renderTextWithLinks(
                                            data.keterangan
                                        )}
                                    </div>

                                </div>


                                {/* KANAN - JADWAL */}


                                <div className="detail-schedule">

                                    <div className="detail-schedule-top">

                                        <div className="detail-schedule-caption">
                                            Jadwal Agenda
                                        </div>

                                        <div className="detail-schedule-date">
                                            {formatDate(
                                                data.tanggal
                                            )}
                                        </div>

                                        <div className="detail-schedule-wit">
                                            Waktu menggunakan zona WIT
                                        </div>

                                    </div>

                                    <div className="detail-schedule-body">

                                        <div className="detail-schedule-row">

                                            <div className="detail-schedule-icon">
                                                <Icon
                                                    name="clock"
                                                    size={15}
                                                />
                                            </div>

                                            <div>

                                                <div className="detail-schedule-label">
                                                    Waktu
                                                </div>

                                                <div className="detail-schedule-value">
                                                    {formatTime(
                                                        data.waktu_mulai
                                                    )}

                                                    {data.waktu_selesai &&
                                                        ` - ${formatTime(
                                                            data.waktu_selesai
                                                        )}`}

                                                    {' '}WIT
                                                </div>

                                            </div>

                                        </div>


                                        <div className="detail-schedule-row">

                                            <div className="detail-schedule-icon">
                                                <Icon
                                                    name="location"
                                                    size={15}
                                                />
                                            </div>

                                            <div>

                                                <div className="detail-schedule-label">
                                                    Lokasi
                                                </div>

                                                <div className="detail-schedule-value">
                                                    {data.lokasi ||
                                                        'Belum ditentukan'}
                                                </div>

                                            </div>

                                        </div>


                                        <div className="detail-schedule-row">

                                            <div className="detail-schedule-icon">
                                                <Icon
                                                    name="calendar"
                                                    size={15}
                                                />
                                            </div>

                                            <div>

                                                <div className="detail-schedule-label">
                                                    Jenis Agenda
                                                </div>

                                                <div className="detail-schedule-value">
                                                    {data.jenis ||
                                                        'Lainnya'}
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="detail-info-grid">

                                <div className="detail-info-box">

                                    <div className="detail-info-label">
                                        Tanggal
                                    </div>

                                    <div className="detail-info-value">
                                        {formatDate(
                                            data.tanggal
                                        )}
                                    </div>

                                </div>

                                <div className="detail-info-box">

                                    <div className="detail-info-label">
                                        Waktu
                                    </div>

                                    <div className="detail-info-value">
                                        {formatTime(
                                            data.waktu_mulai
                                        )}
                                        {data.waktu_selesai &&
                                            ` - ${formatTime(
                                                data.waktu_selesai
                                            )}`}
                                        {' '}WIT
                                    </div>

                                </div>

                                <div className="detail-info-box">

                                    <div className="detail-info-label">
                                        Sumber Agenda
                                    </div>

                                    <div className="detail-info-value">
                                        {surat
                                            ? 'Surat Masuk'
                                            : 'Agenda Manual'}
                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        SURAT MASUK
                    ================================================= */}

                    <section className="detail-card">

                        <div className="detail-card-header">

                            <div>

                                <div className="detail-card-title">
                                    Surat Masuk Terkait
                                </div>

                                <div className="detail-card-subtitle">
                                    Surat yang menjadi sumber agenda
                                </div>

                            </div>

                        </div>

                        <div className="detail-card-body">

                            {surat ? (

                                <div className="detail-surat-grid">

                                    <div className="detail-surat-info">

                                        <div className="detail-surat-row">

                                            <div className="detail-surat-label">
                                                Nomor Surat
                                            </div>

                                            <div className="detail-surat-value">
                                                {surat.nomor_surat ||
                                                    '-'}
                                            </div>

                                        </div>

                                        <div className="detail-surat-row">

                                            <div className="detail-surat-label">
                                                Tanggal Surat
                                            </div>

                                            <div className="detail-surat-value">
                                                {formatDate(
                                                    surat.tanggal_surat
                                                )}
                                            </div>

                                        </div>

                                        <div className="detail-surat-row">

                                            <div className="detail-surat-label">
                                                Tanggal Diterima
                                            </div>

                                            <div className="detail-surat-value">
                                                {formatDate(
                                                    surat.tanggal_diterima
                                                )}
                                            </div>

                                        </div>

                                        <div className="detail-surat-row">

                                            <div className="detail-surat-label">
                                                Pengirim
                                            </div>

                                            <div className="detail-surat-value">
                                                {surat.pengirim ||
                                                    '-'}
                                            </div>

                                        </div>

                                        <div className="detail-surat-row">

                                            <div className="detail-surat-label">
                                                Perihal
                                            </div>

                                            <div className="detail-surat-value">
                                                {surat.perihal ||
                                                    '-'}
                                            </div>

                                        </div>

                                        {surat.sifat && (
                                            <div className="detail-surat-row">

                                                <div className="detail-surat-label">
                                                    Sifat Surat
                                                </div>

                                                <div className="detail-surat-value">
                                                    {surat.sifat}
                                                </div>

                                            </div>
                                        )}

                                    </div>


                                    <div className="detail-pdf-box">

                                        <div className="detail-pdf-header">

                                            <div className="detail-pdf-title">
                                                Dokumen Surat
                                            </div>

                                            {pdfUrl && (
                                                <a
                                                    href={pdfUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="detail-pdf-link"
                                                >

                                                    <Icon
                                                        name="external"
                                                        size={11}
                                                    />

                                                    Buka PDF

                                                </a>
                                            )}

                                        </div>

                                        {pdfUrl ? (

                                            <iframe
                                                src={pdfUrl}
                                                title="Preview Surat Masuk"
                                                className="detail-pdf-frame"
                                            />

                                        ) : (

                                            <div className="detail-no-pdf">
                                                File PDF surat
                                                belum tersedia.
                                            </div>

                                        )}

                                    </div>

                                </div>

                            ) : (

                                <div className="detail-no-pdf">
                                    Agenda ini tidak memiliki
                                    surat masuk terkait.
                                </div>

                            )}

                        </div>

                    </section>


                    {/* =================================================
                        ACTION
                    ================================================= */}

                    <div className="detail-bottom">

                        <a
                            href={backUrl}
                            className="detail-action detail-action-back"
                        >

                            <Icon
                                name="arrowLeft"
                                size={14}
                            />

                            {backLabel}

                        </a>

                        {!isDirectorPage &&
                            data.id && (
                                <a
                                    href={`/sekretaris/agenda/${data.id}/edit`}
                                    className="detail-action detail-action-edit"
                                >

                                    <Icon
                                        name="edit"
                                        size={14}
                                    />

                                    Edit Agenda

                                </a>
                            )}

                    </div>


                    <div className="detail-footer">
                        SIMAP Poltekkes Maluku
                    </div>

                </main>

            </div>
        </>
    );
}