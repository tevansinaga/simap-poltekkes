import React, {
    useMemo,
    useRef,
    useState,
} from 'react';

export default function DisposisiUnitDetail({
    disposisi = null,
}) {
    // =====================================================
    // DATA KOSONG
    // =====================================================

    if (!disposisi) {
        return (
            <div className="unit-detail-empty">
                <div className="unit-empty-card">
                    <div className="unit-empty-icon">
                        !
                    </div>

                    <h1>
                        Data tidak ditemukan
                    </h1>

                    <p>
                        Data disposisi yang ingin
                        dilihat tidak tersedia.
                    </p>

                    <a href="/unit/disposisi">
                        Kembali ke disposisi
                    </a>
                </div>
            </div>
        );
    }

    // =====================================================
    // DATA RELASI
    // =====================================================

    const surat =
        disposisi?.surat_masuk || null;

    const tujuan =
        disposisi?.unit?.name ||
        'Unit';

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
    // PDF SURAT
    // =====================================================

    const pdfUrl = surat?.file_surat
        ? `/storage/${String(
              surat.file_surat
          ).replace(/^\/+/, '')}`
        : null;

    // =====================================================
    // STATUS
    // =====================================================

    const status = useMemo(() => {
        if (
            disposisi.status ===
            'selesai'
        ) {
            return {
                label: 'Selesai',
                background: '#ecfdf5',
                color: '#047857',
                border: '#a7f3d0',
            };
        }

        if (
            disposisi.status ===
            'in_progress'
        ) {
            return {
                label: 'Dalam Proses',
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '#bfdbfe',
            };
        }

        return {
            label: 'Terkirim',
            background: '#fffbeb',
            color: '#b45309',
            border: '#fde68a',
        };
    }, [
        disposisi.status,
    ]);

    // =====================================================
    // STATUS DESCRIPTION
    // =====================================================

    const statusDescription = useMemo(() => {
        if (
            disposisi.status ===
            'selesai'
        ) {
            return 'Disposisi telah diselesaikan oleh unit.';
        }

        if (
            disposisi.status ===
            'in_progress'
        ) {
            return 'Unit sedang mengerjakan disposisi ini.';
        }

        return 'Disposisi telah dikirim dan menunggu tindak lanjut unit.';
    }, [
        disposisi.status,
    ]);

    // =====================================================
    // DATE ONLY
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

    const formatTanggal = (value) => {
        if (!value) {
            return '-';
        }

        const text = String(value).trim();
        const match = text.match(
            /^(\d{4})-(\d{2})-(\d{2})/
        );

        if (!match) {
            return String(value);
        }

        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);

        const months = [
            'Januari','Februari','Maret','April','Mei','Juni',
            'Juli','Agustus','September','Oktober','November','Desember',
        ];

        const daysInMonth = [
            31,
            (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28,
            31,30,31,30,31,31,30,31,30,31,
        ];

        if (
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > daysInMonth[month - 1]
        ) {
            return String(value);
        }

        // DATE-only: tampilkan persis tanggal kalender yang disimpan.
        // Tidak ada konversi timezone dan tidak ada new Date(value).
        return `${String(day).padStart(2, '0')} ${months[month - 1]} ${year}`;
    };

    // =====================================================
    // DATETIME WIT
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
    // FILE PDF
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
        | Pesan atau PDF wajib salah satu
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
        | PDF maksimal 10 MB
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
        | Jangan menggunakan disabled pada field.
        | Field disabled tidak ikut dikirim oleh browser.
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

            play: (
                <>
                    <path d="m8 5 11 7-11 7V5Z" />
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
        <div className="unit-detail-page">

            <style>{`
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                }

                .unit-detail-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(
                            circle at top left,
                            rgba(16,185,129,.05),
                            transparent 26%
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

                /* =================================================
                   EMPTY
                ================================================= */

                .unit-detail-empty {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f5f7fb;
                    padding: 20px;
                }

                .unit-empty-card {
                    width: min(100%, 500px);
                    padding: 36px;
                    text-align: center;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    box-shadow:
                        0 16px 40px
                        rgba(15,23,42,.06);
                }

                .unit-empty-icon {
                    width: 58px;
                    height: 58px;
                    margin: 0 auto 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 16px;
                    background: #fef2f2;
                    color: #dc2626;
                    font-size: 25px;
                    font-weight: 850;
                }

                .unit-empty-card h1 {
                    margin: 0;
                    color: #0f2747;
                    font-size: 21px;
                    font-weight: 850;
                }

                .unit-empty-card p {
                    margin: 8px 0 0;
                    color: #64748b;
                    font-size: 12px;
                    line-height: 1.6;
                }

                .unit-empty-card a {
                    display: inline-flex;
                    margin-top: 18px;
                    padding: 11px 15px;
                    border-radius: 10px;
                    background: #0f2747;
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 11px;
                    font-weight: 800;
                }

                /* =================================================
                   LAYOUT
                ================================================= */

                .ud-container {
                    max-width: 1250px;
                    margin: 0 auto;
                    padding:
                        28px 24px 50px;
                }

                .ud-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .ud-kicker {
                    color: #059669;
                    font-size: 11px;
                    font-weight: 850;
                    letter-spacing: .7px;
                }

                .ud-title {
                    margin:
                        7px 0 0;
                    color: #0f2747;
                    font-size: 30px;
                    line-height: 1.15;
                    font-weight: 850;
                    letter-spacing: -.5px;
                }

                .ud-subtitle {
                    margin:
                        8px 0 0;
                    color: #64748b;
                    font-size: 13px;
                    line-height: 1.6;
                }

                .ud-back {
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
                    white-space: nowrap;
                }

                .ud-back:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }

                /* =================================================
                   STATUS HEADER
                ================================================= */

                .ud-status-card {
                    margin-bottom: 18px;
                    padding:
                        20px 22px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 17px;
                    box-shadow:
                        0 6px 20px
                        rgba(15,23,42,.025);
                }

                .ud-status-layout {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                }

                .ud-label {
                    color: #94a3b8;
                    font-size: 10px;
                    font-weight: 850;
                    letter-spacing: .6px;
                    text-transform: uppercase;
                }

                .ud-subject {
                    margin-top: 6px;
                    color: #0f2747;
                    font-size: 20px;
                    line-height: 1.45;
                    font-weight: 850;
                }

                .ud-number {
                    margin-top: 5px;
                    color: #94a3b8;
                    font-size: 11px;
                }

                .ud-status-right {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 7px;
                    flex-shrink: 0;
                }

                .ud-status-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding:
                        7px 10px;
                    border-radius: 999px;
                    font-size: 10px;
                    font-weight: 850;
                }

                .ud-late-pill {
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

                .ud-grid {
                    display: grid;
                    grid-template-columns:
                        minmax(0,1.45fr)
                        minmax(310px,.72fr);
                    gap: 18px;
                }

                .ud-left,
                .ud-right {
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .ud-card {
                    overflow: hidden;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 17px;
                    box-shadow:
                        0 6px 20px
                        rgba(15,23,42,.022);
                }

                .ud-card-header {
                    padding:
                        17px 20px;
                    border-bottom:
                        1px solid #edf1f5;
                }

                .ud-card-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #0f2747;
                    font-size: 14px;
                    font-weight: 820;
                }

                .ud-card-description {
                    margin-top: 5px;
                    color: #94a3b8;
                    font-size: 10px;
                    line-height: 1.5;
                }

                .ud-card-body {
                    padding: 20px;
                }

                /* =================================================
                   INFO
                ================================================= */

                .ud-info-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(
                            2,
                            minmax(0,1fr)
                        );
                    gap: 20px;
                }

                .ud-info-label {
                    color: #94a3b8;
                    font-size: 9px;
                    font-weight: 850;
                    text-transform: uppercase;
                    letter-spacing: .6px;
                }

                .ud-info-value {
                    margin-top: 6px;
                    color: #334155;
                    font-size: 12px;
                    line-height: 1.6;
                    font-weight: 650;
                }

                /* =================================================
                   INSTRUKSI
                ================================================= */

                .ud-instruction {
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
                   CHAT
                ================================================= */

                .ud-chat {
                    min-height: 250px;
                    max-height: 670px;
                    overflow-y: auto;
                    padding: 20px;
                    background: #f8fafc;
                }

                .ud-chat-empty {
                    min-height: 190px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 12px;
                }

                .ud-old-note {
                    margin-bottom: 14px;
                    padding: 14px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 12px;
                }

                .ud-old-note-badge {
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

                .ud-old-note-text {
                    margin-top: 9px;
                    color: #475569;
                    font-size: 12px;
                    line-height: 1.7;
                    white-space: pre-line;
                }

                .ud-chat-row {
                    display: flex;
                    margin-bottom: 12px;
                }

                .ud-chat-row:last-child {
                    margin-bottom: 0;
                }

                .ud-chat-left {
                    justify-content: flex-start;
                }

                .ud-chat-right {
                    justify-content: flex-end;
                }

                .ud-bubble {
                    width: min(
                        720px,
                        88%
                    );
                    padding:
                        13px 15px;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 14px;
                    box-shadow:
                        0 3px 10px
                        rgba(15,23,42,.02);
                }

                .ud-bubble-secretary {
                    background:
                        #eff6ff;
                    border-color:
                        #dbeafe;
                }

                .ud-bubble-unit {
                    background:
                        #ecfdf5;
                    border-color:
                        #d1fae5;
                }

                .ud-bubble-author {
                    color: #0f2747;
                    font-size: 10px;
                    font-weight: 850;
                }

                .ud-bubble-role {
                    margin-top: 2px;
                    color: #94a3b8;
                    font-size: 9px;
                }

                .ud-bubble-text {
                    margin-top: 8px;
                    color: #334155;
                    font-size: 13px;
                    line-height: 1.7;
                    white-space: pre-line;
                    word-break: break-word;
                }

                /* =================================================
                   FILE CHAT
                ================================================= */

                .ud-message-file {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 11px;
                    padding: 10px;
                    border:
                        1px solid #dbe3ee;
                    border-radius: 10px;
                    background: #ffffff;
                    color: inherit;
                    text-decoration: none;
                    transition: .16s ease;
                }

                .ud-message-file:hover {
                    background: #f8fbff;
                    border-color: #93c5fd;
                }

                .ud-file-icon {
                    width: 40px;
                    height: 40px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 9px;
                    background: #fef2f2;
                    color: #dc2626;
                    font-size: 9px;
                    font-weight: 900;
                }

                .ud-file-info {
                    min-width: 0;
                    flex: 1;
                }

                .ud-file-name {
                    color: #334155;
                    font-size: 11px;
                    font-weight: 800;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .ud-file-meta {
                    margin-top: 3px;
                    color: #94a3b8;
                    font-size: 9px;
                }

                .ud-bubble-time {
                    margin-top: 8px;
                    color: #94a3b8;
                    font-size: 9px;
                }

                /* =================================================
                   COMPOSE
                ================================================= */

                .ud-compose {
                    padding:
                        18px 20px 20px;
                    border-top:
                        1px solid #edf1f5;
                }

                .ud-compose-closed {
                    padding:
                        18px 20px;
                    background: #f8fafc;
                    border-top:
                        1px solid #edf1f5;
                }

                .ud-compose-closed-inner {
                    padding: 13px;
                    text-align: center;
                    color: #64748b;
                    font-size: 11px;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 10px;
                    background: #ffffff;
                }

                .ud-textarea {
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
                        box-shadow .16s ease;
                }

                .ud-textarea::placeholder {
                    color: #a0a9b8;
                }

                .ud-textarea:focus {
                    border-color: #6ee7b7;
                    box-shadow:
                        0 0 0 3px
                        rgba(16,185,129,.08);
                }

                .ud-textarea[readonly] {
                    background: #fafafa;
                }

                .ud-compose-bottom {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 9px;
                    margin-top: 10px;
                }

                .ud-file-picker {
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

                .ud-file-picker:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }

                .ud-file-picker input {
                    display: none;
                }

                .ud-selected-file {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    max-width: 390px;
                    padding:
                        8px 10px;
                    border:
                        1px solid #fecaca;
                    border-radius: 8px;
                    background: #fef2f2;
                    color: #b91c1c;
                    font-size: 9px;
                }

                .ud-selected-file-name {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .ud-remove-file {
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

                .ud-remove-file:hover {
                    background: #fee2e2;
                }

                .ud-send {
                    min-width: 135px;
                    margin-left: auto;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
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

                .ud-send:hover {
                    background: #174a7e;
                }

                .ud-send:disabled {
                    opacity: .65;
                    cursor: wait;
                }

                .ud-help {
                    margin-top: 8px;
                    color: #94a3b8;
                    font-size: 9px;
                    line-height: 1.5;
                }

                /* =================================================
                   PDF
                ================================================= */

                .ud-document {
                    overflow: hidden;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 11px;
                    background: #f8fafc;
                }

                .ud-document iframe {
                    display: block;
                    width: 100%;
                    height: 650px;
                    border: 0;
                }

                .ud-pdf-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    color: #2563eb;
                    font-size: 10px;
                    font-weight: 800;
                    text-decoration: none;
                }

                .ud-pdf-link:hover {
                    text-decoration: underline;
                }

                /* =================================================
                   STATUS BOX
                ================================================= */

                .ud-status-box {
                    padding: 15px;
                    border-radius: 12px;
                }

                .ud-status-title {
                    font-size: 12px;
                    font-weight: 850;
                }

                .ud-status-description {
                    margin-top: 6px;
                    font-size: 10px;
                    line-height: 1.65;
                }

                /* =================================================
                   ACTIONS
                ================================================= */

                .ud-action {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                }

                .ud-action-title {
                    color: #0f2747;
                    font-size: 13px;
                    font-weight: 800;
                }

                .ud-action-text {
                    margin-top: 5px;
                    color: #64748b;
                    font-size: 10px;
                    line-height: 1.6;
                }

                .ud-action-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    flex-shrink: 0;
                    padding:
                        11px 15px;
                    border: 0;
                    border-radius: 10px;
                    color: #ffffff;
                    font-size: 10px;
                    font-weight: 800;
                    cursor: pointer;
                }

                .ud-action-blue {
                    background: #2563eb;
                }

                .ud-action-blue:hover {
                    background: #1d4ed8;
                }

                .ud-action-green {
                    background: #059669;
                }

                .ud-action-green:hover {
                    background: #047857;
                }

                /* =================================================
                   DONE
                ================================================= */

                .ud-done-box {
                    padding: 16px;
                    border:
                        1px solid #a7f3d0;
                    border-radius: 12px;
                    background: #ecfdf5;
                }

                .ud-done-title {
                    color: #047857;
                    font-size: 13px;
                    font-weight: 850;
                }

                .ud-done-text {
                    margin-top: 5px;
                    color: #059669;
                    font-size: 10px;
                    line-height: 1.6;
                }

                /* =================================================
                   DEADLINE
                ================================================= */

                .ud-deadline-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                }

                .ud-deadline-icon {
                    width: 36px;
                    height: 36px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 9px;
                }

                .ud-deadline-title {
                    color: #334155;
                    font-size: 11px;
                    font-weight: 850;
                }

                .ud-deadline-text {
                    margin-top: 4px;
                    color: #64748b;
                    font-size: 10px;
                    line-height: 1.6;
                }

                /* =================================================
                   FOOTER
                ================================================= */

                .ud-footer {
                    padding:
                        26px 0 8px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 10px;
                }

                /* =================================================
                   RESPONSIVE
                ================================================= */

                @media (max-width: 980px) {
                    .ud-grid {
                        grid-template-columns:
                            1fr;
                    }
                }

                @media (max-width: 700px) {
                    .ud-container {
                        padding:
                            20px 15px 40px;
                    }

                    .ud-header {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .ud-back {
                        width: fit-content;
                    }

                    .ud-status-layout {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .ud-status-right {
                        align-items: flex-start;
                    }

                    .ud-info-grid {
                        grid-template-columns:
                            1fr;
                    }

                    .ud-bubble {
                        width: 94%;
                    }

                    .ud-document iframe {
                        height: 500px;
                    }

                    .ud-action {
                        align-items: stretch;
                        flex-direction: column;
                    }

                    .ud-action-button {
                        width: 100%;
                    }
                }

                @media (max-width: 500px) {
                    .ud-title {
                        font-size: 25px;
                    }

                    .ud-subtitle {
                        font-size: 12px;
                    }

                    .ud-subject {
                        font-size: 17px;
                    }

                    .ud-file-picker {
                        width: 100%;
                    }

                    .ud-send {
                        width: 100%;
                        margin-left: 0;
                    }

                    .ud-selected-file {
                        width: 100%;
                        max-width: 100%;
                    }
                }
            `}</style>

            <main className="ud-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="ud-header">

                    <div>

                        <div className="ud-kicker">
                            UNIT · MONITORING DISPOSISI
                        </div>

                        <h1 className="ud-title">
                            Detail Disposisi
                        </h1>

                        <p className="ud-subtitle">
                            Informasi surat,
                            instruksi,
                            percakapan, dan
                            tindak lanjut unit.
                        </p>

                    </div>

                    <a
                        href="/unit/disposisi"
                        className="ud-back"
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

                <section className="ud-status-card">

                    <div className="ud-status-layout">

                        <div>

                            <div className="ud-label">
                                Perihal Surat
                            </div>

                            <div className="ud-subject">
                                {surat?.perihal ||
                                    'Tanpa perihal'}
                            </div>

                            <div className="ud-number">
                                {surat?.nomor_surat ||
                                    '-'}
                            </div>

                        </div>

                        <div className="ud-status-right">

                            <span
                                className="ud-status-pill"
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
                                        disposisi.status ===
                                        'selesai'
                                            ? 'check'
                                            : 'clock'
                                    }
                                    size={12}
                                />

                                {status.label}
                            </span>

                            {terlambat && (
                                <span className="ud-late-pill">

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

                <div className="ud-grid">

                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <div className="ud-left">

                        {/* =============================================
                            INFORMASI SURAT
                        ============================================= */}

                        <section className="ud-card">

                            <div className="ud-card-header">

                                <div className="ud-card-title">

                                    <Icon
                                        name="file"
                                        size={17}
                                    />

                                    Informasi Surat

                                </div>

                            </div>

                            <div className="ud-card-body">

                                <div className="ud-info-grid">

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
                                        value={formatTanggal(
                                            surat?.tanggal_surat
                                        )}
                                    />

                                    <Info
                                        label="Tanggal Diterima"
                                        value={formatTanggal(
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

                        <section className="ud-card">

                            <div className="ud-card-header">

                                <div className="ud-card-title">

                                    <Icon
                                        name="note"
                                        size={17}
                                    />

                                    Instruksi Disposisi

                                </div>

                            </div>

                            <div className="ud-card-body">

                                <div className="ud-instruction">

                                    {disposisi.instruksi ||
                                        '-'}

                                </div>

                            </div>

                        </section>

                        {/* =============================================
                            CHAT
                        ============================================= */}

                        <section className="ud-card">

                            <div className="ud-card-header">

                                <div className="ud-card-title">

                                    <Icon
                                        name="send"
                                        size={17}
                                    />

                                    Percakapan Tindak Lanjut

                                </div>

                                <div className="ud-card-description">

                                    Komunikasi antara
                                    Unit dan Sekretaris.
                                    Setiap pesan tetap
                                    tersimpan.

                                </div>

                            </div>

                            <div className="ud-chat">

                                {/* CATATAN LAMA */}

                                {disposisi.catatan_tindak_lanjut && (

                                    <div className="ud-old-note">

                                        <div className="ud-old-note-badge">

                                            <Icon
                                                name="note"
                                                size={10}
                                            />

                                            Catatan Lama

                                        </div>

                                        <div className="ud-old-note-text">

                                            {
                                                disposisi.catatan_tindak_lanjut
                                            }

                                        </div>

                                    </div>

                                )}

                                {/* CHAT */}

                                {pesanList.length === 0 &&
                                !disposisi.catatan_tindak_lanjut ? (

                                    <div className="ud-chat-empty">

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
                                                    className={`ud-chat-row ${
                                                        isSecretary
                                                            ? 'ud-chat-left'
                                                            : 'ud-chat-right'
                                                    }`}
                                                >

                                                    <div
                                                        className={`ud-bubble ${
                                                            isSecretary
                                                                ? 'ud-bubble-secretary'
                                                                : 'ud-bubble-unit'
                                                        }`}
                                                    >

                                                        <div className="ud-bubble-author">

                                                            {
                                                                item?.user?.name ||
                                                                'Pengguna'
                                                            }

                                                        </div>

                                                        <div className="ud-bubble-role">

                                                            {isSecretary
                                                                ? 'Sekretaris Direktur'
                                                                : tujuan}

                                                        </div>

                                                        {item.pesan && (

                                                            <div className="ud-bubble-text">

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
                                                                className="ud-message-file"
                                                            >

                                                                <div className="ud-file-icon">
                                                                    PDF
                                                                </div>

                                                                <div className="ud-file-info">

                                                                    <div className="ud-file-name">

                                                                        {
                                                                            item.file_nama ||
                                                                            'Dokumen PDF'
                                                                        }

                                                                    </div>

                                                                    <div className="ud-file-meta">

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

                                                        <div className="ud-bubble-time">

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

                                <div className="ud-compose-closed">

                                    <div className="ud-compose-closed-inner">

                                        Disposisi sudah selesai.
                                        Percakapan hanya dapat
                                        dilihat.

                                    </div>

                                </div>

                            ) : (

                                <form
                                    method="POST"
                                    action={`/unit/disposisi/${disposisi.id}/pesan`}
                                    encType="multipart/form-data"
                                    className="ud-compose"
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
                                        className="ud-textarea"
                                        placeholder="Tulis balasan atau hasil tindak lanjut untuk Sekretaris..."
                                        readOnly={
                                            sending
                                        }
                                    />

                                    <div className="ud-compose-bottom">

                                        <label className="ud-file-picker">

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

                                            <div className="ud-selected-file">

                                                <Icon
                                                    name="file"
                                                    size={13}
                                                />

                                                <span className="ud-selected-file-name">

                                                    {
                                                        filePdf.name
                                                    }

                                                </span>

                                                <button
                                                    type="button"
                                                    className="ud-remove-file"
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
                                            className="ud-send"
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
                                                : 'Kirim Pesan'}

                                        </button>

                                    </div>

                                    <div className="ud-help">

                                        Format lampiran:
                                        PDF, maksimal
                                        10 MB. Pesan
                                        tanpa PDF juga
                                        diperbolehkan.

                                    </div>

                                </form>

                            )}

                        </section>

                        {/* =============================================
                            DOKUMEN SURAT
                        ============================================= */}

                        {pdfUrl && (

                            <section className="ud-card">

                                <div className="ud-card-header">

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

                                            <div className="ud-card-title">

                                                <Icon
                                                    name="file"
                                                    size={17}
                                                />

                                                Dokumen Surat

                                            </div>

                                            <div className="ud-card-description">

                                                Preview PDF
                                                surat masuk.

                                            </div>

                                        </div>

                                        <a
                                            href={
                                                pdfUrl
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ud-pdf-link"
                                        >

                                            <Icon
                                                name="external"
                                                size={12}
                                            />

                                            Buka PDF

                                        </a>

                                    </div>

                                </div>

                                <div className="ud-card-body">

                                    <div className="ud-document">

                                        <iframe
                                            src={
                                                pdfUrl
                                            }
                                            title="Preview Surat"
                                        />

                                    </div>

                                </div>

                            </section>

                        )}

                    </div>

                    {/* =================================================
                        RIGHT
                    ================================================= */}

                    <div className="ud-right">

                        {/* =============================================
                            INFORMASI DISPOSISI
                        ============================================= */}

                        <section className="ud-card">

                            <div className="ud-card-header">

                                <div className="ud-card-title">
                                    Informasi Disposisi
                                </div>

                            </div>

                            <div className="ud-card-body">

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
                                        label="Unit Tujuan"
                                        value={
                                            tujuan
                                        }
                                        icon="building"
                                    />

                                    <Info
                                        label="Dikirim Oleh"
                                        value={
                                            disposisi
                                                .dari_user
                                                ?.name
                                        }
                                        icon="user"
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
                                        value={formatTanggal(
                                            disposisi.batas_waktu
                                        )}
                                    />

                                    {disposisi.status ===
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

                        {/* =============================================
                            STATUS
                        ============================================= */}

                        <section className="ud-card">

                            <div className="ud-card-header">

                                <div className="ud-card-title">
                                    Status Pekerjaan
                                </div>

                            </div>

                            <div className="ud-card-body">

                                <div
                                    className="ud-status-box"
                                    style={{
                                        background:
                                            status.background,
                                        border:
                                            `1px solid ${status.border}`,
                                        color:
                                            status.color,
                                    }}
                                >

                                    <div className="ud-status-title">

                                        {status.label}

                                    </div>

                                    <div
                                        className="ud-status-description"
                                        style={{
                                            color:
                                                status.color,
                                        }}
                                    >
                                        {statusDescription}
                                    </div>

                                </div>

                            </div>

                        </section>

                        {/* =============================================
                            ACTION STATUS
                        ============================================= */}

                        <section className="ud-card">

                            <div className="ud-card-body">

                                {disposisi.status ===
                                    'terkirim' && (

                                    <form
                                        method="POST"
                                        action={`/unit/disposisi/${disposisi.id}/mulai`}
                                    >

                                        <input
                                            type="hidden"
                                            name="_token"
                                            value={
                                                csrfToken
                                            }
                                        />

                                        <div className="ud-action">

                                            <div>

                                                <div className="ud-action-title">

                                                    Mulai Pengerjaan

                                                </div>

                                                <div className="ud-action-text">

                                                    Tandai disposisi
                                                    sebagai sedang
                                                    dikerjakan oleh
                                                    unit.

                                                </div>

                                            </div>

                                            <button
                                                type="submit"
                                                className="ud-action-button ud-action-blue"
                                            >

                                                <Icon
                                                    name="play"
                                                    size={13}
                                                />

                                                Mulai Proses

                                            </button>

                                        </div>

                                    </form>

                                )}

                                {disposisi.status ===
                                    'in_progress' && (

                                    <form
                                        method="POST"
                                        action={`/unit/disposisi/${disposisi.id}/selesai`}
                                    >

                                        <input
                                            type="hidden"
                                            name="_token"
                                            value={
                                                csrfToken
                                            }
                                        />

                                        <div className="ud-action">

                                            <div>

                                                <div className="ud-action-title">

                                                    Selesaikan
                                                    Disposisi

                                                </div>

                                                <div className="ud-action-text">

                                                    Pastikan tindak
                                                    lanjut sudah
                                                    dicatat melalui
                                                    percakapan sebelum
                                                    menyelesaikan.

                                                </div>

                                            </div>

                                            <button
                                                type="submit"
                                                className="ud-action-button ud-action-green"
                                            >

                                                <Icon
                                                    name="check"
                                                    size={13}
                                                />

                                                Tandai Selesai

                                            </button>

                                        </div>

                                    </form>

                                )}

                                {disposisi.status ===
                                    'selesai' && (

                                    <div className="ud-done-box">

                                        <div className="ud-done-title">

                                            Disposisi telah
                                            diselesaikan.

                                        </div>

                                        {disposisi.selesai_at && (

                                            <div className="ud-done-text">

                                                Diselesaikan
                                                pada{' '}

                                                {formatDateTime(
                                                    disposisi.selesai_at
                                                )}

                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>

                        </section>

                        {/* =============================================
                            DEADLINE
                        ============================================= */}

                        <section className="ud-card">

                            <div className="ud-card-body">

                                <div className="ud-deadline-row">

                                    <div
                                        className="ud-deadline-icon"
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

                                        <div className="ud-deadline-title">

                                            {terlambat
                                                ? 'Disposisi Terlambat'
                                                : 'Batas Waktu Disposisi'}

                                        </div>

                                        <div
                                            className="ud-deadline-text"
                                            style={{
                                                color:
                                                    terlambat
                                                        ? '#dc2626'
                                                        : '#64748b',
                                            }}
                                        >

                                            Batas:{' '}

                                            <strong>
                                                {formatTanggal(
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

                <div className="ud-footer">
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
                className="ud-info-label"
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

            <div className="ud-info-value">
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