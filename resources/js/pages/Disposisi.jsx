import React, { useMemo, useState } from 'react';

export default function Disposisi({
    disposisis = [],
}) {
    const safeDisposisis = Array.isArray(disposisis)
        ? disposisis
        : [];

    // =====================================================
    // FILTER STATE
    // =====================================================

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [tujuanFilter, setTujuanFilter] = useState('');
    const [sifatFilter, setSifatFilter] = useState('');
    const [tanggalDari, setTanggalDari] = useState('');
    const [tanggalSampai, setTanggalSampai] = useState('');

    // =====================================================
    // FORMAT TANGGAL
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        const value = String(date).trim();

        // DATE-only harus dibaca sebagai tanggal kalender, bukan datetime.
        // Jangan gunakan new Date(YYYY-MM-DD) karena bisa bergeser timezone.
        const match = value.match(
            /^(\d{4})-(\d{2})-(\d{2})/
        );

        if (!match) {
            return String(date);
        }

        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);

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

        const daysInMonth = [
            31,
            (year % 4 === 0 &&
                (year % 100 !== 0 ||
                    year % 400 === 0))
                ? 29
                : 28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31,
        ];

        if (
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > daysInMonth[month - 1]
        ) {
            return String(date);
        }

        return `${String(day).padStart(2, '0')} ${months[month - 1]} ${year}`;
    };

    // =====================================================
    // FORMAT TANGGAL + WAKTU
    // =====================================================

    const formatDateTime = (date) => {
        if (!date) {
            return '-';
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return String(date);
        }

        return new Intl.DateTimeFormat(
            'id-ID',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }
        ).format(parsedDate);
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

            send: (
                <>
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
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

            clipboard: (
                <>
                    <rect
                        x="5"
                        y="4"
                        width="14"
                        height="17"
                        rx="2"
                    />
                    <path d="M9 4.5V3h6v1.5" />
                    <path d="M8.5 10h7M8.5 14h7M8.5 18h4" />
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

            alert: (
                <>
                    <path d="M10.3 3.8 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                </>
            ),

            note: (
                <>
                    <path d="M4 4h16v16H4z" />
                    <path d="M8 8h8M8 12h8M8 16h5" />
                </>
            ),

            search: (
                <>
                    <circle
                        cx="11"
                        cy="11"
                        r="7"
                    />
                    <path d="m20 20-4-4" />
                </>
            ),

            filter: (
                <>
                    <path d="M4 6h16" />
                    <path d="M7 12h10" />
                    <path d="M10 18h4" />
                </>
            ),

            refresh: (
                <>
                    <path d="M20 11a8 8 0 0 0-14.8-4" />
                    <path d="M4 4v5h5" />
                    <path d="M4 13a8 8 0 0 0 14.8 4" />
                    <path d="M20 20v-5h-5" />
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
    // TUJUAN
    // =====================================================

    const getTujuan = (item) => {
        if (
            item?.tujuan_type === 'direktur'
        ) {
            return {
                label: 'Direktur',
                type: 'direktur',
            };
        }

        return {
            label:
                item?.unit?.name ||
                'Unit belum ditentukan',
            type: 'unit',
        };
    };

    // =====================================================
    // STATUS LABEL
    // =====================================================

    const getStatusLabel = (status) => {
        const map = {
            terkirim: 'Terkirim',
            in_progress: 'Dalam Proses',
            selesai: 'Selesai',
        };

        return (
            map[status] ||
            status ||
            'Terkirim'
        );
    };

    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusStyle = (status) => {
        if (status === 'selesai') {
            return {
                background: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #bbf7d0',
            };
        }

        if (status === 'in_progress') {
            return {
                background: '#fff7ed',
                color: '#c2410c',
                border: '1px solid #fed7aa',
            };
        }

        return {
            background: '#eff6ff',
            color: '#1d4ed8',
            border: '1px solid #dbeafe',
        };
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

        // Gunakan tanggal kalender WIT dalam format YYYY-MM-DD.
        // Perbandingan string aman karena formatnya ISO date.
        const todayWIT = new Intl.DateTimeFormat(
            'en-CA',
            {
                timeZone: 'Asia/Jayapura',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }
        ).format(new Date());

        const deadlineText = String(
            item.batas_waktu
        )
            .trim()
            .substring(0, 10);

        if (!/^\d{4}-\d{2}-\d{2}$/.test(deadlineText)) {
            return false;
        }

        return deadlineText < todayWIT;
    };

    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    const filteredDisposisis = useMemo(() => {
        const keyword =
            search
                .trim()
                .toLowerCase();

        return safeDisposisis
            .filter((item) => {

                // SEARCH
                if (keyword) {
                    const searchableText = [
                        item?.surat_masuk?.nomor_surat,
                        item?.surat_masuk?.perihal,
                        item?.surat_masuk?.pengirim,
                        item?.instruksi,
                        item?.catatan_tindak_lanjut,
                        item?.unit?.name,
                        item?.sifat,
                        getTujuan(item).label,
                        getStatusLabel(item?.status),
                    ]
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase();

                    if (
                        !searchableText.includes(
                            keyword
                        )
                    ) {
                        return false;
                    }
                }

                // STATUS
                if (
                    statusFilter &&
                    item?.status !==
                        statusFilter
                ) {
                    return false;
                }

                // TUJUAN
                if (
                    tujuanFilter &&
                    item?.tujuan_type !==
                        tujuanFilter
                ) {
                    return false;
                }

                // SIFAT
                if (
                    sifatFilter &&
                    item?.sifat !==
                        sifatFilter
                ) {
                    return false;
                }

                // TANGGAL DARI
                if (tanggalDari) {
                    const itemDate =
                        String(
                            item?.tanggal_disposisi ||
                            item?.created_at ||
                            ''
                        ).substring(0, 10);

                    if (
                        itemDate &&
                        itemDate < tanggalDari
                    ) {
                        return false;
                    }
                }

                // TANGGAL SAMPAI
                if (tanggalSampai) {
                    const itemDate =
                        String(
                            item?.tanggal_disposisi ||
                            item?.created_at ||
                            ''
                        ).substring(0, 10);

                    if (
                        itemDate &&
                        itemDate > tanggalSampai
                    ) {
                        return false;
                    }
                }

                return true;
            })
            .sort((a, b) => {
                const dateA =
                    new Date(
                        a?.tanggal_disposisi ||
                        a?.created_at ||
                        0
                    ).getTime();

                const dateB =
                    new Date(
                        b?.tanggal_disposisi ||
                        b?.created_at ||
                        0
                    ).getTime();

                return dateB - dateA;
            });
    }, [
        safeDisposisis,
        search,
        statusFilter,
        tujuanFilter,
        sifatFilter,
        tanggalDari,
        tanggalSampai,
    ]);

    // =====================================================
    // COUNTS
    // =====================================================

    const jumlahTerkirim =
        safeDisposisis.filter(
            (item) =>
                item.status === 'terkirim'
        ).length;

    const jumlahDalamProses =
        safeDisposisis.filter(
            (item) =>
                item.status === 'in_progress'
        ).length;

    const jumlahSelesai =
        safeDisposisis.filter(
            (item) =>
                item.status === 'selesai'
        ).length;

    const jumlahTerlambat =
        safeDisposisis.filter(
            (item) =>
                isTerlambat(item)
        ).length;

    // =====================================================
    // RESET
    // =====================================================

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('');
        setTujuanFilter('');
        setSifatFilter('');
        setTanggalDari('');
        setTanggalSampai('');
    };

    // =====================================================
    // RETURN
    // =====================================================

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#f4f7fb',
                color: '#0f172a',
                fontFamily:
                    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
        >

            <style>{`

                .disposisi-layout {
                    width: 100%;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 28px 24px 50px;
                    box-sizing: border-box;
                }

                .disposisi-summary {
                    display: grid;
                    grid-template-columns:
                        repeat(5, minmax(0, 1fr));
                    gap: 14px;
                    margin-bottom: 18px;
                }

                .disposisi-table-wrapper {
                    width: 100%;
                    overflow-x: auto;
                }

                .disposisi-table {
                    width: 100%;
                    min-width: 1350px;
                    border-collapse: collapse;
                }

                .disposisi-row {
                    transition:
                        background .15s ease;
                }

                .disposisi-row:hover {
                    background: #f8fafc;
                }

                .filter-grid {
                    display: grid;
                    grid-template-columns:
                        1.7fr
                        repeat(4, minmax(150px, 1fr))
                        auto;
                    gap: 10px;
                    align-items: end;
                }

                .filter-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .filter-label {
                    color: #64748b;
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: .4px;
                }

                .filter-control {
                    width: 100%;
                    height: 40px;
                    box-sizing: border-box;
                    border: 1px solid #e2e8f0;
                    border-radius: 9px;
                    background: #ffffff;
                    color: #334155;
                    font-size: 11px;
                    padding: 0 11px;
                    outline: none;
                    transition: .15s ease;
                }

                .filter-control:focus {
                    border-color: #93c5fd;
                    box-shadow:
                        0 0 0 3px rgba(37,99,235,.08);
                }

                .search-wrapper {
                    position: relative;
                }

                .search-wrapper svg {
                    position: absolute;
                    left: 11px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    pointer-events: none;
                }

                .search-input {
                    padding-left: 35px;
                }

                .reset-button {
                    height: 40px;
                    border: 1px solid #e2e8f0;
                    border-radius: 9px;
                    background: #ffffff;
                    color: #475569;
                    padding: 0 12px;
                    font-size: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    white-space: nowrap;
                    transition: .15s ease;
                }

                .reset-button:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }

                .result-count {
                    margin-top: 11px;
                    color: #94a3b8;
                    font-size: 10px;
                }

                .catatan-cell {
                    max-width: 280px;
                }

                @media (max-width: 1200px) {
                    .disposisi-summary {
                        grid-template-columns:
                            repeat(3, minmax(0, 1fr));
                    }

                    .filter-grid {
                        grid-template-columns:
                            repeat(3, minmax(0, 1fr));
                    }
                }

                @media (max-width: 800px) {
                    .disposisi-summary {
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                    }

                    .filter-grid {
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                    }
                }

                @media (max-width: 600px) {
                    .disposisi-layout {
                        padding:
                            20px 15px 40px;
                    }

                    .disposisi-summary {
                        grid-template-columns:
                            1fr;
                    }

                    .filter-grid {
                        grid-template-columns:
                            1fr;
                    }

                    .disposisi-title {
                        font-size:
                            25px !important;
                    }
                }

            `}</style>


            <main className="disposisi-layout">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    style={{
                        display: 'flex',
                        alignItems:
                            'flex-start',
                        justifyContent:
                            'space-between',
                        gap: '20px',
                        marginBottom:
                            '20px',
                    }}
                >

                    <div>

                        <div
                            style={{
                                display:
                                    'inline-flex',
                                alignItems:
                                    'center',
                                gap: '7px',
                                padding:
                                    '6px 10px',
                                borderRadius:
                                    '999px',
                                background:
                                    '#eff6ff',
                                color:
                                    '#1d4ed8',
                                border:
                                    '1px solid #dbeafe',
                                fontSize:
                                    '10px',
                                fontWeight:
                                    800,
                                marginBottom:
                                    '10px',
                            }}
                        >
                            <Icon
                                name="send"
                                size={13}
                            />

                            Monitoring Disposisi

                        </div>


                        <h1
                            className="disposisi-title"
                            style={{
                                margin: 0,
                                fontSize:
                                    '29px',
                                lineHeight:
                                    1.2,
                                fontWeight:
                                    800,
                                color:
                                    '#0f2747',
                                letterSpacing:
                                    '-.5px',
                            }}
                        >
                            Disposisi
                        </h1>


                        <p
                            style={{
                                margin:
                                    '7px 0 0',
                                color:
                                    '#64748b',
                                fontSize:
                                    '12px',
                                lineHeight:
                                    1.6,
                            }}
                        >
                            Cari, filter, dan pantau
                            seluruh disposisi yang
                            dikirim kepada unit kerja
                            atau Direktur.
                        </p>

                    </div>


                    <a
                        href="/sekretaris/dashboard"
                        style={{
                            display:
                                'inline-flex',
                            alignItems:
                                'center',
                            gap: '7px',
                            padding:
                                '10px 13px',
                            border:
                                '1px solid #e2e8f0',
                            borderRadius:
                                '10px',
                            background:
                                '#ffffff',
                            color:
                                '#475569',
                            textDecoration:
                                'none',
                            fontSize:
                                '11px',
                            fontWeight:
                                700,
                            whiteSpace:
                                'nowrap',
                        }}
                    >
                        <Icon
                            name="arrowLeft"
                            size={14}
                        />

                        Dashboard

                    </a>

                </div>


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <div
                    className="disposisi-summary"
                >

                    <SummaryCard
                        label="Total Disposisi"
                        value={
                            safeDisposisis.length
                        }
                        color="#0f2747"
                        description="Seluruh riwayat"
                    />

                    <SummaryCard
                        label="Terkirim"
                        value={jumlahTerkirim}
                        color="#2563eb"
                        description="Menunggu tindak lanjut"
                    />

                    <SummaryCard
                        label="Dalam Proses"
                        value={
                            jumlahDalamProses
                        }
                        color="#c2410c"
                        description="Sedang dikerjakan"
                    />

                    <SummaryCard
                        label="Selesai"
                        value={jumlahSelesai}
                        color="#16a34a"
                        description="Sudah ditindaklanjuti"
                    />

                    <SummaryCard
                        label="Terlambat"
                        value={jumlahTerlambat}
                        color="#dc2626"
                        description="Melewati batas waktu"
                    />

                </div>


                {/* =================================================
                    FILTER
                ================================================= */}

                <section
                    style={{
                        background:
                            '#ffffff',
                        border:
                            '1px solid #e2e8f0',
                        borderRadius:
                            '17px',
                        padding:
                            '18px',
                        marginBottom:
                            '18px',
                        boxShadow:
                            '0 8px 24px rgba(15,23,42,.03)',
                    }}
                >

                    <div
                        style={{
                            display:
                                'flex',
                            alignItems:
                                'center',
                            justifyContent:
                                'space-between',
                            gap:
                                '12px',
                            marginBottom:
                                '14px',
                        }}
                    >

                        <div>

                            <div
                                style={{
                                    display:
                                        'flex',
                                    alignItems:
                                        'center',
                                    gap:
                                        '7px',
                                    color:
                                        '#0f2747',
                                    fontSize:
                                        '14px',
                                    fontWeight:
                                        800,
                                }}
                            >
                                <Icon
                                    name="filter"
                                    size={16}
                                />

                                Pencarian & Filter

                            </div>

                            <div
                                style={{
                                    marginTop:
                                        '4px',
                                    color:
                                        '#94a3b8',
                                    fontSize:
                                        '10px',
                                }}
                            >
                                Gunakan filter untuk
                                menemukan disposisi
                                tertentu.
                            </div>

                        </div>


                        <button
                            type="button"
                            className="reset-button"
                            onClick={
                                resetFilters
                            }
                        >

                            <Icon
                                name="refresh"
                                size={12}
                            />

                            Reset

                        </button>

                    </div>


                    <div className="filter-grid">

                        {/* SEARCH */}

                        <div className="filter-field">

                            <label className="filter-label">
                                Pencarian
                            </label>

                            <div className="search-wrapper">

                                <Icon
                                    name="search"
                                    size={15}
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Nomor surat, perihal, pengirim, instruksi..."
                                    className="filter-control search-input"
                                />

                            </div>

                        </div>


                        {/* TUJUAN */}

                        <div className="filter-field">

                            <label className="filter-label">
                                Tujuan
                            </label>

                            <select
                                value={
                                    tujuanFilter
                                }
                                onChange={(event) =>
                                    setTujuanFilter(
                                        event.target.value
                                    )
                                }
                                className="filter-control"
                            >

                                <option value="">
                                    Semua Tujuan
                                </option>

                                <option value="unit">
                                    Unit
                                </option>

                                <option value="direktur">
                                    Direktur
                                </option>

                            </select>

                        </div>


                        {/* STATUS */}

                        <div className="filter-field">

                            <label className="filter-label">
                                Status
                            </label>

                            <select
                                value={
                                    statusFilter
                                }
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                                className="filter-control"
                            >

                                <option value="">
                                    Semua Status
                                </option>

                                <option value="terkirim">
                                    Terkirim
                                </option>

                                <option value="in_progress">
                                    Dalam Proses
                                </option>

                                <option value="selesai">
                                    Selesai
                                </option>

                            </select>

                        </div>


                        {/* SIFAT */}

                        <div className="filter-field">

                            <label className="filter-label">
                                Sifat
                            </label>

                            <select
                                value={
                                    sifatFilter
                                }
                                onChange={(event) =>
                                    setSifatFilter(
                                        event.target.value
                                    )
                                }
                                className="filter-control"
                            >

                                <option value="">
                                    Semua Sifat
                                </option>

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


                        {/* TANGGAL DARI */}

                        <div className="filter-field">

                            <label className="filter-label">
                                Tanggal Dari
                            </label>

                            <input
                                type="date"
                                value={
                                    tanggalDari
                                }
                                onChange={(event) =>
                                    setTanggalDari(
                                        event.target.value
                                    )
                                }
                                className="filter-control"
                            />

                        </div>


                        {/* TANGGAL SAMPAI */}

                        <div className="filter-field">

                            <label className="filter-label">
                                Tanggal Sampai
                            </label>

                            <input
                                type="date"
                                value={
                                    tanggalSampai
                                }
                                onChange={(event) =>
                                    setTanggalSampai(
                                        event.target.value
                                    )
                                }
                                className="filter-control"
                            />

                        </div>

                    </div>


                    <div className="result-count">

                        Menampilkan{' '}

                        <strong
                            style={{
                                color:
                                    '#475569',
                            }}
                        >
                            {filteredDisposisis.length}
                        </strong>

                        {' '}dari{' '}

                        <strong
                            style={{
                                color:
                                    '#475569',
                            }}
                        >
                            {safeDisposisis.length}
                        </strong>

                        {' '}disposisi.

                    </div>

                </section>


                {/* =================================================
                    TABLE
                ================================================= */}

                <section
                    style={{
                        background:
                            '#ffffff',
                        border:
                            '1px solid #e2e8f0',
                        borderRadius:
                            '17px',
                        overflow:
                            'hidden',
                        boxShadow:
                            '0 8px 24px rgba(15,23,42,.04)',
                    }}
                >

                    <div
                        style={{
                            padding:
                                '18px 20px',
                            borderBottom:
                                '1px solid #eef2f7',
                            display:
                                'flex',
                            alignItems:
                                'center',
                            justifyContent:
                                'space-between',
                            gap:
                                '15px',
                        }}
                    >

                        <div>

                            <h2
                                style={{
                                    margin: 0,
                                    color:
                                        '#0f2747',
                                    fontSize:
                                        '15px',
                                    fontWeight:
                                        800,
                                }}
                            >
                                Hasil Disposisi
                            </h2>

                            <p
                                style={{
                                    margin:
                                        '4px 0 0',
                                    color:
                                        '#94a3b8',
                                    fontSize:
                                        '10px',
                                }}
                            >
                                Data mengikuti filter
                                yang sedang aktif.
                            </p>

                        </div>


                        <div
                            style={{
                                padding:
                                    '6px 10px',
                                borderRadius:
                                    '999px',
                                background:
                                    '#f8fafc',
                                border:
                                    '1px solid #e2e8f0',
                                color:
                                    '#64748b',
                                fontSize:
                                    '10px',
                                fontWeight:
                                    700,
                            }}
                        >
                            {filteredDisposisis.length}
                            {' '}data
                        </div>

                    </div>


                    <div className="disposisi-table-wrapper">

                        {filteredDisposisis.length === 0 ? (

                            <div
                                style={{
                                    padding:
                                        '60px 20px',
                                    textAlign:
                                        'center',
                                }}
                            >

                                <div
                                    style={{
                                        width:
                                            '60px',
                                        height:
                                            '60px',
                                        margin:
                                            '0 auto 14px',
                                        borderRadius:
                                            '17px',
                                        background:
                                            '#eff6ff',
                                        color:
                                            '#2563eb',
                                        display:
                                            'flex',
                                        alignItems:
                                            'center',
                                        justifyContent:
                                            'center',
                                    }}
                                >
                                    <Icon
                                        name="search"
                                        size={25}
                                    />
                                </div>


                                <div
                                    style={{
                                        color:
                                            '#475569',
                                        fontSize:
                                            '13px',
                                        fontWeight:
                                            700,
                                    }}
                                >
                                    Tidak ada hasil
                                </div>


                                <div
                                    style={{
                                        marginTop:
                                            '6px',
                                        color:
                                            '#94a3b8',
                                        fontSize:
                                            '10px',
                                    }}
                                >
                                    Coba ubah kata
                                    pencarian atau
                                    filter yang digunakan.
                                </div>


                                <button
                                    type="button"
                                    className="reset-button"
                                    onClick={
                                        resetFilters
                                    }
                                    style={{
                                        marginTop:
                                            '14px',
                                    }}
                                >
                                    <Icon
                                        name="refresh"
                                        size={12}
                                    />
                                    Reset Filter
                                </button>

                            </div>

                        ) : (

                            <table
                                className="disposisi-table"
                            >

                                <thead>

                                    <tr
                                        style={{
                                            background:
                                                '#f8fafc',
                                        }}
                                    >

                                        <th style={thStyle}>
                                            Surat Masuk
                                        </th>

                                        <th style={thStyle}>
                                            Tujuan
                                        </th>

                                        <th style={thStyle}>
                                            Instruksi
                                        </th>

                                        <th style={thStyle}>
                                            Sifat
                                        </th>

                                        <th style={thStyle}>
                                            Batas Waktu
                                        </th>

                                        <th style={thStyle}>
                                            Status
                                        </th>

                                        <th style={thStyle}>
                                            Catatan Tindak Lanjut
                                        </th>

                                        <th style={thStyle}>
                                            Tanggal
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredDisposisis.map(
                                        (item) => {

                                            const tujuan =
                                                getTujuan(
                                                    item
                                                );

                                            const statusStyle =
                                                getStatusStyle(
                                                    item.status
                                                );

                                            const terlambat =
                                                isTerlambat(
                                                    item
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        item.id
                                                    }
                                                    className="disposisi-row"
                                                    style={{
                                                        borderTop:
                                                            '1px solid #f1f5f9',
                                                    }}
                                                >

                                                    {/* SURAT */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={{
                                                                display:
                                                                    'flex',
                                                                alignItems:
                                                                    'flex-start',
                                                                gap:
                                                                    '10px',
                                                            }}
                                                        >

                                                            <div
                                                                style={{
                                                                    width:
                                                                        '34px',
                                                                    height:
                                                                        '34px',
                                                                    borderRadius:
                                                                        '9px',
                                                                    background:
                                                                        '#eff6ff',
                                                                    color:
                                                                        '#2563eb',
                                                                    display:
                                                                        'flex',
                                                                    alignItems:
                                                                        'center',
                                                                    justifyContent:
                                                                        'center',
                                                                    flexShrink:
                                                                        0,
                                                                }}
                                                            >

                                                                <Icon
                                                                    name="file"
                                                                    size={15}
                                                                />

                                                            </div>


                                                            <div
                                                                style={{
                                                                    minWidth:
                                                                        0,
                                                                }}
                                                            >

                                                                <div
                                                                    style={{
                                                                        fontWeight:
                                                                            800,
                                                                        color:
                                                                            '#0f2747',
                                                                        lineHeight:
                                                                            1.5,
                                                                    }}
                                                                >
                                                                    {
                                                                        item
                                                                            .surat_masuk
                                                                            ?.perihal ||
                                                                        'Tanpa perihal'
                                                                    }
                                                                </div>


                                                                <div
                                                                    style={{
                                                                        marginTop:
                                                                            '4px',
                                                                        fontSize:
                                                                            '10px',
                                                                        color:
                                                                            '#94a3b8',
                                                                    }}
                                                                >
                                                                    {
                                                                        item
                                                                            .surat_masuk
                                                                            ?.nomor_surat ||
                                                                        '-'
                                                                    }
                                                                </div>


                                                                <div
                                                                    style={{
                                                                        marginTop:
                                                                            '3px',
                                                                        fontSize:
                                                                            '9px',
                                                                        color:
                                                                            '#64748b',
                                                                    }}
                                                                >
                                                                    {
                                                                        item
                                                                            .surat_masuk
                                                                            ?.pengirim ||
                                                                        '-'
                                                                    }
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* TUJUAN */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={{
                                                                display:
                                                                    'inline-flex',
                                                                alignItems:
                                                                    'center',
                                                                gap:
                                                                    '7px',
                                                                padding:
                                                                    '7px 9px',
                                                                borderRadius:
                                                                    '9px',
                                                                background:
                                                                    tujuan.type ===
                                                                    'direktur'
                                                                        ? '#eff6ff'
                                                                        : '#f8fafc',
                                                                color:
                                                                    tujuan.type ===
                                                                    'direktur'
                                                                        ? '#1d4ed8'
                                                                        : '#475569',
                                                                border:
                                                                    tujuan.type ===
                                                                    'direktur'
                                                                        ? '1px solid #dbeafe'
                                                                        : '1px solid #e2e8f0',
                                                                fontSize:
                                                                    '10px',
                                                                fontWeight:
                                                                    700,
                                                            }}
                                                        >

                                                            <Icon
                                                                name={
                                                                    tujuan.type ===
                                                                    'direktur'
                                                                        ? 'user'
                                                                        : 'building'
                                                                }
                                                                size={13}
                                                            />

                                                            {tujuan.label}

                                                        </div>

                                                    </td>


                                                    {/* INSTRUKSI */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={{
                                                                maxWidth:
                                                                    '240px',
                                                                lineHeight:
                                                                    1.6,
                                                                color:
                                                                    '#475569',
                                                            }}
                                                        >
                                                            {
                                                                item.instruksi ||
                                                                '-'
                                                            }
                                                        </div>

                                                    </td>


                                                    {/* SIFAT */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <span
                                                            style={{
                                                                display:
                                                                    'inline-flex',
                                                                alignItems:
                                                                    'center',
                                                                padding:
                                                                    '5px 8px',
                                                                borderRadius:
                                                                    '999px',
                                                                background:
                                                                    item.sifat ===
                                                                    'Rahasia'
                                                                        ? '#fef2f2'
                                                                        : item.sifat ===
                                                                          'Sangat Penting'
                                                                        ? '#fff7ed'
                                                                        : item.sifat ===
                                                                          'Penting'
                                                                        ? '#eff6ff'
                                                                        : '#f8fafc',
                                                                color:
                                                                    item.sifat ===
                                                                    'Rahasia'
                                                                        ? '#dc2626'
                                                                        : item.sifat ===
                                                                          'Sangat Penting'
                                                                        ? '#c2410c'
                                                                        : item.sifat ===
                                                                          'Penting'
                                                                        ? '#1d4ed8'
                                                                        : '#64748b',
                                                                fontSize:
                                                                    '9px',
                                                                fontWeight:
                                                                    700,
                                                            }}
                                                        >
                                                            {
                                                                item.sifat ||
                                                                'Biasa'
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* BATAS WAKTU */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={{
                                                                display:
                                                                    'flex',
                                                                flexDirection:
                                                                    'column',
                                                                gap:
                                                                    '5px',
                                                            }}
                                                        >

                                                            <div
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    alignItems:
                                                                        'flex-start',
                                                                    gap:
                                                                        '6px',
                                                                }}
                                                            >

                                                                <Icon
                                                                    name="calendar"
                                                                    size={13}
                                                                />

                                                                <span>
                                                                    {formatDate(
                                                                        item.batas_waktu
                                                                    )}
                                                                </span>

                                                            </div>


                                                            {terlambat && (

                                                                <span
                                                                    style={{
                                                                        display:
                                                                            'inline-flex',
                                                                        width:
                                                                            'fit-content',
                                                                        alignItems:
                                                                            'center',
                                                                        gap:
                                                                            '4px',
                                                                        padding:
                                                                            '4px 7px',
                                                                        borderRadius:
                                                                            '999px',
                                                                        background:
                                                                            '#fef2f2',
                                                                        color:
                                                                            '#dc2626',
                                                                        border:
                                                                            '1px solid #fecaca',
                                                                        fontSize:
                                                                            '8px',
                                                                        fontWeight:
                                                                            800,
                                                                    }}
                                                                >

                                                                    <Icon
                                                                        name="alert"
                                                                        size={10}
                                                                    />

                                                                    Terlambat

                                                                </span>

                                                            )}

                                                        </div>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <span
                                                            style={{
                                                                display:
                                                                    'inline-flex',
                                                                alignItems:
                                                                    'center',
                                                                gap:
                                                                    '5px',
                                                                padding:
                                                                    '5px 8px',
                                                                borderRadius:
                                                                    '999px',
                                                                background:
                                                                    statusStyle.background,
                                                                color:
                                                                    statusStyle.color,
                                                                border:
                                                                    statusStyle.border,
                                                                fontSize:
                                                                    '9px',
                                                                fontWeight:
                                                                    700,
                                                                whiteSpace:
                                                                    'nowrap',
                                                            }}
                                                        >

                                                            <Icon
                                                                name={
                                                                    item.status ===
                                                                    'selesai'
                                                                        ? 'check'
                                                                        : item.status ===
                                                                          'in_progress'
                                                                        ? 'clock'
                                                                        : 'send'
                                                                }
                                                                size={12}
                                                            />

                                                            {
                                                                getStatusLabel(
                                                                    item.status
                                                                )
                                                            }

                                                        </span>


                                                        {item.status ===
                                                            'selesai' &&
                                                            item.selesai_at && (

                                                                <div
                                                                    style={{
                                                                        marginTop:
                                                                            '6px',
                                                                        fontSize:
                                                                            '9px',
                                                                        color:
                                                                            '#94a3b8',
                                                                    }}
                                                                >
                                                                    Selesai:
                                                                    {' '}
                                                                    {formatDateTime(
                                                                        item.selesai_at
                                                                    )}
                                                                </div>

                                                            )}

                                                    </td>


                                                    {/* CATATAN */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        {item.catatan_tindak_lanjut ? (

                                                            <div
                                                                className="catatan-cell"
                                                                style={{
                                                                    padding:
                                                                        '9px 10px',
                                                                    borderRadius:
                                                                        '10px',
                                                                    background:
                                                                        '#f0fdf4',
                                                                    border:
                                                                        '1px solid #dcfce7',
                                                                }}
                                                            >

                                                                <div
                                                                    style={{
                                                                        display:
                                                                            'flex',
                                                                        alignItems:
                                                                            'center',
                                                                        gap:
                                                                            '5px',
                                                                        color:
                                                                            '#15803d',
                                                                        fontSize:
                                                                            '9px',
                                                                        fontWeight:
                                                                            800,
                                                                        marginBottom:
                                                                            '5px',
                                                                    }}
                                                                >

                                                                    <Icon
                                                                        name="note"
                                                                        size={11}
                                                                    />

                                                                    Tindak lanjut

                                                                </div>


                                                                <div
                                                                    style={{
                                                                        color:
                                                                            '#166534',
                                                                        fontSize:
                                                                            '10px',
                                                                        lineHeight:
                                                                            1.6,
                                                                        whiteSpace:
                                                                            'pre-line',
                                                                    }}
                                                                >
                                                                    {
                                                                        item.catatan_tindak_lanjut
                                                                    }
                                                                </div>

                                                            </div>

                                                        ) : (

                                                            <div
                                                                style={{
                                                                    display:
                                                                        'inline-flex',
                                                                    alignItems:
                                                                        'center',
                                                                    gap:
                                                                        '5px',
                                                                    padding:
                                                                        '6px 8px',
                                                                    borderRadius:
                                                                        '8px',
                                                                    background:
                                                                        '#f8fafc',
                                                                    color:
                                                                        '#94a3b8',
                                                                    fontSize:
                                                                        '9px',
                                                                    fontWeight:
                                                                        600,
                                                                }}
                                                            >

                                                                <Icon
                                                                    name="note"
                                                                    size={11}
                                                                />

                                                                Belum ada catatan

                                                            </div>

                                                        )}

                                                    </td>


                                                    {/* TANGGAL */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >

                                                        <div
                                                            style={{
                                                                display:
                                                                    'flex',
                                                                alignItems:
                                                                    'flex-start',
                                                                gap:
                                                                    '6px',
                                                                color:
                                                                    '#64748b',
                                                                whiteSpace:
                                                                    'nowrap',
                                                            }}
                                                        >

                                                            <Icon
                                                                name="clock"
                                                                size={13}
                                                            />

                                                            <span>
                                                                {formatDateTime(
                                                                    item.tanggal_disposisi ||
                                                                    item.created_at
                                                                )}
                                                            </span>

                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        )}

                    </div>

                </section>


                {/* =================================================
                    INFO
                ================================================= */}

                <div
                    style={{
                        marginTop:
                            '16px',
                        padding:
                            '14px 16px',
                        background:
                            '#ffffff',
                        border:
                            '1px solid #e2e8f0',
                        borderRadius:
                            '13px',
                        display:
                            'flex',
                        alignItems:
                            'flex-start',
                        gap:
                            '10px',
                    }}
                >

                    <div
                        style={{
                            width:
                                '32px',
                            height:
                                '32px',
                            borderRadius:
                                '8px',
                            background:
                                '#eff6ff',
                            color:
                                '#2563eb',
                            display:
                                'flex',
                            alignItems:
                                'center',
                            justifyContent:
                                'center',
                            flexShrink:
                                0,
                        }}
                    >

                        <Icon
                            name="clipboard"
                            size={16}
                        />

                    </div>


                    <div>

                        <div
                            style={{
                                color:
                                    '#334155',
                                fontSize:
                                    '11px',
                                fontWeight:
                                    800,
                            }}
                        >
                            Monitoring Disposisi
                        </div>

                        <div
                            style={{
                                marginTop:
                                    '4px',
                                color:
                                    '#64748b',
                                fontSize:
                                    '10px',
                                lineHeight:
                                    1.7,
                            }}
                        >
                            Gunakan pencarian dan filter
                            untuk menemukan disposisi
                            berdasarkan tujuan, status,
                            sifat, maupun tanggal.
                            Catatan tindak lanjut akan
                            muncul setelah unit mengisi
                            hasil pekerjaannya.
                        </div>

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div
                    style={{
                        textAlign:
                            'center',
                        padding:
                            '25px 0 10px',
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
// SUMMARY CARD
// =====================================================

function SummaryCard({
    label,
    value,
    color,
    description,
}) {
    return (
        <div
            style={{
                background:
                    '#ffffff',
                border:
                    '1px solid #e2e8f0',
                borderRadius:
                    '15px',
                padding:
                    '17px',
            }}
        >

            <div
                style={{
                    color:
                        '#64748b',
                    fontSize:
                        '10px',
                    fontWeight:
                        700,
                }}
            >
                {label}
            </div>

            <div
                style={{
                    marginTop:
                        '6px',
                    fontSize:
                        '27px',
                    lineHeight:
                        1,
                    fontWeight:
                        800,
                    color,
                }}
            >
                {value}
            </div>

            <div
                style={{
                    marginTop:
                        '6px',
                    color:
                        '#94a3b8',
                    fontSize:
                        '9px',
                }}
            >
                {description}
            </div>

        </div>
    );
}


// =====================================================
// TABLE STYLE
// =====================================================

const thStyle = {
    textAlign: 'left',
    padding: '13px 16px',
    fontSize: '10px',
    color: '#64748b',
    fontWeight: 800,
    whiteSpace: 'nowrap',
};

const tdStyle = {
    padding: '15px 16px',
    fontSize: '11px',
    color: '#475569',
    verticalAlign: 'top',
};