import React, { useState } from 'react';

export default function DisposisiCreate({
    surat = null,
    units = [],
    errors = [],
}) {
    // =====================================================
    // DATA AMAN
    // =====================================================

    const safeUnits = Array.isArray(units)
        ? units
        : [];

    const safeErrors = Array.isArray(errors)
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
    // TANGGAL WIT
    // =====================================================

    const getTodayWIT = () => {
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Jayapura',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date());
    };

    // =====================================================
    // STATE DISPOSISI
    // =====================================================

    const [tujuanType, setTujuanType] =
        useState('unit');

    const [unitId, setUnitId] =
        useState('');

    const [instruksi, setInstruksi] =
        useState('');

    const [sifat, setSifat] =
        useState('Biasa');

    const [batasWaktu, setBatasWaktu] =
        useState('');

    // =====================================================
    // STATE AGENDA
    // =====================================================

    const [agendaJudul, setAgendaJudul] =
        useState(
            surat?.perihal || ''
        );

    /*
    |--------------------------------------------------------------------------
    | PENTING
    |--------------------------------------------------------------------------
    | Tanggal disimpan sebagai STRING YYYY-MM-DD.
    | Tidak diubah ke Date.
    |--------------------------------------------------------------------------
    */

    const [agendaTanggal, setAgendaTanggal] =
        useState('');

    const [agendaWaktuMulai, setAgendaWaktuMulai] =
        useState('');

    const [agendaWaktuSelesai, setAgendaWaktuSelesai] =
        useState('');

    const [agendaLokasi, setAgendaLokasi] =
        useState('');

    const [agendaJenis, setAgendaJenis] =
        useState('Rapat');

    const [agendaKeterangan, setAgendaKeterangan] =
        useState('');

    // =====================================================
    // FORMAT TANGGAL DATE ONLY
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        const value = String(date).trim();

        const match = value.match(
            /^(\d{4})-(\d{2})-(\d{2})/
        );

        if (!match) {
            return String(date);
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
            return String(date);
        }

        return `${String(day).padStart(2, '0')} ${monthNames[month - 1]} ${year}`;
    };

    // =====================================================
    // HANDLE TUJUAN
    // =====================================================

    const handleTujuanChange = (value) => {
        setTujuanType(value);

        if (value === 'direktur') {
            // Set tanggal hari ini WIT jika belum ada
            setAgendaTanggal((current) => {
                if (current) {
                    return current;
                }

                return getTodayWIT();
            });

            // Judul agenda mengikuti perihal surat
            setAgendaJudul((current) => {
                if (
                    current &&
                    current.trim()
                ) {
                    return current;
                }

                return surat?.perihal || '';
            });
        }
    };

    // =====================================================
    // HANDLE TANGGAL AGENDA
    // =====================================================

    const handleAgendaTanggalChange = (
        event
    ) => {
        /*
        |--------------------------------------------------------------------------
        | Jangan gunakan:
        | new Date(value)
        | toISOString()
        |
        | Ambil langsung YYYY-MM-DD dari input.
        |--------------------------------------------------------------------------
        */

        setAgendaTanggal(
            event.target.value
        );
    };

    // =====================================================
    // HANDLE SUBMIT
    // =====================================================

    const handleSubmit = (event) => {
        if (
            tujuanType === 'direktur'
        ) {
            const validDate =
                /^\d{4}-\d{2}-\d{2}$/.test(
                    agendaTanggal
                );

            if (!agendaTanggal || !validDate) {
                event.preventDefault();

                window.alert(
                    'Tanggal agenda wajib diisi dengan benar.'
                );
            }
        }
    };

    // =====================================================
    // SURAT TIDAK DITEMUKAN
    // =====================================================

    if (!surat) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    background: '#f4f7fb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '30px',
                    fontFamily:
                        'Inter, ui-sans-serif, system-ui, sans-serif',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '680px',
                        background: '#ffffff',
                        border:
                            '1px solid #e2e8f0',
                        borderRadius: '18px',
                        padding: '45px',
                        textAlign: 'center',
                        boxShadow:
                            '0 15px 40px rgba(15,23,42,.05)',
                    }}
                >
                    <div
                        style={{
                            width: '58px',
                            height: '58px',
                            margin: '0 auto 16px',
                            borderRadius: '16px',
                            background: '#fef2f2',
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            fontWeight: 800,
                        }}
                    >
                        !
                    </div>

                    <h2
                        style={{
                            margin: 0,
                            color: '#0f2747',
                            fontSize: '22px',
                        }}
                    >
                        Surat tidak ditemukan
                    </h2>

                    <p
                        style={{
                            margin:
                                '10px 0 22px',
                            color: '#64748b',
                            fontSize: '13px',
                            lineHeight: 1.7,
                        }}
                    >
                        Data surat untuk disposisi
                        tidak tersedia.
                    </p>

                    <a
                        href="/sekretaris/surat-masuk"
                        style={{
                            display:
                                'inline-flex',
                            alignItems:
                                'center',
                            justifyContent:
                                'center',
                            padding:
                                '10px 16px',
                            borderRadius:
                                '9px',
                            background:
                                '#0f2747',
                            color:
                                '#ffffff',
                            textDecoration:
                                'none',
                            fontSize:
                                '12px',
                            fontWeight:
                                700,
                        }}
                    >
                        Kembali ke Surat Masuk
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div
            className="disposisi-create-page"
        >
            <style>{`
                * {
                    box-sizing: border-box;
                }

                .disposisi-create-page {
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

                .dc-header {
                    height: 74px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 28px;
                    background: #ffffff;
                    border-bottom:
                        1px solid #e2e8f0;
                    position: sticky;
                    top: 0;
                    z-index: 30;
                }

                .dc-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    text-decoration: none;
                }

                .dc-logo {
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

                .dc-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                }

                .dc-brand-title {
                    color: #0f2747;
                    font-size: 18px;
                    font-weight: 850;
                    line-height: 1;
                }

                .dc-brand-subtitle {
                    margin-top: 5px;
                    color: #64748b;
                    font-size: 10px;
                }

                .dc-role {
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

                .dc-main {
                    width: 100%;
                    max-width: 1080px;
                    margin: 0 auto;
                    padding: 30px 24px 55px;
                }

                .dc-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: #94a3b8;
                    font-size: 10px;
                    margin-bottom: 11px;
                }

                .dc-breadcrumb a {
                    color: #64748b;
                    text-decoration: none;
                }

                .dc-breadcrumb a:hover {
                    color: #2563eb;
                }

                .dc-title {
                    margin: 0;
                    color: #0f2747;
                    font-size: 30px;
                    font-weight: 850;
                    letter-spacing: -.6px;
                }

                .dc-description {
                    margin: 8px 0 0;
                    color: #64748b;
                    font-size: 12px;
                    line-height: 1.6;
                }

                /* =================================================
                   SURAT CARD
                ================================================= */

                .dc-letter-card {
                    margin-top: 22px;
                    padding: 17px;
                    background: #eff6ff;
                    border:
                        1px solid #bfdbfe;
                    border-radius: 15px;
                }

                .dc-letter-label {
                    color: #1d4ed8;
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: .55px;
                }

                .dc-letter-inner {
                    margin-top: 10px;
                    padding: 15px;
                    background: #ffffff;
                    border:
                        1px solid #dbeafe;
                    border-radius: 11px;
                }

                .dc-letter-title {
                    color: #0f2747;
                    font-size: 13px;
                    font-weight: 800;
                }

                .dc-letter-meta {
                    margin-top: 5px;
                    color: #64748b;
                    font-size: 10px;
                }

                .dc-letter-date {
                    margin-top: 4px;
                    color: #94a3b8;
                    font-size: 9px;
                }

                /* =================================================
                   FORM CARD
                ================================================= */

                .dc-form-card {
                    margin-top: 18px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 17px;
                    overflow: hidden;
                    box-shadow:
                        0 8px 25px rgba(15,23,42,.03);
                }

                .dc-form-header {
                    padding: 19px 21px;
                    border-bottom:
                        1px solid #eef2f7;
                }

                .dc-form-title {
                    color: #0f2747;
                    font-size: 15px;
                    font-weight: 800;
                }

                .dc-form-subtitle {
                    margin-top: 4px;
                    color: #94a3b8;
                    font-size: 10px;
                }

                .dc-form-body {
                    padding: 21px;
                }

                /* =================================================
                   ERROR
                ================================================= */

                .dc-errors {
                    margin-bottom: 18px;
                    padding: 13px 14px;
                    background: #fff5f5;
                    border:
                        1px solid #fecaca;
                    border-radius: 10px;
                    color: #b91c1c;
                    font-size: 11px;
                    line-height: 1.65;
                }

                .dc-errors-title {
                    margin-bottom: 4px;
                    font-weight: 800;
                }

                /* =================================================
                   FIELD
                ================================================= */

                .dc-label {
                    display: block;
                    margin-bottom: 7px;
                    color: #334155;
                    font-size: 10px;
                    font-weight: 800;
                }

                .dc-required {
                    color: #dc2626;
                    margin-left: 3px;
                }

                .dc-input,
                .dc-select,
                .dc-textarea {
                    width: 100%;
                    box-sizing: border-box;
                    border:
                        1px solid #dbe3ee;
                    border-radius: 10px;
                    background: #ffffff;
                    color: #334155;
                    outline: none;
                    font-family: inherit;
                    font-size: 11px;
                    transition:
                        border-color .15s ease,
                        box-shadow .15s ease;
                }

                .dc-input,
                .dc-select {
                    height: 43px;
                    padding: 0 12px;
                }

                .dc-textarea {
                    min-height: 115px;
                    padding: 11px 12px;
                    resize: vertical;
                    line-height: 1.6;
                }

                .dc-input:focus,
                .dc-select:focus,
                .dc-textarea:focus {
                    border-color: #4abda5;
                    box-shadow:
                        0 0 0 3px rgba(74,189,165,.08);
                }

                .dc-row {
                    display: grid;
                    grid-template-columns:
                        1fr 1fr;
                    gap: 16px;
                    margin-top: 18px;
                }

                /* =================================================
                   TUJUAN
                ================================================= */

                .dc-target-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(2,minmax(0,1fr));
                    gap: 12px;
                }

                .dc-target {
                    display: flex;
                    gap: 11px;
                    padding: 14px;
                    border-radius: 12px;
                    border:
                        1px solid #e2e8f0;
                    background: #ffffff;
                    cursor: pointer;
                    transition: .15s ease;
                }

                .dc-target:hover {
                    border-color: #cbd5e1;
                }

                .dc-target.active {
                    border-color: #93c5fd;
                    background: #eff6ff;
                }

                .dc-target input {
                    margin-top: 2px;
                    accent-color: #2563eb;
                }

                .dc-target-title {
                    color: #0f2747;
                    font-size: 11px;
                    font-weight: 800;
                }

                .dc-target-description {
                    margin-top: 4px;
                    color: #64748b;
                    font-size: 9px;
                    line-height: 1.55;
                }

                /* =================================================
                   AGENDA
                ================================================= */

                .dc-agenda {
                    margin-top: 23px;
                    padding: 18px;
                    background: #f8fafc;
                    border:
                        1px solid #dbeafe;
                    border-radius: 14px;
                }

                .dc-agenda-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    margin-bottom: 17px;
                }

                .dc-agenda-icon {
                    width: 37px;
                    height: 37px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    background: #eff6ff;
                    color: #2563eb;
                    font-size: 19px;
                    font-weight: 800;
                }

                .dc-agenda-title {
                    color: #0f2747;
                    font-size: 14px;
                    font-weight: 800;
                }

                .dc-agenda-description {
                    margin-top: 4px;
                    color: #64748b;
                    font-size: 9px;
                    line-height: 1.65;
                }

                .dc-date-hint {
                    margin-top: 5px;
                    color: #94a3b8;
                    font-size: 8px;
                    line-height: 1.5;
                }

                /* =================================================
                   ACTION
                ================================================= */

                .dc-actions {
                    padding: 17px 21px;
                    border-top:
                        1px solid #eef2f7;
                    background: #f8fafc;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }

                .dc-button {
                    min-height: 40px;
                    padding: 0 15px;
                    border-radius: 9px;
                    font-size: 10px;
                    font-weight: 700;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .dc-button-secondary {
                    background: #ffffff;
                    color: #475569;
                    border:
                        1px solid #e2e8f0;
                }

                .dc-button-primary {
                    border: none;
                    background: #0f2747;
                    color: #ffffff;
                    box-shadow:
                        0 7px 17px rgba(15,39,71,.12);
                }

                .dc-button-primary:hover {
                    background: #174a7e;
                }

                /* =================================================
                   RESPONSIVE
                ================================================= */

                @media (max-width: 720px) {
                    .dc-header {
                        padding: 0 16px;
                    }

                    .dc-brand-subtitle,
                    .dc-role {
                        display: none;
                    }

                    .dc-main {
                        padding:
                            22px 15px 40px;
                    }

                    .dc-target-grid,
                    .dc-row {
                        grid-template-columns: 1fr;
                    }

                    .dc-actions {
                        flex-direction: column-reverse;
                    }

                    .dc-button {
                        width: 100%;
                    }
                }
            `}</style>

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="dc-header">

                <a
                    href="/sekretaris/dashboard"
                    className="dc-brand"
                >

                    <div className="dc-logo">
                        <img
                            src="/images/poltekkes-icon.png"
                            alt="Logo Poltekkes Maluku"
                        />
                    </div>

                    <div>

                        <div className="dc-brand-title">
                            SIMAP
                        </div>

                        <div className="dc-brand-subtitle">
                            Poltekkes Maluku
                        </div>

                    </div>

                </a>

                <div className="dc-role">
                    Sekretaris Direktur
                </div>

            </header>

            {/* =================================================
                MAIN
            ================================================= */}

            <main className="dc-main">

                {/* BREADCRUMB */}

                <div className="dc-breadcrumb">

                    <a href="/sekretaris/surat-masuk">
                        Surat Masuk
                    </a>

                    <span>›</span>

                    <a
                        href={`/sekretaris/surat-masuk/${surat.id}`}
                    >
                        Detail Surat
                    </a>

                    <span>›</span>

                    <span>
                        Buat Disposisi
                    </span>

                </div>

                {/* TITLE */}

                <h1 className="dc-title">
                    Buat Disposisi
                </h1>

                <p className="dc-description">
                    Tentukan tujuan surat dan instruksi
                    tindak lanjut. Apabila tujuan adalah
                    Direktur, agenda akan dibuat otomatis.
                </p>

                {/* =================================================
                    SURAT
                ================================================= */}

                <section className="dc-letter-card">

                    <div className="dc-letter-label">
                        Surat yang akan didisposisikan
                    </div>

                    <div className="dc-letter-inner">

                        <div className="dc-letter-title">
                            {surat.perihal ||
                                'Tanpa perihal'}
                        </div>

                        <div className="dc-letter-meta">
                            Nomor:{' '}
                            {surat.nomor_surat ||
                                '-'}
                        </div>

                        <div className="dc-letter-meta">
                            Pengirim:{' '}
                            {surat.pengirim ||
                                '-'}
                        </div>

                        <div className="dc-letter-date">
                            Tanggal Surat:{' '}
                            {formatDate(
                                surat.tanggal_surat
                            )}
                        </div>

                    </div>

                </section>

                {/* =================================================
                    FORM
                ================================================= */}

                <section className="dc-form-card">

                    <div className="dc-form-header">

                        <div className="dc-form-title">
                            Informasi Disposisi
                        </div>

                        <div className="dc-form-subtitle">
                            Tentukan tujuan, sifat,
                            instruksi, dan tindak lanjut
                            surat.
                        </div>

                    </div>

                    <form
                        method="POST"
                        action={`/sekretaris/disposisi/${surat.id}`}
                        onSubmit={handleSubmit}
                    >

                        <input
                            type="hidden"
                            name="_token"
                            value={csrfToken}
                        />

                        {safeErrors.length > 0 && (
                            <div
                                style={{
                                    padding:
                                        '20px 21px 0',
                                }}
                            >
                                <div className="dc-errors">

                                    <div className="dc-errors-title">
                                        Disposisi belum
                                        dapat dikirim.
                                    </div>

                                    {safeErrors.map(
                                        (
                                            error,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
                                            >
                                                • {error}
                                            </div>
                                        )
                                    )}

                                </div>
                            </div>
                        )}

                        <div className="dc-form-body">

                            {/* =================================================
                                TUJUAN
                            ================================================= */}

                            <div>

                                <label className="dc-label">
                                    Tujuan Disposisi
                                    <span className="dc-required">
                                        *
                                    </span>
                                </label>

                                <div className="dc-target-grid">

                                    {/* UNIT */}

                                    <label
                                        className={
                                            `dc-target ${
                                                tujuanType ===
                                                'unit'
                                                    ? 'active'
                                                    : ''
                                            }`
                                        }
                                    >

                                        <input
                                            type="radio"
                                            name="tujuan_type"
                                            value="unit"
                                            checked={
                                                tujuanType ===
                                                'unit'
                                            }
                                            onChange={(e) =>
                                                handleTujuanChange(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div>

                                            <div className="dc-target-title">
                                                Unit
                                            </div>

                                            <div className="dc-target-description">
                                                Kirim surat
                                                kepada unit
                                                untuk
                                                ditindaklanjuti.
                                            </div>

                                        </div>

                                    </label>

                                    {/* DIREKTUR */}

                                    <label
                                        className={
                                            `dc-target ${
                                                tujuanType ===
                                                'direktur'
                                                    ? 'active'
                                                    : ''
                                            }`
                                        }
                                    >

                                        <input
                                            type="radio"
                                            name="tujuan_type"
                                            value="direktur"
                                            checked={
                                                tujuanType ===
                                                'direktur'
                                            }
                                            onChange={(e) =>
                                                handleTujuanChange(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div>

                                            <div className="dc-target-title">
                                                Direktur
                                            </div>

                                            <div className="dc-target-description">
                                                Buat agenda
                                                otomatis untuk
                                                ditampilkan
                                                kepada
                                                Direktur.
                                            </div>

                                        </div>

                                    </label>

                                </div>

                            </div>

                            {/* =================================================
                                UNIT
                            ================================================= */}

                            {tujuanType === 'unit' && (
                                <div
                                    style={{
                                        marginTop:
                                            '18px',
                                    }}
                                >

                                    <label className="dc-label">
                                        Unit Tujuan
                                        <span className="dc-required">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        name="ke_unit_id"
                                        value={unitId}
                                        onChange={(e) =>
                                            setUnitId(
                                                e.target
                                                    .value
                                            )
                                        }
                                        required
                                        className="dc-select"
                                    >
                                        <option value="">
                                            Pilih unit tujuan
                                        </option>

                                        {safeUnits.map(
                                            (unit) => (
                                                <option
                                                    key={
                                                        unit.id
                                                    }
                                                    value={
                                                        unit.id
                                                    }
                                                >
                                                    {
                                                        unit.name
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>

                                </div>
                            )}

                            {/* =================================================
                                SIFAT + BATAS WAKTU
                            ================================================= */}

                            <div className="dc-row">

                                <div>

                                    <label className="dc-label">
                                        Sifat
                                        <span className="dc-required">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        name="sifat"
                                        value={sifat}
                                        onChange={(e) =>
                                            setSifat(
                                                e.target
                                                    .value
                                            )
                                        }
                                        required
                                        className="dc-select"
                                    >
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

                                </div>

                                <div>

                                    <label className="dc-label">
                                        Batas Waktu
                                    </label>

                                    <input
                                        type="date"
                                        name="batas_waktu"
                                        value={batasWaktu}
                                        onChange={(e) =>
                                            setBatasWaktu(
                                                e.target
                                                    .value
                                            )
                                        }
                                        className="dc-input"
                                    />

                                </div>

                            </div>

                            {/* =================================================
                                INSTRUKSI
                            ================================================= */}

                            <div
                                style={{
                                    marginTop: '18px',
                                }}
                            >

                                <label className="dc-label">
                                    Instruksi
                                    <span className="dc-required">
                                        *
                                    </span>
                                </label>

                                <textarea
                                    name="instruksi"
                                    value={instruksi}
                                    onChange={(e) =>
                                        setInstruksi(
                                            e.target.value
                                        )
                                    }
                                    required
                                    className="dc-textarea"
                                    placeholder="Contoh: Tindak lanjuti dan laporkan hasilnya."
                                />

                            </div>

                            {/* =================================================
                                AGENDA DIREKTUR
                            ================================================= */}

                            {tujuanType ===
                                'direktur' && (
                                <section className="dc-agenda">

                                    <div className="dc-agenda-header">

                                        <div className="dc-agenda-icon">
                                            +
                                        </div>

                                        <div>

                                            <div className="dc-agenda-title">
                                                Agenda Direktur
                                            </div>

                                            <div className="dc-agenda-description">
                                                Karena disposisi
                                                ditujukan kepada
                                                Direktur, agenda
                                                akan dibuat
                                                otomatis setelah
                                                disposisi berhasil
                                                dikirim.
                                            </div>

                                        </div>

                                    </div>

                                    <div className="dc-row">

                                        {/* JUDUL */}

                                        <div
                                            style={{
                                                gridColumn:
                                                    '1 / -1',
                                            }}
                                        >

                                            <label className="dc-label">
                                                Judul Agenda
                                                <span className="dc-required">
                                                    *
                                                </span>
                                            </label>

                                            <input
                                                type="text"
                                                name="agenda_judul"
                                                value={
                                                    agendaJudul
                                                }
                                                onChange={(e) =>
                                                    setAgendaJudul(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                required
                                                className="dc-input"
                                                placeholder="Contoh: Rapat koordinasi"
                                            />

                                        </div>

                                        {/* TANGGAL */}

                                        <div>

                                            <label className="dc-label">
                                                Tanggal Agenda
                                                <span className="dc-required">
                                                    *
                                                </span>
                                            </label>

                                            <input
                                                type="date"
                                                name="agenda_tanggal"
                                                value={
                                                    agendaTanggal
                                                }
                                                onChange={
                                                    handleAgendaTanggalChange
                                                }
                                                required
                                                className="dc-input"
                                            />

                                            <div className="dc-date-hint">
                                                Format tersimpan:
                                                {' '}
                                                YYYY-MM-DD.
                                                Tanggal tidak
                                                dikonversi ke
                                                timezone lain.
                                            </div>

                                        </div>

                                        {/* JENIS */}

                                        <div>

                                            <label className="dc-label">
                                                Jenis Agenda
                                                <span className="dc-required">
                                                    *
                                                </span>
                                            </label>

                                            <select
                                                name="agenda_jenis"
                                                value={
                                                    agendaJenis
                                                }
                                                onChange={(e) =>
                                                    setAgendaJenis(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                required
                                                className="dc-select"
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
                                            </select>

                                        </div>

                                        {/* WAKTU MULAI */}

                                        <div>

                                            <label className="dc-label">
                                                Waktu Mulai
                                                <span className="dc-required">
                                                    *
                                                </span>
                                            </label>

                                            <input
                                                type="time"
                                                name="agenda_waktu_mulai"
                                                value={
                                                    agendaWaktuMulai
                                                }
                                                onChange={(e) =>
                                                    setAgendaWaktuMulai(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                required
                                                className="dc-input"
                                            />

                                        </div>

                                        {/* WAKTU SELESAI */}

                                        <div>

                                            <label className="dc-label">
                                                Waktu Selesai
                                            </label>

                                            <input
                                                type="time"
                                                name="agenda_waktu_selesai"
                                                value={
                                                    agendaWaktuSelesai
                                                }
                                                onChange={(e) =>
                                                    setAgendaWaktuSelesai(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="dc-input"
                                            />

                                        </div>

                                        {/* LOKASI */}

                                        <div
                                            style={{
                                                gridColumn:
                                                    '1 / -1',
                                            }}
                                        >

                                            <label className="dc-label">
                                                Lokasi
                                            </label>

                                            <input
                                                type="text"
                                                name="agenda_lokasi"
                                                value={
                                                    agendaLokasi
                                                }
                                                onChange={(e) =>
                                                    setAgendaLokasi(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="dc-input"
                                                placeholder="Contoh: Ruang Direktur / Aula"
                                            />

                                        </div>

                                        {/* KETERANGAN */}

                                        <div
                                            style={{
                                                gridColumn:
                                                    '1 / -1',
                                            }}
                                        >

                                            <label className="dc-label">
                                                Keterangan Agenda
                                            </label>

                                            <textarea
                                                name="agenda_keterangan"
                                                value={
                                                    agendaKeterangan
                                                }
                                                onChange={(e) =>
                                                    setAgendaKeterangan(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="dc-textarea"
                                                style={{
                                                    minHeight:
                                                        '90px',
                                                }}
                                                placeholder="Keterangan tambahan untuk Direktur."
                                            />

                                        </div>

                                    </div>

                                </section>
                            )}

                        </div>

                        {/* =================================================
                            ACTION
                        ================================================= */}

                        <div className="dc-actions">

                            <a
                                href={`/sekretaris/surat-masuk/${surat.id}`}
                                className="dc-button dc-button-secondary"
                            >
                                Batal
                            </a>

                            <button
                                type="submit"
                                className="dc-button dc-button-primary"
                            >
                                {tujuanType ===
                                'direktur'
                                    ? 'Kirim Disposisi & Buat Agenda'
                                    : 'Kirim Disposisi'}
                            </button>

                        </div>

                    </form>

                </section>

            </main>
        </div>
    );
}