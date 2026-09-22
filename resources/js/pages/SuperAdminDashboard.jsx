import React, {
    useEffect,
    useState,
} from 'react';


export default function SuperAdminDashboard({
    user = null,
    stats = {},
    usersTerbaru = [],
}) {

    // =====================================================
    // DATA AMAN
    // =====================================================

    const safeStats = {
        totalUsers: Number(
            stats?.totalUsers ?? 0
        ),

        activeUsers: Number(
            stats?.activeUsers ?? 0
        ),

        inactiveUsers: Number(
            stats?.inactiveUsers ?? 0
        ),

        totalUnits: Number(
            stats?.totalUnits ?? 0
        ),

        activeUnits: Number(
            stats?.activeUnits ?? 0
        ),
    };


    const safeUsers =
        Array.isArray(usersTerbaru)
            ? usersTerbaru
            : [];


    const userName =
        user?.name ||
        'Super Admin';


    // =====================================================
    // TANGGAL HARI INI
    // =====================================================

    const [todayLabel, setTodayLabel] =
        useState('');

    useEffect(() => {
        const formatter =
            new Intl.DateTimeFormat(
                'id-ID',
                {
                    timeZone:
                        'Asia/Jayapura',

                    weekday:
                        'long',

                    day:
                        '2-digit',

                    month:
                        'long',

                    year:
                        'numeric',
                }
            );

        setTodayLabel(
            formatter.format(new Date())
        );
    }, []);


    // =====================================================
    // ROLE LABEL
    // =====================================================

    const roleLabel = (slug) => {

        const labels = {

            'super-admin':
                'Super Admin',

            'direktur':
                'Direktur',

            'sekretaris-direktur':
                'Sekretaris Direktur',

            'admin':
                'Admin',

            'kepala-unit':
                'Kepala Unit',

            'staf':
                'Staf',
        };


        return (
            labels[slug] ||
            slug ||
            '-'
        );
    };


    // =====================================================
    // STATUS LABEL
    // =====================================================

    const formatStatus = (
        active
    ) => {

        return active
            ? 'Aktif'
            : 'Nonaktif';
    };


    // =====================================================
    // CSRF
    // =====================================================

    const [csrfToken, setCsrfToken] =
        useState('');

    useEffect(() => {
        if (
            typeof document ===
            'undefined'
        ) {
            return;
        }

        const token =
            document
                .querySelector(
                    'meta[name="csrf-token"]'
                )
                ?.getAttribute('content') ||
            '';

        setCsrfToken(token);
    }, []);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = (
        event
    ) => {
        if (
            typeof window ===
            'undefined'
        ) {
            return;
        }

        const confirmed =
            window.confirm(
                'Yakin ingin keluar dari SIMAP?'
            );

        if (!confirmed) {
            event.preventDefault();
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
            width:
                size,

            height:
                size,

            viewBox:
                '0 0 24 24',

            fill:
                'none',

            stroke:
                'currentColor',

            strokeWidth:
                1.8,

            strokeLinecap:
                'round',

            strokeLinejoin:
                'round',

            'aria-hidden':
                'true',
        };


        const icons = {

            shield: (
                <>
                    <path
                        d="
                            M12 3
                            20 6
                            v5
                            c0 5.2
                            -3.2 8.6
                            -8 10
                            -4.8-1.4
                            -8-4.8
                            -8-10
                            V6
                            l8-3Z
                        "
                    />

                    <path
                        d="
                            m9 12
                            2 2
                            4-4
                        "
                    />
                </>
            ),


            users: (
                <>
                    <circle
                        cx="9"
                        cy="8"
                        r="3"
                    />

                    <path
                        d="
                            M3.5 20
                            c.5-3.5
                            2.3-5.5
                            5.5-5.5
                            s5 2
                            5.5 5.5
                        "
                    />

                    <path
                        d="
                            M16 6.5
                            a3 3 0
                            0 1
                            0 5.8
                        "
                    />

                    <path
                        d="
                            M17 14.5
                            c2.1.5
                            3.4 2.2
                            3.7 5.5
                        "
                    />
                </>
            ),


            check: (
                <>
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                    />

                    <path
                        d="
                            m8.5 12
                            2.3 2.3
                            4.7-5
                        "
                    />
                </>
            ),


            userX: (
                <>
                    <circle
                        cx="9"
                        cy="8"
                        r="3"
                    />

                    <path
                        d="
                            M3.5 20
                            c.5-3.5
                            2.3-5.5
                            5.5-5.5
                            s5 2
                            5.5 5.5
                        "
                    />

                    <path
                        d="
                            m16 9
                            5 5
                        "
                    />

                    <path
                        d="
                            m21 9
                            -5 5
                        "
                    />
                </>
            ),


            building: (
                <>
                    <path
                        d="
                            M4 21
                            V5
                            a2 2 0
                            0 1 2-2
                            h12
                            a2 2 0
                            0 1 2 2
                            v16
                        "
                    />

                    <path
                        d="
                            M8 7h2
                            M14 7h2
                            M8 11h2
                            M14 11h2
                            M8 15h2
                            M14 15h2
                        "
                    />

                    <path
                        d="
                            M9 21
                            v-3h6v3
                        "
                    />
                </>
            ),


            settings: (
                <>
                    <path
                        d="
                            M12 3v2
                            M12 19v2
                            M3 12h2
                            M19 12h2
                            M5.6 5.6l1.4 1.4
                            M17 17l1.4 1.4
                            M18.4 5.6L17 7
                            M7 17l-1.4 1.4
                        "
                    />

                    <circle
                        cx="12"
                        cy="12"
                        r="3.5"
                    />
                </>
            ),


            activity: (
                <path
                    d="
                        M3 12
                        h4
                        l2-7
                        4 14
                        2-7
                        h6
                    "
                />
            ),


            logout: (
                <>
                    <path
                        d="
                            M10 5
                            H6
                            a2 2
                            0 0 0-2 2
                            v10
                            a2 2
                            0 0 0 2 2
                            h4
                        "
                    />

                    <path
                        d="
                            m14 8
                            4 4
                            -4 4
                        "
                    />

                    <path
                        d="
                            M9 12
                            h9
                        "
                    />
                </>
            ),
        };


        return (
            <svg {...common}>
                {icons[name] || null}
            </svg>
        );
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            <style>{`

                * {
                    box-sizing: border-box;
                }

                html,
                body {
                    margin: 0;
                    padding: 0;
                    min-height: 100%;
                }

                body {
                    background: #f5f7fb;
                }


                /* =====================================================
                   PAGE
                ====================================================== */

                .sa-page {
                    min-height: 100vh;

                    background:
                        radial-gradient(
                            circle at top left,
                            rgba(15,39,71,.055),
                            transparent 28%
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


                /* =====================================================
                   SHELL
                ====================================================== */

                .sa-shell {
                    min-height: 100vh;

                    display: grid;

                    grid-template-columns:
                        248px
                        minmax(0,1fr);
                }


                /* =====================================================
                   SIDEBAR
                ====================================================== */

                .sa-sidebar {
                    position: sticky;

                    top: 0;

                    height: 100vh;

                    padding:
                        22px 16px;

                    background:
                        #0f2747;

                    color:
                        #ffffff;

                    display:
                        flex;

                    flex-direction:
                        column;

                    border-right:
                        1px solid
                        rgba(255,255,255,.07);

                    overflow-y:
                        auto;
                }


                .sa-brand {
                    display:
                        flex;

                    align-items:
                        center;

                    gap:
                        11px;

                    padding:
                        5px 8px 22px;
                }


                .sa-brand-logo {
                    width:
                        40px;

                    height:
                        40px;

                    padding:
                        5px;

                    border-radius:
                        11px;

                    background:
                        #ffffff;

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    overflow:
                        hidden;
                }


                .sa-brand-logo img {
                    width:
                        100%;

                    height:
                        100%;

                    object-fit:
                        contain;
                }


                .sa-brand-title {
                    font-size:
                        17px;

                    font-weight:
                        850;

                    line-height:
                        1;
                }


                .sa-brand-subtitle {
                    margin-top:
                        5px;

                    color:
                        rgba(255,255,255,.62);

                    font-size:
                        9px;
                }


                /* =====================================================
                   NAV
                ====================================================== */

                .sa-nav-label {
                    padding:
                        14px
                        10px
                        8px;

                    color:
                        rgba(255,255,255,.43);

                    font-size:
                        9px;

                    font-weight:
                        850;

                    letter-spacing:
                        .8px;

                    text-transform:
                        uppercase;
                }


                .sa-nav {
                    display:
                        flex;

                    flex-direction:
                        column;
                }


                .sa-nav-item {
                    display:
                        flex;

                    align-items:
                        center;

                    gap:
                        10px;

                    width:
                        100%;

                    margin-bottom:
                        4px;

                    padding:
                        11px 10px;

                    border-radius:
                        10px;

                    color:
                        rgba(255,255,255,.78);

                    background:
                        transparent;

                    border:
                        0;

                    font:
                        inherit;

                    font-size:
                        11px;

                    font-weight:
                        700;

                    text-align:
                        left;

                    text-decoration:
                        none;

                    transition:
                        background .18s ease,
                        color .18s ease;
                }


                .sa-nav-item:hover {
                    background:
                        rgba(255,255,255,.07);

                    color:
                        #ffffff;

                    cursor:
                        pointer;
                }


                .sa-nav-item-active {
                    background:
                        rgba(255,255,255,.105);

                    color:
                        #ffffff;
                }


                .sa-nav-icon {
                    width:
                        26px;

                    height:
                        26px;

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    flex-shrink:
                        0;

                    border-radius:
                        8px;

                    background:
                        rgba(255,255,255,.07);
                }


                .sa-nav-item-active
                .sa-nav-icon {
                    background:
                        rgba(255,255,255,.13);
                }


                /* =====================================================
                   SIDEBAR SPACER
                ====================================================== */

                .sa-sidebar-spacer {
                    flex:
                        1;
                }


                /* =====================================================
                   PROFILE
                ====================================================== */

                .sa-profile-box {
                    padding:
                        12px;

                    border:
                        1px solid
                        rgba(255,255,255,.09);

                    border-radius:
                        13px;

                    background:
                        rgba(255,255,255,.045);
                }


                .sa-profile-name {
                    color:
                        #ffffff;

                    font-size:
                        10px;

                    font-weight:
                        800;

                    overflow:
                        hidden;

                    text-overflow:
                        ellipsis;

                    white-space:
                        nowrap;
                }


                .sa-profile-role {
                    margin-top:
                        4px;

                    color:
                        rgba(255,255,255,.58);

                    font-size:
                        8px;
                }


                /* =====================================================
                   LOGOUT
                ====================================================== */

                .sa-logout-form {
                    width:
                        100%;

                    margin:
                        0;

                    padding:
                        0;
                }


                .sa-logout {
                    width:
                        100%;

                    margin-top:
                        9px;

                    padding:
                        9px 10px;

                    display:
                        inline-flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    gap:
                        7px;

                    border:
                        1px solid
                        rgba(255,255,255,.12);

                    border-radius:
                        9px;

                    background:
                        transparent;

                    color:
                        rgba(255,255,255,.82);

                    font-family:
                        inherit;

                    font-size:
                        9px;

                    font-weight:
                        800;

                    cursor:
                        pointer;

                    transition:
                        background .18s ease,
                        color .18s ease,
                        border-color .18s ease,
                        transform .18s ease;
                }


                .sa-logout:hover {
                    background:
                        rgba(255,255,255,.08);

                    color:
                        #ffffff;

                    border-color:
                        rgba(255,255,255,.18);
                }


                .sa-logout:active {
                    transform:
                        translateY(1px);
                }


                /* =====================================================
                   MAIN
                ====================================================== */

                .sa-main {
                    min-width:
                        0;

                    padding:
                        28px
                        30px
                        50px;
                }


                .sa-container {
                    width:
                        100%;

                    max-width:
                        1280px;

                    margin:
                        0 auto;
                }


                /* =====================================================
                   TOPBAR
                ====================================================== */

                .sa-topbar {
                    display:
                        flex;

                    align-items:
                        flex-end;

                    justify-content:
                        space-between;

                    gap:
                        20px;

                    margin-bottom:
                        20px;
                }


                .sa-kicker {
                    color:
                        #2563eb;

                    font-size:
                        10px;

                    font-weight:
                        850;

                    letter-spacing:
                        .8px;
                }


                .sa-title {
                    margin:
                        6px 0 0;

                    color:
                        #0f2747;

                    font-size:
                        30px;

                    line-height:
                        1.12;

                    font-weight:
                        850;

                    letter-spacing:
                        -.5px;
                }


                .sa-subtitle {
                    margin:
                        7px 0 0;

                    color:
                        #64748b;

                    font-size:
                        12px;

                    line-height:
                        1.6;
                }


                .sa-date-chip {
                    padding:
                        8px 11px;

                    border-radius:
                        999px;

                    background:
                        #ffffff;

                    border:
                        1px solid
                        #e2e8f0;

                    color:
                        #64748b;

                    font-size:
                        9px;

                    font-weight:
                        750;

                    white-space:
                        nowrap;
                }


                /* =====================================================
                   STATISTICS
                ====================================================== */

                .sa-stat-grid {
                    display:
                        grid;

                    grid-template-columns:
                        repeat(
                            4,
                            minmax(0,1fr)
                        );

                    gap:
                        13px;

                    margin-bottom:
                        18px;
                }


                .sa-stat-card {
                    padding:
                        17px;

                    border:
                        1px solid
                        #e2e8f0;

                    border-radius:
                        15px;

                    background:
                        #ffffff;

                    box-shadow:
                        0 6px 20px
                        rgba(15,23,42,.022);
                }


                .sa-stat-top {
                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        space-between;

                    gap:
                        10px;
                }


                .sa-stat-icon {
                    width:
                        36px;

                    height:
                        36px;

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    border-radius:
                        10px;
                }


                .sa-stat-label {
                    margin-top:
                        13px;

                    color:
                        #94a3b8;

                    font-size:
                        8px;

                    font-weight:
                        850;

                    letter-spacing:
                        .7px;

                    text-transform:
                        uppercase;
                }


                .sa-stat-value {
                    margin-top:
                        4px;

                    color:
                        #0f2747;

                    font-size:
                        25px;

                    line-height:
                        1;

                    font-weight:
                        850;
                }


                .sa-stat-note {
                    margin-top:
                        5px;

                    color:
                        #94a3b8;

                    font-size:
                        8px;
                }


                /* =====================================================
                   CONTENT
                ====================================================== */

                .sa-content-grid {
                    display:
                        grid;

                    grid-template-columns:
                        minmax(0,1.45fr)
                        minmax(290px,.75fr);

                    gap:
                        18px;
                }


                .sa-card {
                    background:
                        #ffffff;

                    border:
                        1px solid
                        #e2e8f0;

                    border-radius:
                        16px;

                    overflow:
                        hidden;

                    box-shadow:
                        0 6px 20px
                        rgba(15,23,42,.022);
                }


                .sa-card-header {
                    padding:
                        16px 18px;

                    border-bottom:
                        1px solid
                        #edf1f5;

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        space-between;

                    gap:
                        12px;
                }


                .sa-card-title {
                    color:
                        #0f2747;

                    font-size:
                        13px;

                    font-weight:
                        850;
                }


                .sa-card-description {
                    margin-top:
                        4px;

                    color:
                        #94a3b8;

                    font-size:
                        9px;

                    line-height:
                        1.5;
                }


                .sa-card-body {
                    padding:
                        18px;
                }


                /* =====================================================
                   TABLE
                ====================================================== */

                .sa-table-wrap {
                    overflow-x:
                        auto;
                }


                .sa-table {
                    width:
                        100%;

                    border-collapse:
                        collapse;

                    min-width:
                        620px;
                }


                .sa-table th {
                    padding:
                        10px 8px;

                    text-align:
                        left;

                    color:
                        #94a3b8;

                    background:
                        #f8fafc;

                    border-bottom:
                        1px solid
                        #e2e8f0;

                    font-size:
                        8px;

                    font-weight:
                        850;

                    letter-spacing:
                        .55px;

                    text-transform:
                        uppercase;
                }


                .sa-table td {
                    padding:
                        12px 8px;

                    border-bottom:
                        1px solid
                        #edf1f5;

                    color:
                        #475569;

                    font-size:
                        10px;

                    vertical-align:
                        middle;
                }


                .sa-table tr:last-child td {
                    border-bottom:
                        0;
                }


                .sa-name {
                    color:
                        #0f2747;

                    font-weight:
                        800;
                }


                .sa-email {
                    margin-top:
                        2px;

                    color:
                        #94a3b8;

                    font-size:
                        8px;
                }


                /* =====================================================
                   PILLS
                ====================================================== */

                .sa-pill {
                    display:
                        inline-flex;

                    align-items:
                        center;

                    padding:
                        5px 7px;

                    border-radius:
                        999px;

                    font-size:
                        8px;

                    font-weight:
                        800;
                }


                .sa-pill-role {
                    background:
                        #eff6ff;

                    border:
                        1px solid
                        #dbeafe;

                    color:
                        #1d4ed8;
                }


                .sa-pill-active {
                    background:
                        #f0fdf4;

                    border:
                        1px solid
                        #bbf7d0;

                    color:
                        #15803d;
                }


                .sa-pill-inactive {
                    background:
                        #fef2f2;

                    border:
                        1px solid
                        #fecaca;

                    color:
                        #dc2626;
                }


                /* =====================================================
                   SIDE
                ====================================================== */

                .sa-side-stack {
                    display:
                        flex;

                    flex-direction:
                        column;

                    gap:
                        18px;
                }


                .sa-mini-list {
                    display:
                        flex;

                    flex-direction:
                        column;

                    gap:
                        11px;
                }


                .sa-mini-item {
                    display:
                        flex;

                    align-items:
                        flex-start;

                    gap:
                        10px;
                }


                .sa-mini-icon {
                    width:
                        34px;

                    height:
                        34px;

                    flex-shrink:
                        0;

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    border-radius:
                        9px;

                    background:
                        #f8fafc;

                    border:
                        1px solid
                        #e2e8f0;

                    color:
                        #0f2747;
                }


                .sa-mini-title {
                    color:
                        #334155;

                    font-size:
                        9px;

                    font-weight:
                        800;
                }


                .sa-mini-text {
                    margin-top:
                        2px;

                    color:
                        #94a3b8;

                    font-size:
                        8px;

                    line-height:
                        1.5;
                }


                /* =====================================================
                   CLICKABLE SIDE ITEM
                ====================================================== */

                .sa-mini-link {
                    display:
                        flex;

                    align-items:
                        flex-start;

                    gap:
                        10px;

                    color:
                        inherit;

                    text-decoration:
                        none;

                    border-radius:
                        10px;

                    padding:
                        2px;

                    margin:
                        -2px;
                }


                .sa-mini-link:hover
                .sa-mini-title {
                    color:
                        #0f2747;
                }


                /* =====================================================
                   FOOTER
                ====================================================== */

                .sa-footer {
                    padding-top:
                        22px;

                    text-align:
                        center;

                    color:
                        #94a3b8;

                    font-size:
                        8px;
                }


                /* =====================================================
                   RESPONSIVE
                ====================================================== */

                @media (max-width: 1080px) {

                    .sa-shell {
                        grid-template-columns:
                            220px
                            minmax(0,1fr);
                    }


                    .sa-main {
                        padding:
                            24px
                            20px
                            45px;
                    }


                    .sa-stat-grid {
                        grid-template-columns:
                            repeat(
                                2,
                                minmax(0,1fr)
                            );
                    }
                }


                @media (max-width: 820px) {

                    .sa-shell {
                        display:
                            block;
                    }


                    .sa-sidebar {
                        position:
                            relative;

                        height:
                            auto;

                        padding:
                            15px;
                    }


                    .sa-brand {
                        padding-bottom:
                            12px;
                    }


                    .sa-nav-label,
                    .sa-sidebar-spacer {
                        display:
                            none;
                    }


                    .sa-nav {
                        display:
                            flex;

                        flex-direction:
                            row;

                        gap:
                            5px;

                        overflow-x:
                            auto;
                    }


                    .sa-nav-item {
                        width:
                            auto;

                        min-width:
                            max-content;

                        margin:
                            0;
                    }


                    .sa-profile-box {
                        display:
                            none;
                    }


                    .sa-content-grid {
                        grid-template-columns:
                            1fr;
                    }
                }


                @media (max-width: 560px) {

                    .sa-main {
                        padding:
                            20px
                            14px
                            36px;
                    }


                    .sa-topbar {
                        align-items:
                            flex-start;

                        flex-direction:
                            column;
                    }


                    .sa-date-chip {
                        white-space:
                            normal;
                    }


                    .sa-stat-grid {
                        grid-template-columns:
                            1fr 1fr;

                        gap:
                            9px;
                    }


                    .sa-stat-card {
                        padding:
                            13px;
                    }


                    .sa-stat-value {
                        font-size:
                            21px;
                    }
                }

            `}</style>


            <div className="sa-page">

                <div className="sa-shell">


                    {/* =================================================
                        SIDEBAR
                    ================================================== */}

                    <aside className="sa-sidebar">


                        {/* BRAND */}

                        <div className="sa-brand">

                            <div className="sa-brand-logo">

                                <img
                                    src="/images/poltekkes-icon.png"
                                    alt="Logo Poltekkes Maluku"
                                />

                            </div>


                            <div>

                                <div className="sa-brand-title">
                                    SIMAP
                                </div>

                                <div className="sa-brand-subtitle">
                                    Poltekkes Maluku
                                </div>

                            </div>

                        </div>


                        {/* NAV LABEL */}

                        <div className="sa-nav-label">
                            MENU UTAMA
                        </div>


                        {/* NAV */}

                        <nav className="sa-nav">

                            <a
                                href="/super-admin/dashboard"
                                className="
                                    sa-nav-item
                                    sa-nav-item-active
                                "
                            >
                                <span className="sa-nav-icon">
                                    <Icon
                                        name="shield"
                                        size={15}
                                    />
                                </span>

                                Dashboard
                            </a>


                            <a
                                href="/super-admin/pengguna"
                                className="sa-nav-item"
                            >
                                <span className="sa-nav-icon">
                                    <Icon
                                        name="users"
                                        size={15}
                                    />
                                </span>

                                Pengguna
                            </a>


                            {/* UNIT SUDAH AKTIF */}

                            <a
                                href="/super-admin/unit"
                                className="sa-nav-item"
                            >
                                <span className="sa-nav-icon">
                                    <Icon
                                        name="building"
                                        size={15}
                                    />
                                </span>

                                Unit
                            </a>


                            {/* AKTIVITAS SISTEM */}

                            <a
                                href="/super-admin/aktivitas"
                                className="sa-nav-item"
                            >
                                <span className="sa-nav-icon">
                                    <Icon
                                        name="activity"
                                        size={15}
                                    />
                                </span>

                                Aktivitas Sistem
                            </a>

                        </nav>


                        <div
                            className="
                                sa-sidebar-spacer
                            "
                        />


                        {/* PROFILE */}

                        <div className="sa-profile-box">

                            <div
                                className="
                                    sa-profile-name
                                "
                            >
                                {
                                    userName
                                }
                            </div>


                            <div
                                className="
                                    sa-profile-role
                                "
                            >
                                Super Admin
                            </div>


                            {/* LOGOUT */}

                            <form
                                method="POST"
                                action="/logout"
                                className="
                                    sa-logout-form
                                "
                                onSubmit={
                                    handleLogout
                                }
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
                                    className="
                                        sa-logout
                                    "
                                >

                                    <Icon
                                        name="logout"
                                        size={12}
                                    />

                                    Keluar

                                </button>

                            </form>

                        </div>

                    </aside>


                    {/* =================================================
                        MAIN
                    ================================================== */}

                    <main className="sa-main">

                        <div className="sa-container">


                            {/* TOPBAR */}

                            <div className="sa-topbar">

                                <div>

                                    <div className="sa-kicker">
                                        ADMINISTRASI SISTEM
                                    </div>


                                    <h1 className="sa-title">
                                        Dashboard Super Admin
                                    </h1>


                                    <p className="sa-subtitle">
                                        Kelola pengguna dan konfigurasi
                                        dasar Sistem Manajemen Administrasi
                                        Poltekkes Maluku.
                                    </p>

                                </div>


                                <div className="sa-date-chip">
                                    {
                                        todayLabel ||
                                        'Memuat tanggal...'
                                    }
                                    {' '}· WIT
                                </div>

                            </div>


                            {/* STATISTIK */}

                            <div className="sa-stat-grid">

                                <StatCard
                                    icon="users"
                                    label="Total Pengguna"
                                    value={
                                        safeStats.totalUsers
                                    }
                                    note="Seluruh akun terdaftar"
                                    iconBackground="#eff6ff"
                                    iconColor="#2563eb"
                                />


                                <StatCard
                                    icon="check"
                                    label="Pengguna Aktif"
                                    value={
                                        safeStats.activeUsers
                                    }
                                    note="Akun dapat digunakan"
                                    iconBackground="#f0fdf4"
                                    iconColor="#16a34a"
                                />


                                <StatCard
                                    icon="userX"
                                    label="Pengguna Nonaktif"
                                    value={
                                        safeStats.inactiveUsers
                                    }
                                    note="Akun tidak dapat digunakan"
                                    iconBackground="#fef2f2"
                                    iconColor="#dc2626"
                                />


                                <StatCard
                                    icon="building"
                                    label="Total Unit"
                                    value={
                                        safeStats.totalUnits
                                    }
                                    note={
                                        `${safeStats.activeUnits} unit aktif`
                                    }
                                    iconBackground="#f5f3ff"
                                    iconColor="#7c3aed"
                                />

                            </div>


                            {/* CONTENT */}

                            <div className="sa-content-grid">


                                {/* =================================================
                                    USERS
                                ================================================== */}

                                <section className="sa-card">

                                    <div className="sa-card-header">

                                        <div>

                                            <div className="sa-card-title">
                                                Pengguna Terbaru
                                            </div>


                                            <div className="sa-card-description">
                                                Ringkasan akun pengguna yang
                                                terakhir ditambahkan.
                                            </div>

                                        </div>


                                        <div
                                            className="
                                                sa-pill
                                                sa-pill-role
                                            "
                                        >
                                            {
                                                safeUsers.length
                                            } akun
                                        </div>

                                    </div>


                                    <div
                                        className="
                                            sa-card-body
                                            sa-table-wrap
                                        "
                                    >

                                        {
                                            safeUsers.length === 0

                                                ? (

                                                    <div
                                                        style={{
                                                            padding:
                                                                '30px',

                                                            textAlign:
                                                                'center',

                                                            color:
                                                                '#94a3b8',

                                                            fontSize:
                                                                '10px',
                                                        }}
                                                    >
                                                        Belum ada data
                                                        pengguna.
                                                    </div>

                                                )

                                                : (

                                                    <table
                                                        className="
                                                            sa-table
                                                        "
                                                    >

                                                        <thead>

                                                            <tr>

                                                                <th>
                                                                    Pengguna
                                                                </th>

                                                                <th>
                                                                    Role
                                                                </th>

                                                                <th>
                                                                    Unit
                                                                </th>

                                                                <th>
                                                                    Status
                                                                </th>

                                                            </tr>

                                                        </thead>


                                                        <tbody>

                                                            {
                                                                safeUsers.map(
                                                                    (
                                                                        item
                                                                    ) => {

                                                                        const role =
                                                                            item?.role?.slug;


                                                                        return (

                                                                            <tr
                                                                                key={
                                                                                    item?.id ??
                                                                                    item?.email ??
                                                                                    `${item?.name ?? 'user'}-${item?.role?.slug ?? 'role'}`
                                                                                }
                                                                            >

                                                                                <td>

                                                                                    <div
                                                                                        className="
                                                                                            sa-name
                                                                                        "
                                                                                    >
                                                                                        {
                                                                                            item?.name ||
                                                                                            '-'
                                                                                        }
                                                                                    </div>


                                                                                    <div
                                                                                        className="
                                                                                            sa-email
                                                                                        "
                                                                                    >
                                                                                        {
                                                                                            item?.email ||
                                                                                            '-'
                                                                                        }
                                                                                    </div>

                                                                                </td>


                                                                                <td>

                                                                                    <span
                                                                                        className="
                                                                                            sa-pill
                                                                                            sa-pill-role
                                                                                        "
                                                                                    >
                                                                                        {
                                                                                            roleLabel(
                                                                                                role
                                                                                            )
                                                                                        }
                                                                                    </span>

                                                                                </td>


                                                                                <td>

                                                                                    {
                                                                                        item?.unit?.name ||
                                                                                        '-'
                                                                                    }

                                                                                </td>


                                                                                <td>

                                                                                    <span
                                                                                        className={`sa-pill ${
                                                                                            item?.is_active
                                                                                                ? 'sa-pill-active'
                                                                                                : 'sa-pill-inactive'
                                                                                        }`}
                                                                                    >

                                                                                        {
                                                                                            formatStatus(
                                                                                                item?.is_active
                                                                                            )
                                                                                        }

                                                                                    </span>

                                                                                </td>

                                                                            </tr>

                                                                        );
                                                                    }
                                                                )
                                                            }

                                                        </tbody>

                                                    </table>
                                                )
                                        }

                                    </div>

                                </section>


                                {/* =================================================
                                    SIDE
                                ================================================== */}

                                <div className="sa-side-stack">


                                    {/* FUNGSI */}

                                    <section className="sa-card">

                                        <div
                                            className="
                                                sa-card-header
                                            "
                                        >

                                            <div>

                                                <div
                                                    className="
                                                        sa-card-title
                                                    "
                                                >
                                                    Fungsi Super Admin
                                                </div>


                                                <div
                                                    className="
                                                        sa-card-description
                                                    "
                                                >
                                                    Ruang lingkup
                                                    administrasi sistem.
                                                </div>

                                            </div>

                                        </div>


                                        <div
                                            className="
                                                sa-card-body
                                            "
                                        >

                                            <div
                                                className="
                                                    sa-mini-list
                                                "
                                            >

                                                <a
                                                    href="/super-admin/pengguna"
                                                    className="
                                                        sa-mini-link
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            sa-mini-icon
                                                        "
                                                    >

                                                        <InlineIcon
                                                            name="users"
                                                            size={14}
                                                        />

                                                    </div>


                                                    <div>

                                                        <div
                                                            className="
                                                                sa-mini-title
                                                            "
                                                        >
                                                            Kelola Pengguna
                                                        </div>


                                                        <div
                                                            className="
                                                                sa-mini-text
                                                            "
                                                        >
                                                            Mengatur akun,
                                                            role, unit,
                                                            dan status
                                                            pengguna.
                                                        </div>

                                                    </div>

                                                </a>


                                                <a
                                                    href="/super-admin/unit"
                                                    className="
                                                        sa-mini-link
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            sa-mini-icon
                                                        "
                                                    >

                                                        <InlineIcon
                                                            name="building"
                                                            size={14}
                                                        />

                                                    </div>


                                                    <div>

                                                        <div
                                                            className="
                                                                sa-mini-title
                                                            "
                                                        >
                                                            Kelola Unit
                                                        </div>


                                                        <div
                                                            className="
                                                                sa-mini-text
                                                            "
                                                        >
                                                            Mengatur daftar
                                                            unit dan status
                                                            unit.
                                                        </div>

                                                    </div>

                                                </a>


                                                <a
                                                    href="/super-admin/aktivitas"
                                                    className="
                                                        sa-mini-link
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            sa-mini-icon
                                                        "
                                                    >

                                                        <InlineIcon
                                                            name="activity"
                                                            size={14}
                                                        />

                                                    </div>


                                                    <div>

                                                        <div
                                                            className="
                                                                sa-mini-title
                                                            "
                                                        >
                                                            Aktivitas Sistem
                                                        </div>


                                                        <div
                                                            className="
                                                                sa-mini-text
                                                            "
                                                        >
                                                            Melihat riwayat
                                                            tindakan penting
                                                            di sistem.
                                                        </div>

                                                    </div>

                                                </a>

                                            </div>

                                        </div>

                                    </section>


                                    {/* ADMINISTRASI TERPUSAT */}

                                    <section className="sa-card">

                                        <div
                                            className="
                                                sa-card-body
                                            "
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
                                                    className="
                                                        sa-mini-icon
                                                    "
                                                >

                                                    <Icon
                                                        name="settings"
                                                        size={15}
                                                    />

                                                </div>


                                                <div>

                                                    <div
                                                        className="
                                                            sa-mini-title
                                                        "
                                                    >
                                                        Administrasi Terpusat
                                                    </div>


                                                    <div
                                                        className="
                                                            sa-mini-text
                                                        "
                                                    >

                                                        Super Admin menangani
                                                        konfigurasi dasar sistem,
                                                        sedangkan pekerjaan surat
                                                        dan disposisi tetap mengikuti
                                                        hak akses masing-masing role.

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </section>

                                </div>

                            </div>


                            {/* FOOTER */}

                            <div
                                className="
                                    sa-footer
                                "
                            >
                                SIMAP Poltekkes Maluku
                            </div>

                        </div>

                    </main>

                </div>

            </div>
        </>
    );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
    icon,
    label,
    value,
    note,
    iconBackground,
    iconColor,
}) {

    return (

        <div className="sa-stat-card">

            <div className="sa-stat-top">

                <div
                    className="sa-stat-icon"
                    style={{
                        background:
                            iconBackground,

                        color:
                            iconColor,
                    }}
                >

                    <InlineIcon
                        name={icon}
                        size={16}
                    />

                </div>

            </div>


            <div className="sa-stat-label">
                {label}
            </div>


            <div className="sa-stat-value">
                {value}
            </div>


            <div className="sa-stat-note">
                {note}
            </div>

        </div>
    );
}


// =====================================================
// INLINE ICON
// =====================================================

function InlineIcon({
    name,
    size = 16,
}) {

    const common = {
        width:
            size,

        height:
            size,

        viewBox:
            '0 0 24 24',

        fill:
            'none',

        stroke:
            'currentColor',

        strokeWidth:
            1.8,

        strokeLinecap:
            'round',

        strokeLinejoin:
            'round',

        'aria-hidden':
            'true',
    };


    if (
        name === 'users'
    ) {

        return (

            <svg {...common}>

                <circle
                    cx="9"
                    cy="8"
                    r="3"
                />

                <path
                    d="
                        M3.5 20
                        c.5-3.5
                        2.3-5.5
                        5.5-5.5
                        s5 2
                        5.5 5.5
                    "
                />

                <path
                    d="
                        M16 6.5
                        a3 3 0
                        0 1 0 5.8
                    "
                />

                <path
                    d="
                        M17 14.5
                        c2.1.5
                        3.4 2.2
                        3.7 5.5
                    "
                />

            </svg>
        );

    }


    if (
        name === 'check'
    ) {

        return (

            <svg {...common}>

                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />

                <path
                    d="
                        m8.5 12
                        2.3 2.3
                        4.7-5
                    "
                />

            </svg>
        );

    }


    if (
        name === 'userX'
    ) {

        return (

            <svg {...common}>

                <circle
                    cx="9"
                    cy="8"
                    r="3"
                />

                <path
                    d="
                        M3.5 20
                        c.5-3.5
                        2.3-5.5
                        5.5-5.5
                        s5 2
                        5.5 5.5
                    "
                />

                <path
                    d="
                        m16 9
                        5 5
                    "
                />

                <path
                    d="
                        m21 9
                        -5 5
                    "
                />

            </svg>
        );

    }


    if (
        name === 'building'
    ) {

        return (

            <svg {...common}>

                <path
                    d="
                        M4 21
                        V5
                        a2 2 0
                        0 1 2-2
                        h12
                        a2 2 0
                        0 1 2 2
                        v16
                    "
                />

                <path
                    d="
                        M8 7h2
                        M14 7h2
                        M8 11h2
                        M14 11h2
                        M8 15h2
                        M14 15h2
                    "
                />

                <path
                    d="
                        M9 21
                        v-3h6v3
                    "
                />

            </svg>
        );

    }


    if (
        name === 'activity'
    ) {

        return (

            <svg {...common}>

                <path
                    d="
                        M3 12
                        h4
                        l2-7
                        4 14
                        2-7
                        h6
                    "
                />

            </svg>
        );

    }


    return null;
}