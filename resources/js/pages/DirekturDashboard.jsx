import React, { useMemo } from 'react';

export default function DirekturDashboard({
    user = null,
    agendaHariIni = [],
    stats = {},
}) {
    // =====================================================
    // DATA
    // =====================================================

    const safeAgenda = Array.isArray(agendaHariIni)
        ? agendaHariIni.filter(
              (item) =>
                  item &&
                  typeof item === 'object' &&
                  item.id
          )
        : [];

    const safeStats =
        stats &&
        typeof stats === 'object'
            ? stats
            : {};

    // =====================================================
    // USER
    // =====================================================

    const userName =
        user?.name || 'Direktur';

    const userInitial = useMemo(() => {
        return (
            String(userName)
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .map((word) =>
                    word.charAt(0)
                )
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'DI'
        );
    }, [userName]);

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

    const todayLabel = useMemo(() => {
        return new Intl.DateTimeFormat(
            'id-ID',
            {
                timeZone: 'Asia/Jayapura',
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
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
            home: (
                <>
                    <path d="M3 10.5 12 3l9 7.5" />
                    <path d="M5.5 9.5V21h13V9.5" />
                    <path d="M9.5 21v-6h5v6" />
                </>
            ),

            calendar: (
                <>
                    <rect
                        x="3"
                        y="4.5"
                        width="18"
                        height="16"
                        rx="2.5"
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

            arrowUpRight: (
                <>
                    <path d="M7 17 17 7" />
                    <path d="M8 7h9v9" />
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

            file: (
                <>
                    <path d="M14 2.5H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5Z" />
                    <path d="M14 2.5v6h6" />
                    <path d="M8 13h8M8 17h5" />
                </>
            ),

            logout: (
                <>
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M13 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
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
    // SAFE DATE
    // =====================================================

    const getDateKey = (value) => {
        if (!value) {
            return '';
        }

        const text =
            String(value).trim();

        const match =
            text.match(
                /^(\d{4}-\d{2}-\d{2})/
            );

        return match
            ? match[1]
            : '';
    };

    // =====================================================
    // SORT AGENDA
    // =====================================================

    const sortedAgendaHariIni =
        useMemo(() => {
            return [...safeAgenda].sort(
                (a, b) => {
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
                }
            );
        }, [safeAgenda]);

    // =====================================================
    // STATISTIK
    // =====================================================

    const agendaHariIniCount =
        sortedAgendaHariIni.length;

    const agendaMendatang =
        Number(
            safeStats.agendaMendatang ??
                safeStats.agendaMendatangCount ??
                0
        );

    const totalAgenda =
        Number(
            safeStats.totalAgenda ??
                safeStats.total ??
                agendaHariIniCount +
                    agendaMendatang
        );

    // =====================================================
    // JENIS AGENDA
    // =====================================================

    const jenisCount = useMemo(() => {
        const counts = {};

        sortedAgendaHariIni.forEach(
            (item) => {
                const jenis =
                    item?.jenis ||
                    'Lainnya';

                counts[jenis] =
                    (counts[jenis] || 0) +
                    1;
            }
        );

        return Object.entries(counts)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )
            .slice(0, 4);
    }, [sortedAgendaHariIni]);

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = (event) => {
        if (
            !window.confirm(
                'Yakin ingin keluar dari SIMAP?'
            )
        ) {
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

                body {
                    margin: 0;
                }

                .direktur-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(
                            circle at 0% 0%,
                            rgba(37,99,235,.045),
                            transparent 23%
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
                   HEADER
                ===================================================== */

                .direktur-header {
                    height: 74px;
                    position: sticky;
                    top: 0;
                    z-index: 60;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 26px;
                    background: rgba(255,255,255,.94);
                    backdrop-filter: blur(14px);
                    border-bottom: 1px solid #e5eaf1;
                }

                .direktur-header-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    text-decoration: none;
                }

                .direktur-logo-box {
                    width: 43px;
                    height: 43px;
                    padding: 5px;
                    border-radius: 11px;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    box-shadow:
                        0 5px 14px
                        rgba(15,39,71,.055);
                }

                .direktur-logo-box img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                }

                .direktur-brand-title {
                    color: #0f2747;
                    font-size: 18px;
                    font-weight: 850;
                    line-height: 1;
                    letter-spacing: -.2px;
                }

                .direktur-brand-subtitle {
                    margin-top: 5px;
                    color: #64748b;
                    font-size: 9px;
                }

                .direktur-header-user {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .direktur-user-copy {
                    text-align: right;
                }

                .direktur-user-name {
                    color: #172033;
                    font-size: 12px;
                    font-weight: 800;
                }

                .direktur-user-role {
                    margin-top: 3px;
                    color: #94a3b8;
                    font-size: 9px;
                }

                .direktur-avatar {
                    width: 39px;
                    height: 39px;
                    border-radius: 50%;
                    background:
                        linear-gradient(
                            135deg,
                            #dbeafe,
                            #bfdbfe
                        );
                    color: #174a7e;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 850;
                }

                .direktur-logout {
                    height: 39px;
                    min-width: 39px;
                    padding: 0 12px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    border-radius: 9px;
                    border: 1px solid #fecaca;
                    background: #fff7f7;
                    color: #dc2626;
                    font-size: 10px;
                    font-weight: 750;
                    cursor: pointer;
                    transition: .16s ease;
                }

                .direktur-logout:hover {
                    background: #fee2e2;
                    border-color: #fca5a5;
                }

                /* =====================================================
                   LAYOUT
                ===================================================== */

                .direktur-shell {
                    display: flex;
                    min-height:
                        calc(100vh - 74px);
                }

                .direktur-sidebar {
                    width: 230px;
                    flex-shrink: 0;
                    background: #ffffff;
                    border-right: 1px solid #e5eaf1;
                    padding: 20px 13px;
                }

                .direktur-side-label {
                    padding: 0 11px 9px;
                    color: #a0a9b8;
                    font-size: 9px;
                    font-weight: 850;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .direktur-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .direktur-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    padding: 10px 11px;
                    border-radius: 9px;
                    color: #64748b;
                    text-decoration: none;
                    font-size: 11px;
                    font-weight: 650;
                    transition: .15s ease;
                }

                .direktur-nav-link:hover {
                    background: #f8fafc;
                    color: #0f2747;
                }

                .direktur-nav-link.active {
                    background: #0f2747;
                    color: #ffffff;
                    box-shadow:
                        0 7px 15px
                        rgba(15,39,71,.11);
                }

                .direktur-info-card {
                    margin: 20px 3px 0;
                    padding: 13px;
                    border-radius: 11px;
                    background: #f8fafc;
                    border: 1px solid #e6ebf2;
                }

                .direktur-info-card-top {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: #0f2747;
                    font-size: 10px;
                    font-weight: 800;
                }

                .direktur-info-card-text {
                    margin-top: 7px;
                    color: #64748b;
                    font-size: 9px;
                    line-height: 1.65;
                }

                /* =====================================================
                   MAIN
                ===================================================== */

                .direktur-main {
                    flex: 1;
                    min-width: 0;
                    padding: 25px;
                }

                .direktur-container {
                    max-width: 1370px;
                    margin: 0 auto;
                }

                /* =====================================================
                   WELCOME
                ===================================================== */

                .direktur-welcome {
                    position: relative;
                    overflow: hidden;
                    min-height: 195px;
                    padding: 26px 28px;
                    border-radius: 20px;
                    background:
                        linear-gradient(
                            135deg,
                            #0e2747 0%,
                            #153f69 58%,
                            #1d557f 100%
                        );
                    box-shadow:
                        0 16px 35px
                        rgba(15,39,71,.15);
                }

                .direktur-welcome-circle-1 {
                    position: absolute;
                    width: 230px;
                    height: 230px;
                    right: -90px;
                    top: -110px;
                    border-radius: 50%;
                    background:
                        rgba(255,255,255,.05);
                }

                .direktur-welcome-circle-2 {
                    position: absolute;
                    width: 115px;
                    height: 115px;
                    right: 115px;
                    bottom: -80px;
                    border-radius: 50%;
                    background:
                        rgba(125,211,252,.06);
                }

                .direktur-welcome-content {
                    position: relative;
                    z-index: 1;
                    max-width: 760px;
                }

                .direktur-welcome-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 10px;
                    border-radius: 999px;
                    background:
                        rgba(255,255,255,.10);
                    border:
                        1px solid
                        rgba(255,255,255,.10);
                    color: #dbeafe;
                    font-size: 9px;
                    font-weight: 750;
                }

                .direktur-welcome-title {
                    margin: 15px 0 0;
                    color: #ffffff;
                    font-size: 30px;
                    line-height: 1.15;
                    font-weight: 850;
                    letter-spacing: -.7px;
                }

                .direktur-welcome-date {
                    margin-top: 8px;
                    color: #bfdbfe;
                    font-size: 10px;
                }

                .direktur-welcome-text {
                    margin: 11px 0 0;
                    color: #dbeafe;
                    font-size: 11px;
                    line-height: 1.75;
                }

                /* =====================================================
                   SUMMARY
                ===================================================== */

                .direktur-summary {
                    display: grid;
                    grid-template-columns:
                        repeat(3,minmax(0,1fr));
                    gap: 13px;
                    margin-top: 15px;
                }

                .direktur-summary-card {
                    position: relative;
                    overflow: hidden;
                    padding: 17px;
                    border-radius: 14px;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    box-shadow:
                        0 5px 18px
                        rgba(15,23,42,.025);
                }

                .direktur-summary-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 10px;
                }

                .direktur-summary-label {
                    color: #64748b;
                    font-size: 10px;
                    font-weight: 750;
                }

                .direktur-summary-value {
                    margin-top: 7px;
                    font-size: 29px;
                    line-height: 1;
                    font-weight: 850;
                }

                .direktur-summary-description {
                    margin-top: 7px;
                    color: #94a3b8;
                    font-size: 9px;
                }

                .direktur-summary-icon {
                    width: 39px;
                    height: 39px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .direktur-summary-card.total
                    .direktur-summary-icon {
                    background: #f1f5f9;
                    color: #475569;
                }

                .direktur-summary-card.today
                    .direktur-summary-icon {
                    background: #eff6ff;
                    color: #2563eb;
                }

                .direktur-summary-card.upcoming
                    .direktur-summary-icon {
                    background: #f0fdf4;
                    color: #16a34a;
                }

                .direktur-summary-card.total
                    .direktur-summary-value {
                    color: #334155;
                }

                .direktur-summary-card.today
                    .direktur-summary-value {
                    color: #2563eb;
                }

                .direktur-summary-card.upcoming
                    .direktur-summary-value {
                    color: #16a34a;
                }

                /* =====================================================
                   GRID
                ===================================================== */

                .direktur-content-grid {
                    display: grid;
                    grid-template-columns:
                        minmax(0,1.45fr)
                        minmax(290px,.65fr);
                    gap: 15px;
                    margin-top: 15px;
                }

                .direktur-panel {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 17px;
                    overflow: hidden;
                    box-shadow:
                        0 5px 18px
                        rgba(15,23,42,.025);
                }

                .direktur-panel-header {
                    padding: 17px 19px;
                    border-bottom: 1px solid #eef2f7;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }

                .direktur-panel-title {
                    color: #0f2747;
                    font-size: 14px;
                    font-weight: 820;
                }

                .direktur-panel-subtitle {
                    margin-top: 4px;
                    color: #94a3b8;
                    font-size: 9px;
                    line-height: 1.5;
                }

                .direktur-pill {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 5px 9px;
                    border-radius: 999px;
                    background: #eff6ff;
                    border: 1px solid #dbeafe;
                    color: #1d4ed8;
                    font-size: 9px;
                    font-weight: 800;
                    white-space: nowrap;
                }

                /* =====================================================
                   AGENDA TIMELINE
                ===================================================== */

                .direktur-agenda-list {
                    padding: 5px 18px 2px;
                }

                .direktur-agenda-row {
                    position: relative;
                    display: grid;
                    grid-template-columns:
                        88px
                        1fr
                        22px;
                    gap: 13px;
                    align-items: stretch;
                    padding: 15px 0;
                    text-decoration: none;
                    color: inherit;
                }

                .direktur-agenda-row:not(:last-child) {
                    border-bottom:
                        1px solid #f1f5f9;
                }

                .direktur-agenda-row:hover
                    .direktur-agenda-card {
                    background: #fbfdff;
                    border-color: #dbeafe;
                }

                .direktur-agenda-time {
                    align-self: start;
                    padding: 10px 7px;
                    border-radius: 11px;
                    background: #eff6ff;
                    border: 1px solid #dbeafe;
                    text-align: center;
                }

                .direktur-agenda-time-main {
                    color: #1d4ed8;
                    font-size: 15px;
                    font-weight: 850;
                    line-height: 1;
                }

                .direktur-agenda-time-end {
                    margin-top: 4px;
                    color: #64748b;
                    font-size: 8px;
                }

                .direktur-agenda-time-zone {
                    margin-top: 4px;
                    color: #94a3b8;
                    font-size: 8px;
                    font-weight: 750;
                }

                .direktur-agenda-card {
                    min-width: 0;
                    padding: 12px 13px;
                    border-radius: 11px;
                    border: 1px solid transparent;
                    transition: .16s ease;
                }

                .direktur-agenda-title-line {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    flex-wrap: wrap;
                }

                .direktur-agenda-title {
                    color: #1e293b;
                    font-size: 12px;
                    font-weight: 800;
                    line-height: 1.45;
                    word-break: break-word;
                }

                .direktur-agenda-type {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 7px;
                    border-radius: 999px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    color: #64748b;
                    font-size: 8px;
                    font-weight: 750;
                }

                .direktur-agenda-meta {
                    margin-top: 7px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #64748b;
                    font-size: 9px;
                }

                .direktur-agenda-source {
                    margin-top: 6px;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    color: #94a3b8;
                    font-size: 8px;
                }

                .direktur-agenda-source.manual {
                    color: #94a3b8;
                }

                .direktur-agenda-source.surat {
                    color: #2563eb;
                }

                .direktur-agenda-arrow {
                    align-self: center;
                    color: #a8b1bf;
                    transition: transform .16s ease;
                }

                .direktur-agenda-row:hover
                    .direktur-agenda-arrow {
                    transform: translateX(3px);
                    color: #2563eb;
                }

                .direktur-empty {
                    padding: 55px 22px;
                    text-align: center;
                }

                .direktur-empty-icon {
                    width: 58px;
                    height: 58px;
                    margin: 0 auto 13px;
                    border-radius: 16px;
                    background: #eff6ff;
                    color: #2563eb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .direktur-empty-title {
                    color: #475569;
                    font-size: 13px;
                    font-weight: 800;
                }

                .direktur-empty-text {
                    margin-top: 5px;
                    color: #94a3b8;
                    font-size: 10px;
                }

                .direktur-all-button {
                    margin-top: 12px;
                    padding: 12px 17px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    border-radius: 10px;
                    background: #0f2747;
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 10px;
                    font-weight: 800;
                    transition: .16s ease;
                }

                .direktur-all-button:hover {
                    background: #174a7e;
                }

                .direktur-panel-footer {
                    padding: 13px 18px;
                    border-top: 1px solid #eef2f7;
                    background: #f8fafc;
                }

                .direktur-panel-footer .direktur-all-button {
                    width: 100%;
                    margin-top: 0;
                }

                /* =====================================================
                   RIGHT PANEL
                ===================================================== */

                .direktur-side-content {
                    padding: 15px;
                }

                .direktur-today-box {
                    padding: 14px;
                    border-radius: 13px;
                    background:
                        linear-gradient(
                            135deg,
                            #eff6ff,
                            #f8fbff
                        );
                    border: 1px solid #dbeafe;
                }

                .direktur-side-heading {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: #1d4ed8;
                    font-size: 10px;
                    font-weight: 820;
                }

                .direktur-side-date {
                    margin-top: 8px;
                    color: #334155;
                    font-size: 11px;
                    font-weight: 750;
                    line-height: 1.5;
                }

                .direktur-side-count {
                    margin-top: 4px;
                    color: #64748b;
                    font-size: 9px;
                }

                .direktur-types {
                    margin-top: 11px;
                    padding: 13px;
                    border-radius: 12px;
                    background: #ffffff;
                    border: 1px solid #e5eaf1;
                }

                .direktur-types-title {
                    color: #334155;
                    font-size: 10px;
                    font-weight: 800;
                }

                .direktur-type-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    margin-top: 9px;
                }

                .direktur-type-left {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    min-width: 0;
                }

                .direktur-type-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #2563eb;
                    flex-shrink: 0;
                }

                .direktur-type-name {
                    color: #64748b;
                    font-size: 9px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .direktur-type-count {
                    color: #334155;
                    font-size: 9px;
                    font-weight: 800;
                }

                .direktur-access-box {
                    margin-top: 11px;
                    padding: 13px;
                    border-radius: 12px;
                    background: #f8fafc;
                    border: 1px solid #e5eaf1;
                }

                .direktur-access-title {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: #0f2747;
                    font-size: 10px;
                    font-weight: 820;
                }

                .direktur-access-text {
                    margin-top: 6px;
                    color: #64748b;
                    font-size: 9px;
                    line-height: 1.7;
                }

                /* =====================================================
                   FOOTER
                ===================================================== */

                .direktur-footer {
                    padding: 22px 0 5px;
                    text-align: center;
                    color: #a0a9b8;
                    font-size: 9px;
                }

                /* =====================================================
                   RESPONSIVE
                ===================================================== */

                @media (max-width: 1100px) {

                    .direktur-content-grid {
                        grid-template-columns: 1fr;
                    }

                    .direktur-summary {
                        grid-template-columns:
                            repeat(3,minmax(0,1fr));
                    }

                }

                @media (max-width: 820px) {

                    .direktur-sidebar {
                        display: none;
                    }

                    .direktur-summary {
                        grid-template-columns:
                            repeat(2,minmax(0,1fr));
                    }

                    .direktur-main {
                        padding: 19px 15px 35px;
                    }

                }

                @media (max-width: 620px) {

                    .direktur-header {
                        padding: 0 15px;
                    }

                    .direktur-brand-copy,
                    .direktur-user-copy {
                        display: none;
                    }

                    .direktur-summary {
                        grid-template-columns: 1fr;
                    }

                    .direktur-welcome {
                        min-height: auto;
                        padding: 21px;
                    }

                    .direktur-welcome-title {
                        font-size: 25px;
                    }

                    .direktur-agenda-row {
                        grid-template-columns:
                            70px
                            minmax(0,1fr)
                            16px;
                        gap: 9px;
                    }

                    .direktur-agenda-title {
                        font-size: 11px;
                    }

                    .direktur-logout-text {
                        display: none;
                    }

                    .direktur-logout {
                        width: 39px;
                        padding: 0;
                    }

                }

                @media (max-width: 440px) {

                    .direktur-panel-header {
                        align-items: flex-start;
                    }

                    .direktur-agenda-row {
                        grid-template-columns:
                            1fr;
                    }

                    .direktur-agenda-time {
                        width: 100px;
                    }

                    .direktur-agenda-arrow {
                        display: none;
                    }

                }

            `}</style>

            <div className="direktur-page">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <header className="direktur-header">

                    <a
                        href="/direktur/dashboard"
                        className="direktur-header-brand"
                    >

                        <div className="direktur-logo-box">
                            <img
                                src="/images/poltekkes-icon.png"
                                alt="Logo Poltekkes Maluku"
                            />
                        </div>

                        <div className="direktur-brand-copy">

                            <div className="direktur-brand-title">
                                SIMAP
                            </div>

                            <div className="direktur-brand-subtitle">
                                Poltekkes Maluku
                            </div>

                        </div>

                    </a>

                    <div className="direktur-header-user">

                        <div className="direktur-user-copy">

                            <div className="direktur-user-name">
                                {userName}
                            </div>

                            <div className="direktur-user-role">
                                Direktur
                            </div>

                        </div>

                        <div className="direktur-avatar">
                            {userInitial}
                        </div>

                        <form
                            method="POST"
                            action="/logout"
                            onSubmit={handleLogout}
                            style={{
                                margin: 0,
                            }}
                        >

                            <input
                                type="hidden"
                                name="_token"
                                value={csrfToken}
                            />

                            <button
                                type="submit"
                                className="direktur-logout"
                                title="Keluar dari SIMAP"
                            >

                                <Icon
                                    name="logout"
                                    size={15}
                                />

                                <span className="direktur-logout-text">
                                    Keluar
                                </span>

                            </button>

                        </form>

                    </div>

                </header>


                <div className="direktur-shell">

                    {/* =================================================
                        SIDEBAR
                    ================================================= */}

                    <aside className="direktur-sidebar">

                        <div className="direktur-side-label">
                            Menu Utama
                        </div>

                        <nav className="direktur-nav">

                            <a
                                href="/direktur/dashboard"
                                className="direktur-nav-link active"
                            >

                                <Icon
                                    name="home"
                                    size={16}
                                />

                                Dashboard

                            </a>

                            <a
                                href="/direktur/agenda"
                                className="direktur-nav-link"
                            >

                                <Icon
                                    name="calendar"
                                    size={16}
                                />

                                Agenda Direktur

                            </a>

                        </nav>


                        <div
                            className="direktur-side-label"
                            style={{
                                marginTop:
                                    '25px',
                            }}
                        >
                            Informasi
                        </div>

                        <div className="direktur-info-card">

                            <div className="direktur-info-card-top">

                                <Icon
                                    name="calendar"
                                    size={15}
                                />

                                Agenda Direktur

                            </div>

                            <div className="direktur-info-card-text">

                                Agenda disiapkan dan
                                dikelola oleh Sekretaris
                                Direktur. Direktur dapat
                                melihat informasi dan
                                membuka detail agenda.

                            </div>

                        </div>

                    </aside>


                    {/* =================================================
                        MAIN
                    ================================================= */}

                    <main className="direktur-main">

                        <div className="direktur-container">

                            {/* =================================================
                                WELCOME
                            ================================================= */}

                            <section className="direktur-welcome">

                                <div className="direktur-welcome-circle-1" />
                                <div className="direktur-welcome-circle-2" />

                                <div className="direktur-welcome-content">

                                    <div className="direktur-welcome-badge">

                                        <Icon
                                            name="calendar"
                                            size={12}
                                        />

                                        Dashboard Direktur

                                    </div>

                                    <h1 className="direktur-welcome-title">
                                        Selamat datang, {userName}
                                    </h1>

                                    <div className="direktur-welcome-date">
                                        {todayLabel} · WIT
                                    </div>

                                    <p className="direktur-welcome-text">
                                        Pantau agenda kegiatan
                                        Direktur yang telah
                                        disiapkan oleh Sekretaris
                                        Direktur. Pilih agenda
                                        untuk melihat informasi
                                        lengkapnya.
                                    </p>

                                </div>

                            </section>


                            {/* =================================================
                                SUMMARY
                            ================================================= */}

                            <section className="direktur-summary">

                                <SummaryCard
                                    type="total"
                                    label="Total Agenda"
                                    value={totalAgenda}
                                    description="Seluruh agenda dalam sistem"
                                />

                                <SummaryCard
                                    type="today"
                                    label="Agenda Hari Ini"
                                    value={agendaHariIniCount}
                                    description="Kegiatan yang dijadwalkan hari ini"
                                />

                                <SummaryCard
                                    type="upcoming"
                                    label="Agenda Mendatang"
                                    value={agendaMendatang}
                                    description="Kegiatan setelah hari ini"
                                />

                            </section>


                            {/* =================================================
                                CONTENT
                            ================================================= */}

                            <div className="direktur-content-grid">

                                {/* =========================================
                                    LEFT
                                ========================================= */}

                                <section className="direktur-panel">

                                    <div className="direktur-panel-header">

                                        <div>

                                            <div className="direktur-panel-title">
                                                Agenda Hari Ini
                                            </div>

                                            <div className="direktur-panel-subtitle">
                                                Jadwal kegiatan Direktur
                                                yang berlangsung hari ini.
                                            </div>

                                        </div>

                                        <div className="direktur-pill">
                                            {agendaHariIniCount} agenda
                                        </div>

                                    </div>


                                    {sortedAgendaHariIni.length === 0 ? (

                                        <div className="direktur-empty">

                                            <div className="direktur-empty-icon">

                                                <Icon
                                                    name="calendar"
                                                    size={25}
                                                />

                                            </div>

                                            <div className="direktur-empty-title">
                                                Tidak ada agenda hari ini
                                            </div>

                                            <div className="direktur-empty-text">
                                                Belum ada kegiatan
                                                yang dijadwalkan.
                                            </div>

                                            <a
                                                href="/direktur/agenda"
                                                className="direktur-all-button"
                                            >
                                                Lihat Semua Agenda

                                                <Icon
                                                    name="arrow"
                                                    size={13}
                                                />

                                            </a>

                                        </div>

                                    ) : (

                                        <div className="direktur-agenda-list">

                                            {sortedAgendaHariIni
                                                .slice(0, 10)
                                                .map(
                                                    (item) => {

                                                        const startTime =
                                                            formatTime(
                                                                item?.waktu_mulai
                                                            );

                                                        const endTime =
                                                            item?.waktu_selesai
                                                                ? formatTime(
                                                                      item.waktu_selesai
                                                                  )
                                                                : null;

                                                        const sourceText =
                                                            item?.surat_masuk
                                                                ?.nomor_surat
                                                                ? `Surat ${item.surat_masuk.nomor_surat}`
                                                                : 'Agenda manual';

                                                        const sourceClass =
                                                            item?.surat_masuk
                                                                ?.nomor_surat
                                                                ? 'surat'
                                                                : 'manual';

                                                        return (
                                                            <a
                                                                key={
                                                                    item.id
                                                                }
                                                                href={`/direktur/agenda/${item.id}`}
                                                                className="direktur-agenda-row"
                                                            >

                                                                <div className="direktur-agenda-time">

                                                                    <div className="direktur-agenda-time-main">
                                                                        {startTime}
                                                                    </div>

                                                                    {endTime && (
                                                                        <div className="direktur-agenda-time-end">
                                                                            s/d {endTime}
                                                                        </div>
                                                                    )}

                                                                    <div className="direktur-agenda-time-zone">
                                                                        WIT
                                                                    </div>

                                                                </div>


                                                                <div className="direktur-agenda-card">

                                                                    <div className="direktur-agenda-title-line">

                                                                        <div className="direktur-agenda-title">
                                                                            {item.judul ||
                                                                                'Tanpa judul'}
                                                                        </div>

                                                                        <span className="direktur-agenda-type">
                                                                            {item.jenis ||
                                                                                'Agenda'}
                                                                        </span>

                                                                    </div>


                                                                    <div className="direktur-agenda-meta">

                                                                        <Icon
                                                                            name="location"
                                                                            size={12}
                                                                        />

                                                                        <span>
                                                                            {item.lokasi ||
                                                                                'Lokasi belum ditentukan'}
                                                                        </span>

                                                                    </div>


                                                                    <div
                                                                        className={`direktur-agenda-source ${sourceClass}`}
                                                                    >

                                                                        <Icon
                                                                            name={
                                                                                sourceClass ===
                                                                                'surat'
                                                                                    ? 'file'
                                                                                    : 'calendar'
                                                                            }
                                                                            size={11}
                                                                        />

                                                                        {sourceText}

                                                                    </div>

                                                                </div>


                                                                <div className="direktur-agenda-arrow">

                                                                    <Icon
                                                                        name="arrowUpRight"
                                                                        size={15}
                                                                    />

                                                                </div>

                                                            </a>
                                                        );
                                                    }
                                                )}

                                        </div>

                                    )}


                                    {agendaHariIniCount > 0 && (
                                        <div className="direktur-panel-footer">

                                            <a
                                                href="/direktur/agenda"
                                                className="direktur-all-button"
                                            >

                                                Lihat Semua Agenda

                                                <Icon
                                                    name="arrow"
                                                    size={13}
                                                />

                                            </a>

                                        </div>
                                    )}

                                </section>


                                {/* =========================================
                                    RIGHT
                                ========================================= */}

                                <aside className="direktur-panel">

                                    <div className="direktur-panel-header">

                                        <div>

                                            <div className="direktur-panel-title">
                                                Ringkasan Hari Ini
                                            </div>

                                            <div className="direktur-panel-subtitle">
                                                Informasi singkat agenda
                                                Direktur.
                                            </div>

                                        </div>

                                    </div>


                                    <div className="direktur-side-content">

                                        <div className="direktur-today-box">

                                            <div className="direktur-side-heading">

                                                <Icon
                                                    name="calendar"
                                                    size={15}
                                                />

                                                Hari Ini

                                            </div>

                                            <div className="direktur-side-date">
                                                {todayLabel}
                                            </div>

                                            <div className="direktur-side-count">
                                                {agendaHariIniCount}
                                                {' '}
                                                agenda terjadwal
                                            </div>

                                        </div>


                                        <div className="direktur-types">

                                            <div className="direktur-types-title">
                                                Komposisi Agenda
                                            </div>

                                            {jenisCount.length === 0 ? (

                                                <div
                                                    style={{
                                                        marginTop:
                                                            '8px',
                                                        color:
                                                            '#94a3b8',
                                                        fontSize:
                                                            '9px',
                                                    }}
                                                >
                                                    Belum ada agenda hari
                                                    ini.
                                                </div>

                                            ) : (

                                                jenisCount.map(
                                                    ([jenis, jumlah]) => (
                                                        <div
                                                            key={
                                                                jenis
                                                            }
                                                            className="direktur-type-row"
                                                        >

                                                            <div className="direktur-type-left">

                                                                <span className="direktur-type-dot" />

                                                                <span className="direktur-type-name">
                                                                    {jenis}
                                                                </span>

                                                            </div>

                                                            <span className="direktur-type-count">
                                                                {jumlah}
                                                            </span>

                                                        </div>
                                                    )
                                                )

                                            )}

                                        </div>


                                        <div className="direktur-access-box">

                                            <div className="direktur-access-title">

                                                <Icon
                                                    name="check"
                                                    size={15}
                                                />

                                                Akses Direktur

                                            </div>

                                            <div className="direktur-access-text">
                                                Direktur dapat
                                                melihat agenda dan
                                                membuka detail,
                                                tanpa mengubah atau
                                                menghapus data.
                                            </div>

                                        </div>


                                        <a
                                            href="/direktur/agenda"
                                            className="direktur-all-button"
                                            style={{
                                                width:
                                                    '100%',
                                                marginTop:
                                                    '11px',
                                            }}
                                        >

                                            Buka Agenda Direktur

                                            <Icon
                                                name="arrow"
                                                size={13}
                                            />

                                        </a>

                                    </div>

                                </aside>

                            </div>


                            <div className="direktur-footer">
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
// SUMMARY CARD
// =====================================================

function SummaryCard({
    type,
    label,
    value,
    description,
}) {
    return (
        <div
            className={`direktur-summary-card ${type}`}
        >

            <div className="direktur-summary-top">

                <div>

                    <div className="direktur-summary-label">
                        {label}
                    </div>

                    <div className="direktur-summary-value">
                        {value}
                    </div>

                    <div className="direktur-summary-description">
                        {description}
                    </div>

                </div>

                <div className="direktur-summary-icon">

                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >

                        <rect
                            x="3"
                            y="4.5"
                            width="18"
                            height="16"
                            rx="2.5"
                        />

                        <path d="M16 2.5v4M8 2.5v4M3 9h18" />

                    </svg>

                </div>

            </div>

        </div>
    );
}