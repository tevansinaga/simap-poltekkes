import React from 'react';

export default function SuratMasukDetail({
    surat = null,
}) {
    // =====================================================
    // EMPTY
    // =====================================================

    if (!surat) {
        return (
            <>
                <style>{`
                    .surat-detail-empty-page {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 24px;
                        background: #f4f7fb;
                        font-family:
                            Inter,
                            ui-sans-serif,
                            system-ui,
                            sans-serif;
                    }

                    .surat-detail-empty-card {
                        width: 100%;
                        max-width: 500px;
                        padding: 38px;
                        background: #ffffff;
                        border: 1px solid #e2e8f0;
                        border-radius: 18px;
                        text-align: center;
                        box-shadow:
                            0 15px 40px
                            rgba(15,23,42,.06);
                    }

                    .surat-detail-empty-icon {
                        width: 60px;
                        height: 60px;
                        margin: 0 auto 15px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 17px;
                        background: #fef2f2;
                        color: #dc2626;
                        font-size: 24px;
                        font-weight: 800;
                    }

                    .surat-detail-empty-title {
                        color: #0f2747;
                        font-size: 19px;
                        font-weight: 800;
                    }

                    .surat-detail-empty-text {
                        margin-top: 8px;
                        color: #64748b;
                        font-size: 12px;
                        line-height: 1.7;
                    }

                    .surat-detail-empty-button {
                        display: inline-flex;
                        margin-top: 20px;
                        padding: 10px 15px;
                        border-radius: 10px;
                        background: #0f2747;
                        color: #ffffff;
                        text-decoration: none;
                        font-size: 11px;
                        font-weight: 700;
                    }
                `}</style>

                <div className="surat-detail-empty-page">

                    <div className="surat-detail-empty-card">

                        <div className="surat-detail-empty-icon">
                            !
                        </div>

                        <div className="surat-detail-empty-title">
                            Surat tidak ditemukan
                        </div>

                        <div className="surat-detail-empty-text">
                            Data surat yang ingin kamu
                            lihat tidak tersedia atau
                            sudah tidak ditemukan.
                        </div>

                        <a
                            href="/sekretaris/surat-masuk"
                            className="surat-detail-empty-button"
                        >
                            ← Kembali ke Surat Masuk
                        </a>

                    </div>

                </div>
            </>
        );
    }

    // =====================================================
    // CSRF
    // =====================================================

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '';

    // =====================================================
    // FORMAT DATE-ONLY
    // =====================================================
    //
    // Penting:
    // tanggal_surat dan tanggal_diterima adalah DATE,
    // bukan DATETIME.
    //
    // Jangan gunakan new Date('YYYY-MM-DD') karena
    // JavaScript dapat memperlakukannya sebagai UTC.
    // =====================================================

    const formatDate = (value) => {
        if (!value) {
            return '-';
        }

        const text = String(value).trim();

        // Ambil hanya YYYY-MM-DD.
        //
        // Contoh:
        // 2026-09-16
        // 2026-09-16T00:00:00.000000Z
        //
        // Keduanya akan dianggap:
        // 16 September 2026
        const match = text.match(
            /^(\d{4})-(\d{2})-(\d{2})/
        );

        if (!match) {
            return String(value);
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
            return String(value);
        }

        // Validasi hari berdasarkan jumlah hari dalam bulan.
        const daysInMonth =
            new Date(
                year,
                month,
                0
            ).getDate();

        if (day > daysInMonth) {
            return String(value);
        }

        // PENTING:
        // Tidak ada new Date(value) di sini.
        return `${String(day).padStart(2, '0')} ${monthNames[month - 1]} ${year}`;
    };

    // =====================================================
    // FORMAT DATETIME
    // =====================================================
    //
    // Hanya untuk field yang memang memiliki waktu:
    // created_at, tanggal_disposisi, selesai_at, dll.
    //
    // Menggunakan WIT / Asia/Jayapura.
    // =====================================================

    const formatDateTime = (value) => {
        if (!value) {
            return '-';
        }

        const parsed = new Date(value);

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
    // FORMAT TIME
    // =====================================================

    const formatTime = (value) => {
        if (!value) {
            return '--:--';
        }

        const text =
            String(value).trim();

        if (
            /^\d{2}:\d{2}:\d{2}$/.test(text)
        ) {
            return text.slice(0, 5);
        }

        if (
            /^\d{2}:\d{2}$/.test(text)
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
    // STATUS SURAT
    // =====================================================

    const getStatusText = (status) => {
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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'menunggu_disposisi':
                return {
                    background: '#fff7ed',
                    color: '#c2410c',
                    border: '1px solid #fed7aa',
                };

            case 'sudah_didisposisi':
                return {
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe',
                };

            case 'selesai':
                return {
                    background: '#f0fdf4',
                    color: '#15803d',
                    border: '1px solid #bbf7d0',
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
    // STATUS DISPOSISI
    // =====================================================

    const getDisposisiStatusText = (status) => {
        switch (status) {
            case 'terkirim':
                return 'Terkirim';

            case 'in_progress':
                return 'Dalam Proses';

            case 'selesai':
                return 'Selesai';

            default:
                return status || '-';
        }
    };

    const getDisposisiStatusStyle = (status) => {
        switch (status) {
            case 'terkirim':
                return {
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe',
                };

            case 'in_progress':
                return {
                    background: '#fff7ed',
                    color: '#c2410c',
                    border: '1px solid #fed7aa',
                };

            case 'selesai':
                return {
                    background: '#f0fdf4',
                    color: '#15803d',
                    border: '1px solid #bbf7d0',
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
    // DATA
    // =====================================================

    const disposisiList =
        Array.isArray(
            surat.disposisis
        )
            ? surat.disposisis
            : [];

    const agendaList =
        Array.isArray(
            surat.agendas
        )
            ? surat.agendas
            : [];

    const statusStyle =
        getStatusStyle(
            surat.status
        );

    const canDisposisi =
        surat.status ===
        'menunggu_disposisi';

    // =====================================================
    // PDF
    // =====================================================

    const pdfUrl =
        surat.file_surat
            ? `/storage/${String(
                  surat.file_surat
              ).replace(
                  /^\/+/,
                  ''
              )}`
            : null;

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
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 1.8,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
        };

        const icons = {
            file: (
                <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h8M8 17h6" />
                </>
            ),

            edit: (
                <>
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                </>
            ),

            plus: (
                <>
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
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

            building: (
                <>
                    <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
                    <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
                    <path d="M9 21v-3h6v3" />
                </>
            ),

            user: (
                <>
                    <circle
                        cx="12"
                        cy="8"
                        r="3.5"
                    />
                    <path d="M5 20c.8-3.4 3.1-5 7-5s6.2 1.6 7 5" />
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

            note: (
                <>
                    <path d="M4 4h16v16H4z" />
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

            logout: (
                <>
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M13 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
                </>
            ),
        };

        return (
            <svg {...common}>
                {icons[name]}
            </svg>
        );
    };

    return (
        <>
            <style>{`

                * {
                    box-sizing: border-box;
                }

                .surat-detail-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(
                            circle at 5% 0%,
                            rgba(37,99,235,.035),
                            transparent 25%
                        ),
                        #f4f7fb;
                    color: #0f172a;
                    font-family:
                        Inter,
                        ui-sans-serif,
                        system-ui,
                        sans-serif;
                }

                /* HEADER */

                .surat-detail-header {
                    height: 74px;
                    background: rgba(255,255,255,.96);
                    backdrop-filter: blur(12px);
                    border-bottom:
                        1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 28px;
                    position: sticky;
                    top: 0;
                    z-index: 50;
                }

                .surat-detail-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    text-decoration: none;
                }

                .surat-detail-logo {
                    width: 44px;
                    height: 44px;
                    padding: 5px;
                    border-radius: 11px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    box-shadow:
                        0 5px 15px
                        rgba(15,39,71,.07);
                }

                .surat-detail-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                }

                .surat-detail-brand-title {
                    color: #0f2747;
                    font-size: 18px;
                    font-weight: 800;
                    line-height: 1.1;
                }

                .surat-detail-brand-subtitle {
                    margin-top: 4px;
                    color: #64748b;
                    font-size: 10px;
                }

                .surat-detail-header-right {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                }

                .surat-detail-role {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 12px;
                    border-radius: 999px;
                    background: #eff6ff;
                    border:
                        1px solid #dbeafe;
                    color: #1d4ed8;
                    font-size: 10px;
                    font-weight: 700;
                }

                .surat-detail-role-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #2563eb;
                }

                /* MAIN */

                .surat-detail-main {
                    width: 100%;
                    max-width: 1120px;
                    margin: 0 auto;
                    padding: 30px 24px 50px;
                }

                .surat-detail-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    margin-bottom: 13px;
                    color: #94a3b8;
                    font-size: 11px;
                }

                .surat-detail-breadcrumb a {
                    color: #64748b;
                    text-decoration: none;
                    font-weight: 600;
                }

                .surat-detail-breadcrumb a:hover {
                    color: #2563eb;
                }

                .surat-detail-title-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .surat-detail-kicker {
                    display: inline-flex;
                    margin-bottom: 8px;
                    padding: 5px 9px;
                    border-radius: 999px;
                    background: #f8fafc;
                    border:
                        1px solid #e2e8f0;
                    color: #64748b;
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: .4px;
                }

                .surat-detail-title {
                    margin: 0;
                    color: #0f2747;
                    font-size: 30px;
                    font-weight: 850;
                    line-height: 1.2;
                    letter-spacing: -.6px;
                }

                .surat-detail-description {
                    margin: 8px 0 0;
                    color: #64748b;
                    font-size: 12px;
                    line-height: 1.6;
                }

                .surat-detail-actions {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .surat-detail-action {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    padding: 10px 13px;
                    border-radius: 10px;
                    text-decoration: none;
                    font-size: 10px;
                    font-weight: 750;
                    white-space: nowrap;
                    transition: .15s ease;
                }

                .surat-detail-action-edit {
                    background: #ffffff;
                    color: #475569;
                    border:
                        1px solid #dbe3ec;
                }

                .surat-detail-action-edit:hover {
                    background: #f8fafc;
                }

                .surat-detail-action-disposisi {
                    background:
                        linear-gradient(
                            135deg,
                            #0f2747,
                            #174a7e
                        );
                    color: #ffffff;
                    border:
                        1px solid #0f2747;
                    box-shadow:
                        0 7px 17px
                        rgba(15,39,71,.13);
                }

                .surat-detail-action-disposisi:hover {
                    transform: translateY(-1px);
                }

                /* CARD */

                .surat-detail-card {
                    margin-bottom: 18px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 17px;
                    overflow: hidden;
                    box-shadow:
                        0 5px 20px
                        rgba(15,23,42,.025);
                }

                .surat-detail-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 15px;
                    padding: 18px 21px;
                    border-bottom:
                        1px solid #eef2f7;
                }

                .surat-detail-card-title {
                    color: #0f2747;
                    font-size: 15px;
                    font-weight: 800;
                    line-height: 1.5;
                }

                .surat-detail-card-subtitle {
                    margin-top: 4px;
                    color: #94a3b8;
                    font-size: 10px;
                    line-height: 1.55;
                }

                .surat-detail-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 6px 9px;
                    border-radius: 999px;
                    font-size: 9px;
                    font-weight: 800;
                    white-space: nowrap;
                }

                /* INFO SURAT */

                .surat-detail-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(
                            2,
                            minmax(0,1fr)
                        );
                    gap: 20px 30px;
                    padding: 22px 21px;
                }

                .surat-detail-label {
                    margin-bottom: 5px;
                    color: #94a3b8;
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: .35px;
                }

                .surat-detail-value {
                    color: #334155;
                    font-size: 12px;
                    font-weight: 650;
                    line-height: 1.6;
                    word-break: break-word;
                }

                /* PDF */

                .surat-detail-attachment {
                    margin:
                        0 21px 21px;
                    padding: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    background: #f8fafc;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 12px;
                }

                .surat-detail-attachment-main {
                    min-width: 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .surat-detail-attachment-icon {
                    width: 36px;
                    height: 36px;
                    flex-shrink: 0;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #eff6ff;
                    color: #2563eb;
                }

                .surat-detail-attachment-title {
                    color: #334155;
                    font-size: 11px;
                    font-weight: 800;
                }

                .surat-detail-attachment-text {
                    margin-top: 3px;
                    color: #94a3b8;
                    font-size: 9px;
                    word-break: break-word;
                }

                .surat-detail-attachment-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 9px 12px;
                    border-radius: 9px;
                    background: #0f2747;
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 10px;
                    font-weight: 750;
                    white-space: nowrap;
                }

                /* AGENDA */

                .surat-detail-agenda {
                    border-color: #bbf7d0;
                }

                .surat-detail-agenda .surat-detail-card-header {
                    background:
                        linear-gradient(
                            135deg,
                            #f0fdf4,
                            #f7fff9
                        );
                    border-bottom-color:
                        #dcfce7;
                }

                .surat-detail-agenda-title {
                    color: #166534;
                }

                .surat-detail-agenda-subtitle {
                    color: #65a30d;
                }

                .surat-detail-agenda-body {
                    padding: 18px 21px;
                }

                .surat-detail-agenda-item {
                    padding: 15px;
                    background: #fbfffc;
                    border:
                        1px solid #dcfce7;
                    border-radius: 12px;
                }

                .surat-detail-agenda-item + .surat-detail-agenda-item {
                    margin-top: 11px;
                }

                .surat-detail-agenda-name {
                    color: #0f2747;
                    font-size: 13px;
                    font-weight: 800;
                    line-height: 1.5;
                }

                .surat-detail-agenda-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(
                            3,
                            minmax(0,1fr)
                        );
                    gap: 9px;
                    margin-top: 11px;
                }

                .surat-detail-small-info {
                    padding: 9px 10px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 9px;
                }

                .surat-detail-small-label {
                    color: #94a3b8;
                    font-size: 8px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .surat-detail-small-value {
                    margin-top: 4px;
                    color: #334155;
                    font-size: 10px;
                    font-weight: 700;
                    line-height: 1.45;
                }

                .surat-detail-chip-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin-top: 10px;
                }

                .surat-detail-chip {
                    display: inline-flex;
                    padding: 5px 8px;
                    border-radius: 999px;
                    background: #f8fafc;
                    border:
                        1px solid #e2e8f0;
                    color: #64748b;
                    font-size: 8px;
                    font-weight: 700;
                    line-height: 1.4;
                }

                /* DISPOSISI */

                .surat-detail-disposisi-list {
                    padding: 18px 21px;
                }

                .surat-detail-disposisi-item {
                    margin-bottom: 11px;
                    padding: 15px;
                    background: #fbfcfe;
                    border:
                        1px solid #edf2f7;
                    border-radius: 13px;
                }

                .surat-detail-disposisi-item:last-child {
                    margin-bottom: 0;
                }

                .surat-detail-disposisi-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 15px;
                }

                .surat-detail-disposisi-unit {
                    color: #0f2747;
                    font-size: 12px;
                    font-weight: 800;
                }

                .surat-detail-disposisi-meta {
                    margin-top: 4px;
                    color: #64748b;
                    font-size: 9px;
                    line-height: 1.5;
                }

                .surat-detail-disposisi-instruction {
                    margin-top: 10px;
                    padding: 11px;
                    background: #ffffff;
                    border:
                        1px solid #eef2f7;
                    border-radius: 9px;
                    color: #475569;
                    font-size: 10px;
                    line-height: 1.65;
                    white-space: pre-wrap;
                }

                .surat-detail-disposisi-extra {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin-top: 9px;
                }

                .surat-detail-followup {
                    margin-top: 9px;
                    padding: 11px;
                    background: #f0fdf4;
                    border:
                        1px solid #dcfce7;
                    border-radius: 9px;
                }

                .surat-detail-followup-label {
                    color: #15803d;
                    font-size: 8px;
                    font-weight: 800;
                    text-transform: uppercase;
                }

                .surat-detail-followup-value {
                    margin-top: 4px;
                    color: #475569;
                    font-size: 10px;
                    line-height: 1.6;
                    white-space: pre-wrap;
                }

                .surat-detail-complete {
                    margin-top: 8px;
                    color: #15803d;
                    font-size: 9px;
                    font-weight: 750;
                }

                .surat-detail-monitoring-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    margin-top: 11px;
                    padding: 8px 10px;
                    border-radius: 8px;
                    background: #eff6ff;
                    border:
                        1px solid #dbeafe;
                    color: #2563eb;
                    text-decoration: none;
                    font-size: 9px;
                    font-weight: 800;
                }

                .surat-detail-monitoring-link:hover {
                    background: #dbeafe;
                }

                .surat-detail-empty {
                    padding: 38px 20px;
                    text-align: center;
                }

                .surat-detail-empty-title {
                    color: #475569;
                    font-size: 13px;
                    font-weight: 750;
                }

                .surat-detail-empty-text {
                    margin-top: 5px;
                    color: #94a3b8;
                    font-size: 10px;
                }

                .surat-detail-empty-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    margin-top: 14px;
                    padding: 9px 12px;
                    border-radius: 9px;
                    background: #0f2747;
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 10px;
                    font-weight: 750;
                }

                /* DELETE */

                .surat-detail-delete {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    padding: 16px 19px;
                    border-color: #fecaca;
                }

                .surat-detail-delete-title {
                    color: #334155;
                    font-size: 11px;
                    font-weight: 800;
                }

                .surat-detail-delete-text {
                    margin-top: 4px;
                    color: #94a3b8;
                    font-size: 9px;
                }

                .surat-detail-delete-button {
                    padding: 9px 12px;
                    border-radius: 9px;
                    border:
                        1px solid #fecaca;
                    background: #fff1f2;
                    color: #dc2626;
                    font-size: 10px;
                    font-weight: 750;
                    cursor: pointer;
                }

                .surat-detail-footer {
                    padding: 25px 0 8px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 10px;
                }

                /* RESPONSIVE */

                @media (max-width: 760px) {

                    .surat-detail-header {
                        padding:
                            0 16px;
                    }

                    .surat-detail-brand-subtitle,
                    .surat-detail-role {
                        display:
                            none;
                    }

                    .surat-detail-main {
                        padding:
                            22px 15px 40px;
                    }

                    .surat-detail-title-row {
                        flex-direction:
                            column;
                        align-items:
                            stretch;
                    }

                    .surat-detail-actions {
                        justify-content:
                            flex-start;
                    }

                    .surat-detail-grid {
                        grid-template-columns:
                            1fr;
                    }

                    .surat-detail-agenda-grid {
                        grid-template-columns:
                            1fr;
                    }

                    .surat-detail-attachment,
                    .surat-detail-delete {
                        flex-direction:
                            column;
                        align-items:
                            stretch;
                    }

                    .surat-detail-attachment-link,
                    .surat-detail-delete-button {
                        width:
                            100%;
                        justify-content:
                            center;
                        text-align:
                            center;
                    }

                    .surat-detail-disposisi-top {
                        flex-direction:
                            column;
                    }
                }

                @media (max-width: 480px) {

                    .surat-detail-title {
                        font-size:
                            26px;
                    }

                    .surat-detail-action {
                        flex: 1;
                    }

                }

            `}</style>

            <div className="surat-detail-page">

                {/* HEADER */}

                <header className="surat-detail-header">

                    <a
                        href="/sekretaris/dashboard"
                        className="surat-detail-brand"
                    >

                        <div className="surat-detail-logo">

                            <img
                                src="/images/poltekkes-icon.png"
                                alt="Logo Poltekkes Maluku"
                            />

                        </div>

                        <div>

                            <div className="surat-detail-brand-title">
                                SIMAP
                            </div>

                            <div className="surat-detail-brand-subtitle">
                                Poltekkes Maluku
                            </div>

                        </div>

                    </a>

                    <div className="surat-detail-header-right">

                        <div className="surat-detail-role">

                            <span className="surat-detail-role-dot" />

                            Sekretaris Direktur

                        </div>

                    </div>

                </header>


                {/* MAIN */}

                <main className="surat-detail-main">

                    {/* BREADCRUMB */}

                    <div className="surat-detail-breadcrumb">

                        <a href="/sekretaris/dashboard">
                            Dashboard
                        </a>

                        <span>›</span>

                        <a href="/sekretaris/surat-masuk">
                            Surat Masuk
                        </a>

                        <span>›</span>

                        <span>
                            Detail Surat
                        </span>

                    </div>


                    {/* TITLE */}

                    <div className="surat-detail-title-row">

                        <div>

                            <div className="surat-detail-kicker">
                                Administrasi Sekretariat Direktur
                            </div>

                            <h1 className="surat-detail-title">
                                Detail Surat Masuk
                            </h1>

                            <p className="surat-detail-description">
                                Periksa informasi surat,
                                lampiran, agenda, dan
                                riwayat disposisi.
                            </p>

                        </div>

                        <div className="surat-detail-actions">

                            <a
                                href={`/sekretaris/surat-masuk/${surat.id}/edit`}
                                className="surat-detail-action surat-detail-action-edit"
                            >

                                <Icon
                                    name="edit"
                                    size={13}
                                />

                                Edit Surat

                            </a>

                            {canDisposisi && (

                                <a
                                    href={`/sekretaris/disposisi/${surat.id}`}
                                    className="surat-detail-action surat-detail-action-disposisi"
                                >

                                    <Icon
                                        name="plus"
                                        size={13}
                                    />

                                    Buat Disposisi

                                </a>

                            )}

                        </div>

                    </div>


                    {/* INFORMASI SURAT */}

                    <section className="surat-detail-card">

                        <div className="surat-detail-card-header">

                            <div>

                                <div className="surat-detail-card-title">

                                    {
                                        surat.perihal ||
                                        'Tanpa Perihal'
                                    }

                                </div>

                                <div className="surat-detail-card-subtitle">

                                    Nomor Surat:{' '}
                                    {surat.nomor_surat || '-'}

                                </div>

                            </div>

                            <span
                                className="surat-detail-status"
                                style={statusStyle}
                            >
                                {
                                    getStatusText(
                                        surat.status
                                    )
                                }
                            </span>

                        </div>


                        <div className="surat-detail-grid">

                            <DetailItem
                                label="Nomor Surat"
                                value={
                                    surat.nomor_surat
                                }
                            />

                            <DetailItem
                                label="Pengirim"
                                value={
                                    surat.pengirim
                                }
                            />

                            <DetailItem
                                label="Perihal"
                                value={
                                    surat.perihal
                                }
                            />

                            <DetailItem
                                label="Tanggal Surat"
                                value={formatDate(
                                    surat.tanggal_surat
                                )}
                            />

                            <DetailItem
                                label="Tanggal Diterima"
                                value={formatDate(
                                    surat.tanggal_diterima
                                )}
                            />

                            <DetailItem
                                label="Sifat Surat"
                                value={
                                    surat.sifat ||
                                    'Biasa'
                                }
                            />

                            <DetailItem
                                label="Dicatat Oleh"
                                value={
                                    surat.creator
                                        ?.name ||
                                    '-'
                                }
                            />

                            <DetailItem
                                label="Dibuat"
                                value={formatDateTime(
                                    surat.created_at
                                )}
                            />

                        </div>


                        {/* LAMPIRAN */}

                        {pdfUrl && (

                            <div className="surat-detail-attachment">

                                <div className="surat-detail-attachment-main">

                                    <div className="surat-detail-attachment-icon">

                                        <Icon
                                            name="file"
                                            size={17}
                                        />

                                    </div>

                                    <div
                                        style={{
                                            minWidth:
                                                0,
                                        }}
                                    >

                                        <div className="surat-detail-attachment-title">
                                            Lampiran Surat
                                        </div>

                                        <div className="surat-detail-attachment-text">

                                            {
                                                String(
                                                    surat.file_surat
                                                )
                                                    .split(
                                                        '/'
                                                    )
                                                    .pop()
                                            }

                                        </div>

                                    </div>

                                </div>

                                <a
                                    href={
                                        pdfUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="surat-detail-attachment-link"
                                >

                                    <Icon
                                        name="file"
                                        size={13}
                                    />

                                    Buka PDF

                                </a>

                            </div>

                        )}

                    </section>


                    {/* AGENDA */}

                    {agendaList.length > 0 && (

                        <section
                            className="surat-detail-card surat-detail-agenda"
                        >

                            <div className="surat-detail-card-header">

                                <div>

                                    <div className="surat-detail-card-title surat-detail-agenda-title">
                                        Agenda Direktur
                                    </div>

                                    <div className="surat-detail-card-subtitle surat-detail-agenda-subtitle">
                                        Agenda yang terhubung
                                        dengan surat ini.
                                    </div>

                                </div>

                            </div>

                            <div className="surat-detail-agenda-body">

                                {agendaList.map(
                                    (agenda) => (

                                        <div
                                            key={
                                                agenda.id
                                            }
                                            className="surat-detail-agenda-item"
                                        >

                                            <div className="surat-detail-agenda-name">

                                                {
                                                    agenda.judul ||
                                                    'Tanpa Judul'
                                                }

                                            </div>

                                            <div className="surat-detail-agenda-grid">

                                                <SmallInfo
                                                    label="Tanggal"
                                                    value={formatDate(
                                                        agenda.tanggal
                                                    )}
                                                />

                                                <SmallInfo
                                                    label="Waktu"
                                                    value={`${formatTime(
                                                        agenda.waktu_mulai
                                                    )}${
                                                        agenda.waktu_selesai
                                                            ? ` - ${formatTime(
                                                                  agenda.waktu_selesai
                                                              )}`
                                                            : ''
                                                    } WIT`}
                                                />

                                                <SmallInfo
                                                    label="Lokasi"
                                                    value={
                                                        agenda.lokasi ||
                                                        '-'
                                                    }
                                                />

                                            </div>

                                            <div className="surat-detail-chip-row">

                                                {agenda.jenis && (

                                                    <span className="surat-detail-chip">

                                                        Jenis:{' '}

                                                        {
                                                            agenda.jenis
                                                        }

                                                    </span>

                                                )}

                                                {agenda.keterangan && (

                                                    <span className="surat-detail-chip">

                                                        Keterangan:{' '}

                                                        {
                                                            agenda.keterangan
                                                        }

                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </section>

                    )}


                    {/* RIWAYAT DISPOSISI */}

                    <section className="surat-detail-card">

                        <div className="surat-detail-card-header">

                            <div>

                                <div className="surat-detail-card-title">
                                    Riwayat Disposisi
                                </div>

                                <div className="surat-detail-card-subtitle">
                                    Perjalanan surat dari
                                    Sekretariat ke unit atau
                                    Direktur.
                                </div>

                            </div>

                            <div
                                style={{
                                    padding:
                                        '6px 9px',
                                    borderRadius:
                                        '999px',
                                    background:
                                        '#f8fafc',
                                    border:
                                        '1px solid #e2e8f0',
                                    color:
                                        '#64748b',
                                    fontSize:
                                        '9px',
                                    fontWeight:
                                        700,
                                    whiteSpace:
                                        'nowrap',
                                }}
                            >
                                {
                                    disposisiList.length
                                } disposisi
                            </div>

                        </div>

                        {disposisiList.length === 0 ? (

                            <div className="surat-detail-empty">

                                <div className="surat-detail-empty-title">
                                    Belum ada disposisi
                                </div>

                                <div className="surat-detail-empty-text">
                                    Surat ini belum
                                    diteruskan kepada
                                    unit tujuan atau
                                    Direktur.
                                </div>

                                {canDisposisi && (

                                    <a
                                        href={`/sekretaris/disposisi/${surat.id}`}
                                        className="surat-detail-empty-button"
                                    >
                                        Buat Disposisi

                                        <Icon
                                            name="arrowRight"
                                            size={12}
                                        />

                                    </a>

                                )}

                            </div>

                        ) : (

                            <div className="surat-detail-disposisi-list">

                                {disposisiList.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const tujuan =
                                            item?.tujuan_type ===
                                            'direktur'
                                                ? 'Direktur'
                                                : item?.unit?.name ||
                                                  'Unit tidak diketahui';

                                        return (

                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="surat-detail-disposisi-item"
                                            >

                                                <div className="surat-detail-disposisi-top">

                                                    <div>

                                                        <div className="surat-detail-disposisi-unit">

                                                            {index + 1}.
                                                            {' '}
                                                            {tujuan}

                                                        </div>

                                                        <div className="surat-detail-disposisi-meta">

                                                            Dikirim oleh:{' '}

                                                            {
                                                                item?.dari_user?.name ||
                                                                item?.dariUser?.name ||
                                                                'Pengguna'
                                                            }

                                                        </div>

                                                        <div className="surat-detail-disposisi-meta">

                                                            {
                                                                formatDateTime(
                                                                    item?.tanggal_disposisi
                                                                )
                                                            }

                                                        </div>

                                                    </div>

                                                    <span
                                                        className="surat-detail-status"
                                                        style={getDisposisiStatusStyle(
                                                            item.status
                                                        )}
                                                    >
                                                        {
                                                            getDisposisiStatusText(
                                                                item.status
                                                            )
                                                        }
                                                    </span>

                                                </div>

                                                <div className="surat-detail-disposisi-instruction">

                                                    <strong
                                                        style={{
                                                            display:
                                                                'block',
                                                            marginBottom:
                                                                '4px',
                                                            color:
                                                                '#0f2747',
                                                            fontSize:
                                                                '9px',
                                                        }}
                                                    >
                                                        Instruksi
                                                    </strong>

                                                    {
                                                        item.instruksi ||
                                                        'Tidak ada instruksi.'
                                                    }

                                                </div>

                                                <div className="surat-detail-disposisi-extra">

                                                    {item.sifat && (

                                                        <span className="surat-detail-chip">

                                                            Sifat:{' '}

                                                            {
                                                                item.sifat
                                                            }

                                                        </span>

                                                    )}

                                                    {item.batas_waktu && (

                                                        <span className="surat-detail-chip">

                                                            Batas waktu:{' '}

                                                            {
                                                                formatDate(
                                                                    item.batas_waktu
                                                                )
                                                            }

                                                        </span>

                                                    )}

                                                    <span className="surat-detail-chip">

                                                        Tujuan:{' '}

                                                        {
                                                            item?.tujuan_type ===
                                                            'direktur'
                                                                ? 'Direktur'
                                                                : 'Unit'
                                                        }

                                                    </span>

                                                </div>

                                                {item.catatan_tindak_lanjut && (

                                                    <div className="surat-detail-followup">

                                                        <div className="surat-detail-followup-label">
                                                            Catatan Tindak Lanjut
                                                        </div>

                                                        <div className="surat-detail-followup-value">
                                                            {
                                                                item.catatan_tindak_lanjut
                                                            }
                                                        </div>

                                                    </div>

                                                )}

                                                {item.selesai_at && (

                                                    <div className="surat-detail-complete">

                                                        ✓ Diselesaikan pada{' '}

                                                        {
                                                            formatDateTime(
                                                                item.selesai_at
                                                            )
                                                        }

                                                    </div>

                                                )}

                                                <a
                                                    href={`/sekretaris/disposisi/${item.id}/detail`}
                                                    className="surat-detail-monitoring-link"
                                                >

                                                    Lihat Monitoring

                                                    <Icon
                                                        name="arrowRight"
                                                        size={11}
                                                    />

                                                </a>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        )}

                    </section>


                    {/* HAPUS */}

                    <section className="surat-detail-card surat-detail-delete">

                        <div>

                            <div className="surat-detail-delete-title">
                                Hapus Surat
                            </div>

                            <div className="surat-detail-delete-text">
                                Data surat yang dihapus
                                tidak dapat
                                dikembalikan.
                            </div>

                        </div>

                        <form
                            method="POST"
                            action={`/sekretaris/surat-masuk/${surat.id}`}
                            onSubmit={(event) => {

                                if (
                                    !window.confirm(
                                        'Yakin ingin menghapus surat ini?'
                                    )
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
                                className="surat-detail-delete-button"
                            >
                                Hapus Surat
                            </button>

                        </form>

                    </section>

                    <div className="surat-detail-footer">
                        SIMAP Poltekkes Maluku
                    </div>

                </main>

            </div>
        </>
    );
}


// =====================================================
// DETAIL ITEM
// =====================================================

function DetailItem({
    label,
    value,
}) {
    return (
        <div>

            <div className="surat-detail-label">
                {label}
            </div>

            <div className="surat-detail-value">
                {value || '-'}
            </div>

        </div>
    );
}


// =====================================================
// SMALL INFO
// =====================================================

function SmallInfo({
    label,
    value,
}) {
    return (
        <div className="surat-detail-small-info">

            <div className="surat-detail-small-label">
                {label}
            </div>

            <div className="surat-detail-small-value">
                {value || '-'}
            </div>

        </div>
    );
}