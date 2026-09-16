import React, { useState } from 'react';

export default function AgendaEdit({
    agenda = null,
    errors = [],
}) {
    // =====================================================
    // DATA
    // =====================================================

    const safeAgenda = agenda || null;

    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(false);

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
    // DATE ONLY
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
    // TIME
    // =====================================================

    const formatTimeForInput = (value) => {
        if (!value) {
            return '';
        }

        const text = String(value).trim();

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
            text.match(/(\d{2}:\d{2})/);

        return match
            ? match[1]
            : '';
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = () => {
        if (loading) {
            return;
        }

        setLoading(true);
    };

    // =====================================================
    // EMPTY
    // =====================================================

    if (!safeAgenda) {
        return (
            <>
                <style>{`

                    .agenda-edit-empty-page {
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

                    .agenda-edit-empty-card {
                        width: 100%;
                        max-width: 470px;
                        padding: 35px;
                        background: #ffffff;
                        border: 1px solid #e2e8f0;
                        border-radius: 18px;
                        text-align: center;
                        box-shadow:
                            0 15px 40px
                            rgba(15,23,42,.06);
                    }

                    .agenda-edit-empty-icon {
                        width: 58px;
                        height: 58px;
                        margin: 0 auto 15px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 16px;
                        background: #fef2f2;
                        color: #dc2626;
                        font-size: 24px;
                        font-weight: 800;
                    }

                    .agenda-edit-empty-title {
                        color: #0f2747;
                        font-size: 18px;
                        font-weight: 800;
                    }

                    .agenda-edit-empty-text {
                        margin-top: 8px;
                        color: #64748b;
                        font-size: 11px;
                        line-height: 1.7;
                    }

                    .agenda-edit-empty-button {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        margin-top: 18px;
                        padding: 10px 15px;
                        border-radius: 9px;
                        background: #0f2747;
                        color: #ffffff;
                        text-decoration: none;
                        font-size: 11px;
                        font-weight: 750;
                    }

                    .agenda-edit-empty-button:hover {
                        background: #174a7e;
                    }

                `}</style>

                <div className="agenda-edit-empty-page">

                    <div className="agenda-edit-empty-card">

                        <div className="agenda-edit-empty-icon">
                            !
                        </div>

                        <div className="agenda-edit-empty-title">
                            Agenda tidak ditemukan
                        </div>

                        <div className="agenda-edit-empty-text">
                            Data agenda yang ingin
                            kamu edit tidak tersedia.
                        </div>

                        <a
                            href="/sekretaris/agenda"
                            className="agenda-edit-empty-button"
                        >
                            ← Kembali ke Agenda
                        </a>

                    </div>

                </div>
            </>
        );
    }

    // =====================================================
    // RETURN
    // =====================================================

    return (
        <>
            <style>{`

                * {
                    box-sizing: border-box;
                }

                .agenda-edit-page {
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

                /* HEADER */

                .agenda-edit-header {
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

                .agenda-edit-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    text-decoration: none;
                }

                .agenda-edit-logo {
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

                .agenda-edit-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                }

                .agenda-edit-brand-title {
                    color: #0f2747;
                    font-size: 18px;
                    font-weight: 800;
                }

                .agenda-edit-brand-subtitle {
                    margin-top: 4px;
                    color: #64748b;
                    font-size: 10px;
                }

                .agenda-edit-role {
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

                .agenda-edit-role-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #2563eb;
                }

                /* MAIN */

                .agenda-edit-main {
                    width: 100%;
                    max-width: 1080px;
                    margin: 0 auto;
                    padding: 30px 24px 55px;
                }

                .agenda-edit-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    margin-bottom: 12px;
                    color: #94a3b8;
                    font-size: 11px;
                }

                .agenda-edit-breadcrumb a {
                    color: #64748b;
                    text-decoration: none;
                    font-weight: 600;
                }

                .agenda-edit-breadcrumb a:hover {
                    color: #2563eb;
                }

                .agenda-edit-kicker {
                    display: inline-flex;
                    padding: 5px 9px;
                    margin-bottom: 8px;
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

                .agenda-edit-title {
                    margin: 0;
                    color: #0f2747;
                    font-size: 30px;
                    line-height: 1.2;
                    font-weight: 850;
                    letter-spacing: -.6px;
                }

                .agenda-edit-description {
                    margin: 8px 0 0;
                    color: #64748b;
                    font-size: 12px;
                    line-height: 1.7;
                }

                /* ERROR */

                .agenda-edit-errors {
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

                .agenda-edit-errors-title {
                    margin-bottom: 5px;
                    font-weight: 800;
                }

                .agenda-edit-errors ul {
                    margin: 0;
                    padding-left: 18px;
                }

                /* CARD */

                .agenda-edit-card {
                    margin-top: 22px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow:
                        0 8px 25px
                        rgba(15,23,42,.04);
                }

                .agenda-edit-card-header {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 19px 21px;
                    border-bottom:
                        1px solid #eef2f7;
                }

                .agenda-edit-card-icon {
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

                .agenda-edit-card-title {
                    color: #0f2747;
                    font-size: 15px;
                    font-weight: 800;
                }

                .agenda-edit-card-subtitle {
                    margin-top: 3px;
                    color: #94a3b8;
                    font-size: 10px;
                }

                .agenda-edit-body {
                    padding: 22px;
                }

                .agenda-edit-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(2,minmax(0,1fr));
                    gap: 18px;
                }

                .agenda-edit-full {
                    grid-column: 1 / -1;
                }

                .agenda-edit-label {
                    display: block;
                    margin-bottom: 7px;
                    color: #334155;
                    font-size: 11px;
                    font-weight: 750;
                }

                .agenda-edit-required {
                    margin-left: 3px;
                    color: #dc2626;
                }

                .agenda-edit-input,
                .agenda-edit-select,
                .agenda-edit-textarea {
                    width: 100%;
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

                .agenda-edit-input,
                .agenda-edit-select {
                    height: 44px;
                    padding: 0 12px;
                }

                .agenda-edit-textarea {
                    min-height: 120px;
                    padding: 12px;
                    resize: vertical;
                    line-height: 1.6;
                }

                .agenda-edit-input:hover,
                .agenda-edit-select:hover,
                .agenda-edit-textarea:hover {
                    border-color: #cbd5e1;
                }

                .agenda-edit-input:focus,
                .agenda-edit-select:focus,
                .agenda-edit-textarea:focus {
                    border-color: #60a5fa;
                    box-shadow:
                        0 0 0 3px
                        rgba(59,130,246,.08);
                }

                .agenda-edit-help {
                    margin-top: 6px;
                    color: #94a3b8;
                    font-size: 9px;
                    line-height: 1.5;
                }

                /* SOURCE */

                .agenda-edit-source {
                    padding: 14px;
                    border:
                        1px solid #dbeafe;
                    background: #f8fbff;
                    border-radius: 12px;
                    margin-bottom: 20px;
                }

                .agenda-edit-source-label {
                    color: #94a3b8;
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: .4px;
                }

                .agenda-edit-source-value {
                    margin-top: 5px;
                    color: #1e40af;
                    font-size: 12px;
                    font-weight: 800;
                }

                .agenda-edit-source-link {
                    display: inline-flex;
                    margin-top: 7px;
                    color: #2563eb;
                    text-decoration: none;
                    font-size: 10px;
                    font-weight: 700;
                }

                .agenda-edit-source-link:hover {
                    text-decoration: underline;
                }

                /* ACTION */

                .agenda-edit-actions {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 9px;
                    padding: 17px 21px;
                    border-top:
                        1px solid #eef2f7;
                    background: #f8fafc;
                }

                .agenda-edit-cancel {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 11px 15px;
                    border:
                        1px solid #dbe3ec;
                    border-radius: 10px;
                    background: #ffffff;
                    color: #475569;
                    text-decoration: none;
                    font-size: 11px;
                    font-weight: 750;
                }

                .agenda-edit-cancel:hover {
                    background: #f8fafc;
                }

                .agenda-edit-save {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 11px 17px;
                    border: 0;
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
                }

                .agenda-edit-save:hover:not(:disabled) {
                    transform: translateY(-1px);
                }

                .agenda-edit-save:disabled {
                    background: #94a3b8;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .agenda-edit-footer {
                    padding: 25px 0 10px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 10px;
                }

                @media (max-width: 720px) {

                    .agenda-edit-header {
                        padding: 0 16px;
                    }

                    .agenda-edit-brand-subtitle {
                        display: none;
                    }

                    .agenda-edit-main {
                        padding:
                            22px 15px 40px;
                    }

                    .agenda-edit-title {
                        font-size: 25px;
                    }

                    .agenda-edit-grid {
                        grid-template-columns: 1fr;
                    }

                    .agenda-edit-full {
                        grid-column: auto;
                    }

                    .agenda-edit-role {
                        font-size: 9px;
                    }

                    .agenda-edit-actions {
                        flex-direction: column-reverse;
                        align-items: stretch;
                    }

                    .agenda-edit-cancel,
                    .agenda-edit-save {
                        width: 100%;
                    }
                }

            `}</style>

            <div className="agenda-edit-page">

                {/* HEADER */}

                <header className="agenda-edit-header">

                    <a
                        href="/sekretaris/dashboard"
                        className="agenda-edit-brand"
                    >
                        <div className="agenda-edit-logo">
                            <img
                                src="/images/poltekkes-icon.png"
                                alt="Logo Poltekkes Maluku"
                            />
                        </div>

                        <div>
                            <div className="agenda-edit-brand-title">
                                SIMAP
                            </div>

                            <div className="agenda-edit-brand-subtitle">
                                Poltekkes Maluku
                            </div>
                        </div>
                    </a>

                    <div className="agenda-edit-role">
                        <span className="agenda-edit-role-dot" />
                        Sekretaris Direktur
                    </div>

                </header>

                <main className="agenda-edit-main">

                    {/* BREADCRUMB */}

                    <div className="agenda-edit-breadcrumb">

                        <a href="/sekretaris/dashboard">
                            Dashboard
                        </a>

                        <span>›</span>

                        <a href="/sekretaris/agenda">
                            Agenda Direktur
                        </a>

                        <span>›</span>

                        <span>
                            Edit Agenda
                        </span>

                    </div>

                    {/* HEADER */}

                    <div>

                        <div className="agenda-edit-kicker">
                            Administrasi Sekretaris Direktur
                        </div>

                        <h1 className="agenda-edit-title">
                            Edit Agenda
                        </h1>

                        <p className="agenda-edit-description">
                            Perbarui informasi jadwal,
                            kegiatan, rapat, atau agenda
                            Direktur.
                        </p>

                    </div>

                    {/* ERROR */}

                    {Array.isArray(errors) &&
                        errors.length > 0 && (
                            <div className="agenda-edit-errors">

                                <div className="agenda-edit-errors-title">
                                    Periksa kembali data:
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

                    {/* FORM CARD */}

                    <section className="agenda-edit-card">

                        <div className="agenda-edit-card-header">

                            <div className="agenda-edit-card-icon">
                                📅
                            </div>

                            <div>

                                <div className="agenda-edit-card-title">
                                    Informasi Agenda
                                </div>

                                <div className="agenda-edit-card-subtitle">
                                    Ubah data agenda
                                </div>

                            </div>

                        </div>

                        <form
                            method="POST"
                            action={`/sekretaris/agenda/${safeAgenda.id}`}
                            onSubmit={handleSubmit}
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

                            <div className="agenda-edit-body">

                                {/* SOURCE */}

                                {safeAgenda.surat_masuk && (
                                    <div className="agenda-edit-source">

                                        <div className="agenda-edit-source-label">
                                            Surat Masuk Terkait
                                        </div>

                                        <div className="agenda-edit-source-value">
                                            {safeAgenda
                                                .surat_masuk
                                                .nomor_surat ||
                                                'Surat Masuk'}
                                        </div>

                                        <a
                                            href={`/sekretaris/surat-masuk/${safeAgenda.surat_masuk.id}`}
                                            className="agenda-edit-source-link"
                                        >
                                            Lihat detail surat →
                                        </a>

                                    </div>
                                )}

                                <div className="agenda-edit-grid">

                                    {/* JUDUL */}

                                    <div className="agenda-edit-full">

                                        <label
                                            htmlFor="judul"
                                            className="agenda-edit-label"
                                        >
                                            Judul Agenda
                                            <span className="agenda-edit-required">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="judul"
                                            name="judul"
                                            type="text"
                                            className="agenda-edit-input"
                                            defaultValue={
                                                safeAgenda.judul ||
                                                ''
                                            }
                                            required
                                        />

                                    </div>

                                    {/* TANGGAL */}

                                    <div>

                                        <label
                                            htmlFor="tanggal"
                                            className="agenda-edit-label"
                                        >
                                            Tanggal
                                            <span className="agenda-edit-required">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="tanggal"
                                            name="tanggal"
                                            type="date"
                                            className="agenda-edit-input"
                                            defaultValue={formatDateForInput(
                                                safeAgenda.tanggal
                                            )}
                                            required
                                        />

                                        <div className="agenda-edit-help">
                                            Tanggal disimpan
                                            sebagai tanggal
                                            kalender, tanpa
                                            konversi timezone.
                                        </div>

                                    </div>

                                    {/* JENIS */}

                                    <div>

                                        <label
                                            htmlFor="jenis"
                                            className="agenda-edit-label"
                                        >
                                            Jenis Agenda
                                            <span className="agenda-edit-required">
                                                *
                                            </span>
                                        </label>

                                        <select
                                            id="jenis"
                                            name="jenis"
                                            className="agenda-edit-select"
                                            defaultValue={
                                                safeAgenda.jenis ||
                                                'Rapat'
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

                                    <div>

                                        <label
                                            htmlFor="waktu_mulai"
                                            className="agenda-edit-label"
                                        >
                                            Waktu Mulai
                                            <span className="agenda-edit-required">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="waktu_mulai"
                                            name="waktu_mulai"
                                            type="time"
                                            className="agenda-edit-input"
                                            defaultValue={formatTimeForInput(
                                                safeAgenda.waktu_mulai
                                            )}
                                            required
                                        />

                                    </div>

                                    {/* WAKTU SELESAI */}

                                    <div>

                                        <label
                                            htmlFor="waktu_selesai"
                                            className="agenda-edit-label"
                                        >
                                            Waktu Selesai
                                            <span
                                                style={{
                                                    marginLeft:
                                                        '5px',
                                                    color:
                                                        '#94a3b8',
                                                    fontSize:
                                                        '9px',
                                                    fontWeight:
                                                        500,
                                                }}
                                            >
                                                (opsional)
                                            </span>
                                        </label>

                                        <input
                                            id="waktu_selesai"
                                            name="waktu_selesai"
                                            type="time"
                                            className="agenda-edit-input"
                                            defaultValue={formatTimeForInput(
                                                safeAgenda.waktu_selesai
                                            )}
                                        />

                                    </div>

                                    {/* LOKASI */}

                                    <div className="agenda-edit-full">

                                        <label
                                            htmlFor="lokasi"
                                            className="agenda-edit-label"
                                        >
                                            Lokasi
                                            <span
                                                style={{
                                                    marginLeft:
                                                        '5px',
                                                    color:
                                                        '#94a3b8',
                                                    fontSize:
                                                        '9px',
                                                    fontWeight:
                                                        500,
                                                }}
                                            >
                                                (opsional)
                                            </span>
                                        </label>

                                        <input
                                            id="lokasi"
                                            name="lokasi"
                                            type="text"
                                            className="agenda-edit-input"
                                            defaultValue={
                                                safeAgenda.lokasi ||
                                                ''
                                            }
                                            placeholder="Contoh: Ruang Direktur"
                                        />

                                    </div>

                                    {/* KETERANGAN */}

                                    <div className="agenda-edit-full">

                                        <label
                                            htmlFor="keterangan"
                                            className="agenda-edit-label"
                                        >
                                            Keterangan
                                            <span
                                                style={{
                                                    marginLeft:
                                                        '5px',
                                                    color:
                                                        '#94a3b8',
                                                    fontSize:
                                                        '9px',
                                                    fontWeight:
                                                        500,
                                                }}
                                            >
                                                (opsional)
                                            </span>
                                        </label>

                                        <textarea
                                            id="keterangan"
                                            name="keterangan"
                                            className="agenda-edit-textarea"
                                            defaultValue={
                                                safeAgenda.keterangan ||
                                                ''
                                            }
                                            placeholder="Tambahkan keterangan agenda..."
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="agenda-edit-actions">

                                <a
                                    href="/sekretaris/agenda"
                                    className="agenda-edit-cancel"
                                >
                                    Batal
                                </a>

                                <button
                                    type="submit"
                                    className="agenda-edit-save"
                                    disabled={loading}
                                >
                                    {loading
                                        ? 'Menyimpan...'
                                        : 'Simpan Perubahan'}
                                </button>

                            </div>

                        </form>

                    </section>

                    <div className="agenda-edit-footer">
                        SIMAP Poltekkes Maluku
                    </div>

                </main>

            </div>
        </>
    );
}