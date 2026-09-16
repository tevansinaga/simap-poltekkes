import React, { useState } from 'react';

export default function AgendaCreate({
    suratMasuk = null,
    errors = [],
}) {
    const sourceSurat = suratMasuk || null;

    // =====================================================
    // DATA AMAN
    // =====================================================

    const errorList = Array.isArray(errors)
        ? errors
        : [];

    // =====================================================
    // CSRF
    // =====================================================

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '';

    // =====================================================
    // DATE ONLY
    // =====================================================

    const getDateOnly = (value) => {
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

    // =====================================================
    // STATE
    // =====================================================

    const [judul, setJudul] = useState(
        sourceSurat?.perihal || ''
    );

    /*
    |--------------------------------------------------------------------------
    | Tanggal default mengikuti tanggal surat hanya jika
    | memang tersedia.
    |
    | Nilai tetap STRING YYYY-MM-DD.
    |--------------------------------------------------------------------------
    */
    const [tanggal, setTanggal] = useState(
        getDateOnly(
            sourceSurat?.tanggal_surat
        )
    );

    const [waktuMulai, setWaktuMulai] =
        useState('');

    const [waktuSelesai, setWaktuSelesai] =
        useState('');

    const [lokasi, setLokasi] =
        useState('');

    const [jenis, setJenis] =
        useState('Rapat');

    const [keterangan, setKeterangan] =
        useState('');

    // =====================================================
    // FORMAT TANGGAL UNTUK TAMPILAN
    // =====================================================

    const formatDate = (date) => {
        const dateKey = getDateOnly(date);

        if (!dateKey) {
            return '-';
        }

        const match = dateKey.match(
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
    // HANDLE TANGGAL
    // =====================================================

    const handleTanggalChange = (event) => {
        /*
        |--------------------------------------------------------------------------
        | PENTING:
        | Jangan gunakan new Date(event.target.value)
        | Jangan gunakan toISOString()
        |
        | Ambil langsung YYYY-MM-DD dari input.
        |--------------------------------------------------------------------------
        */

        setTanggal(
            event.target.value
        );
    };

    // =====================================================
    // VALIDASI
    // =====================================================

    const handleSubmit = (event) => {
        const validDate =
            /^\d{4}-\d{2}-\d{2}$/.test(
                tanggal
            );

        if (!tanggal || !validDate) {
            event.preventDefault();

            window.alert(
                'Tanggal agenda wajib diisi dengan benar.'
            );

            return;
        }

        if (!waktuMulai) {
            event.preventDefault();

            window.alert(
                'Waktu mulai agenda wajib diisi.'
            );
        }
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

            arrow: (
                <>
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
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

            clock: (
                <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                </>
            ),

            location: (
                <>
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                </>
            ),

            save: (
                <>
                    <path d="M5 3h12l2 2v16H5z" />
                    <path d="M8 3v6h8V3M8 21v-7h8v7" />
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

                .agenda-create-page {
                    min-height: 100vh;
                    background: #f4f7fb;
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

                .agenda-create-header {
                    height: 76px;
                    background: #ffffff;
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

                .agenda-create-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    text-decoration: none;
                }

                .agenda-create-logo {
                    width: 44px;
                    height: 44px;
                    border-radius: 11px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    padding: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    box-shadow:
                        0 4px 12px rgba(15,23,42,.05);
                }

                .agenda-create-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                }

                .agenda-create-brand-title {
                    color: #0f2747;
                    font-size: 18px;
                    line-height: 1;
                    font-weight: 850;
                }

                .agenda-create-brand-subtitle {
                    margin-top: 5px;
                    color: #64748b;
                    font-size: 10px;
                }

                .agenda-create-role {
                    padding: 8px 12px;
                    border-radius: 999px;
                    background: #eff6ff;
                    border:
                        1px solid #dbeafe;
                    color: #1d4ed8;
                    font-size: 10px;
                    font-weight: 700;
                }

                /* =================================================
                   MAIN
                ================================================= */

                .agenda-create-main {
                    width: 100%;
                    max-width: 1040px;
                    margin: 0 auto;
                    padding: 30px 24px 55px;
                }

                .agenda-create-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: #94a3b8;
                    font-size: 10px;
                    margin-bottom: 11px;
                }

                .agenda-create-breadcrumb a {
                    color: #64748b;
                    text-decoration: none;
                }

                .agenda-create-breadcrumb a:hover {
                    color: #2563eb;
                }

                .agenda-create-title {
                    margin: 0;
                    color: #0f2747;
                    font-size: 30px;
                    font-weight: 850;
                    letter-spacing: -.6px;
                }

                .agenda-create-description {
                    margin: 8px 0 0;
                    color: #64748b;
                    font-size: 12px;
                    line-height: 1.7;
                }

                /* =================================================
                   SOURCE SURAT
                ================================================= */

                .agenda-create-source {
                    margin-top: 22px;
                    padding: 18px;
                    border-radius: 15px;
                    background:
                        linear-gradient(
                            135deg,
                            #eff6ff,
                            #f8fbff
                        );
                    border:
                        1px solid #bfdbfe;
                }

                .agenda-create-source-label {
                    color: #1d4ed8;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: .55px;
                    text-transform: uppercase;
                }

                .agenda-create-source-grid {
                    margin-top: 12px;
                    display: grid;
                    grid-template-columns:
                        repeat(2, minmax(0,1fr));
                    gap: 12px;
                }

                .agenda-create-source-item {
                    padding: 11px 12px;
                    background: #ffffff;
                    border:
                        1px solid #dbeafe;
                    border-radius: 10px;
                }

                .agenda-create-source-key {
                    color: #94a3b8;
                    font-size: 9px;
                }

                .agenda-create-source-value {
                    margin-top: 4px;
                    color: #1e293b;
                    font-size: 11px;
                    font-weight: 700;
                    line-height: 1.5;
                }

                /* =================================================
                   CARD
                ================================================= */

                .agenda-create-card {
                    margin-top: 18px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 17px;
                    overflow: hidden;
                    box-shadow:
                        0 7px 22px rgba(15,23,42,.025);
                }

                .agenda-create-card-header {
                    padding: 19px 21px;
                    border-bottom:
                        1px solid #eef2f7;
                }

                .agenda-create-card-title {
                    color: #0f2747;
                    font-size: 15px;
                    font-weight: 800;
                }

                .agenda-create-card-subtitle {
                    margin-top: 4px;
                    color: #94a3b8;
                    font-size: 10px;
                }

                .agenda-create-form {
                    padding: 21px;
                }

                /* =================================================
                   ERRORS
                ================================================= */

                .agenda-create-errors {
                    margin-bottom: 17px;
                    padding: 12px 14px;
                    border-radius: 10px;
                    border:
                        1px solid #fecaca;
                    background: #fff5f5;
                    color: #b91c1c;
                    font-size: 11px;
                    line-height: 1.6;
                }

                .agenda-create-errors div + div {
                    margin-top: 4px;
                }

                /* =================================================
                   GRID
                ================================================= */

                .agenda-create-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(2, minmax(0,1fr));
                    gap: 16px;
                }

                .agenda-create-field {
                    display: flex;
                    flex-direction: column;
                }

                .agenda-create-field-full {
                    grid-column: 1 / -1;
                }

                .agenda-create-label {
                    margin-bottom: 7px;
                    color: #334155;
                    font-size: 10px;
                    font-weight: 800;
                }

                .agenda-create-required {
                    color: #dc2626;
                    margin-left: 2px;
                }

                .agenda-create-input,
                .agenda-create-select,
                .agenda-create-textarea {
                    width: 100%;
                    box-sizing: border-box;
                    border:
                        1px solid #dbe3ee;
                    border-radius: 10px;
                    outline: none;
                    background: #ffffff;
                    color: #334155;
                    font-family: inherit;
                    font-size: 11px;
                    transition:
                        border-color .15s ease,
                        box-shadow .15s ease,
                        background .15s ease;
                }

                .agenda-create-input,
                .agenda-create-select {
                    height: 43px;
                    padding: 0 12px;
                }

                .agenda-create-textarea {
                    min-height: 110px;
                    padding: 11px 12px;
                    resize: vertical;
                    line-height: 1.6;
                }

                .agenda-create-input:hover,
                .agenda-create-select:hover,
                .agenda-create-textarea:hover {
                    border-color: #cbd5e1;
                }

                .agenda-create-input:focus,
                .agenda-create-select:focus,
                .agenda-create-textarea:focus {
                    border-color: #4abda5;
                    box-shadow:
                        0 0 0 3px rgba(74,189,165,.08);
                }

                .agenda-create-help {
                    margin-top: 5px;
                    color: #94a3b8;
                    font-size: 9px;
                    line-height: 1.5;
                }

                /* =================================================
                   ACTION
                ================================================= */

                .agenda-create-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 21px;
                    padding-top: 18px;
                    border-top:
                        1px solid #eef2f7;
                }

                .agenda-create-cancel,
                .agenda-create-save {
                    min-height: 40px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    padding: 0 15px;
                    border-radius: 10px;
                    font-size: 10px;
                    font-weight: 700;
                    text-decoration: none;
                }

                .agenda-create-cancel {
                    border:
                        1px solid #e2e8f0;
                    background: #ffffff;
                    color: #475569;
                }

                .agenda-create-cancel:hover {
                    background: #f8fafc;
                }

                .agenda-create-save {
                    border: none;
                    background:
                        linear-gradient(
                            135deg,
                            #0f2747,
                            #174a7e
                        );
                    color: #ffffff;
                    cursor: pointer;
                    box-shadow:
                        0 7px 18px rgba(15,39,71,.12);
                    transition: .18s ease;
                }

                .agenda-create-save:hover {
                    transform: translateY(-1px);
                    background:
                        linear-gradient(
                            135deg,
                            #12355d,
                            #1a5b8b
                        );
                }

                /* =================================================
                   RESPONSIVE
                ================================================= */

                @media (max-width: 700px) {
                    .agenda-create-header {
                        padding: 0 16px;
                    }

                    .agenda-create-brand-subtitle,
                    .agenda-create-role {
                        display: none;
                    }

                    .agenda-create-main {
                        padding:
                            22px 15px 40px;
                    }

                    .agenda-create-grid,
                    .agenda-create-source-grid {
                        grid-template-columns: 1fr;
                    }

                    .agenda-create-field-full {
                        grid-column: auto;
                    }

                    .agenda-create-actions {
                        flex-direction: column-reverse;
                    }

                    .agenda-create-cancel,
                    .agenda-create-save {
                        width: 100%;
                    }

                    .agenda-create-title {
                        font-size: 25px;
                    }
                }
            `}</style>

            <div className="agenda-create-page">

                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="agenda-create-header">

                    <a
                        href="/sekretaris/dashboard"
                        className="agenda-create-brand"
                    >

                        <div className="agenda-create-logo">

                            <img
                                src="/images/poltekkes-icon.png"
                                alt="Logo Poltekkes Maluku"
                            />

                        </div>

                        <div>

                            <div className="agenda-create-brand-title">
                                SIMAP
                            </div>

                            <div className="agenda-create-brand-subtitle">
                                Poltekkes Maluku
                            </div>

                        </div>

                    </a>

                    <div className="agenda-create-role">
                        Sekretaris Direktur
                    </div>

                </header>

                {/* =================================================
                    MAIN
                ================================================= */}

                <main className="agenda-create-main">

                    {/* BREADCRUMB */}

                    <div className="agenda-create-breadcrumb">

                        <a href="/sekretaris/dashboard">
                            Dashboard
                        </a>

                        <span>›</span>

                        <a href="/sekretaris/agenda">
                            Agenda Direktur
                        </a>

                        <span>›</span>

                        <span>
                            Buat Agenda
                        </span>

                    </div>

                    {/* TITLE */}

                    <h1 className="agenda-create-title">
                        Buat Agenda Direktur
                    </h1>

                    <p className="agenda-create-description">
                        Jadwalkan kegiatan, rapat, dinas,
                        atau agenda lain yang akan dihadiri
                        Direktur.
                    </p>

                    {/* =================================================
                        SUMBER SURAT
                    ================================================= */}

                    {sourceSurat && (
                        <section className="agenda-create-source">

                            <div className="agenda-create-source-label">
                                Agenda berasal dari Surat Masuk
                            </div>

                            <div className="agenda-create-source-grid">

                                <div className="agenda-create-source-item">

                                    <div className="agenda-create-source-key">
                                        Nomor Surat
                                    </div>

                                    <div className="agenda-create-source-value">
                                        {sourceSurat.nomor_surat ||
                                            '-'}
                                    </div>

                                </div>

                                <div className="agenda-create-source-item">

                                    <div className="agenda-create-source-key">
                                        Pengirim
                                    </div>

                                    <div className="agenda-create-source-value">
                                        {sourceSurat.pengirim ||
                                            '-'}
                                    </div>

                                </div>

                                <div className="agenda-create-source-item">

                                    <div className="agenda-create-source-key">
                                        Perihal
                                    </div>

                                    <div className="agenda-create-source-value">
                                        {sourceSurat.perihal ||
                                            '-'}
                                    </div>

                                </div>

                                <div className="agenda-create-source-item">

                                    <div className="agenda-create-source-key">
                                        Tanggal Surat
                                    </div>

                                    <div className="agenda-create-source-value">
                                        {formatDate(
                                            sourceSurat.tanggal_surat
                                        )}
                                    </div>

                                </div>

                            </div>

                        </section>
                    )}

                    {/* =================================================
                        FORM CARD
                    ================================================= */}

                    <section className="agenda-create-card">

                        <div className="agenda-create-card-header">

                            <div className="agenda-create-card-title">
                                Informasi Agenda
                            </div>

                            <div className="agenda-create-card-subtitle">
                                Isi jadwal yang akan
                                dihadiri Direktur.
                            </div>

                        </div>

                        <form
                            method="POST"

                            /*
                            |--------------------------------------------------------------------------
                            | INI PERBAIKAN UTAMANYA
                            |--------------------------------------------------------------------------
                            | Sebelumnya:
                            | /direktur/agenda
                            |
                            | Sekarang:
                            | /sekretaris/agenda
                            |--------------------------------------------------------------------------
                            */
                            action="/sekretaris/agenda"

                            className="agenda-create-form"

                            onSubmit={
                                handleSubmit
                            }
                        >

                            <input
                                type="hidden"
                                name="_token"
                                value={csrfToken}
                            />

                            {/* SOURCE SURAT */}

                            {sourceSurat && (
                                <input
                                    type="hidden"
                                    name="surat_masuk_id"
                                    value={sourceSurat.id}
                                />
                            )}

                            {/* ERRORS */}

                            {errorList.length > 0 && (
                                <div className="agenda-create-errors">

                                    {errorList.map(
                                        (
                                            error,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
                                            >
                                                {error}
                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                            {/* =================================================
                                FORM GRID
                            ================================================= */}

                            <div className="agenda-create-grid">

                                {/* JUDUL */}

                                <div className="agenda-create-field agenda-create-field-full">

                                    <label
                                        className="agenda-create-label"
                                        htmlFor="judul"
                                    >
                                        Judul Agenda

                                        <span className="agenda-create-required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="judul"
                                        type="text"
                                        name="judul"
                                        className="agenda-create-input"
                                        value={judul}
                                        onChange={(e) =>
                                            setJudul(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Contoh: Rapat Koordinasi"
                                        required
                                    />

                                </div>

                                {/* TANGGAL */}

                                <div className="agenda-create-field">

                                    <label
                                        className="agenda-create-label"
                                        htmlFor="tanggal"
                                    >
                                        Tanggal

                                        <span className="agenda-create-required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="tanggal"
                                        type="date"
                                        name="tanggal"
                                        className="agenda-create-input"
                                        value={tanggal}
                                        onChange={
                                            handleTanggalChange
                                        }
                                        required
                                    />

                                    <div className="agenda-create-help">
                                        Tanggal disimpan sebagai
                                        tanggal kalender
                                        YYYY-MM-DD tanpa
                                        konversi timezone.
                                    </div>

                                </div>

                                {/* JENIS */}

                                <div className="agenda-create-field">

                                    <label
                                        className="agenda-create-label"
                                        htmlFor="jenis"
                                    >
                                        Jenis Agenda

                                        <span className="agenda-create-required">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        id="jenis"
                                        name="jenis"
                                        className="agenda-create-select"
                                        value={jenis}
                                        onChange={(e) =>
                                            setJenis(
                                                e.target.value
                                            )
                                        }
                                        required
                                    >

                                        <option value="Rapat">
                                            Rapat
                                        </option>

                                        <option value="Kegiatan">
                                            Kegiatan
                                        </option>

                                        <option value="Dinas">
                                            Dinas
                                        </option>

                                        <option value="Acara">
                                            Acara
                                        </option>

                                        <option value="Lainnya">
                                            Lainnya
                                        </option>

                                    </select>

                                </div>

                                {/* WAKTU MULAI */}

                                <div className="agenda-create-field">

                                    <label
                                        className="agenda-create-label"
                                        htmlFor="waktu_mulai"
                                    >
                                        Waktu Mulai

                                        <span className="agenda-create-required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="waktu_mulai"
                                        type="time"
                                        name="waktu_mulai"
                                        className="agenda-create-input"
                                        value={waktuMulai}
                                        onChange={(e) =>
                                            setWaktuMulai(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                                {/* WAKTU SELESAI */}

                                <div className="agenda-create-field">

                                    <label
                                        className="agenda-create-label"
                                        htmlFor="waktu_selesai"
                                    >
                                        Waktu Selesai
                                    </label>

                                    <input
                                        id="waktu_selesai"
                                        type="time"
                                        name="waktu_selesai"
                                        className="agenda-create-input"
                                        value={
                                            waktuSelesai
                                        }
                                        onChange={(e) =>
                                            setWaktuSelesai(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <div className="agenda-create-help">
                                        Kosongkan jika tidak
                                        diperlukan.
                                    </div>

                                </div>

                                {/* LOKASI */}

                                <div className="agenda-create-field agenda-create-field-full">

                                    <label
                                        className="agenda-create-label"
                                        htmlFor="lokasi"
                                    >
                                        Lokasi
                                    </label>

                                    <input
                                        id="lokasi"
                                        type="text"
                                        name="lokasi"
                                        className="agenda-create-input"
                                        value={lokasi}
                                        onChange={(e) =>
                                            setLokasi(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Contoh: Aula Poltekkes Maluku"
                                    />

                                </div>

                                {/* KETERANGAN */}

                                <div className="agenda-create-field agenda-create-field-full">

                                    <label
                                        className="agenda-create-label"
                                        htmlFor="keterangan"
                                    >
                                        Keterangan
                                    </label>

                                    <textarea
                                        id="keterangan"
                                        name="keterangan"
                                        className="agenda-create-textarea"
                                        value={
                                            keterangan
                                        }
                                        onChange={(e) =>
                                            setKeterangan(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Tambahkan informasi tambahan mengenai agenda..."
                                    />

                                </div>

                            </div>

                            {/* =================================================
                                ACTION
                            ================================================= */}

                            <div className="agenda-create-actions">

                                <a
                                    href="/sekretaris/agenda"
                                    className="agenda-create-cancel"
                                >
                                    Batal
                                </a>

                                <button
                                    type="submit"
                                    className="agenda-create-save"
                                >

                                    <Icon
                                        name="save"
                                        size={15}
                                    />

                                    Simpan Agenda

                                </button>

                            </div>

                        </form>

                    </section>

                </main>

            </div>
        </>
    );
}