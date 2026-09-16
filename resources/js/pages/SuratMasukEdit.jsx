import React, { useRef, useState } from 'react';

export default function SuratMasukEdit({
    surat = null,
    errors = [],
}) {
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
    // FORMAT DATE INPUT
    // =====================================================

    const formatDateForInput = (value) => {
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
    // RESET FILE BARU
    // =====================================================

    const resetNewFile = () => {
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
        if (loading || fileError) {
            event.preventDefault();
            return;
        }

        setLoading(true);
    };

    // =====================================================
    // EMPTY STATE
    // =====================================================

    if (!surat) {
        return (
            <div className="surat-edit-empty-page">

                <style>{`
                    .surat-edit-empty-page {
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

                    .surat-edit-empty-card {
                        width: 100%;
                        max-width: 430px;
                        padding: 35px;
                        background: #ffffff;
                        border: 1px solid #e2e8f0;
                        border-radius: 17px;
                        color: #0f2747;
                        font-size: 16px;
                        font-weight: 800;
                        text-align: center;
                        box-shadow:
                            0 12px 30px
                            rgba(15,23,42,.06);
                    }

                    .surat-edit-empty-card a {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        margin-top: 15px;
                        padding: 10px 14px;
                        border-radius: 9px;
                        background: #0f2747;
                        color: #ffffff;
                        text-decoration: none;
                        font-size: 11px;
                        font-weight: 700;
                    }

                    .surat-edit-empty-card a:hover {
                        background: #174a7e;
                    }
                `}</style>

                <div className="surat-edit-empty-card">

                    Data surat tidak ditemukan.

                    <br />

                    <a href="/sekretaris/surat-masuk">
                        Kembali ke Surat Masuk
                    </a>

                </div>

            </div>
        );
    }

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

            upload: (
                <>
                    <path d="M12 16V4" />
                    <path d="m7 9 5-5 5 5" />
                    <path d="M5 20h14" />
                </>
            ),

            arrowLeft: (
                <>
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                </>
            ),

            save: (
                <>
                    <path d="M5 3h12l2 2v16H5z" />
                    <path d="M8 3v6h8V3" />
                    <path d="M8 21v-7h8v7" />
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
    // OLD FILE NAME
    // =====================================================

    const currentFileName =
        surat.file_surat
            ? String(surat.file_surat)
                .split('/')
                .pop()
            : '';

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="surat-edit-page">

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .surat-edit-page {
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

                .surat-edit-header {
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

                .surat-edit-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    text-decoration: none;
                }

                .surat-edit-logo {
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

                .surat-edit-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                }

                .surat-edit-brand-title {
                    color: #0f2747;
                    font-size: 18px;
                    font-weight: 800;
                    line-height: 1.1;
                }

                .surat-edit-brand-subtitle {
                    margin-top: 4px;
                    color: #64748b;
                    font-size: 10px;
                }

                .surat-edit-role {
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

                .surat-edit-role-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #2563eb;
                }

                /* =================================================
                    MAIN
                ================================================= */

                .surat-edit-main {
                    width: 100%;
                    max-width: 1080px;
                    margin: 0 auto;
                    padding: 30px 24px 50px;
                }

                .surat-edit-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    margin-bottom: 10px;
                    color: #94a3b8;
                    font-size: 11px;
                }

                .surat-edit-breadcrumb a {
                    color: #64748b;
                    text-decoration: none;
                    font-weight: 600;
                }

                .surat-edit-breadcrumb a:hover {
                    color: #2563eb;
                }

                .surat-edit-kicker {
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

                .surat-edit-title {
                    margin: 0;
                    color: #0f2747;
                    font-size: 30px;
                    font-weight: 850;
                    line-height: 1.2;
                    letter-spacing: -.6px;
                }

                .surat-edit-description {
                    margin: 8px 0 0;
                    color: #64748b;
                    font-size: 12px;
                    line-height: 1.7;
                }

                /* =================================================
                    ERROR
                ================================================= */

                .surat-edit-errors {
                    margin-top: 20px;
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

                .surat-edit-errors-title {
                    font-weight: 800;
                    margin-bottom: 5px;
                }

                .surat-edit-errors ul {
                    margin: 0;
                    padding-left: 18px;
                }

                .surat-edit-file-error {
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

                .surat-edit-file-error-text {
                    flex: 1;
                    line-height: 1.5;
                }

                .surat-edit-error-close {
                    width: 29px;
                    height: 29px;
                    padding: 0;
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

                .surat-edit-error-close:hover {
                    background: rgba(194,65,12,.16);
                }

                /* =================================================
                    CARD
                ================================================= */

                .surat-edit-card {
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

                .surat-edit-card-header {
                    padding: 19px 21px;
                    border-bottom:
                        1px solid #eef2f7;
                    display: flex;
                    align-items: center;
                    gap: 11px;
                }

                .surat-edit-card-icon {
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

                .surat-edit-card-title {
                    color: #0f2747;
                    font-size: 15px;
                    font-weight: 800;
                }

                .surat-edit-card-subtitle {
                    margin-top: 3px;
                    color: #94a3b8;
                    font-size: 10px;
                }

                .surat-edit-body {
                    padding: 21px;
                }

                .surat-edit-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(
                            2,
                            minmax(0,1fr)
                        );
                    gap: 18px;
                }

                .surat-edit-full {
                    grid-column:
                        1 / -1;
                }

                .surat-edit-label {
                    display: block;
                    margin-bottom: 7px;
                    color: #334155;
                    font-size: 11px;
                    font-weight: 750;
                }

                .surat-edit-required {
                    margin-left: 3px;
                    color: #dc2626;
                }

                .surat-edit-optional {
                    margin-left: 5px;
                    color: #94a3b8;
                    font-size: 9px;
                    font-weight: 500;
                }

                .surat-edit-input,
                .surat-edit-select {
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

                .surat-edit-input:hover,
                .surat-edit-select:hover {
                    border-color: #cbd5e1;
                }

                .surat-edit-input:focus,
                .surat-edit-select:focus {
                    border-color: #60a5fa;
                    box-shadow:
                        0 0 0 3px
                        rgba(59,130,246,.08);
                }

                /* =================================================
                    FILE UPLOAD
                ================================================= */

                .surat-edit-upload {
                    position: relative;
                    border:
                        1.5px dashed #cbd5e1;
                    border-radius: 13px;
                    padding: 15px;
                    background: #f8fafc;
                    transition: all .18s ease;
                }

                .surat-edit-upload:hover {
                    border-color: #93c5fd;
                    background: #f8fbff;
                }

                .surat-edit-upload.has-file {
                    border-style: solid;
                    border-color: #bfdbfe;
                    background: #f8fbff;
                }

                .surat-edit-upload-main {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                }

                .surat-edit-upload-icon {
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

                .surat-edit-upload-text {
                    flex: 1;
                    min-width: 0;
                    color: #475569;
                    font-size: 10px;
                    line-height: 1.6;
                }

                .surat-edit-upload-text strong {
                    display: block;
                    color: #334155;
                    font-size: 11px;
                }

                .surat-edit-upload-text span {
                    display: block;
                    margin-top: 1px;
                    color: #94a3b8;
                }

                .surat-edit-file-input {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0,0,0,0);
                    white-space: nowrap;
                    border: 0;
                }

                .surat-edit-upload-buttons {
                    margin-top: 13px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .surat-edit-select-file {
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

                .surat-edit-select-file:hover {
                    background: #174a7e;
                    transform: translateY(-1px);
                }

                /* =================================================
                    CURRENT FILE
                ================================================= */

                .surat-edit-current-file {
                    margin-top: 12px;
                    padding: 11px;
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 10px;
                }

                .surat-edit-current-file-icon {
                    width: 32px;
                    height: 32px;
                    flex-shrink: 0;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #eff6ff;
                    color: #2563eb;
                }

                .surat-edit-current-file-content {
                    min-width: 0;
                    flex: 1;
                }

                .surat-edit-current-file-name {
                    color: #475569;
                    font-size: 10px;
                    font-weight: 700;
                    line-height: 1.5;
                    word-break: break-word;
                }

                .surat-edit-current-file-note {
                    margin-top: 2px;
                    color: #94a3b8;
                    font-size: 8px;
                }

                /* =================================================
                    NEW FILE
                ================================================= */

                .surat-edit-selected-file {
                    margin-top: 12px;
                    padding: 11px;
                    border-radius: 10px;
                    background: #ffffff;
                    border:
                        1px solid #dbeafe;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                }

                .surat-edit-selected-file-left {
                    min-width: 0;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 9px;
                }

                .surat-edit-selected-file-icon {
                    width: 32px;
                    height: 32px;
                    flex-shrink: 0;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #eff6ff;
                    color: #2563eb;
                }

                .surat-edit-selected-file-content {
                    min-width: 0;
                }

                .surat-edit-selected-file-name {
                    color: #1e40af;
                    font-size: 10px;
                    font-weight: 800;
                    line-height: 1.4;
                    word-break: break-word;
                }

                .surat-edit-selected-file-size {
                    margin-top: 2px;
                    color: #94a3b8;
                    font-size: 9px;
                }

                .surat-edit-remove-file {
                    width: 31px;
                    height: 31px;
                    padding: 0;
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

                .surat-edit-remove-file:hover {
                    background: #fee2e2;
                    border-color: #fca5a5;
                }

                .surat-edit-upload-help {
                    margin-top: 8px;
                    color: #94a3b8;
                    font-size: 8px;
                    line-height: 1.5;
                }

                /* =================================================
                    INFO
                ================================================= */

                .surat-edit-info {
                    margin-top: 18px;
                    padding: 13px 14px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    background: #f8fafc;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 11px;
                }

                .surat-edit-info-icon {
                    width: 30px;
                    height: 30px;
                    flex-shrink: 0;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #eff6ff;
                    color: #2563eb;
                }

                .surat-edit-info-text {
                    color: #64748b;
                    font-size: 9px;
                    line-height: 1.7;
                }

                /* =================================================
                    ACTION
                ================================================= */

                .surat-edit-actions {
                    padding: 17px 21px;
                    border-top:
                        1px solid #eef2f7;
                    background: #f8fafc;
                    display: flex;
                    justify-content: flex-end;
                    gap: 9px;
                }

                .surat-edit-cancel {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    padding: 11px 15px;
                    border-radius: 10px;
                    background: #ffffff;
                    border:
                        1px solid #dbe3ec;
                    color: #475569;
                    text-decoration: none;
                    font-size: 11px;
                    font-weight: 750;
                    transition: .15s ease;
                }

                .surat-edit-cancel:hover {
                    background: #f8fafc;
                }

                .surat-edit-save {
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

                .surat-edit-save:hover:not(:disabled) {
                    transform: translateY(-1px);
                }

                .surat-edit-save:disabled {
                    background: #94a3b8;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .surat-edit-footer {
                    padding: 25px 0 10px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 10px;
                }

                /* =================================================
                    RESPONSIVE
                ================================================= */

                @media (max-width: 720px) {

                    .surat-edit-header {
                        padding:
                            0 16px;
                    }

                    .surat-edit-brand-subtitle,
                    .surat-edit-role {
                        display:
                            none;
                    }

                    .surat-edit-main {
                        padding:
                            22px 15px 40px;
                    }

                    .surat-edit-grid {
                        grid-template-columns:
                            1fr;
                    }

                    .surat-edit-full {
                        grid-column:
                            auto;
                    }

                    .surat-edit-actions {
                        flex-direction:
                            column-reverse;
                    }

                    .surat-edit-cancel,
                    .surat-edit-save {
                        width:
                            100%;
                    }

                }

                @media (max-width: 480px) {

                    .surat-edit-title {
                        font-size:
                            26px;
                    }

                    .surat-edit-body {
                        padding:
                            17px;
                    }

                    .surat-edit-card-header {
                        padding:
                            17px;
                    }

                    .surat-edit-actions {
                        padding:
                            15px 17px;
                    }

                }

            `}</style>

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="surat-edit-header">

                <a
                    href="/sekretaris/dashboard"
                    className="surat-edit-brand"
                >

                    <div className="surat-edit-logo">

                        <img
                            src="/images/poltekkes-icon.png"
                            alt="Logo Poltekkes Maluku"
                        />

                    </div>

                    <div>

                        <div className="surat-edit-brand-title">
                            SIMAP
                        </div>

                        <div className="surat-edit-brand-subtitle">
                            Poltekkes Maluku
                        </div>

                    </div>

                </a>

                <div className="surat-edit-role">

                    <span className="surat-edit-role-dot" />

                    Sekretaris Direktur

                </div>

            </header>

            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="surat-edit-main">

                {/* BREADCRUMB */}

                <div className="surat-edit-breadcrumb">

                    <a href="/sekretaris/dashboard">
                        Dashboard
                    </a>

                    <span>›</span>

                    <a href="/sekretaris/surat-masuk">
                        Surat Masuk
                    </a>

                    <span>›</span>

                    <span>
                        Edit Surat
                    </span>

                </div>

                {/* TITLE */}

                <div>

                    <div className="surat-edit-kicker">
                        Administrasi Sekretaris Direktur
                    </div>

                    <h1 className="surat-edit-title">
                        Edit Surat Masuk
                    </h1>

                    <p className="surat-edit-description">
                        Perbarui informasi surat
                        yang tersimpan dalam
                        sistem.
                    </p>

                </div>

                {/* SERVER ERRORS */}

                {hasErrors && (

                    <div className="surat-edit-errors">

                        <div className="surat-edit-errors-title">
                            Data belum dapat
                            diperbarui.
                        </div>

                        <ul>

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

                {/* FILE ERROR */}

                {fileError && (

                    <div className="surat-edit-file-error">

                        <div className="surat-edit-file-error-text">
                            {fileError}
                        </div>

                        <button
                            type="button"
                            className="surat-edit-error-close"
                            onClick={
                                resetNewFile
                            }
                            title="Hapus file"
                        >

                            <Icon
                                name="x"
                                size={14}
                            />

                        </button>

                    </div>

                )}

                {/* =================================================
                    FORM CARD
                ================================================= */}

                <section className="surat-edit-card">

                    <div className="surat-edit-card-header">

                        <div className="surat-edit-card-icon">

                            <Icon
                                name="mail"
                                size={18}
                            />

                        </div>

                        <div>

                            <div className="surat-edit-card-title">
                                Informasi Surat
                            </div>

                            <div className="surat-edit-card-subtitle">
                                Perbarui data surat
                                masuk.
                            </div>

                        </div>

                    </div>

                    <form
                        method="POST"
                        action={`/sekretaris/surat-masuk/${surat.id}`}
                        encType="multipart/form-data"
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <input
                            type="hidden"
                            name="_token"
                            value={csrfToken}
                        />

                        <input
                            type="hidden"
                            name="_method"
                            value="PUT"
                        />

                        <div className="surat-edit-body">

                            <div className="surat-edit-grid">

                                {/* NOMOR SURAT */}

                                <div>

                                    <label
                                        htmlFor="nomor_surat"
                                        className="surat-edit-label"
                                    >
                                        Nomor Surat
                                        <span className="surat-edit-required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="nomor_surat"
                                        name="nomor_surat"
                                        type="text"
                                        className="surat-edit-input"
                                        defaultValue={
                                            surat.nomor_surat ||
                                            ''
                                        }
                                        required
                                    />

                                </div>

                                {/* PENGIRIM */}

                                <div>

                                    <label
                                        htmlFor="pengirim"
                                        className="surat-edit-label"
                                    >
                                        Pengirim
                                        <span className="surat-edit-required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="pengirim"
                                        name="pengirim"
                                        type="text"
                                        className="surat-edit-input"
                                        defaultValue={
                                            surat.pengirim ||
                                            ''
                                        }
                                        required
                                    />

                                </div>

                                {/* TANGGAL SURAT */}

                                <div>

                                    <label
                                        htmlFor="tanggal_surat"
                                        className="surat-edit-label"
                                    >
                                        Tanggal Surat
                                        <span className="surat-edit-required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="tanggal_surat"
                                        name="tanggal_surat"
                                        type="date"
                                        className="surat-edit-input"
                                        defaultValue={formatDateForInput(
                                            surat.tanggal_surat
                                        )}
                                        required
                                    />

                                </div>

                                {/* TANGGAL DITERIMA */}

                                <div>

                                    <label
                                        htmlFor="tanggal_diterima"
                                        className="surat-edit-label"
                                    >
                                        Tanggal Diterima
                                        <span className="surat-edit-required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="tanggal_diterima"
                                        name="tanggal_diterima"
                                        type="date"
                                        className="surat-edit-input"
                                        defaultValue={formatDateForInput(
                                            surat.tanggal_diterima
                                        )}
                                        required
                                    />

                                </div>

                                {/* PERIHAL */}

                                <div className="surat-edit-full">

                                    <label
                                        htmlFor="perihal"
                                        className="surat-edit-label"
                                    >
                                        Perihal
                                        <span className="surat-edit-required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="perihal"
                                        name="perihal"
                                        type="text"
                                        className="surat-edit-input"
                                        defaultValue={
                                            surat.perihal ||
                                            ''
                                        }
                                        required
                                    />

                                </div>

                                {/* SIFAT */}

                                <div>

                                    <label
                                        htmlFor="sifat"
                                        className="surat-edit-label"
                                    >
                                        Sifat Surat
                                        <span className="surat-edit-required">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        id="sifat"
                                        name="sifat"
                                        className="surat-edit-select"
                                        defaultValue={
                                            surat.sifat ||
                                            'Biasa'
                                        }
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

                                {/* FILE SURAT */}

                                <div>

                                    <label
                                        htmlFor="file_surat"
                                        className="surat-edit-label"
                                    >
                                        File Surat

                                        <span className="surat-edit-optional">
                                            (opsional)
                                        </span>
                                    </label>

                                    <div
                                        className={`surat-edit-upload ${
                                            fileName
                                                ? 'has-file'
                                                : ''
                                        }`}
                                    >

                                        {/* UPLOAD HEADER */}

                                        <div className="surat-edit-upload-main">

                                            <div className="surat-edit-upload-icon">

                                                <Icon
                                                    name={
                                                        fileName
                                                            ? 'file'
                                                            : 'upload'
                                                    }
                                                    size={18}
                                                />

                                            </div>

                                            <div className="surat-edit-upload-text">

                                                <strong>
                                                    {fileName
                                                        ? 'File baru siap digunakan'
                                                        : 'Pilih dokumen surat baru'}
                                                </strong>

                                                <span>
                                                    PDF maksimal 10 MB.
                                                </span>

                                            </div>

                                        </div>

                                        {/* INPUT FILE ASLI */}

                                        <input
                                            ref={fileInputRef}
                                            id="file_surat"
                                            name="file_surat"
                                            type="file"
                                            accept=".pdf,application/pdf"
                                            className="surat-edit-file-input"
                                            onChange={
                                                handleFileChange
                                            }
                                        />

                                        {/* BUTTON */}

                                        <div className="surat-edit-upload-buttons">

                                            <label
                                                htmlFor="file_surat"
                                                className="surat-edit-select-file"
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

                                        {/* FILE LAMA */}

                                        {currentFileName && (

                                            <div className="surat-edit-current-file">

                                                <div className="surat-edit-current-file-icon">

                                                    <Icon
                                                        name="file"
                                                        size={15}
                                                    />

                                                </div>

                                                <div className="surat-edit-current-file-content">

                                                    <div className="surat-edit-current-file-name">
                                                        {currentFileName}
                                                    </div>

                                                    <div className="surat-edit-current-file-note">
                                                        File PDF yang saat ini tersimpan.
                                                    </div>

                                                </div>

                                            </div>

                                        )}

                                        {/* FILE BARU */}

                                        {fileName && (

                                            <div className="surat-edit-selected-file">

                                                <div className="surat-edit-selected-file-left">

                                                    <div className="surat-edit-selected-file-icon">

                                                        <Icon
                                                            name="file"
                                                            size={15}
                                                        />

                                                    </div>

                                                    <div className="surat-edit-selected-file-content">

                                                        <div className="surat-edit-selected-file-name">
                                                            {fileName}
                                                        </div>

                                                        <div className="surat-edit-selected-file-size">
                                                            {fileSize}
                                                        </div>

                                                    </div>

                                                </div>

                                                <button
                                                    type="button"
                                                    className="surat-edit-remove-file"
                                                    onClick={
                                                        resetNewFile
                                                    }
                                                    title="Batalkan file baru"
                                                >

                                                    <Icon
                                                        name="trash"
                                                        size={14}
                                                    />

                                                </button>

                                            </div>

                                        )}

                                        <div className="surat-edit-upload-help">

                                            Kosongkan bagian ini
                                            apabila tidak ingin
                                            mengganti file lama.

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* INFO */}

                            <div className="surat-edit-info">

                                <div className="surat-edit-info-icon">

                                    <Icon
                                        name="file"
                                        size={15}
                                    />

                                </div>

                                <div className="surat-edit-info-text">

                                    File PDF lama tidak akan
                                    diganti apabila Anda tidak
                                    memilih file baru.
                                    Pilih file baru hanya jika
                                    ingin memperbarui dokumen
                                    surat.

                                </div>

                            </div>

                        </div>

                        {/* ACTION */}

                        <div className="surat-edit-actions">

                            <a
                                href={`/sekretaris/surat-masuk/${surat.id}`}
                                className="surat-edit-cancel"
                            >

                                <Icon
                                    name="arrowLeft"
                                    size={13}
                                />

                                Batal

                            </a>

                            <button
                                type="submit"
                                className="surat-edit-save"
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
                                            name="save"
                                            size={13}
                                        />

                                        Simpan Perubahan
                                    </>
                                )}

                            </button>

                        </div>

                    </form>

                </section>

                <div className="surat-edit-footer">
                    SIMAP Poltekkes Maluku
                </div>

            </main>

        </div>
    );
}