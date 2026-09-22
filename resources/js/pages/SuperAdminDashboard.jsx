import React, { useEffect, useState } from 'react';

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

    const safeUsers = Array.isArray(usersTerbaru)
        ? usersTerbaru
        : [];

    const userName =
        user?.name ||
        'Super Admin';

    const userRole =
        user?.role?.name ||
        'Super Admin';

    const userInitial =
        userName.trim().charAt(0).toUpperCase() ||
        'S';

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

    const formatStatus = (active) => {
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

    const handleLogout = (event) => {
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
    // RENDER
    // =====================================================

    return (
        <>
            <style>{`
                * {
                    box-sizing: border-box;
                }

                html,
                body,
                #app {
                    margin: 0;
                    padding: 0;
                    min-height: 100%;
                }

                body {
                    background: #f5f7fb;
                    color: #0f172a;
                }

                button,
                input,
                select {
                    font: inherit;
                }

                button {
                    -webkit-tap-highlight-color: transparent;
                }

                a {
                    color: inherit;
                    text-decoration: none;
                }

                /* =====================================================
                   PAGE
                ====================================================== */

                .sa-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(
                            circle at top left,
                            rgba(15,39,71,.045),
                            transparent 30%
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
                   TOP NAVIGATION
                ====================================================== */

                .sa-navbar {
                    position: sticky;
                    top: 0;
                    z-index: 100;

                    width: 100%;

                    background:
                        rgba(255,255,255,.95);

                    backdrop-filter:
                        blur(16px);

                    -webkit-backdrop-filter:
                        blur(16px);

                    border-bottom:
                        1px solid
                        #e6ebf2;

                    box-shadow:
                        0 4px 18px
                        rgba(15,23,42,.035);
                }

                .sa-navbar-inner {
                    width: 100%;
                    max-width: 1480px;
                    min-height: 70px;

                    margin: 0 auto;

                    padding:
                        0 28px;

                    display: flex;
                    align-items: center;

                    gap: 22px;
                }

                /* =====================================================
                   BRAND
                ====================================================== */

                .sa-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;

                    flex-shrink: 0;
                }

                .sa-brand-logo {
                    width: 40px;
                    height: 40px;

                    padding: 5px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 11px;

                    background: #ffffff;

                    border:
                        1px solid
                        #dfe7f0;

                    overflow: hidden;
                }

                .sa-brand-logo img {
                    width: 100%;
                    height: 100%;

                    object-fit: contain;
                }

                .sa-brand-copy {
                    min-width: 0;
                }

                .sa-brand-title {
                    color: #10223d;

                    font-size: 16px;
                    font-weight: 850;

                    line-height: 1;

                    letter-spacing: .03em;
                }

                .sa-brand-subtitle {
                    margin-top: 4px;

                    color: #8795a8;

                    font-size: 8px;

                    line-height: 1;

                    white-space: nowrap;
                }

                /* =====================================================
                   DESKTOP NAV
                ====================================================== */

                .sa-nav {
                    flex: 1;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    gap: 4px;
                }

                .sa-nav-item {
                    min-height: 38px;

                    display: inline-flex;
                    align-items: center;

                    gap: 7px;

                    padding:
                        0 12px;

                    border-radius:
                        10px;

                    color:
                        #6b7b90;

                    font-size:
                        10px;

                    font-weight:
                        750;

                    white-space:
                        nowrap;

                    transition:
                        .18s ease;
                }

                .sa-nav-item:hover {
                    color:
                        #1d5fcf;

                    background:
                        #f2f6fc;
                }

                .sa-nav-item-active {
                    color:
                        #ffffff;

                    background:
                        linear-gradient(
                            135deg,
                            #1768df 0%,
                            #1358c8 100%
                        );

                    box-shadow:
                        0 7px 17px
                        rgba(21,95,209,.18);
                }

                .sa-nav-item-active:hover {
                    color:
                        #ffffff;

                    background:
                        linear-gradient(
                            135deg,
                            #1768df 0%,
                            #1358c8 100%
                        );
                }

                .sa-nav-icon {
                    width: 19px;
                    height: 19px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 6px;

                    flex-shrink: 0;
                }

                .sa-nav-item:not(
                    .sa-nav-item-active
                ) .sa-nav-icon {
                    background:
                        #f1f5f9;
                }

                .sa-nav-item-active
                .sa-nav-icon {
                    background:
                        rgba(255,255,255,.12);
                }

                /* =====================================================
                   USER AREA
                ====================================================== */

                .sa-nav-right {
                    display: flex;
                    align-items: center;

                    gap: 9px;

                    flex-shrink: 0;
                }

                .sa-user-box {
                    min-height: 42px;

                    display: flex;
                    align-items: center;

                    gap: 9px;

                    padding:
                        4px 8px 4px 10px;

                    background:
                        #f8fafc;

                    border:
                        1px solid
                        #e5ebf2;

                    border-radius:
                        11px;
                }

                .sa-user-copy {
                    min-width: 0;
                    max-width: 120px;
                }

                .sa-user-name {
                    overflow: hidden;

                    color:
                        #1a2c45;

                    font-size:
                        9px;

                    font-weight:
                        800;

                    white-space:
                        nowrap;

                    text-overflow:
                        ellipsis;
                }

                .sa-user-role {
                    margin-top:
                        2px;

                    overflow:
                        hidden;

                    color:
                        #8b98a9;

                    font-size:
                        7px;

                    white-space:
                        nowrap;

                    text-overflow:
                        ellipsis;
                }

                .sa-avatar {
                    width: 30px;
                    height: 30px;

                    display: grid;
                    place-items: center;

                    border-radius: 9px;

                    background:
                        #eaf2ff;

                    color:
                        #185fcf;

                    font-size:
                        10px;

                    font-weight:
                        850;

                    flex-shrink:
                        0;
                }

                /* =====================================================
                   LOGOUT
                ====================================================== */

                .sa-logout-form {
                    margin: 0;
                    padding: 0;
                }

                .sa-logout {
                    min-height: 40px;

                    display: inline-flex;

                    align-items: center;
                    justify-content: center;

                    gap: 7px;

                    padding:
                        0 12px;

                    border:
                        1px solid
                        #e2e8f0;

                    border-radius:
                        10px;

                    background:
                        #ffffff;

                    color:
                        #62738a;

                    font-size:
                        9px;

                    font-weight:
                        800;

                    cursor:
                        pointer;

                    transition:
                        .18s ease;
                }

                .sa-logout:hover {
                    color:
                        #c23f3f;

                    background:
                        #fff7f7;

                    border-color:
                        #efd5d5;
                }

                .sa-logout:active {
                    transform:
                        translateY(1px);
                }

                /* =====================================================
                   MOBILE NAV
                ====================================================== */

                .sa-mobile-nav {
                    display: none;

                    overflow-x:
                        auto;

                    scrollbar-width:
                        none;

                    -webkit-overflow-scrolling:
                        touch;

                    border-top:
                        1px solid
                        #edf1f5;

                    background:
                        rgba(255,255,255,.97);
                }

                .sa-mobile-nav::-webkit-scrollbar {
                    display: none;
                }

                .sa-mobile-nav-inner {
                    min-width:
                        max-content;

                    display:
                        flex;

                    align-items:
                        center;

                    gap:
                        5px;

                    padding:
                        8px 12px;
                }

                .sa-mobile-item {
                    min-height:
                        34px;

                    display:
                        inline-flex;

                    align-items:
                        center;

                    gap:
                        6px;

                    padding:
                        0 10px;

                    border-radius:
                        9px;

                    color:
                        #66768a;

                    font-size:
                        9px;

                    font-weight:
                        750;

                    white-space:
                        nowrap;
                }

                .sa-mobile-item:hover {
                    background:
                        #f5f8fc;
                }

                .sa-mobile-item.active {
                    color:
                        #145ecf;

                    background:
                        #eef5ff;
                }

                /* =====================================================
                   MAIN
                ====================================================== */

                .sa-main {
                    width: 100%;
                }

                .sa-container {
                    width: 100%;

                    max-width:
                        1420px;

                    margin:
                        0 auto;

                    padding:
                        28px
                        28px
                        45px;
                }

                /* =====================================================
                   HEADER
                ====================================================== */

                .sa-topbar {
                    display:
                        flex;

                    align-items:
                        flex-start;

                    justify-content:
                        space-between;

                    gap:
                        18px;

                    margin-bottom:
                        20px;
                }

                .sa-header-left {
                    min-width:
                        0;
                }

                .sa-kicker {
                    color:
                        #2563eb;

                    font-size:
                        9px;

                    font-weight:
                        850;

                    letter-spacing:
                        .13em;
                }

                .sa-title {
                    margin:
                        5px 0 0;

                    color:
                        #0f2747;

                    font-size:
                        28px;

                    line-height:
                        1.15;

                    font-weight:
                        850;

                    letter-spacing:
                        -.4px;
                }

                .sa-subtitle {
                    max-width:
                        760px;

                    margin:
                        7px 0 0;

                    color:
                        #6d7c90;

                    font-size:
                        11px;

                    line-height:
                        1.7;
                }

                .sa-date-chip {
                    flex-shrink:
                        0;

                    min-height:
                        34px;

                    display:
                        inline-flex;

                    align-items:
                        center;

                    padding:
                        0 11px;

                    border-radius:
                        999px;

                    background:
                        #ffffff;

                    border:
                        1px solid
                        #e1e8ef;

                    color:
                        #697a90;

                    font-size:
                        8px;

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
                            minmax(0, 1fr)
                        );

                    gap:
                        12px;

                    margin-bottom:
                        17px;
                }

                .sa-stat-card {
                    position:
                        relative;

                    min-width:
                        0;

                    overflow:
                        hidden;

                    padding:
                        16px;

                    border:
                        1px solid
                        #e2e8f0;

                    border-radius:
                        15px;

                    background:
                        #ffffff;

                    box-shadow:
                        0 7px 23px
                        rgba(15,23,42,.025);
                }

                .sa-stat-card::after {
                    content:
                        "";

                    position:
                        absolute;

                    width:
                        74px;

                    height:
                        74px;

                    right:
                        -26px;

                    bottom:
                        -27px;

                    border-radius:
                        50%;

                    background:
                        #f7f9fc;
                }

                .sa-stat-top {
                    position:
                        relative;

                    z-index:
                        1;

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        flex-start;
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
                    position:
                        relative;

                    z-index:
                        1;

                    margin-top:
                        12px;

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
                    position:
                        relative;

                    z-index:
                        1;

                    margin-top:
                        4px;

                    color:
                        #0f2747;

                    font-size:
                        24px;

                    line-height:
                        1;

                    font-weight:
                        850;
                }

                .sa-stat-note {
                    position:
                        relative;

                    z-index:
                        1;

                    margin-top:
                        6px;

                    color:
                        #9ba7b6;

                    font-size:
                        8px;

                    line-height:
                        1.4;
                }

                /* =====================================================
                   CONTENT GRID
                ====================================================== */

                .sa-content-grid {
                    display:
                        grid;

                    grid-template-columns:
                        minmax(0,1.45fr)
                        minmax(300px,.75fr);

                    gap:
                        17px;

                    align-items:
                        start;
                }

                .sa-card {
                    min-width:
                        0;

                    overflow:
                        hidden;

                    background:
                        #ffffff;

                    border:
                        1px solid
                        #e2e8f0;

                    border-radius:
                        16px;

                    box-shadow:
                        0 8px 25px
                        rgba(15,23,42,.025);
                }

                .sa-card-header {
                    display:
                        flex;

                    align-items:
                        flex-start;

                    justify-content:
                        space-between;

                    gap:
                        12px;

                    padding:
                        16px 17px;

                    border-bottom:
                        1px solid
                        #edf1f5;
                }

                .sa-card-title {
                    color:
                        #132740;

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
                        8px;

                    line-height:
                        1.55;
                }

                .sa-card-body {
                    padding:
                        17px;
                }

                /* =====================================================
                   TABLE
                ====================================================== */

                .sa-table-wrap {
                    width:
                        100%;

                    overflow-x:
                        auto;

                    -webkit-overflow-scrolling:
                        touch;
                }

                .sa-table {
                    width:
                        100%;

                    min-width:
                        650px;

                    border-collapse:
                        collapse;
                }

                .sa-table th {
                    padding:
                        10px 8px;

                    text-align:
                        left;

                    background:
                        #f8fafc;

                    border-bottom:
                        1px solid
                        #e2e8f0;

                    color:
                        #94a3b8;

                    font-size:
                        8px;

                    font-weight:
                        850;

                    letter-spacing:
                        .55px;

                    text-transform:
                        uppercase;

                    white-space:
                        nowrap;
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
                        9px;

                    vertical-align:
                        middle;
                }

                .sa-table tbody tr:last-child td {
                    border-bottom:
                        0;
                }

                .sa-table tbody tr:hover td {
                    background:
                        #fcfdff;
                }

                .sa-name {
                    color:
                        #17304e;

                    font-size:
                        9px;

                    font-weight:
                        800;
                }

                .sa-email {
                    margin-top:
                        3px;

                    color:
                        #97a3b2;

                    font-size:
                        8px;

                    white-space:
                        nowrap;
                }

                /* =====================================================
                   PILLS
                ====================================================== */

                .sa-pill {
                    display:
                        inline-flex;

                    align-items:
                        center;

                    min-height:
                        23px;

                    padding:
                        0 8px;

                    border-radius:
                        999px;

                    font-size:
                        8px;

                    font-weight:
                        800;

                    white-space:
                        nowrap;
                }

                .sa-pill-role {
                    color:
                        #1d4ed8;

                    background:
                        #eff6ff;

                    border:
                        1px solid
                        #dbeafe;
                }

                .sa-pill-active {
                    color:
                        #15803d;

                    background:
                        #f0fdf4;

                    border:
                        1px solid
                        #bbf7d0;
                }

                .sa-pill-inactive {
                    color:
                        #dc2626;

                    background:
                        #fef2f2;

                    border:
                        1px solid
                        #fecaca;
                }

                /* =====================================================
                   SIDE STACK
                ====================================================== */

                .sa-side-stack {
                    display:
                        flex;

                    flex-direction:
                        column;

                    gap:
                        17px;
                }

                .sa-mini-list {
                    display:
                        flex;

                    flex-direction:
                        column;

                    gap:
                        11px;
                }

                .sa-mini-link {
                    display:
                        flex;

                    align-items:
                        flex-start;

                    gap:
                        10px;

                    margin:
                        -2px;

                    padding:
                        2px;

                    border-radius:
                        10px;

                    transition:
                        background .18s ease;
                }

                .sa-mini-link:hover {
                    background:
                        #f8fafc;
                }

                .sa-mini-icon {
                    width:
                        34px;

                    height:
                        34px;

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    flex-shrink:
                        0;

                    border:
                        1px solid
                        #e2e8f0;

                    border-radius:
                        9px;

                    background:
                        #f8fafc;

                    color:
                        #17304d;
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
                        3px;

                    color:
                        #94a3b8;

                    font-size:
                        8px;

                    line-height:
                        1.55;
                }

                /* =====================================================
                   EMPTY
                ====================================================== */

                .sa-empty {
                    padding:
                        38px 20px;

                    text-align:
                        center;

                    color:
                        #94a3b8;

                    font-size:
                        9px;
                }

                /* =====================================================
                   FOOTER
                ====================================================== */

                .sa-footer {
                    margin-top:
                        22px;

                    text-align:
                        center;

                    color:
                        #9aa6b5;

                    font-size:
                        8px;
                }

                /* =====================================================
                   LARGE TABLET
                ====================================================== */

                @media (max-width: 1180px) {

                    .sa-navbar-inner {
                        gap:
                            14px;
                    }

                    .sa-brand-subtitle {
                        display:
                            none;
                    }

                    .sa-nav-item {
                        padding:
                            0 9px;
                    }

                    .sa-user-copy {
                        max-width:
                            100px;
                    }

                    .sa-content-grid {
                        grid-template-columns:
                            minmax(0,1fr)
                            minmax(280px,.75fr);
                    }
                }

                /* =====================================================
                   TABLET
                ====================================================== */

                @media (max-width: 940px) {

                    .sa-navbar-inner {
                        min-height:
                            64px;

                        padding:
                            0 18px;
                    }

                    .sa-nav {
                        justify-content:
                            flex-start;
                    }

                    .sa-nav-item {
                        font-size:
                            9px;

                        padding:
                            0 8px;
                    }

                    .sa-user-box {
                        display:
                            none;
                    }

                    .sa-content-grid {
                        grid-template-columns:
                            1fr;
                    }

                    .sa-side-stack {
                        display:
                            grid;

                        grid-template-columns:
                            repeat(
                                2,
                                minmax(0,1fr)
                            );

                        gap:
                            12px;
                    }

                    .sa-main {
                        width:
                            100%;
                    }

                    .sa-container {
                        padding:
                            24px
                            20px
                            42px;
                    }
                }

                /* =====================================================
                   MOBILE
                ====================================================== */

                @media (max-width: 760px) {

                    .sa-navbar-inner {
                        min-height:
                            60px;

                        padding:
                            0 13px;

                        gap:
                            10px;
                    }

                    .sa-brand {
                        gap:
                            8px;
                    }

                    .sa-brand-logo {
                        width:
                            36px;

                        height:
                            36px;

                        border-radius:
                            10px;
                    }

                    .sa-brand-logo img {
                        width:
                            25px;

                        height:
                            25px;
                    }

                    .sa-brand-title {
                        font-size:
                            13px;
                    }

                    .sa-brand-subtitle {
                        display:
                            block;

                        margin-top:
                            3px;

                        font-size:
                            7px;
                    }

                    .sa-nav {
                        display:
                            none;
                    }

                    .sa-nav-right {
                        margin-left:
                            auto;
                    }

                    .sa-user-box {
                        display:
                            none;
                    }

                    .sa-logout {
                        width:
                            38px;

                        min-height:
                            38px;

                        padding:
                            0;

                        border-radius:
                            10px;
                    }

                    .sa-logout-label {
                        display:
                            none;
                    }

                    .sa-mobile-nav {
                        display:
                            block;
                    }

                    .sa-container {
                        padding:
                            18px
                            12px
                            32px;
                    }

                    .sa-topbar {
                        flex-direction:
                            column;

                        align-items:
                            flex-start;

                        gap:
                            12px;

                        margin-bottom:
                            16px;
                    }

                    .sa-kicker {
                        font-size:
                            8px;
                    }

                    .sa-title {
                        font-size:
                            22px;
                    }

                    .sa-subtitle {
                        font-size:
                            9px;

                        line-height:
                            1.65;
                    }

                    .sa-date-chip {
                        min-height:
                            31px;

                        font-size:
                            8px;
                    }

                    .sa-stat-grid {
                        grid-template-columns:
                            repeat(
                                2,
                                minmax(0,1fr)
                            );

                        gap:
                            8px;

                        margin-bottom:
                            13px;
                    }

                    .sa-stat-card {
                        padding:
                            12px;

                        border-radius:
                            13px;
                    }

                    .sa-stat-icon {
                        width:
                            32px;

                        height:
                            32px;

                        border-radius:
                            9px;
                    }

                    .sa-stat-label {
                        margin-top:
                            10px;

                        font-size:
                            7px;
                    }

                    .sa-stat-value {
                        font-size:
                            20px;
                    }

                    .sa-stat-note {
                        font-size:
                            7px;
                    }

                    .sa-card {
                        border-radius:
                            14px;
                    }

                    .sa-card-header {
                        padding:
                            13px;

                        flex-direction:
                            row;
                    }

                    .sa-card-title {
                        font-size:
                            12px;
                    }

                    .sa-card-description {
                        font-size:
                            8px;
                    }

                    .sa-card-body {
                        padding:
                            13px;
                    }

                    .sa-side-stack {
                        grid-template-columns:
                            1fr;

                        gap:
                            12px;
                    }

                    .sa-table {
                        min-width:
                            640px;
                    }

                    .sa-footer {
                        margin-top:
                            17px;

                        font-size:
                            7px;
                    }
                }

                /* =====================================================
                   SMALL PHONE
                ====================================================== */

                @media (max-width: 430px) {

                    .sa-navbar-inner {
                        min-height:
                            57px;

                        padding:
                            0 10px;
                    }

                    .sa-brand-logo {
                        width:
                            33px;

                        height:
                            33px;
                    }

                    .sa-brand-title {
                        font-size:
                            12px;
                    }

                    .sa-brand-subtitle {
                        font-size:
                            6.5px;
                    }

                    .sa-logout {
                        width:
                            35px;

                        min-height:
                            35px;
                    }

                    .sa-mobile-nav-inner {
                        padding:
                            7px 9px;
                    }

                    .sa-mobile-item {
                        min-height:
                            32px;

                        font-size:
                            8px;

                        padding:
                            0 9px;
                    }

                    .sa-container {
                        padding:
                            15px
                            8px
                            27px;
                    }

                    .sa-title {
                        font-size:
                            20px;
                    }

                    .sa-subtitle {
                        font-size:
                            8.5px;
                    }

                    .sa-stat-grid {
                        gap:
                            6px;
                    }

                    .sa-stat-card {
                        padding:
                            10px;
                    }

                    .sa-stat-value {
                        font-size:
                            18px;
                    }

                    .sa-stat-note {
                        display:
                            none;
                    }

                    .sa-card-header {
                        padding:
                            12px;
                    }

                    .sa-card-body {
                        padding:
                            11px;
                    }

                    .sa-card-title {
                        font-size:
                            11px;
                    }

                    .sa-card-description {
                        font-size:
                            7.5px;
                    }

                    .sa-pill {
                        min-height:
                            21px;

                        padding:
                            0 7px;

                        font-size:
                            7px;
                    }

                    .sa-mini-icon {
                        width:
                            32px;

                        height:
                            32px;
                    }

                    .sa-mini-title {
                        font-size:
                            8.5px;
                    }

                    .sa-mini-text {
                        font-size:
                            7.5px;
                    }

                    .sa-table {
                        min-width:
                            620px;
                    }
                }

                /* =====================================================
                   VERY SMALL PHONE
                ====================================================== */

                @media (max-width: 350px) {

                    .sa-brand-subtitle {
                        display:
                            none;
                    }

                    .sa-title {
                        font-size:
                            18px;
                    }

                    .sa-stat-label {
                        font-size:
                            6.5px;
                    }

                    .sa-stat-value {
                        font-size:
                            17px;
                    }

                    .sa-mobile-item {
                        font-size:
                            7.5px;

                        padding:
                            0 8px;
                    }
                }
            `}</style>

            <div className="sa-page">

                {/* =====================================================
                    TOP NAVIGATION
                ====================================================== */}

                <header className="sa-navbar">

                    <div className="sa-navbar-inner">

                        {/* BRAND */}

                        <div className="sa-brand">

                            <div className="sa-brand-logo">

                                <img
                                    src="/images/poltekkes-icon.png"
                                    alt="Logo Poltekkes Maluku"
                                />

                            </div>

                            <div className="sa-brand-copy">

                                <div className="sa-brand-title">
                                    SIMAP
                                </div>

                                <div className="sa-brand-subtitle">
                                    Poltekkes Maluku
                                </div>

                            </div>

                        </div>

                        {/* DESKTOP MENU */}

                        <nav className="sa-nav">

                            <DesktopNavItem
                                href="/super-admin/dashboard"
                                label="Dashboard"
                                icon="shield"
                                active
                            />

                            <DesktopNavItem
                                href="/super-admin/pengguna"
                                label="Pengguna"
                                icon="users"
                            />

                            <DesktopNavItem
                                href="/super-admin/unit"
                                label="Unit"
                                icon="building"
                            />

                            <DesktopNavItem
                                href="/super-admin/aktivitas"
                                label="Aktivitas Sistem"
                                icon="activity"
                            />

                        </nav>

                        {/* USER + LOGOUT */}

                        <div className="sa-nav-right">

                            <div className="sa-user-box">

                                <div className="sa-user-copy">

                                    <div className="sa-user-name">
                                        {userName}
                                    </div>

                                    <div className="sa-user-role">
                                        {userRole}
                                    </div>

                                </div>

                                <div className="sa-avatar">
                                    {userInitial}
                                </div>

                            </div>

                            <form
                                method="POST"
                                action="/logout"
                                className="sa-logout-form"
                                onSubmit={handleLogout}
                            >

                                <input
                                    type="hidden"
                                    name="_token"
                                    value={csrfToken}
                                />

                                <button
                                    type="submit"
                                    className="sa-logout"
                                    title="Keluar dari SIMAP"
                                    aria-label="Keluar dari SIMAP"
                                >

                                    <Icon
                                        name="logout"
                                        size={14}
                                    />

                                    <span className="sa-logout-label">
                                        Keluar
                                    </span>

                                </button>

                            </form>

                        </div>

                    </div>

                    {/* MOBILE MENU */}

                    <div className="sa-mobile-nav">

                        <div className="sa-mobile-nav-inner">

                            <MobileNavItem
                                href="/super-admin/dashboard"
                                label="Dashboard"
                                icon="shield"
                                active
                            />

                            <MobileNavItem
                                href="/super-admin/pengguna"
                                label="Pengguna"
                                icon="users"
                            />

                            <MobileNavItem
                                href="/super-admin/unit"
                                label="Unit"
                                icon="building"
                            />

                            <MobileNavItem
                                href="/super-admin/aktivitas"
                                label="Aktivitas"
                                icon="activity"
                            />

                        </div>

                    </div>

                </header>

                {/* =====================================================
                    MAIN
                ====================================================== */}

                <main className="sa-main">

                    <div className="sa-container">

                        {/* =================================================
                            PAGE HEADER
                        ================================================== */}

                        <div className="sa-topbar">

                            <div className="sa-header-left">

                                <div className="sa-kicker">
                                    ADMINISTRASI SISTEM
                                </div>

                                <h1 className="sa-title">
                                    Dashboard Super Admin
                                </h1>

                                <p className="sa-subtitle">
                                    Kelola pengguna dan konfigurasi dasar
                                    Sistem Manajemen Administrasi
                                    Poltekkes Maluku.
                                </p>

                            </div>

                            <div className="sa-date-chip">
                                {todayLabel ||
                                    'Memuat tanggal...'}
                                {' '}· WIT
                            </div>

                        </div>

                        {/* =================================================
                            STATISTICS
                        ================================================== */}

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
                                note={`${safeStats.activeUnits} unit aktif`}
                                iconBackground="#f5f3ff"
                                iconColor="#7c3aed"
                            />

                        </div>

                        {/* =================================================
                            CONTENT
                        ================================================== */}

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

                                    <div className="sa-pill sa-pill-role">
                                        {safeUsers.length}
                                        {' '}akun
                                    </div>

                                </div>

                                <div className="sa-card-body">

                                    {safeUsers.length === 0 ? (

                                        <div className="sa-empty">
                                            Belum ada data pengguna.
                                        </div>

                                    ) : (

                                        <div className="sa-table-wrap">

                                            <table className="sa-table">

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

                                                    {safeUsers.map(
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

                                                                        <div className="sa-name">
                                                                            {
                                                                                item?.name ||
                                                                                '-'
                                                                            }
                                                                        </div>

                                                                        <div className="sa-email">
                                                                            {
                                                                                item?.email ||
                                                                                '-'
                                                                            }
                                                                        </div>

                                                                    </td>

                                                                    <td>

                                                                        <span className="sa-pill sa-pill-role">

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
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>

                                    )}

                                </div>

                            </section>

                            {/* =================================================
                                SIDE
                            ================================================== */}

                            <div className="sa-side-stack">

                                {/* =================================================
                                    FUNGSI SUPER ADMIN
                                ================================================== */}

                                <section className="sa-card">

                                    <div className="sa-card-header">

                                        <div>

                                            <div className="sa-card-title">
                                                Fungsi Super Admin
                                            </div>

                                            <div className="sa-card-description">
                                                Ruang lingkup administrasi
                                                sistem.
                                            </div>

                                        </div>

                                    </div>

                                    <div className="sa-card-body">

                                        <div className="sa-mini-list">

                                            {/* PENGGUNA */}

                                            <a
                                                href="/super-admin/pengguna"
                                                className="sa-mini-link"
                                            >

                                                <div className="sa-mini-icon">

                                                    <InlineIcon
                                                        name="users"
                                                        size={14}
                                                    />

                                                </div>

                                                <div>

                                                    <div className="sa-mini-title">
                                                        Kelola Pengguna
                                                    </div>

                                                    <div className="sa-mini-text">
                                                        Mengatur akun, role,
                                                        unit, dan status
                                                        pengguna.
                                                    </div>

                                                </div>

                                            </a>

                                            {/* UNIT */}

                                            <a
                                                href="/super-admin/unit"
                                                className="sa-mini-link"
                                            >

                                                <div className="sa-mini-icon">

                                                    <InlineIcon
                                                        name="building"
                                                        size={14}
                                                    />

                                                </div>

                                                <div>

                                                    <div className="sa-mini-title">
                                                        Kelola Unit
                                                    </div>

                                                    <div className="sa-mini-text">
                                                        Mengatur daftar unit
                                                        dan status unit.
                                                    </div>

                                                </div>

                                            </a>

                                            {/* AKTIVITAS */}

                                            <a
                                                href="/super-admin/aktivitas"
                                                className="sa-mini-link"
                                            >

                                                <div className="sa-mini-icon">

                                                    <InlineIcon
                                                        name="activity"
                                                        size={14}
                                                    />

                                                </div>

                                                <div>

                                                    <div className="sa-mini-title">
                                                        Aktivitas Sistem
                                                    </div>

                                                    <div className="sa-mini-text">
                                                        Melihat riwayat
                                                        tindakan penting
                                                        di sistem.
                                                    </div>

                                                </div>

                                            </a>

                                        </div>

                                    </div>

                                </section>

                                {/* =================================================
                                    ADMINISTRASI TERPUSAT
                                ================================================== */}

                                <section className="sa-card">

                                    <div className="sa-card-body">

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

                                            <div className="sa-mini-icon">

                                                <InlineIcon
                                                    name="settings"
                                                    size={14}
                                                />

                                            </div>

                                            <div>

                                                <div className="sa-mini-title">
                                                    Administrasi Terpusat
                                                </div>

                                                <div className="sa-mini-text">
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

                        {/* =================================================
                            FOOTER
                        ================================================== */}

                        <div className="sa-footer">
                            SIMAP Poltekkes Maluku
                        </div>

                    </div>

                </main>

            </div>
        </>
    );
}

/* =========================================================
   STAT CARD
========================================================= */

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

/* =========================================================
   DESKTOP NAV ITEM
========================================================= */

function DesktopNavItem({
    href,
    label,
    icon,
    active = false,
}) {
    return (
        <a
            href={href}
            className={`sa-nav-item ${
                active
                    ? 'sa-nav-item-active'
                    : ''
            }`}
        >

            <span className="sa-nav-icon">

                <InlineIcon
                    name={icon}
                    size={13}
                />

            </span>

            <span>
                {label}
            </span>

        </a>
    );
}

/* =========================================================
   MOBILE NAV ITEM
========================================================= */

function MobileNavItem({
    href,
    label,
    icon,
    active = false,
}) {
    return (
        <a
            href={href}
            className={`sa-mobile-item ${
                active
                    ? 'active'
                    : ''
            }`}
        >

            <InlineIcon
                name={icon}
                size={12}
            />

            <span>
                {label}
            </span>

        </a>
    );
}

/* =========================================================
   ICON
========================================================= */

function Icon({
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

    const icons = {

        logout: (
            <>
                <path
                    d="
                        M10 5
                        H6
                        a2 2 0
                        0 0-2 2
                        v10
                        a2 2 0
                        0 0 2 2
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
}

/* =========================================================
   INLINE ICON
========================================================= */

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

    /* =====================================================
       SHIELD
    ===================================================== */

    if (
        name === 'shield'
    ) {
        return (
            <svg {...common}>

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

            </svg>
        );
    }

    /* =====================================================
       USERS
    ===================================================== */

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

    /* =====================================================
       CHECK
    ===================================================== */

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

    /* =====================================================
       USER X
    ===================================================== */

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

    /* =====================================================
       BUILDING
    ===================================================== */

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

    /* =====================================================
       ACTIVITY
    ===================================================== */

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

    /* =====================================================
       SETTINGS
    ===================================================== */

    if (
        name === 'settings'
    ) {
        return (
            <svg {...common}>

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

            </svg>
        );
    }

    return null;
}