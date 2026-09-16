import React, { useRef, useState } from 'react';

export default function SuratMasukCreate({
    errors = [],
}) {
    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [fileError, setFileError] = useState('');

    const fileInputRef = useRef(null);

    // =====================================================
    // CSRF
    // =====================================================

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '';

    const hasErrors =
        Array.isArray(errors) &&
        errors.length > 0;

    // =====================================================
    // FORMAT FILE SIZE
    // =====================================================

    const formatFileSize = (bytes) => {
        if (!bytes) {
            return '0 KB';
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    // =====================================================
    // RESET FILE
    // =====================================================

    const resetFile = () => {
        setFileName('');
        setFileSize('');
        setFileError('');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // =====================================================
    // FILE HANDLER
    // =====================================================

    const handleFileChange = (event) => {
        const file =
            event.target.files?.[0];

        setFileName('');
        setFileSize('');
        setFileError('');

        if (!file) {
            return;
        }

        const fileNameLower =
            file.name.toLowerCase();

        // =================================================
        // VALIDASI EXTENSION
        // =================================================

        if (!fileNameLower.endsWith('.pdf')) {
            event.target.value = '';

            setFileError(
                'File surat harus berupa PDF.'
            );

            return;
        }

        // =================================================
        // VALIDASI MIME TYPE
        // =================================================

        if (
            file.type &&
            file.type !== 'application/pdf'
        ) {
            event.target.value = '';

            setFileError(
                'File surat harus berupa PDF.'
            );

            return;
        }

        // =================================================
        // VALIDASI SIZE
        // =================================================

        const maxSize =
            10 * 1024 * 1024;

        if (file.size > maxSize) {
            event.target.value = '';

            setFileError(
                'Ukuran file surat maksimal 10 MB.'
            );

            return;
        }

        // =================================================
        // FILE VALID
        // =================================================

        setFileName(file.name);
        setFileSize(
            formatFileSize(file.size)
        );
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = (event) => {
        if (loading) {
            event.preventDefault();
            return;
        }

        setLoading(true);
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

            file: (
                <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h8M8 17h6" />
                </>
            ),

            arrowLeft: (
                <>
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
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

            upload: (
                <>
                    <path d="M12 16V4" />
                    <path d="m7 9 5-5 5 5" />
                    <path d="M5 20h14" />
                </>
            ),

            trash: (
                <>
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v5M14 11v5" />
                </>
            ),

            x: (
                <>
                    <path d="m7 7 10 10" />
                    <path d="M17 7 7 17" />
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
        <div className="surat-create-page">

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .surat-create-page {
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

                .surat-create-header {
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
                    z-index: 40;
                }

                .surat-create-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    text-decoration: none;
                }

                .surat-create-logo {
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
                        0 5px 15px
                        rgba(15,39,71,.07);
                }

                .surat-create-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                }

                .surat-create-brand-title {
                    font-size: 18px;
                    font-weight: 800;
                    color: #0f2747;
                    line-height: 1.1;
                }

                .surat-create-brand-subtitle {
                    margin-top: 4px;
                    color: #64748b;
                    font-size: 10px;
                }

                .surat-create-role {
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

                .surat-create-role-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #2563eb;
                }

                /* =================================================
                    MAIN
                ================================================= */

                .surat-create-main {
                    width: 100%;
                    max-width: 1080px;
                    margin: 0 auto;
                    padding: 30px 24px 50px;
                }

                .surat-create-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: #94a3b8;
                    font-size: 11px;
                    margin-bottom: 10px;
                }

                .surat-create-breadcrumb a {
                    color: #64748b;
                    text-decoration: none;
                    font-weight: 600;
                }

                .surat-create-breadcrumb a:hover {
                    color: #2563eb;
                }

                .surat-create-title {
                    margin: 0;
                    color: #0f2747;
                    font-size: 30px;
                    line-height: 1.2;
                    font-weight: 850;
                    letter-spacing: -.6px;
                }

                .surat-create-description {
                    margin: 8px 0 0;
                    color: #64748b;
                    font-size: 12px;
                    line-height: 1.7;
                }

                /* =================================================
                    ERROR
                ================================================= */

                .surat-create-error {
                    margin-bottom: 18px;
                    padding: 14px 16px;
                    border-radius: 12px;
                    background: #fef2f2;
                    border:
                        1px solid #fecaca;
                    color: #b91c1c;
                    font-size: 11px;
                    line-height: 1.6;
                }

                .surat-create-error-title {
                    margin-bottom: 5px;
                    font-weight: 800;
                }

                .surat-create-error-list {
                    margin: 0;
                    padding-left: 18px;
                }

                .surat-create-file-error {
                    margin-top: 18px;
                    margin-bottom: 18px;
                    padding: 12px 14px;
                    border-radius: 11px;
                    background: #fff7ed;
                    border:
                        1px solid #fed7aa;
                    color: #c2410c;
                    font-size: 11px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }

                .surat-create-error-close {
                    width: 28px;
                    height: 28px;
                    border: 0;
                    border-radius: 8px;
                    background: rgba(194,65,12,.08);
                    color: #c2410c;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    flex-shrink: 0;
                }

                .surat-create-error-close:hover {
                    background: rgba(194,65,12,.16);
                }

                /* =================================================
                    FORM CARD
                ================================================= */

                .surat-create-card {
                    margin-top: 21px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow:
                        0 8px 25px
                        rgba(15,23,42,.04);
                }

                .surat-create-card-header {
                    padding: 19px 21px;
                    border-bottom:
                        1px solid #eef2f7;
                    display: flex;
                    align-items: center;
                    gap: 11px;
                }

                .surat-create-card-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    background: #eff6ff;
                    color: #2563eb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .surat-create-card-title {
                    color: #0f2747;
                    font-size: 15px;
                    font-weight: 800;
                }

                .surat-create-card-subtitle {
                    margin-top: 3px;
                    color: #94a3b8;
                    font-size: 10px;
                }

                .surat-create-body {
                    padding: 21px;
                }

                .surat-create-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(2,minmax(0,1fr));
                    gap: 18px;
                }

                .surat-create-field-full {
                    grid-column:
                        1 / -1;
                }

                .surat-create-label {
                    display: block;
                    margin-bottom: 7px;
                    color: #334155;
                    font-size: 11px;
                    font-weight: 750;
                }

                .surat-create-required {
                    color: #dc2626;
                    margin-left: 3px;
                }

                .surat-create-optional {
                    margin-left: 5px;
                    color: #94a3b8;
                    font-size: 9px;
                    font-weight: 500;
                }

                .surat-create-input,
                .surat-create-select {
                    width: 100%;
                    height: 44px;
                    padding: 0 12px;
                    border:
                        1px solid #dbe3ec;
                    border-radius: 10px;
                    background: #ffffff;
                    color: #334155;
                    outline: none;
                    font-family: inherit;
                    font-size: 12px;
                    transition: .15s ease;
                }

                .surat-create-input:hover,
                .surat-create-select:hover {
                    border-color: #cbd5e1;
                }

                .surat-create-input:focus,
                .surat-create-select:focus {
                    border-color: #60a5fa;
                    box-shadow:
                        0 0 0 3px
                        rgba(59,130,246,.08);
                }

                /* =================================================
                    FILE UPLOAD
                ================================================= */

                .surat-create-upload {
                    position: relative;
                    border:
                        1.5px dashed #cbd5e1;
                    border-radius: 13px;
                    padding: 15px;
                    background: #f8fafc;
                    transition: all .18s ease;
                }

                .surat-create-upload:hover {
                    border-color: #93c5fd;
                    background: #f8fbff;
                }

                .surat-create-upload.has-file {
                    border-style: solid;
                    border-color: #bfdbfe;
                    background: #f8fbff;
                }

                .surat-create-upload-main {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                }

                .surat-create-upload-icon {
                    width: 40px;
                    height: 40px;
                    flex-shrink: 0;
                    border-radius: 10px;
                    background: #eff6ff;
                    color: #2563eb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .surat-create-upload-text {
                    color: #475569;
                    font-size: 10px;
                    line-height: 1.6;
                    flex: 1;
                }

                .surat-create-upload-text strong {
                    display: block;
                    color: #334155;
                    font-size: 11px;
                }

                .surat-create-upload-buttons {
                    margin-top: 13px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .surat-create-select-file {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    min-height: 36px;
                    padding: 8px 12px;
                    border-radius: 9px;
                    background: #0f2747;
                    color: #ffffff;
                    font-size: 10px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: .15s ease;
                }

                .surat-create-select-file:hover {
                    background: #174a7e;
                    transform: translateY(-1px);
                }

                .surat-create-file-input {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }

                .surat-create-file-info {
                    margin-top: 12px;
                    padding: 11px 12px;
                    border-radius: 10px;
                    background: #ffffff;
                    border:
                        1px solid #dbeafe;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                }

                .surat-create-file-info-left {
                    min-width: 0;
                    display: flex;
                    align-items: center;
                    gap: 9px;
                }

                .surat-create-file-info-icon {
                    width: 31px;
                    height: 31px;
                    border-radius: 8px;
                    background: #eff6ff;
                    color: #2563eb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .surat-create-file-name-wrap {
                    min-width: 0;
                }

                .surat-create-file-name {
                    color: #1e40af;
                    font-size: 10px;
                    font-weight: 800;
                    line-height: 1.4;
                    word-break: break-word;
                }

                .surat-create-file-size {
                    margin-top: 2px;
                    color: #94a3b8;
                    font-size: 9px;
                }

                .surat-create-remove-file {
                    width: 31px;
                    height: 31px;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    background: #fef2f2;
                    color: #dc2626;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    flex-shrink: 0;
                    transition: .15s ease;
                }

                .surat-create-remove-file:hover {
                    background: #fee2e2;
                    border-color: #fca5a5;
                }

                /* =================================================
                    INFO
                ================================================= */

                .surat-create-info {
                    margin-top: 18px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 13px 14px;
                    border-radius: 11px;
                    background: #f8fafc;
                    border:
                        1px solid #e2e8f0;
                }

                .surat-create-info-dot {
                    width: 8px;
                    height: 8px;
                    margin-top: 4px;
                    flex-shrink: 0;
                    border-radius: 50%;
                    background: #f59e0b;
                }

                .surat-create-info-text {
                    color: #64748b;
                    font-size: 10px;
                    line-height: 1.7;
                }

                /* =================================================
                    FOOTER ACTION
                ================================================= */

                .surat-create-actions {
                    padding: 17px 21px;
                    border-top:
                        1px solid #eef2f7;
                    background: #f8fafc;
                    display: flex;
                    justify-content: flex-end;
                    gap: 9px;
                }

                .surat-create-cancel {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    padding: 11px 15px;
                    border-radius: 10px;
                    border:
                        1px solid #dbe3ec;
                    background: #ffffff;
                    color: #475569;
                    text-decoration: none;
                    font-size: 11px;
                    font-weight: 750;
                }

                .surat-create-cancel:hover {
                    background: #f8fafc;
                }

                .surat-create-submit {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    padding: 11px 17px;
                    border: none;
                    border-radius: 10px;
                    background:
                        linear-gradient(
                            135deg,
                            #0f2747,
                            #174a7e
                        );
                    color: #ffffff;
                    font-size: 11px;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow:
                        0 7px 17px
                        rgba(15,39,71,.14);
                    transition: .15s ease;
                }

                .surat-create-submit:hover:not(:disabled) {
                    transform: translateY(-1px);
                }

                .surat-create-submit:disabled {
                    background: #94a3b8;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .surat-create-footer {
                    padding: 25px 0 10px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 10px;
                }

                /* =================================================
                    RESPONSIVE
                ================================================= */

                @media (max-width: 720px) {

                    .surat-create-header {
                        padding:
                            0 16px;
                    }

                    .surat-create-brand-subtitle,
                    .surat-create-role {
                        display:
                            none;
                    }

                    .surat-create-main {
                        padding:
                            22px 15px 40px;
                    }

                    .surat-create-grid {
                        grid-template-columns:
                            1fr;
                    }

                    .surat-create-field-full {
                        grid-column:
                            auto;
                    }

                    .surat-create-actions {
                        flex-direction:
                            column-reverse;
                    }

                    .surat-create-cancel,
                    .surat-create-submit {
                        width:
                            100%;
                    }

                    .surat-create-file-info {
                        align-items:
                            flex-start;
                    }

                }

                @media (max-width: 480px) {

                    .surat-create-title {
                        font-size:
                            26px;
                    }

                    .surat-create-body {
                        padding:
                            17px;
                    }

                    .surat-create-card-header {
                        padding:
                            17px;
                    }

                    .surat-create-actions {
                        padding:
                            15px 17px;
                    }

                }

            `}</style>

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="surat-create-header">

                <a
                    href="/sekretaris/dashboard"
                    className="surat-create-brand"
                >

                    <div className="surat-create-logo">

                        <img
                            src="/images/poltekkes-icon.png"
                            alt="Logo Poltekkes Maluku"
                        />

                    </div>

                    <div>

                        <div className="surat-create-brand-title">
                            SIMAP
                        </div>

                        <div className="surat-create-brand-subtitle">
                            Poltekkes Maluku
                        </div>

                    </div>

                </a>

                <div className="surat-create-role">

                    <span className="surat-create-role-dot" />

                    Sekretaris Direktur

                </div>

            </header>

            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="surat-create-main">

                {/* BREADCRUMB */}

                <div className="surat-create-breadcrumb">

                    <a href="/sekretaris/dashboard">
                        Dashboard
                    </a>

                    <span>›</span>

                    <a href="/sekretaris/surat-masuk">
                        Surat Masuk
                    </a>

                    <span>›</span>

                    <span>
                        Tambah Surat
                    </span>

                </div>

                {/* TITLE */}

                <h1 className="surat-create-title">
                    Tambah Surat Masuk
                </h1>

                <p className="surat-create-description">
                    Masukkan informasi surat
                    yang diterima oleh
                    Poltekkes Maluku.
                </p>

                {/* =================================================
                    SERVER ERRORS
                ================================================= */}

                {hasErrors && (

                    <div
                        className="surat-create-error"
                        style={{
                            marginTop: '20px',
                        }}
                    >

                        <div className="surat-create-error-title">
                            Data belum dapat
                            disimpan.
                        </div>

                        <ul className="surat-create-error-list">

                            {errors.map(
                                (
                                    error,
                                    index
                                ) => (
                                    <li
                                        key={
                                            index
                                        }
                                    >
                                        {error}
                                    </li>
                                )
                            )}

                        </ul>

                    </div>

                )}

                {/* =================================================
                    FILE ERROR
                ================================================= */}

                {fileError && (

                    <div className="surat-create-file-error">

                        <span>
                            {fileError}
                        </span>

                        <button
                            type="button"
                            className="surat-create-error-close"
                            onClick={() => {
                                resetFile();
                            }}
                            title="Hapus pilihan file"
                        >
                            <Icon
                                name="x"
                                size={14}
                            />
                        </button>

                    </div>

                )}

                {/* =================================================
                    FORM
                ================================================= */}

                <section className="surat-create-card">

                    <div className="surat-create-card-header">

                        <div className="surat-create-card-icon">

                            <Icon
                                name="mail"
                                size={18}
                            />

                        </div>

                        <div>

                            <div className="surat-create-card-title">
                                Informasi Surat
                            </div>

                            <div className="surat-create-card-subtitle">
                                Lengkapi informasi dasar
                                surat masuk.
                            </div>

                        </div>

                    </div>

                    <form
                        method="POST"
                        action="/sekretaris/surat-masuk"
                        encType="multipart/form-data"
                        onSubmit={handleSubmit}
                    >

                        <input
                            type="hidden"
                            name="_token"
                            value={csrfToken}
                        />

                        <div className="surat-create-body">

                            <div className="surat-create-grid">

                                {/* NOMOR */}

                                <div>

                                    <label
                                        className="surat-create-label"
                                        htmlFor="nomor_surat"
                                    >
                                        Nomor Surat
                                        <span className="surat-create-required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="nomor_surat"
                                        name="nomor_surat"
                                        type="text"
                                        className="surat-create-input"
                                        placeholder="Contoh: 021/PL12/TU/2026"
                                        required
                                    />

                                </div>

                                {/* PENGIRIM */}

                                <div>

                                    <label
                                        className="surat-create-label"
                                        htmlFor="pengirim"
                                    >
                                        Pengirim
                                        <span className="surat-create-required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="pengirim"
                                        name="pengirim"
                                        type="text"
                                        className="surat-create-input"
                                        placeholder="Contoh: Kemenkes RI"
                                        required
                                    />

                                </div>

                                {/* TANGGAL SURAT */}

                                <div>

                                    <label
                                        className="surat-create-label"
                                        htmlFor="tanggal_surat"
                                    >
                                        Tanggal Surat
                                        <span className="surat-create-required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="tanggal_surat"
                                        name="tanggal_surat"
                                        type="date"
                                        className="surat-create-input"
                                        required
                                    />

                                </div>

                                {/* TANGGAL DITERIMA */}

                                <div>

                                    <label
                                        className="surat-create-label"
                                        htmlFor="tanggal_diterima"
                                    >
                                        Tanggal Diterima
                                        <span className="surat-create-required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="tanggal_diterima"
                                        name="tanggal_diterima"
                                        type="date"
                                        className="surat-create-input"
                                        required
                                    />

                                </div>

                                {/* PERIHAL */}

                                <div className="surat-create-field-full">

                                    <label
                                        className="surat-create-label"
                                        htmlFor="perihal"
                                    >
                                        Perihal
                                        <span className="surat-create-required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="perihal"
                                        name="perihal"
                                        type="text"
                                        className="surat-create-input"
                                        placeholder="Masukkan perihal surat"
                                        required
                                    />

                                </div>

                                {/* SIFAT */}

                                <div>

                                    <label
                                        className="surat-create-label"
                                        htmlFor="sifat"
                                    >
                                        Sifat Surat
                                        <span className="surat-create-required">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        id="sifat"
                                        name="sifat"
                                        className="surat-create-select"
                                        defaultValue="Biasa"
                                        required
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

                                {/* FILE */}

                                <div>

                                    <label
                                        className="surat-create-label"
                                        htmlFor="file_surat"
                                    >
                                        File Surat
                                        <span className="surat-create-optional">
                                            (opsional)
                                        </span>
                                    </label>

                                    <div
                                        className={`surat-create-upload ${
                                            fileName
                                                ? 'has-file'
                                                : ''
                                        }`}
                                    >

                                        <div className="surat-create-upload-main">

                                            <div className="surat-create-upload-icon">

                                                <Icon
                                                    name={
                                                        fileName
                                                            ? 'file'
                                                            : 'upload'
                                                    }
                                                    size={18}
                                                />

                                            </div>

                                            <div className="surat-create-upload-text">

                                                <strong>
                                                    {fileName
                                                        ? 'File surat siap diupload'
                                                        : 'Upload dokumen surat'}
                                                </strong>

                                                <span>
                                                    PDF maksimal 10 MB.
                                                </span>

                                            </div>

                                        </div>

                                        {/* HIDDEN REAL INPUT */}

                                        <input
                                            ref={fileInputRef}
                                            id="file_surat"
                                            name="file_surat"
                                            type="file"
                                            accept=".pdf,application/pdf"
                                            className="surat-create-file-input"
                                            onChange={
                                                handleFileChange
                                            }
                                        />

                                        {/* BUTTON AREA */}

                                        <div className="surat-create-upload-buttons">

                                            <label
                                                htmlFor="file_surat"
                                                className="surat-create-select-file"
                                            >

                                                <Icon
                                                    name="upload"
                                                    size={14}
                                                />

                                                {fileName
                                                    ? 'Ganti File'
                                                    : 'Pilih File PDF'}

                                            </label>

                                        </div>

                                        {/* SELECTED FILE */}

                                        {fileName && (

                                            <div className="surat-create-file-info">

                                                <div className="surat-create-file-info-left">

                                                    <div className="surat-create-file-info-icon">

                                                        <Icon
                                                            name="file"
                                                            size={15}
                                                        />

                                                    </div>

                                                    <div className="surat-create-file-name-wrap">

                                                        <div className="surat-create-file-name">
                                                            {fileName}
                                                        </div>

                                                        <div className="surat-create-file-size">
                                                            {fileSize}
                                                        </div>

                                                    </div>

                                                </div>

                                                <button
                                                    type="button"
                                                    className="surat-create-remove-file"
                                                    onClick={
                                                        resetFile
                                                    }
                                                    title="Hapus file"
                                                >

                                                    <Icon
                                                        name="trash"
                                                        size={14}
                                                    />

                                                </button>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                            {/* INFO */}

                            <div className="surat-create-info">

                                <div className="surat-create-info-dot" />

                                <div className="surat-create-info-text">

                                    Setelah surat disimpan,
                                    status awalnya adalah
                                    <strong
                                        style={{
                                            color:
                                                '#475569',
                                        }}
                                    >
                                        {' '}
                                        Menunggu Disposisi
                                    </strong>
                                    .
                                    Sekretaris kemudian dapat
                                    membuat disposisi untuk
                                    unit kerja atau Direktur.

                                </div>

                            </div>

                        </div>

                        {/* ACTION */}

                        <div className="surat-create-actions">

                            <a
                                href="/sekretaris/surat-masuk"
                                className="surat-create-cancel"
                            >

                                <Icon
                                    name="arrowLeft"
                                    size={14}
                                />

                                Batal

                            </a>

                            <button
                                type="submit"
                                className="surat-create-submit"
                                disabled={
                                    loading ||
                                    Boolean(fileError)
                                }
                            >

                                {loading ? (
                                    <>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Icon
                                            name="check"
                                            size={14}
                                        />

                                        Simpan Surat
                                    </>
                                )}

                            </button>

                        </div>

                    </form>

                </section>

                <div className="surat-create-footer">
                    SIMAP Poltekkes Maluku
                </div>

            </main>

        </div>
    );
}