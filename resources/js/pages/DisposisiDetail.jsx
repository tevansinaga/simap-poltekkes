import React, {
    useMemo,
    useRef,
    useState,
} from 'react';

export default function DisposisiDetail({
    disposisi = null,
}) {
    // =====================================================
    // DATA KOSONG
    // =====================================================

    const hasDisposisi = Boolean(disposisi);

    // =====================================================
    // DATA RELASI
    // =====================================================

    const surat =
        disposisi?.surat_masuk || null;

    const tujuan =
        disposisi?.tujuan_type === 'direktur'
            ? 'Direktur'
            : disposisi?.unit?.name ||
              'Unit belum ditentukan';

    const isForDirector =
        disposisi?.tujuan_type === 'direktur';

    const isForUnit =
        disposisi?.tujuan_type === 'unit';

    const pesanList = Array.isArray(
        disposisi?.pesans
    )
        ? disposisi.pesans
        : [];

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
    // STATE CHAT
    // =====================================================

    const [pesan, setPesan] =
        useState('');

    const [filePdf, setFilePdf] =
        useState(null);

    const [sending, setSending] =
        useState(false);

    const fileInputRef =
        useRef(null);

    // =====================================================
    // PDF SURAT MASUK
    // =====================================================

    const pdfUrl = surat?.file_surat
        ? `/storage/${String(
              surat.file_surat
          ).replace(/^\/+/, '')}`
        : null;

    // =====================================================
    // ERROR VALIDASI DARI LARAVEL
    // =====================================================

    const errorMessage =
        typeof window !== 'undefined' &&
        Array.isArray(window.laravelErrors)
            ? window.laravelErrors?.[0] || ''
            : '';

    // =====================================================
    // FORMAT DATE ONLY
    // =====================================================

    const getDateKey = (value) => {
        if (!value) {
            return '';
        }

        const text =
            String(value).trim();

        const match =
            text.match(
                /^(\d{4})-(\d{2})-(\d{2})/
            );

        if (!match) {
            return '';
        }

        return `${match[1]}-${match[2]}-${match[3]}`;
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

        if (
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > 31
        ) {
            return dateKey;
        }

        return `${String(day).padStart(2, '0')} ${
            months[month - 1]
        } ${year}`;
    };

    // =====================================================
    // FORMAT DATETIME WIT
    // =====================================================

    const formatDateTime = (value) => {
        if (!value) {
            return '-';
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return String(value);
        }

        return (
            new Intl.DateTimeFormat(
                'id-ID',
                {
                    timeZone:
                        'Asia/Jayapura',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }
            ).format(date) + ' WIT'
        );
    };

    // =====================================================
    // STATUS
    // =====================================================

    const status = useMemo(() => {
        if (isForDirector) {
            return {
                label: 'Diteruskan',
                background: '#f5f3ff',
                color: '#6d28d9',
                border: '#ddd6fe',
            };
        }

        if (
            disposisi?.status ===
            'selesai'
        ) {
            return {
                label: 'Selesai',
                background:
                    '#f0fdf4',
                color: '#15803d',
                border: '#bbf7d0',
            };
        }

        if (
            disposisi?.status ===
            'in_progress'
        ) {
            return {
                label:
                    'Dalam Proses',
                background:
                    '#fff7ed',
                color: '#c2410c',
                border: '#fed7aa',
            };
        }

        return {
            label: 'Terkirim',
            background:
                '#eff6ff',
            color: '#1d4ed8',
            border: '#dbeafe',
        };
    }, [
        disposisi?.status,
        isForDirector,
    ]);

    // =====================================================
    // TODAY WIT
    // =====================================================

    const todayWIT = useMemo(() => {
        return new Intl.DateTimeFormat(
            'en-CA',
            {
                timeZone:
                    'Asia/Jayapura',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }
        ).format(new Date());
    }, []);

    // =====================================================
    // TERLAMBAT
    // =====================================================

    const terlambat = useMemo(() => {
        if (
            !disposisi?.batas_waktu ||
            disposisi?.status ===
                'selesai'
        ) {
            return false;
        }

        const deadline =
            getDateKey(
                disposisi.batas_waktu
            );

        if (!deadline) {
            return false;
        }

        return deadline < todayWIT;
    }, [
        disposisi.batas_waktu,
        disposisi.status,
        todayWIT,
    ]);

    // =====================================================
    // VALIDASI FILE
    // =====================================================

    const handleFileChange = (
        event
    ) => {
        const file =
            event.target.files?.[0] ||
            null;

        if (!file) {
            setFilePdf(null);
            return;
        }

        const isPdf =
            file.type ===
                'application/pdf' ||
            file.name
                .toLowerCase()
                .endsWith('.pdf');

        if (!isPdf) {
            window.alert(
                'File harus berupa PDF.'
            );

            event.target.value = '';

            setFilePdf(null);

            return;
        }

        const maxSize =
            10 * 1024 * 1024;

        if (file.size > maxSize) {
            window.alert(
                'Ukuran PDF maksimal 10 MB.'
            );

            event.target.value = '';

            setFilePdf(null);

            return;
        }

        setFilePdf(file);
    };

    // =====================================================
    // HAPUS FILE
    // =====================================================

    const removeSelectedFile = () => {
        setFilePdf(null);

        if (fileInputRef.current) {
            fileInputRef.current.value =
                '';
        }
    };

    // =====================================================
    // KIRIM PESAN
    // =====================================================

    const handleSubmitPesan = (
        event
    ) => {
        const text =
            pesan.trim();

        /*
        |--------------------------------------------------------------------------
        | Validasi pesan / file
        |--------------------------------------------------------------------------
        */

        if (
            !text &&
            !filePdf
        ) {
            event.preventDefault();

            window.alert(
                'Tulis pesan atau pilih file PDF terlebih dahulu.'
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Validasi ukuran PDF
        |--------------------------------------------------------------------------
        */

        if (
            filePdf &&
            filePdf.size >
                10 * 1024 * 1024
        ) {
            event.preventDefault();

            window.alert(
                'Ukuran PDF maksimal 10 MB.'
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | PENTING:
        | Jangan disable textarea/file input ketika submit.
        |
        | disabled field tidak ikut dikirim oleh native HTML form.
        |--------------------------------------------------------------------------
        */

        setSending(true);
    };

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
            arrowLeft: (
                <>
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                </>
            ),

            file: (
                <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h8M8 17h6" />
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

            external: (
                <>
                    <path d="M14 5h5v5" />
                    <path d="M10 14 19 5" />
                    <path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
                </>
            ),

            paperclip: (
                <>
                    <path d="m21.4 11.6-8.9 8.9a6 6 0 0 1-8.5-8.5l9.1-9.1a4 4 0 0 1 5.7 5.7l-9.1 9.1a2 2 0 1 1-2.8-2.8l8.5-8.5" />
                </>
            ),

            send: (
                <>
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                </>
            ),

            x: (
                <>
                    <path d="M6 6l12 12" />
                    <path d="M18 6 6 18" />
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

    if (!hasDisposisi) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f4f7fb',
                    padding: '20px',
                    fontFamily:
                        'Inter, ui-sans-serif, system-ui, sans-serif',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '520px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '18px',
                        padding: '38px',
                        textAlign: 'center',
                        boxShadow:
                            '0 15px 35px rgba(15,23,42,.06)',
                    }}
                >
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            margin: '0 auto 16px',
                            borderRadius: '16px',
                            background: '#fef2f2',
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '25px',
                            fontWeight: 850,
                        }}
                    >
                        !
                    </div>

                    <h2
                        style={{
                            margin: 0,
                            color: '#0f2747',
                            fontSize: '21px',
                            fontWeight: 800,
                        }}
                    >
                        Data disposisi tidak ditemukan
                    </h2>

                    <p
                        style={{
                            margin: '8px 0 0',
                            color: '#64748b',
                            fontSize: '12px',
                            lineHeight: 1.6,
                        }}
                    >
                        Data disposisi yang ingin dilihat
                        tidak tersedia.
                    </p>

                    <a
                        href="/sekretaris/disposisi"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '18px',
                            padding: '11px 15px',
                            borderRadius: '10px',
                            background: '#0f2747',
                            color: '#ffffff',
                            textDecoration: 'none',
                            fontSize: '11px',
                            fontWeight: 750,
                        }}
                    >
                        Kembali ke Disposisi
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="disposisi-detail-page">

            <style>{`

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                }

                .disposisi-detail-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(
                            circle at top left,
                            rgba(37,99,235,.045),
                            transparent 24%
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

                .dd-container {
                    max-width: 1250px;
                    margin: 0 auto;
                    padding:
                        28px 24px 50px;
                }

                /* =================================================
                   HEADER
                ================================================= */

                .dd-page-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .dd-kicker {
                    color: #2563eb;
                    font-size: 11px;
                    font-weight: 850;
                    letter-spacing: .7px;
                }

                .dd-title {
                    margin:
                        7px 0 0;
                    color: #0f2747;
                    font-size: 30px;
                    line-height: 1.15;
                    font-weight: 850;
                    letter-spacing: -.5px;
                }

                .dd-subtitle {
                    margin:
                        8px 0 0;
                    color: #64748b;
                    font-size: 13px;
                    line-height: 1.6;
                }

                .dd-back {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding:
                        10px 13px;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 10px;
                    background: #ffffff;
                    color: #475569;
                    text-decoration: none;
                    font-size: 11px;
                    font-weight: 750;
                    transition: .16s ease;
                    white-space: nowrap;
                }

                .dd-back:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }

                /* =================================================
                   STATUS
                ================================================= */

                .dd-status-card {
                    margin-bottom: 18px;
                    padding: 20px 22px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 17px;
                    box-shadow:
                        0 6px 20px
                        rgba(15,23,42,.025);
                }

                .dd-status-layout {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                }

                .dd-label {
                    color: #94a3b8;
                    font-size: 10px;
                    font-weight: 850;
                    letter-spacing: .6px;
                    text-transform: uppercase;
                }

                .dd-subject {
                    margin-top: 6px;
                    color: #0f2747;
                    font-size: 20px;
                    line-height: 1.45;
                    font-weight: 850;
                }

                .dd-letter-number {
                    margin-top: 5px;
                    color: #94a3b8;
                    font-size: 11px;
                }

                .dd-status-right {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 7px;
                    flex-shrink: 0;
                }

                .dd-status-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding:
                        7px 10px;
                    border-radius: 999px;
                    font-size: 10px;
                    font-weight: 850;
                }

                .dd-late-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding:
                        6px 9px;
                    border-radius: 999px;
                    background: #fef2f2;
                    border:
                        1px solid #fecaca;
                    color: #dc2626;
                    font-size: 9px;
                    font-weight: 850;
                }

                /* =================================================
                   GRID
                ================================================= */

                .dd-grid {
                    display: grid;
                    grid-template-columns:
                        minmax(0,1.45fr)
                        minmax(310px,.72fr);
                    gap: 18px;
                }

                .dd-left,
                .dd-right {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                    min-width: 0;
                }

                .dd-card {
                    overflow: hidden;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 17px;
                    box-shadow:
                        0 6px 20px
                        rgba(15,23,42,.022);
                }

                .dd-card-header {
                    padding:
                        17px 20px;
                    border-bottom:
                        1px solid #edf1f5;
                }

                .dd-card-header-inner {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #0f2747;
                    font-size: 14px;
                    font-weight: 820;
                }

                .dd-card-description {
                    margin-top: 5px;
                    color: #94a3b8;
                    font-size: 10px;
                    line-height: 1.5;
                }

                .dd-card-body {
                    padding: 20px;
                }

                /* =================================================
                   INFO
                ================================================= */

                .dd-info-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(
                            2,
                            minmax(0,1fr)
                        );
                    gap: 20px;
                }

                .dd-info-label {
                    color: #94a3b8;
                    font-size: 9px;
                    font-weight: 850;
                    text-transform: uppercase;
                    letter-spacing: .6px;
                }

                .dd-info-value {
                    margin-top: 6px;
                    color: #334155;
                    font-size: 12px;
                    line-height: 1.6;
                    font-weight: 650;
                }

                /* =================================================
                   INSTRUKSI
                ================================================= */

                .dd-instruction {
                    padding: 15px;
                    border-radius: 11px;
                    background: #f8fafc;
                    border:
                        1px solid #e2e8f0;
                    color: #475569;
                    font-size: 13px;
                    line-height: 1.7;
                    white-space: pre-line;
                }

                /* =================================================
                   ALERT
                ================================================= */

                .dd-form-alert {
                    margin:
                        0 20px 15px;
                    padding:
                        12px 13px;
                    border-radius: 10px;
                    border:
                        1px solid #fecaca;
                    background: #fef2f2;
                    color: #b91c1c;
                    font-size: 11px;
                    font-weight: 650;
                    line-height: 1.6;
                }

                /* =================================================
                   CHAT
                ================================================= */

                .dd-chat {
                    background: #f8fafc;
                    padding: 20px;
                    min-height: 250px;
                    max-height: 670px;
                    overflow-y: auto;
                }

                .dd-chat-empty {
                    min-height: 190px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 12px;
                }

                .dd-old-note {
                    margin-bottom: 14px;
                    padding: 14px;
                    border-radius: 12px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                }

                .dd-old-note-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding:
                        5px 7px;
                    border-radius: 999px;
                    background: #f8fafc;
                    border:
                        1px solid #e2e8f0;
                    color: #64748b;
                    font-size: 9px;
                    font-weight: 800;
                }

                .dd-old-note-text {
                    margin-top: 9px;
                    color: #475569;
                    font-size: 12px;
                    line-height: 1.7;
                    white-space: pre-line;
                }

                .dd-chat-row {
                    display: flex;
                    margin-bottom: 12px;
                }

                .dd-chat-row:last-child {
                    margin-bottom: 0;
                }

                .dd-chat-left {
                    justify-content: flex-start;
                }

                .dd-chat-right {
                    justify-content: flex-end;
                }

                .dd-bubble {
                    width: min(
                        720px,
                        88%
                    );
                    padding:
                        13px 15px;
                    border-radius: 14px;
                    border:
                        1px solid #e2e8f0;
                    box-shadow:
                        0 3px 10px
                        rgba(15,23,42,.02);
                }

                .dd-bubble-secretary {
                    background:
                        #eff6ff;
                    border-color:
                        #dbeafe;
                }

                .dd-bubble-unit {
                    background:
                        #ffffff;
                }

                .dd-bubble-author {
                    color: #0f2747;
                    font-size: 10px;
                    font-weight: 850;
                }

                .dd-bubble-role {
                    margin-top: 2px;
                    color: #94a3b8;
                    font-size: 9px;
                }

                .dd-bubble-text {
                    margin-top: 8px;
                    color: #334155;
                    font-size: 13px;
                    line-height: 1.7;
                    white-space: pre-line;
                    word-break: break-word;
                }

                .dd-message-file {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 11px;
                    padding: 10px;
                    border-radius: 10px;
                    background: #ffffff;
                    border:
                        1px solid #dbe3ee;
                    color: inherit;
                    text-decoration: none;
                    transition: .16s ease;
                }

                .dd-message-file:hover {
                    background: #f8fbff;
                    border-color: #93c5fd;
                }

                .dd-file-icon {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    border-radius: 9px;
                    background: #fef2f2;
                    color: #dc2626;
                    font-size: 9px;
                    font-weight: 900;
                }

                .dd-file-info {
                    min-width: 0;
                    flex: 1;
                }

                .dd-file-name {
                    color: #334155;
                    font-size: 11px;
                    font-weight: 800;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .dd-file-meta {
                    margin-top: 3px;
                    color: #94a3b8;
                    font-size: 9px;
                }

                .dd-bubble-time {
                    margin-top: 8px;
                    color: #94a3b8;
                    font-size: 9px;
                }

                /* =================================================
                   COMPOSE
                ================================================= */

                .dd-compose {
                    padding:
                        18px 20px 20px;
                    border-top:
                        1px solid #edf1f5;
                }

                .dd-compose-closed {
                    padding:
                        18px 20px;
                    background: #f8fafc;
                    border-top:
                        1px solid #edf1f5;
                }

                .dd-compose-closed-inner {
                    padding: 13px;
                    border-radius: 10px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    color: #64748b;
                    text-align: center;
                    font-size: 11px;
                }

                .dd-textarea {
                    width: 100%;
                    min-height: 115px;
                    padding: 13px;
                    resize: vertical;
                    outline: none;
                    border:
                        1px solid #dbe3ee;
                    border-radius: 11px;
                    background: #ffffff;
                    color: #334155;
                    font-family: inherit;
                    font-size: 13px;
                    line-height: 1.65;
                    transition:
                        border-color .16s ease,
                        box-shadow .16s ease,
                        background .16s ease;
                }

                .dd-textarea::placeholder {
                    color: #a0a9b8;
                }

                .dd-textarea:focus {
                    border-color: #93c5fd;
                    box-shadow:
                        0 0 0 3px
                        rgba(59,130,246,.08);
                }

                .dd-textarea[readonly] {
                    background: #fafafa;
                }

                .dd-compose-bottom {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 9px;
                    margin-top: 10px;
                }

                .dd-file-picker {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    padding:
                        10px 12px;
                    border:
                        1px solid #dbe3ee;
                    border-radius: 9px;
                    background: #ffffff;
                    color: #475569;
                    font-size: 10px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: .16s ease;
                }

                .dd-file-picker:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }

                .dd-file-picker input {
                    display: none;
                }

                .dd-selected-file {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    max-width: 390px;
                    padding:
                        8px 10px;
                    border-radius: 8px;
                    background: #fef2f2;
                    border:
                        1px solid #fecaca;
                    color: #b91c1c;
                    font-size: 9px;
                }

                .dd-selected-file-name {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .dd-remove-file {
                    width: 22px;
                    height: 22px;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 0;
                    border-radius: 6px;
                    background: transparent;
                    color: #dc2626;
                    cursor: pointer;
                }

                .dd-remove-file:hover {
                    background: #fee2e2;
                }

                .dd-send {
                    margin-left: auto;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    min-width: 140px;
                    padding:
                        10px 15px;
                    border: 0;
                    border-radius: 9px;
                    background: #0f2747;
                    color: #ffffff;
                    font-size: 10px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: .16s ease;
                }

                .dd-send:hover {
                    background: #174a7e;
                }

                .dd-send:disabled {
                    opacity: .65;
                    cursor: wait;
                }

                .dd-help {
                    margin-top: 8px;
                    color: #94a3b8;
                    font-size: 9px;
                    line-height: 1.5;
                }

                /* =================================================
                   PDF SURAT
                ================================================= */

                .dd-document {
                    overflow: hidden;
                    border-radius: 11px;
                    background: #f8fafc;
                    border:
                        1px solid #e2e8f0;
                }

                .dd-document iframe {
                    display: block;
                    width: 100%;
                    height: 650px;
                    border: 0;
                }

                .dd-pdf-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    color: #2563eb;
                    text-decoration: none;
                    font-size: 10px;
                    font-weight: 800;
                }

                .dd-pdf-link:hover {
                    text-decoration: underline;
                }

                /* =================================================
                   STATUS / RIGHT
                ================================================= */

                .dd-status-box {
                    padding: 15px;
                    border-radius: 12px;
                }

                .dd-status-title {
                    font-size: 12px;
                    font-weight: 850;
                }

                .dd-status-description {
                    margin-top: 6px;
                    font-size: 10px;
                    line-height: 1.65;
                }

                .dd-deadline-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                }

                .dd-deadline-icon {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    border-radius: 9px;
                }

                .dd-deadline-title {
                    color: #334155;
                    font-size: 11px;
                    font-weight: 850;
                }

                .dd-deadline-text {
                    margin-top: 4px;
                    color: #64748b;
                    font-size: 10px;
                    line-height: 1.6;
                }

                /* =================================================
                   RESPONSIVE
                ================================================= */

                @media (max-width: 980px) {

                    .dd-grid {
                        grid-template-columns:
                            1fr;
                    }

                }

                @media (max-width: 700px) {

                    .dd-container {
                        padding:
                            20px 15px 40px;
                    }

                    .dd-page-header {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .dd-back {
                        width: fit-content;
                    }

                    .dd-status-layout {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .dd-status-right {
                        align-items: flex-start;
                    }

                    .dd-info-grid {
                        grid-template-columns:
                            1fr;
                    }

                    .dd-bubble {
                        width: 94%;
                    }

                    .dd-document iframe {
                        height: 500px;
                    }

                }

                @media (max-width: 500px) {

                    .dd-title {
                        font-size: 25px;
                    }

                    .dd-subtitle {
                        font-size: 12px;
                    }

                    .dd-subject {
                        font-size: 17px;
                    }

                    .dd-compose-bottom {
                        align-items: stretch;
                    }

                    .dd-file-picker {
                        width: 100%;
                    }

                    .dd-send {
                        width: 100%;
                        margin-left: 0;
                    }

                    .dd-selected-file {
                        max-width: 100%;
                        width: 100%;
                    }

                }

            `}</style>

            <main className="dd-container">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="dd-page-header">

                    <div>

                        <div className="dd-kicker">
                            MONITORING DISPOSISI
                        </div>

                        <h1 className="dd-title">
                            Detail Disposisi
                        </h1>

                        <p className="dd-subtitle">
                            {isForUnit
                                ? 'Informasi lengkap, percakapan, dan tindak lanjut disposisi.'
                                : 'Informasi lengkap disposisi yang diteruskan kepada Direktur.'}
                        </p>

                    </div>

                    <a
                        href="/sekretaris/disposisi"
                        className="dd-back"
                    >
                        <Icon
                            name="arrowLeft"
                            size={14}
                        />
                        Kembali
                    </a>

                </div>

                {/* =================================================
                    STATUS HEADER
                ================================================= */}

                <section className="dd-status-card">

                    <div className="dd-status-layout">

                        <div>

                            <div className="dd-label">
                                Perihal Surat
                            </div>

                            <div className="dd-subject">
                                {surat?.perihal ||
                                    'Tanpa perihal'}
                            </div>

                            <div className="dd-letter-number">
                                {surat?.nomor_surat ||
                                    '-'}
                            </div>

                        </div>

                        <div className="dd-status-right">

                            <span
                                className="dd-status-pill"
                                style={{
                                    background:
                                        status.background,
                                    color:
                                        status.color,
                                    border:
                                        `1px solid ${status.border}`,
                                }}
                            >
                                <Icon
                                    name={
                                        isForDirector
                                            ? 'send'
                                            : disposisi.status === 'selesai'
                                                ? 'check'
                                                : 'clock'
                                    }
                                    size={12}
                                />

                                {status.label}
                            </span>

                            {terlambat && (
                                <span className="dd-late-pill">

                                    <Icon
                                        name="alert"
                                        size={10}
                                    />

                                    Terlambat

                                </span>
                            )}

                        </div>

                    </div>

                </section>

                {/* =================================================
                    GRID
                ================================================= */}

                <div className="dd-grid">

                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <div className="dd-left">

                        {/* =============================================
                            INFORMASI SURAT
                        ============================================= */}

                        <section className="dd-card">

                            <div className="dd-card-header">

                                <div className="dd-card-header-inner">

                                    <Icon
                                        name="file"
                                        size={17}
                                    />

                                    Informasi Surat

                                </div>

                            </div>

                            <div className="dd-card-body">

                                <div className="dd-info-grid">

                                    <Info
                                        label="Nomor Surat"
                                        value={
                                            surat?.nomor_surat
                                        }
                                    />

                                    <Info
                                        label="Pengirim"
                                        value={
                                            surat?.pengirim
                                        }
                                    />

                                    <Info
                                        label="Tanggal Surat"
                                        value={formatDate(
                                            surat?.tanggal_surat
                                        )}
                                    />

                                    <Info
                                        label="Tanggal Diterima"
                                        value={formatDate(
                                            surat?.tanggal_diterima
                                        )}
                                    />

                                    <Info
                                        label="Dibuat Oleh"
                                        value={
                                            surat?.creator?.name
                                        }
                                    />

                                    <Info
                                        label="Sifat Surat"
                                        value={
                                            surat?.sifat
                                        }
                                    />

                                </div>

                            </div>

                        </section>

                        {/* =============================================
                            INSTRUKSI
                        ============================================= */}

                        <section className="dd-card">

                            <div className="dd-card-header">

                                <div className="dd-card-header-inner">

                                    <Icon
                                        name="note"
                                        size={17}
                                    />

                                    Instruksi Disposisi

                                </div>

                            </div>

                            <div className="dd-card-body">

                                <div className="dd-instruction">

                                    {disposisi.instruksi ||
                                        '-'}

                                </div>

                            </div>

                        </section>

                        {isForUnit && (
                        <>
                            {/* =============================================
                                CHAT
                            ============================================= */}

                        <section className="dd-card">

                            <div className="dd-card-header">

                                <div className="dd-card-header-inner">

                                    <Icon
                                        name="send"
                                        size={17}
                                    />

                                    Percakapan Tindak Lanjut

                                </div>

                                <div className="dd-card-description">

                                    Riwayat komunikasi
                                    Sekretaris dan Unit.
                                    Setiap pesan tetap
                                    tersimpan.

                                </div>

                            </div>

                            {/* ERROR VALIDASI */}

                            {errorMessage && (
                                <div className="dd-form-alert">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="dd-chat">

                                {/* CATATAN LAMA */}

                                {disposisi.catatan_tindak_lanjut && (

                                    <div className="dd-old-note">

                                        <div className="dd-old-note-badge">

                                            <Icon
                                                name="note"
                                                size={10}
                                            />

                                            Catatan Lama

                                        </div>

                                        <div className="dd-old-note-text">

                                            {
                                                disposisi.catatan_tindak_lanjut
                                            }

                                        </div>

                                    </div>

                                )}

                                {/* PESAN CHAT */}

                                {pesanList.length === 0 &&
                                !disposisi.catatan_tindak_lanjut ? (

                                    <div className="dd-chat-empty">

                                        Belum ada pesan
                                        tindak lanjut.

                                    </div>

                                ) : (

                                    pesanList.map(
                                        (item) => {

                                            const isSecretary =
                                                Number(
                                                    item?.user?.id
                                                ) ===
                                                Number(
                                                    disposisi?.dari_user_id
                                                );

                                            return (
                                                <div
                                                    key={
                                                        item.id
                                                    }
                                                    className={`dd-chat-row ${
                                                        isSecretary
                                                            ? 'dd-chat-left'
                                                            : 'dd-chat-right'
                                                    }`}
                                                >

                                                    <div
                                                        className={`dd-bubble ${
                                                            isSecretary
                                                                ? 'dd-bubble-secretary'
                                                                : 'dd-bubble-unit'
                                                        }`}
                                                    >

                                                        <div className="dd-bubble-author">

                                                            {
                                                                item?.user?.name ||
                                                                'Pengguna'
                                                            }

                                                        </div>

                                                        <div className="dd-bubble-role">

                                                            {isSecretary
                                                                ? 'Sekretaris Direktur'
                                                                : tujuan}

                                                        </div>

                                                        {item.pesan && (

                                                            <div className="dd-bubble-text">

                                                                {
                                                                    item.pesan
                                                                }

                                                            </div>

                                                        )}

                                                        {item.file_url && (

                                                            <a
                                                                href={
                                                                    item.file_url
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="dd-message-file"
                                                            >

                                                                <div className="dd-file-icon">
                                                                    PDF
                                                                </div>

                                                                <div className="dd-file-info">

                                                                    <div className="dd-file-name">

                                                                        {
                                                                            item.file_nama ||
                                                                            'Dokumen PDF'
                                                                        }

                                                                    </div>

                                                                    <div className="dd-file-meta">

                                                                        {
                                                                            item.file_size_label ||
                                                                            'PDF'
                                                                        }

                                                                        {' · '}
                                                                        Klik untuk
                                                                        membuka

                                                                    </div>

                                                                </div>

                                                                <Icon
                                                                    name="external"
                                                                    size={14}
                                                                />

                                                            </a>

                                                        )}

                                                        <div className="dd-bubble-time">

                                                            {
                                                                formatDateTime(
                                                                    item.created_at
                                                                )
                                                            }

                                                        </div>

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )

                                )}

                            </div>

                            {/* COMPOSE */}

                            {disposisi.status ===
                            'selesai' ? (

                                <div className="dd-compose-closed">

                                    <div className="dd-compose-closed-inner">

                                        Disposisi sudah selesai.
                                        Percakapan hanya dapat
                                        dilihat.

                                    </div>

                                </div>

                            ) : (

                                <form
                                    method="POST"
                                    action={`/sekretaris/disposisi/${disposisi.id}/pesan`}
                                    encType="multipart/form-data"
                                    className="dd-compose"
                                    onSubmit={
                                        handleSubmitPesan
                                    }
                                >

                                    <input
                                        type="hidden"
                                        name="_token"
                                        value={
                                            csrfToken
                                        }
                                    />

                                    {/*
                                    |--------------------------------------------------------------------------
                                    | Hidden copy:
                                    | memastikan nilai pesan tetap terkirim
                                    |--------------------------------------------------------------------------
                                    */}

                                    <input
                                        type="hidden"
                                        name="pesan_backup"
                                        value={pesan}
                                    />

                                    <textarea
                                        name="pesan"
                                        value={
                                            pesan
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setPesan(
                                                event.target
                                                    .value
                                            )
                                        }
                                        className="dd-textarea"
                                        placeholder="Tulis balasan untuk unit..."
                                        readOnly={
                                            sending
                                        }
                                    />

                                    <div className="dd-compose-bottom">

                                        <label className="dd-file-picker">

                                            <Icon
                                                name="paperclip"
                                                size={14}
                                            />

                                            Lampirkan PDF

                                            <input
                                                ref={
                                                    fileInputRef
                                                }
                                                type="file"
                                                name="file_pdf"
                                                accept="application/pdf,.pdf"
                                                onChange={
                                                    handleFileChange
                                                }
                                            />

                                        </label>

                                        {filePdf && (

                                            <div className="dd-selected-file">

                                                <Icon
                                                    name="file"
                                                    size={13}
                                                />

                                                <span className="dd-selected-file-name">

                                                    {
                                                        filePdf.name
                                                    }

                                                </span>

                                                <button
                                                    type="button"
                                                    className="dd-remove-file"
                                                    onClick={
                                                        removeSelectedFile
                                                    }
                                                    title="Hapus file"
                                                >

                                                    <Icon
                                                        name="x"
                                                        size={13}
                                                    />

                                                </button>

                                            </div>

                                        )}

                                        <button
                                            type="submit"
                                            className="dd-send"
                                            disabled={
                                                sending
                                            }
                                        >

                                            <Icon
                                                name="send"
                                                size={13}
                                            />

                                            {sending
                                                ? 'Mengirim...'
                                                : 'Kirim Balasan'}

                                        </button>

                                    </div>

                                    <div className="dd-help">

                                        Format lampiran:
                                        PDF, maksimal
                                        10 MB.

                                    </div>

                                </form>

                            )}

                        </section>
                        </>
                        )}

                        {/* =============================================
                            DOKUMEN SURAT
                        ============================================= */}

                        {pdfUrl && (

                            <section className="dd-card">

                                <div className="dd-card-header">

                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems:
                                                'center',
                                            justifyContent:
                                                'space-between',
                                            gap: '12px',
                                        }}
                                    >

                                        <div>

                                            <div className="dd-card-header-inner">

                                                <Icon
                                                    name="file"
                                                    size={17}
                                                />

                                                Dokumen Surat

                                            </div>

                                            <div className="dd-card-description">

                                                Preview PDF surat
                                                masuk.

                                            </div>

                                        </div>

                                        <a
                                            href={
                                                pdfUrl
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="dd-pdf-link"
                                        >

                                            <Icon
                                                name="external"
                                                size={12}
                                            />

                                            Buka PDF

                                        </a>

                                    </div>

                                </div>

                                <div className="dd-card-body">

                                    <div className="dd-document">

                                        <iframe
                                            src={
                                                pdfUrl
                                            }
                                            title="Preview Dokumen Surat"
                                        />

                                    </div>

                                </div>

                            </section>

                        )}

                    </div>

                    {/* =================================================
                        RIGHT
                    ================================================= */}

                    <div className="dd-right">

                        {/* =============================================
                            INFORMASI DISPOSISI
                        ============================================= */}

                        <section className="dd-card">

                            <div className="dd-card-header">

                                <div className="dd-card-header-inner">

                                    Informasi Disposisi

                                </div>

                            </div>

                            <div className="dd-card-body">

                                <div
                                    style={{
                                        display:
                                            'flex',
                                        flexDirection:
                                            'column',
                                        gap: '18px',
                                    }}
                                >

                                    <Info
                                        label="Tujuan"
                                        value={
                                            tujuan
                                        }
                                        icon={
                                            disposisi.tujuan_type ===
                                            'direktur'
                                                ? 'user'
                                                : 'building'
                                        }
                                    />

                                    <Info
                                        label="Dikirim Oleh"
                                        value={
                                            disposisi
                                                .dari_user
                                                ?.name
                                        }
                                    />

                                    <Info
                                        label="Sifat Disposisi"
                                        value={
                                            disposisi.sifat
                                        }
                                    />

                                    <Info
                                        label="Tanggal Disposisi"
                                        value={formatDateTime(
                                            disposisi.tanggal_disposisi
                                        )}
                                    />

                                    <Info
                                        label="Batas Waktu"
                                        value={formatDate(
                                            disposisi.batas_waktu
                                        )}
                                    />

                                    {isForUnit &&
                                    disposisi.status ===
                                        'selesai' && (

                                        <Info
                                            label="Diselesaikan"
                                            value={formatDateTime(
                                                disposisi.selesai_at
                                            )}
                                        />

                                    )}

                                </div>

                            </div>

                        </section>

                        {isForUnit && (
                        <>
                            {/* =============================================
                                STATUS
                            ============================================= */}

                        <section className="dd-card">

                            <div className="dd-card-header">

                                <div className="dd-card-header-inner">

                                    Status Pekerjaan

                                </div>

                            </div>

                            <div className="dd-card-body">

                                <div
                                    className="dd-status-box"
                                    style={{
                                        background:
                                            status.background,
                                        border:
                                            `1px solid ${status.border}`,
                                        color:
                                            status.color,
                                    }}
                                >

                                    <div className="dd-status-title">

                                        {status.label}

                                    </div>

                                    <div
                                        className="dd-status-description"
                                        style={{
                                            color:
                                                status.color,
                                        }}
                                    >

                                        {disposisi.status ===
                                        'terkirim'
                                            ? 'Disposisi sudah dikirim dan menunggu tindak lanjut unit.'
                                            : disposisi.status ===
                                              'in_progress'
                                            ? 'Unit sedang mengerjakan disposisi ini.'
                                            : 'Unit telah menyelesaikan disposisi dan memberikan tindak lanjut.'}

                                    </div>

                                </div>

                            </div>

                        </section>
                        </>
                        )}

                        {/* =============================================
                            DEADLINE
                        ============================================= */}

                        <section className="dd-card">

                            <div className="dd-card-body">

                                <div className="dd-deadline-row">

                                    <div
                                        className="dd-deadline-icon"
                                        style={{
                                            background:
                                                terlambat
                                                    ? '#fef2f2'
                                                    : '#eff6ff',
                                            color:
                                                terlambat
                                                    ? '#dc2626'
                                                    : '#2563eb',
                                        }}
                                    >

                                        <Icon
                                            name={
                                                terlambat
                                                    ? 'alert'
                                                    : 'calendar'
                                            }
                                            size={17}
                                        />

                                    </div>

                                    <div>

                                        <div className="dd-deadline-title">

                                            {terlambat
                                                ? 'Disposisi Terlambat'
                                                : 'Batas Waktu Disposisi'}

                                        </div>

                                        <div
                                            className="dd-deadline-text"
                                            style={{
                                                color:
                                                    terlambat
                                                        ? '#dc2626'
                                                        : '#64748b',
                                            }}
                                        >

                                            Batas:
                                            {' '}

                                            <strong>
                                                {formatDate(
                                                    disposisi.batas_waktu
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </section>

                    </div>

                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div
                    style={{
                        padding:
                            '26px 0 8px',
                        textAlign:
                            'center',
                        color:
                            '#94a3b8',
                        fontSize:
                            '10px',
                    }}
                >
                    SIMAP Poltekkes Maluku
                </div>

            </main>

        </div>
    );
}


// =====================================================
// INFO COMPONENT
// =====================================================

function Info({
    label,
    value,
    icon = null,
}) {
    return (
        <div>

            <div
                className="dd-info-label"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                }}
            >

                {icon === 'building' && (
                    <IconInline
                        name="building"
                        size={12}
                    />
                )}

                {icon === 'user' && (
                    <IconInline
                        name="user"
                        size={12}
                    />
                )}

                {label}

            </div>

            <div className="dd-info-value">
                {value || '-'}
            </div>

        </div>
    );
}


// =====================================================
// SMALL ICON
// =====================================================

function IconInline({
    name,
    size = 14,
}) {
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

    if (name === 'building') {
        return (
            <svg {...common}>
                <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
                <path d="M8 7h2M14 7h2M8 11h2M14 11h2" />
            </svg>
        );
    }

    if (name === 'user') {
        return (
            <svg {...common}>
                <circle
                    cx="12"
                    cy="8"
                    r="3.5"
                />

                <path d="M5 20c.8-3.4 3.1-5 7-5s6.2 1.6 7 5" />
            </svg>
        );
    }

    return null;
}