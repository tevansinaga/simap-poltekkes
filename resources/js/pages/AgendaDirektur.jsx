import React, { useMemo } from 'react';

export default function AgendaDirektur({
    agenda = [],
}) {
    // =====================================================
    // DATA
    // =====================================================

    const safeAgenda = Array.isArray(agenda)
        ? agenda.filter(
            (item) =>
                item &&
                typeof item === 'object' &&
                item.id
        )
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
    // TANGGAL HARI INI - WIT
    // =====================================================

    const todayKey = useMemo(() => {
        return new Intl.DateTimeFormat(
            'en-CA',
            {
                timeZone: 'Asia/Jayapura',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }
        ).format(new Date());
    }, []);

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

            location: (
                <>
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle
                        cx="12"
                        cy="10"
                        r="2.5"
                    />
                </>
            ),

            arrow: (
                <>
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                </>
            ),

            back: (
                <>
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                </>
            ),

            logout: (
                <>
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M13 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
                </>
            ),

            file: (
                <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h8M8 17h6" />
                </>
            ),

            eye: (
                <>
                    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                    <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                    />
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
    // NORMALISASI TANGGAL
    // =====================================================

    const getDateKey = (value) => {
        if (!value) {
            return '';
        }

        const text = String(value).trim();

        const match = text.match(
            /^(\d{4})-(\d{2})-(\d{2})/
        );

        if (!match) {
            return '';
        }

        return `${match[1]}-${match[2]}-${match[3]}`;
    };

    // =====================================================
    // FORMAT TANGGAL
    // =====================================================

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

        const weekdayNames = [
            'Minggu',
            'Senin',
            'Selasa',
            'Rabu',
            'Kamis',
            'Jumat',
            'Sabtu',
        ];

        if (
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > 31
        ) {
            return dateKey;
        }

        const daysInMonth = [
            31,
            28,
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

        let maxDay =
            daysInMonth[month - 1];

        const isLeapYear =
            year % 400 === 0 ||
            (
                year % 4 === 0 &&
                year % 100 !== 0
            );

        if (
            month === 2 &&
            isLeapYear
        ) {
            maxDay = 29;
        }

        if (day > maxDay) {
            return dateKey;
        }

        /*
         * Zeller-style weekday calculation.
         * Tidak menggunakan new Date('YYYY-MM-DD')
         * sehingga aman dari pergeseran timezone.
         */

        let y = year;
        let m = month;

        if (m < 3) {
            m += 12;
            y -= 1;
        }

        const k = y % 100;
        const j = Math.floor(y / 100);

        const h =
            (
                day +
                Math.floor(
                    (13 * (m + 1)) / 5
                ) +
                k +
                Math.floor(k / 4) +
                Math.floor(j / 4) +
                5 * j
            ) % 7;

        const weekdayIndex =
            (h + 6) % 7;

        return `${weekdayNames[weekdayIndex]}, ${String(day).padStart(2, '0')} ${monthNames[month - 1]} ${year}`;
    };

    // =====================================================
    // FORMAT JAM
    // =====================================================

    const formatTime = (time) => {
        if (!time) {
            return '--:--';
        }

        const value =
            String(time).trim();

        if (
            /^\d{2}:\d{2}:\d{2}$/.test(
                value
            )
        ) {
            return value.slice(0, 5);
        }

        if (
            /^\d{2}:\d{2}$/.test(
                value
            )
        ) {
            return value;
        }

        const match =
            value.match(
                /(\d{2}:\d{2})/
            );

        return match
            ? match[1]
            : value;
    };

    // =====================================================
    // GROUP AGENDA
    // =====================================================

    const groupedAgenda = useMemo(() => {
        const hariIni = [];
        const mendatang = [];
        const selesai = [];

        safeAgenda.forEach((item) => {
            const agendaDateKey =
                getDateKey(
                    item?.tanggal
                );

            if (!agendaDateKey) {
                return;
            }

            if (
                agendaDateKey ===
                todayKey
            ) {
                hariIni.push(item);
                return;
            }

            if (
                agendaDateKey >
                todayKey
            ) {
                mendatang.push(item);
                return;
            }

            selesai.push(item);
        });

        hariIni.sort((a, b) => {
            const timeA =
                String(
                    a?.waktu_mulai || ''
                );

            const timeB =
                String(
                    b?.waktu_mulai || ''
                );

            return timeA.localeCompare(
                timeB
            );
        });

        mendatang.sort((a, b) => {
            const dateA =
                getDateKey(
                    a?.tanggal
                ) || '';

            const dateB =
                getDateKey(
                    b?.tanggal
                ) || '';

            if (dateA !== dateB) {
                return dateA.localeCompare(
                    dateB
                );
            }

            const timeA =
                String(
                    a?.waktu_mulai || ''
                );

            const timeB =
                String(
                    b?.waktu_mulai || ''
                );

            return timeA.localeCompare(
                timeB
            );
        });

        selesai.sort((a, b) => {
            const dateA =
                getDateKey(
                    a?.tanggal
                ) || '';

            const dateB =
                getDateKey(
                    b?.tanggal
                ) || '';

            return dateB.localeCompare(
                dateA
            );
        });

        return {
            hariIni,
            mendatang,
            selesai,
        };
    }, [
        safeAgenda,
        todayKey,
    ]);

    // =====================================================
    // CARD AGENDA
    // =====================================================

    const AgendaCard = ({
        item,
    }) => {
        const surat =
            item?.surat_masuk ||
            item?.suratMasuk ||
            null;

        return (
            <a
                href={`/direktur/agenda/${item.id}`}
                style={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                    background: '#ffffff',
                    border:
                        '1px solid #e2e8f0',
                    borderRadius: '15px',
                    padding: '18px',
                    transition:
                        'all .18s ease',
                }}
                onMouseEnter={(event) => {
                    event.currentTarget.style.borderColor =
                        '#bfdbfe';

                    event.currentTarget.style.boxShadow =
                        '0 10px 25px rgba(37,99,235,.07)';

                    event.currentTarget.style.transform =
                        'translateY(-1px)';
                }}
                onMouseLeave={(event) => {
                    event.currentTarget.style.borderColor =
                        '#e2e8f0';

                    event.currentTarget.style.boxShadow =
                        'none';

                    event.currentTarget.style.transform =
                        'translateY(0)';
                }}
            >

                <div
                    style={{
                        display: 'flex',
                        justifyContent:
                            'space-between',
                        alignItems:
                            'flex-start',
                        gap: '15px',
                    }}
                >

                    <div
                        style={{
                            flex: 1,
                            minWidth: 0,
                        }}
                    >

                        {/* TAG */}

                        <div
                            style={{
                                display:
                                    'flex',
                                alignItems:
                                    'center',
                                gap: '7px',
                                flexWrap:
                                    'wrap',
                            }}
                        >

                            <span
                                style={{
                                    padding:
                                        '5px 8px',
                                    borderRadius:
                                        '999px',
                                    background:
                                        '#eff6ff',
                                    color:
                                        '#1d4ed8',
                                    border:
                                        '1px solid #dbeafe',
                                    fontSize:
                                        '9px',
                                    fontWeight:
                                        800,
                                }}
                            >
                                {item.jenis ||
                                    'Agenda'}
                            </span>

                            <span
                                style={{
                                    padding:
                                        '5px 8px',
                                    borderRadius:
                                        '999px',
                                    background:
                                        '#f8fafc',
                                    color:
                                        '#64748b',
                                    border:
                                        '1px solid #e2e8f0',
                                    fontSize:
                                        '9px',
                                    fontWeight:
                                        700,
                                }}
                            >
                                Read Only
                            </span>

                        </div>

                        {/* JUDUL */}

                        <div
                            style={{
                                marginTop:
                                    '10px',
                                color:
                                    '#0f2747',
                                fontSize:
                                    '14px',
                                fontWeight:
                                    800,
                                lineHeight:
                                    1.5,
                            }}
                        >
                            {item.judul ||
                                'Tanpa judul'}
                        </div>

                        {/* META */}

                        <div
                            className="agenda-direktur-meta"
                            style={{
                                display:
                                    'grid',
                                gridTemplateColumns:
                                    'repeat(2,minmax(0,1fr))',
                                gap: '10px',
                                marginTop:
                                    '13px',
                            }}
                        >

                            {/* TANGGAL */}

                            <div
                                style={{
                                    display:
                                        'flex',
                                    alignItems:
                                        'flex-start',
                                    gap: '7px',
                                }}
                            >

                                <Icon
                                    name="calendar"
                                    size={14}
                                />

                                <div>

                                    <div
                                        style={{
                                            fontSize:
                                                '9px',
                                            color:
                                                '#94a3b8',
                                            fontWeight:
                                                700,
                                        }}
                                    >
                                        Tanggal
                                    </div>

                                    <div
                                        style={{
                                            marginTop:
                                                '2px',
                                            fontSize:
                                                '10px',
                                            color:
                                                '#475569',
                                            fontWeight:
                                                600,
                                        }}
                                    >
                                        {formatDate(
                                            item.tanggal
                                        )}
                                    </div>

                                </div>

                            </div>

                            {/* WAKTU */}

                            <div
                                style={{
                                    display:
                                        'flex',
                                    alignItems:
                                        'flex-start',
                                    gap: '7px',
                                }}
                            >

                                <Icon
                                    name="clock"
                                    size={14}
                                />

                                <div>

                                    <div
                                        style={{
                                            fontSize:
                                                '9px',
                                            color:
                                                '#94a3b8',
                                            fontWeight:
                                                700,
                                        }}
                                    >
                                        Waktu
                                    </div>

                                    <div
                                        style={{
                                            marginTop:
                                                '2px',
                                            fontSize:
                                                '10px',
                                            color:
                                                '#475569',
                                            fontWeight:
                                                600,
                                        }}
                                    >

                                        {formatTime(
                                            item.waktu_mulai
                                        )}

                                        {item.waktu_selesai &&
                                            ` - ${formatTime(
                                                item.waktu_selesai
                                            )}`}

                                        {' WIT'}

                                    </div>

                                </div>

                            </div>

                            {/* LOKASI */}

                            <div
                                style={{
                                    display:
                                        'flex',
                                    alignItems:
                                        'flex-start',
                                    gap: '7px',
                                }}
                            >

                                <Icon
                                    name="location"
                                    size={14}
                                />

                                <div>

                                    <div
                                        style={{
                                            fontSize:
                                                '9px',
                                            color:
                                                '#94a3b8',
                                            fontWeight:
                                                700,
                                        }}
                                    >
                                        Lokasi
                                    </div>

                                    <div
                                        style={{
                                            marginTop:
                                                '2px',
                                            fontSize:
                                                '10px',
                                            color:
                                                '#475569',
                                            fontWeight:
                                                600,
                                        }}
                                    >
                                        {item.lokasi ||
                                            'Belum ditentukan'}
                                    </div>

                                </div>

                            </div>

                            {/* SUMBER SURAT */}

                            {surat && (
                                <div
                                    style={{
                                        display:
                                            'flex',
                                        alignItems:
                                            'flex-start',
                                        gap: '7px',
                                    }}
                                >

                                    <Icon
                                        name="file"
                                        size={14}
                                    />

                                    <div
                                        style={{
                                            minWidth:
                                                0,
                                        }}
                                    >

                                        <div
                                            style={{
                                                fontSize:
                                                    '9px',
                                                color:
                                                    '#94a3b8',
                                                fontWeight:
                                                    700,
                                            }}
                                        >
                                            Sumber Surat
                                        </div>

                                        <div
                                            style={{
                                                marginTop:
                                                    '2px',
                                                fontSize:
                                                    '10px',
                                                color:
                                                    '#475569',
                                                fontWeight:
                                                    600,
                                                overflow:
                                                    'hidden',
                                                textOverflow:
                                                    'ellipsis',
                                                whiteSpace:
                                                    'nowrap',
                                            }}
                                        >
                                            {surat.nomor_surat ||
                                                '-'}
                                        </div>

                                    </div>

                                </div>
                            )}

                        </div>

                        {/* KETERANGAN */}

                        {item.keterangan && (
                            <div
                                style={{
                                    marginTop:
                                        '13px',
                                    paddingTop:
                                        '12px',
                                    borderTop:
                                        '1px solid #f1f5f9',
                                    color:
                                        '#94a3b8',
                                    fontSize:
                                        '10px',
                                    lineHeight:
                                        1.6,
                                    display:
                                        '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient:
                                        'vertical',
                                    overflow:
                                        'hidden',
                                }}
                            >
                                {item.keterangan}
                            </div>
                        )}

                    </div>

                    {/* ARROW */}

                    <div
                        style={{
                            width: '34px',
                            height: '34px',
                            borderRadius:
                                '9px',
                            background:
                                '#f8fafc',
                            border:
                                '1px solid #e2e8f0',
                            color:
                                '#64748b',
                            display:
                                'flex',
                            alignItems:
                                'center',
                            justifyContent:
                                'center',
                            flexShrink: 0,
                        }}
                    >

                        <Icon
                            name="arrow"
                            size={15}
                        />

                    </div>

                </div>

            </a>
        );
    };

    // =====================================================
    // SECTION
    // =====================================================

    const AgendaSection = ({
        title,
        description,
        data,
        emptyText,
    }) => {
        return (
            <section
                style={{
                    marginTop: '20px',
                }}
            >

                <div
                    style={{
                        marginBottom:
                            '11px',
                    }}
                >

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
                        {title}
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
                        {description}
                    </p>

                </div>

                {data.length === 0 ? (

                    <div
                        style={{
                            background:
                                '#ffffff',
                            border:
                                '1px solid #e2e8f0',
                            borderRadius:
                                '15px',
                            padding:
                                '35px 20px',
                            textAlign:
                                'center',
                        }}
                    >

                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                margin:
                                    '0 auto 11px',
                                borderRadius:
                                    '13px',
                                background:
                                    '#f8fafc',
                                color:
                                    '#94a3b8',
                                display:
                                    'flex',
                                alignItems:
                                    'center',
                                justifyContent:
                                    'center',
                            }}
                        >

                            <Icon
                                name="calendar"
                                size={21}
                            />

                        </div>

                        <div
                            style={{
                                color:
                                    '#475569',
                                fontSize:
                                    '11px',
                                fontWeight:
                                    700,
                            }}
                        >
                            {emptyText}
                        </div>

                    </div>

                ) : (

                    <div
                        style={{
                            display: 'grid',
                            gap: '11px',
                        }}
                    >

                        {data.map((item) => (
                            <AgendaCard
                                key={item.id}
                                item={item}
                            />
                        ))}

                    </div>

                )}

            </section>
        );
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

                .agenda-direktur-layout {
                    width: 100%;
                    max-width: 1150px;
                    margin: 0 auto;
                    padding: 28px 24px 50px;
                    box-sizing: border-box;
                }

                .agenda-direktur-summary {
                    display: grid;
                    grid-template-columns:
                        repeat(3,minmax(0,1fr));
                    gap: 14px;
                }

                .agenda-direktur-logo-box {
                    width: 44px;
                    height: 44px;
                    border-radius: 11px;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    padding: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    box-shadow:
                        0 5px 15px
                        rgba(15,39,71,.07);
                }

                .agenda-direktur-logo-box img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                }

                .agenda-direktur-logout {
                    transition: .15s ease;
                }

                .agenda-direktur-logout:hover {
                    background: #fef2f2 !important;
                }

                .agenda-direktur-back {
                    transition: .15s ease;
                }

                .agenda-direktur-back:hover {
                    background: #174a7e !important;
                }

                @media (max-width: 800px) {

                    .agenda-direktur-summary {
                        grid-template-columns:
                            repeat(2,minmax(0,1fr));
                    }

                }

                @media (max-width: 650px) {

                    .agenda-direktur-layout {
                        padding:
                            20px 15px 40px;
                    }

                    .agenda-direktur-header {
                        padding:
                            0 15px !important;
                    }

                    .agenda-direktur-brand-text {
                        display:
                            none !important;
                    }

                    .agenda-direktur-role {
                        display:
                            none !important;
                    }

                    .agenda-direktur-summary {
                        grid-template-columns:
                            1fr;
                    }

                    .agenda-direktur-title {
                        font-size:
                            26px !important;
                    }

                }

            `}</style>

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header
                className="agenda-direktur-header"
                style={{
                    height: '74px',
                    background: '#ffffff',
                    borderBottom:
                        '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems:
                        'center',
                    justifyContent:
                        'space-between',
                    padding: '0 28px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                }}
            >

                <a
                    href="/direktur/dashboard"
                    style={{
                        display: 'flex',
                        alignItems:
                            'center',
                        gap: '11px',
                        textDecoration:
                            'none',
                    }}
                >

                    <div className="agenda-direktur-logo-box">

                        <img
                            src="/images/poltekkes-icon.png"
                            alt="Logo Poltekkes Maluku"
                        />

                    </div>

                    <div className="agenda-direktur-brand-text">

                        <div
                            style={{
                                fontSize:
                                    '18px',
                                fontWeight:
                                    800,
                                color:
                                    '#0f2747',
                                lineHeight:
                                    1,
                            }}
                        >
                            SIMAP
                        </div>

                        <div
                            style={{
                                marginTop:
                                    '5px',
                                fontSize:
                                    '10px',
                                color:
                                    '#64748b',
                            }}
                        >
                            Poltekkes Maluku
                        </div>

                    </div>

                </a>

                <div
                    style={{
                        display: 'flex',
                        alignItems:
                            'center',
                        gap: '10px',
                    }}
                >

                    <span
                        className="agenda-direktur-role"
                        style={{
                            padding:
                                '8px 12px',
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
                                700,
                        }}
                    >
                        Direktur
                    </span>

                    <form
                        method="POST"
                        action="/logout"
                        style={{
                            margin: 0,
                        }}
                    >

                        <input
                            type="hidden"
                            name="_token"
                            value={
                                csrfToken
                            }
                        />

                        <button
                            type="submit"
                            title="Keluar"
                            className="agenda-direktur-logout"
                            style={{
                                width:
                                    '38px',
                                height:
                                    '38px',
                                border:
                                    '1px solid #fecaca',
                                borderRadius:
                                    '9px',
                                background:
                                    '#ffffff',
                                color:
                                    '#dc2626',
                                display:
                                    'flex',
                                alignItems:
                                    'center',
                                justifyContent:
                                    'center',
                                cursor:
                                    'pointer',
                            }}
                        >

                            <Icon
                                name="logout"
                                size={16}
                            />

                        </button>

                    </form>

                </div>

            </header>

            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="agenda-direktur-layout">

                {/* BREADCRUMB */}

                <div
                    style={{
                        display:
                            'flex',
                        alignItems:
                            'center',
                        gap: '7px',
                        fontSize:
                            '11px',
                        color:
                            '#94a3b8',
                        marginBottom:
                            '14px',
                    }}
                >

                    <a
                        href="/direktur/dashboard"
                        style={{
                            color:
                                '#64748b',
                            textDecoration:
                                'none',
                        }}
                    >
                        Dashboard
                    </a>

                    <span>›</span>

                    <span
                        style={{
                            color:
                                '#475569',
                            fontWeight:
                                700,
                        }}
                    >
                        Semua Agenda
                    </span>

                </div>

                {/* HERO */}

                <section
                    style={{
                        background:
                            'linear-gradient(135deg,#0f2747,#174a7e)',
                        borderRadius:
                            '19px',
                        padding:
                            '26px',
                        marginBottom:
                            '20px',
                        position:
                            'relative',
                        overflow:
                            'hidden',
                        boxShadow:
                            '0 12px 30px rgba(15,39,71,.10)',
                    }}
                >

                    <div
                        style={{
                            position:
                                'absolute',
                            width:
                                '200px',
                            height:
                                '200px',
                            borderRadius:
                                '50%',
                            background:
                                'rgba(255,255,255,.05)',
                            right:
                                '-70px',
                            top:
                                '-90px',
                        }}
                    />

                    <div
                        style={{
                            position:
                                'relative',
                        }}
                    >

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
                                    'rgba(255,255,255,.10)',
                                color:
                                    '#dbeafe',
                                fontSize:
                                    '10px',
                                fontWeight:
                                    700,
                            }}
                        >

                            <Icon
                                name="calendar"
                                size={13}
                            />

                            Agenda Direktur

                        </div>

                        <h1
                            className="agenda-direktur-title"
                            style={{
                                margin:
                                    '12px 0 0',
                                color:
                                    '#ffffff',
                                fontSize:
                                    '29px',
                                lineHeight:
                                    1.2,
                                fontWeight:
                                    800,
                                letterSpacing:
                                    '-.5px',
                            }}
                        >
                            Semua Agenda
                        </h1>

                        <p
                            style={{
                                maxWidth:
                                    '680px',
                                margin:
                                    '8px 0 0',
                                color:
                                    '#dbeafe',
                                fontSize:
                                    '12px',
                                lineHeight:
                                    1.7,
                            }}
                        >
                            Daftar seluruh agenda
                            Direktur yang telah
                            disiapkan oleh Sekretaris
                            Direktur. Halaman ini
                            bersifat read-only.
                        </p>

                    </div>

                </section>

                {/* SUMMARY */}

                <div
                    className="agenda-direktur-summary"
                >

                    {/* HARI INI */}

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
                            Hari Ini
                        </div>

                        <div
                            style={{
                                marginTop:
                                    '6px',
                                color:
                                    '#2563eb',
                                fontSize:
                                    '27px',
                                lineHeight:
                                    1,
                                fontWeight:
                                    800,
                            }}
                        >
                            {
                                groupedAgenda
                                    .hariIni
                                    .length
                            }
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
                            Agenda hari ini
                        </div>

                    </div>

                    {/* MENDATANG */}

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
                            Mendatang
                        </div>

                        <div
                            style={{
                                marginTop:
                                    '6px',
                                color:
                                    '#16a34a',
                                fontSize:
                                    '27px',
                                lineHeight:
                                    1,
                                fontWeight:
                                    800,
                            }}
                        >
                            {
                                groupedAgenda
                                    .mendatang
                                    .length
                            }
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
                            Setelah hari ini
                        </div>

                    </div>

                    {/* TOTAL */}

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
                            Total Agenda
                        </div>

                        <div
                            style={{
                                marginTop:
                                    '6px',
                                color:
                                    '#0f2747',
                                fontSize:
                                    '27px',
                                lineHeight:
                                    1,
                                fontWeight:
                                    800,
                            }}
                        >
                            {safeAgenda.length}
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
                            Seluruh agenda
                        </div>

                    </div>

                </div>

                {/* AGENDA HARI INI */}

                <AgendaSection
                    title="Agenda Hari Ini"
                    description="Kegiatan Direktur yang dijadwalkan untuk hari ini."
                    data={
                        groupedAgenda.hariIni
                    }
                    emptyText="Tidak ada agenda untuk hari ini."
                />

                {/* AGENDA MENDATANG */}

                <AgendaSection
                    title="Agenda Mendatang"
                    description="Kegiatan yang akan dilaksanakan setelah hari ini."
                    data={
                        groupedAgenda.mendatang
                    }
                    emptyText="Belum ada agenda mendatang."
                />

                {/* AGENDA SEBELUMNYA */}

                {groupedAgenda.selesai
                    .length > 0 && (
                    <AgendaSection
                        title="Agenda Sebelumnya"
                        description="Agenda yang tanggal pelaksanaannya telah lewat."
                        data={
                            groupedAgenda.selesai
                        }
                        emptyText="Belum ada agenda sebelumnya."
                    />
                )}

                {/* BACK */}

                <div
                    style={{
                        marginTop:
                            '22px',
                    }}
                >

                    <a
                        href="/direktur/dashboard"
                        className="agenda-direktur-back"
                        style={{
                            display:
                                'inline-flex',
                            alignItems:
                                'center',
                            gap: '7px',
                            padding:
                                '10px 14px',
                            borderRadius:
                                '10px',
                            background:
                                '#0f2747',
                            color:
                                '#ffffff',
                            textDecoration:
                                'none',
                            fontSize:
                                '11px',
                            fontWeight:
                                700,
                        }}
                    >

                        <Icon
                            name="back"
                            size={14}
                        />

                        Kembali ke Dashboard

                    </a>

                </div>

                {/* FOOTER */}

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