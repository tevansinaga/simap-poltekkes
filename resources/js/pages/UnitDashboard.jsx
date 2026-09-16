import React, { useMemo } from 'react';

export default function UnitDashboard({
    user,
    unit,
    stats,
    disposisiTerbaru,
}) {
    // =====================================================
    // SAFE DATA
    // =====================================================

    const safeStats = stats || {};

    const safeDisposisi = Array.isArray(
        disposisiTerbaru
    )
        ? disposisiTerbaru
        : [];

    // =====================================================
    // DATE HELPER
    // =====================================================

    const getDateKey = (value) => {
        if (!value) {
            return '';
        }

        const text =
            String(value).trim();

        const match =
            text.match(
                /^(\d{4})-(\d{2})-(\d{2})/
            );

        if (!match) {
            return '';
        }

        return `${match[1]}-${match[2]}-${match[3]}`;
    };

    const formatTanggal = (value) => {
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

        if (
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > 31
        ) {
            return dateKey;
        }

        return `${String(day).padStart(2, '0')} ${
            months[month - 1]
        } ${year}`;
    };

    const todayWIT = useMemo(() => {
        return new Intl.DateTimeFormat(
            'en-CA',
            {
                timeZone:
                    'Asia/Jayapura',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }
        ).format(new Date());
    }, []);

    // =====================================================
    // STATUS
    // =====================================================

    const getStatusLabel = (
        status
    ) => {
        if (
            status ===
            'terkirim'
        ) {
            return 'Terkirim';
        }

        if (
            status ===
            'in_progress'
        ) {
            return 'Dalam Proses';
        }

        if (
            status ===
            'selesai'
        ) {
            return 'Selesai';
        }

        return status || '-';
    };

    const getStatusStyle = (
        status
    ) => {
        if (
            status ===
            'selesai'
        ) {
            return {
                background:
                    '#ecfdf5',
                color:
                    '#047857',
                border:
                    '#a7f3d0',
            };
        }

        if (
            status ===
            'in_progress'
        ) {
            return {
                background:
                    '#eff6ff',
                color:
                    '#1d4ed8',
                border:
                    '#bfdbfe',
            };
        }

        return {
            background:
                '#fffbeb',
            color:
                '#b45309',
            border:
                '#fde68a',
        };
    };

    // =====================================================
    // DEADLINE
    // =====================================================

    const isTerlambat = (
        item
    ) => {
        if (
            !item?.batas_waktu ||
            item?.status ===
                'selesai'
        ) {
            return false;
        }

        const deadline =
            getDateKey(
                item.batas_waktu
            );

        if (!deadline) {
            return false;
        }

        return deadline < todayWIT;
    };

    const isJatuhTempoHariIni = (
        item
    ) => {
        if (
            !item?.batas_waktu ||
            item?.status ===
                'selesai'
        ) {
            return false;
        }

        const deadline =
            getDateKey(
                item.batas_waktu
            );

        if (!deadline) {
            return false;
        }

        return deadline === todayWIT;
    };

    // =====================================================
    // DERIVED DATA
    // =====================================================

    const jumlahTerlambat =
        safeDisposisi.filter(
            (item) =>
                isTerlambat(item)
        ).length;

    const jumlahHariIni =
        safeDisposisi.filter(
            (item) =>
                isJatuhTempoHariIni(
                    item
                )
        ).length;

    const jumlahPesan =
        safeDisposisi.reduce(
            (total, item) => {
                const list =
                    Array.isArray(
                        item?.pesans
                    )
                        ? item.pesans
                        : [];

                return (
                    total +
                    list.length
                );
            },
            0
        );

    const prioritasDisposisi =
    useMemo(() => {
        return safeDisposisi
            .filter(
                (item) =>
                    item?.status !==
                    'selesai'
            )
            .sort((a, b) => {
                const aLate =
                    isTerlambat(a)
                        ? 0
                        : 1;

                const bLate =
                    isTerlambat(b)
                        ? 0
                        : 1;

                if (
                    aLate !==
                    bLate
                ) {
                    return (
                        aLate -
                        bLate
                    );
                }

                const aDate =
                    getDateKey(
                        a?.batas_waktu
                    ) ||
                    '9999-12-31';

                const bDate =
                    getDateKey(
                        b?.batas_waktu
                    ) ||
                    '9999-12-31';

                return aDate.localeCompare(
                    bDate
                );
            })
            .slice(0, 5);
    }, [
        safeDisposisi,
    ]);

    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {
        const form =
            document.createElement(
                'form'
            );

        form.method =
            'POST';

        form.action =
            '/logout';

        const csrf =
            document.querySelector(
                'meta[name="csrf-token"]'
            );

        if (csrf) {
            const input =
                document.createElement(
                    'input'
                );

            input.type =
                'hidden';

            input.name =
                '_token';

            input.value =
                csrf.content;

            form.appendChild(
                input
            );
        }

        document.body.appendChild(
            form
        );

        form.submit();
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
            viewBox:
                '0 0 24 24',
            fill: 'none',
            stroke:
                'currentColor',
            strokeWidth: 1.8,
            strokeLinecap:
                'round',
            strokeLinejoin:
                'round',
        };

        const icons = {
            inbox: (
                <>
                    <path d="M4 5h16v14H4z" />
                    <path d="M4 14h4l2 3h4l2-3h4" />
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

            message: (
                <>
                    <path d="M4 5h16v11H8l-4 4z" />
                </>
            ),

            arrowRight: (
                <>
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
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

            logout: (
                <>
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M21 4v16" />
                </>
            ),

            paperclip: (
                <>
                    <path d="m21.4 11.6-8.9 8.9a6 6 0 0 1-8.5-8.5l9.1-9.1a4 4 0 0 1 5.7 5.7l-9.1 9.1a2 2 0 1 1-2.8-2.8l8.5-8.5" />
                </>
            ),
        };

        return (
            <svg {...common}>
                {
                    icons[
                        name
                    ]
                }
            </svg>
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="unit-dashboard">

            <style>{`
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                }

                .unit-dashboard {
                    min-height: 100vh;
                    background:
                        radial-gradient(
                            circle at top left,
                            rgba(16,185,129,.05),
                            transparent 25%
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

                .ud-page {
                    max-width: 1350px;
                    margin: 0 auto;
                    padding: 28px 25px 50px;
                }

                /* =================================================
                   HEADER
                ================================================= */

                .ud-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 25px;
                    margin-bottom: 24px;
                }

                .ud-brand {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                }

                .ud-brand-icon {
                    width: 46px;
                    height: 46px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 13px;
                    background:
                        linear-gradient(
                            135deg,
                            #059669,
                            #0f766e
                        );
                    color: #ffffff;
                    box-shadow:
                        0 8px 18px
                        rgba(5,150,105,.16);
                }

                .ud-brand-name {
                    color: #0f2747;
                    font-size: 16px;
                    font-weight: 850;
                    letter-spacing: -.1px;
                }

                .ud-brand-role {
                    margin-top: 3px;
                    color: #64748b;
                    font-size: 11px;
                }

                .ud-header-actions {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                }

                .ud-header-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    padding:
                        10px 13px;
                    border-radius: 10px;
                    font-size: 11px;
                    font-weight: 800;
                    text-decoration: none;
                }

                .ud-header-primary {
                    background: #059669;
                    color: #ffffff;
                }

                .ud-header-primary:hover {
                    background: #047857;
                }

                .ud-header-secondary {
                    border:
                        1px solid #e2e8f0;
                    background: #ffffff;
                    color: #475569;
                    cursor: pointer;
                }

                .ud-header-secondary:hover {
                    background: #f8fafc;
                }

                /* =================================================
                   HERO
                ================================================= */

                .ud-hero {
                    display: grid;
                    grid-template-columns:
                        minmax(0, 1.45fr)
                        minmax(300px, .75fr);
                    gap: 18px;
                    margin-bottom: 20px;
                }

                .ud-hero-main {
                    position: relative;
                    overflow: hidden;
                    padding: 28px;
                    border-radius: 20px;
                    background:
                        linear-gradient(
                            135deg,
                            #ecfdf5 0%,
                            #f0fdf4 48%,
                            #eff6ff 100%
                        );
                    border:
                        1px solid #d1fae5;
                }

                .ud-hero-main::after {
                    content: "";
                    position: absolute;
                    width: 240px;
                    height: 240px;
                    right: -100px;
                    top: -120px;
                    border-radius: 50%;
                    background:
                        rgba(16,185,129,.06);
                }

                .ud-hero-kicker {
                    position: relative;
                    z-index: 1;
                    color: #059669;
                    font-size: 11px;
                    font-weight: 850;
                    letter-spacing: .7px;
                    text-transform: uppercase;
                }

                .ud-hero-title {
                    position: relative;
                    z-index: 1;
                    margin:
                        8px 0 0;
                    color: #064e3b;
                    font-size: 28px;
                    line-height: 1.2;
                    font-weight: 850;
                    letter-spacing: -.5px;
                }

                .ud-hero-text {
                    position: relative;
                    z-index: 1;
                    max-width: 720px;
                    margin:
                        9px 0 0;
                    color: #475569;
                    font-size: 13px;
                    line-height: 1.7;
                }

                .ud-unit-chip {
                    position: relative;
                    z-index: 1;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 17px;
                    padding:
                        8px 11px;
                    border:
                        1px solid #a7f3d0;
                    border-radius: 10px;
                    background: rgba(255,255,255,.72);
                    color: #065f46;
                    font-size: 11px;
                    font-weight: 800;
                }

                .ud-unit-code {
                    color: #64748b;
                    font-weight: 700;
                }

                .ud-hero-side {
                    padding: 23px;
                    border-radius: 20px;
                    border:
                        1px solid #e2e8f0;
                    background: #ffffff;
                    box-shadow:
                        0 6px 20px
                        rgba(15,23,42,.022);
                }

                .ud-side-label {
                    color: #94a3b8;
                    font-size: 10px;
                    font-weight: 850;
                    letter-spacing: .6px;
                    text-transform: uppercase;
                }

                .ud-side-title {
                    margin-top: 7px;
                    color: #0f2747;
                    font-size: 17px;
                    font-weight: 850;
                }

                .ud-side-text {
                    margin-top: 5px;
                    color: #64748b;
                    font-size: 11px;
                    line-height: 1.6;
                }

                .ud-side-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    padding-top: 13px;
                    margin-top: 13px;
                    border-top:
                        1px solid #edf1f5;
                }

                .ud-side-row-label {
                    color: #64748b;
                    font-size: 10px;
                }

                .ud-side-row-value {
                    color: #0f2747;
                    font-size: 15px;
                    font-weight: 850;
                }

                /* =================================================
                   STATISTICS
                ================================================= */

                .ud-stats {
                    display: grid;
                    grid-template-columns:
                        repeat(4, minmax(0, 1fr));
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .ud-stat {
                    padding: 20px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 16px;
                    box-shadow:
                        0 5px 18px
                        rgba(15,23,42,.02);
                }

                .ud-stat-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                }

                .ud-stat-icon {
                    width: 38px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                }

                .ud-stat-label {
                    color: #64748b;
                    font-size: 11px;
                    font-weight: 700;
                }

                .ud-stat-number {
                    margin-top: 11px;
                    color: #0f172a;
                    font-size: 29px;
                    line-height: 1;
                    font-weight: 850;
                }

                .ud-stat-sub {
                    margin-top: 8px;
                    color: #94a3b8;
                    font-size: 9px;
                }

                /* =================================================
                   ALERT STRIP
                ================================================= */

                .ud-attention {
                    display: grid;
                    grid-template-columns:
                        repeat(3, minmax(0,1fr));
                    gap: 14px;
                    margin-bottom: 20px;
                }

                .ud-attention-card {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding:
                        15px 16px;
                    border-radius: 13px;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                }

                .ud-attention-icon {
                    width: 34px;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    border-radius: 9px;
                }

                .ud-attention-label {
                    color: #64748b;
                    font-size: 10px;
                }

                .ud-attention-value {
                    margin-top: 2px;
                    color: #0f2747;
                    font-size: 15px;
                    font-weight: 850;
                }

                /* =================================================
                   MAIN CONTENT
                ================================================= */

                .ud-content-grid {
                    display: grid;
                    grid-template-columns:
                        minmax(0, 1.35fr)
                        minmax(300px, .65fr);
                    gap: 18px;
                }

                .ud-panel {
                    overflow: hidden;
                    background: #ffffff;
                    border:
                        1px solid #e2e8f0;
                    border-radius: 18px;
                    box-shadow:
                        0 6px 20px
                        rgba(15,23,42,.022);
                }

                .ud-panel-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    padding:
                        19px 20px;
                    border-bottom:
                        1px solid #edf1f5;
                }

                .ud-panel-title {
                    color: #0f2747;
                    font-size: 15px;
                    font-weight: 850;
                }

                .ud-panel-subtitle {
                    margin-top: 4px;
                    color: #94a3b8;
                    font-size: 10px;
                    line-height: 1.5;
                }

                .ud-panel-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    color: #059669;
                    font-size: 10px;
                    font-weight: 850;
                    text-decoration: none;
                    white-space: nowrap;
                }

                .ud-panel-link:hover {
                    color: #047857;
                }

                /* =================================================
                   LIST
                ================================================= */

                .ud-list-empty {
                    padding:
                        55px 25px;
                    text-align: center;
                }

                .ud-list-empty-icon {
                    width: 48px;
                    height: 48px;
                    margin: 0 auto 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 13px;
                    background: #f0fdf4;
                    color: #059669;
                }

                .ud-list-empty-title {
                    color: #334155;
                    font-size: 13px;
                    font-weight: 800;
                }

                .ud-list-empty-text {
                    margin-top: 4px;
                    color: #94a3b8;
                    font-size: 10px;
                }

                .ud-item {
                    display: block;
                    padding:
                        17px 20px;
                    border-bottom:
                        1px solid #f1f5f9;
                    color: inherit;
                    text-decoration: none;
                    transition:
                        background .16s ease;
                }

                .ud-item:last-child {
                    border-bottom: 0;
                }

                .ud-item:hover {
                    background: #f8fafc;
                }

                .ud-item-main {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 16px;
                }

                .ud-item-content {
                    min-width: 0;
                    flex: 1;
                }

                .ud-item-title {
                    color: #0f2747;
                    font-size: 13px;
                    line-height: 1.5;
                    font-weight: 800;
                }

                .ud-item-number {
                    margin-top: 3px;
                    color: #94a3b8;
                    font-size: 10px;
                }

                .ud-item-meta {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 8px;
                    margin-top: 9px;
                }

                .ud-meta-item {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    color: #64748b;
                    font-size: 9px;
                }

                .ud-meta-dot {
                    width: 3px;
                    height: 3px;
                    border-radius: 50%;
                    background: #cbd5e1;
                }

                .ud-status-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    flex-shrink: 0;
                    padding:
                        6px 8px;
                    border-radius: 999px;
                    border:
                        1px solid transparent;
                    font-size: 9px;
                    font-weight: 850;
                }

                .ud-deadline {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    margin-top: 9px;
                    padding:
                        5px 7px;
                    border-radius: 7px;
                    font-size: 9px;
                    font-weight: 750;
                }

                .ud-message-count {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    color: #64748b;
                    font-size: 9px;
                    font-weight: 700;
                }

                /* =================================================
                   PRIORITY PANEL
                ================================================= */

                .ud-priority-list {
                    padding: 5px 0;
                }

                .ud-priority-item {
                    display: block;
                    padding:
                        14px 18px;
                    color: inherit;
                    text-decoration: none;
                    border-bottom:
                        1px solid #f1f5f9;
                }

                .ud-priority-item:last-child {
                    border-bottom: 0;
                }

                .ud-priority-item:hover {
                    background: #f8fafc;
                }

                .ud-priority-top {
                    display: flex;
                    align-items: flex-start;
                    gap: 9px;
                }

                .ud-priority-icon {
                    width: 30px;
                    height: 30px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    background: #fff7ed;
                    color: #ea580c;
                }

                .ud-priority-title {
                    color: #334155;
                    font-size: 11px;
                    line-height: 1.5;
                    font-weight: 800;
                }

                .ud-priority-date {
                    margin-top: 3px;
                    color: #94a3b8;
                    font-size: 9px;
                }

                .ud-side-empty {
                    padding:
                        30px 18px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 10px;
                }

                /* =================================================
                   FOOTER
                ================================================= */

                .ud-footer {
                    padding:
                        26px 0 8px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 10px;
                }

                /* =================================================
                   RESPONSIVE
                ================================================= */

                @media (max-width: 1100px) {
                    .ud-hero,
                    .ud-content-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 900px) {
                    .ud-stats {
                        grid-template-columns:
                            repeat(2,minmax(0,1fr));
                    }

                    .ud-attention {
                        grid-template-columns:
                            1fr;
                    }
                }

                @media (max-width: 700px) {
                    .ud-page {
                        padding:
                            20px 15px 40px;
                    }

                    .ud-header {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .ud-header-actions {
                        width: 100%;
                    }

                    .ud-header-button {
                        flex: 1;
                    }

                    .ud-hero-title {
                        font-size: 24px;
                    }

                    .ud-item-main {
                        flex-direction: column;
                    }

                    .ud-status-pill {
                        align-self: flex-start;
                    }
                }

                @media (max-width: 520px) {
                    .ud-stats {
                        grid-template-columns:
                            1fr;
                    }

                    .ud-header-actions {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .ud-header-button {
                        width: 100%;
                    }

                    .ud-hero-main,
                    .ud-hero-side {
                        padding: 20px;
                    }

                    .ud-panel-header {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .ud-panel-link {
                        align-self: flex-start;
                    }
                }
            `}</style>

            <main className="ud-page">

                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="ud-header">

                    <div className="ud-brand">

                        <div className="ud-brand-icon">
                            <Icon
                                name="building"
                                size={21}
                            />
                        </div>

                        <div>

                            <div className="ud-brand-name">
                                SIMAP Poltekkes Maluku
                            </div>

                            <div className="ud-brand-role">
                                Dashboard Unit
                            </div>

                        </div>

                    </div>

                    <div className="ud-header-actions">

                        <a
                            href="/unit/disposisi"
                            className="
                                ud-header-button
                                ud-header-primary
                            "
                        >
                            <Icon
                                name="inbox"
                                size={14}
                            />

                            Lihat Disposisi
                        </a>

                        <button
                            type="button"
                            onClick={
                                logout
                            }
                            className="
                                ud-header-button
                                ud-header-secondary
                            "
                        >
                            <Icon
                                name="logout"
                                size={14}
                            />

                            Keluar
                        </button>

                    </div>

                </header>

                {/* =================================================
                    HERO
                ================================================= */}

                <section className="ud-hero">

                    <div className="ud-hero-main">

                        <div className="ud-hero-kicker">
                            Selamat Datang
                        </div>

                        <h1 className="ud-hero-title">
                            {user?.name ||
                                'Pengguna'}
                        </h1>

                        <p className="ud-hero-text">
                            Pantau surat masuk,
                            disposisi,
                            percakapan tindak
                            lanjut, dan pekerjaan
                            unit Anda dari satu
                            tempat.
                        </p>

                        <div className="ud-unit-chip">

                            <Icon
                                name="building"
                                size={13}
                            />

                            <span>
                                {unit?.name ||
                                    'Unit belum ditentukan'}
                            </span>

                            {unit?.code && (
                                <>
                                    <span>
                                        •
                                    </span>

                                    <span className="ud-unit-code">
                                        {unit.code}
                                    </span>
                                </>
                            )}

                        </div>

                    </div>

                    <div className="ud-hero-side">

                        <div className="ud-side-label">
                            Kondisi Unit
                        </div>

                        <div className="ud-side-title">
                            Ringkasan pekerjaan
                        </div>

                        <div className="ud-side-text">
                            Gunakan daftar
                            disposisi untuk
                            melihat detail,
                            membalas pesan, dan
                            melampirkan dokumen.
                        </div>

                        <div className="ud-side-row">

                            <span className="ud-side-row-label">
                                Total tugas
                            </span>

                            <span className="ud-side-row-value">
                                {safeStats.total ||
                                    0}
                            </span>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    STATS
                ================================================= */}

                <section className="ud-stats">

                    <StatCard
                        label="Total Disposisi"
                        value={
                            safeStats.total ||
                            0
                        }
                        description="Seluruh disposisi unit"
                        icon="inbox"
                        background="#eff6ff"
                        color="#2563eb"
                    />

                    <StatCard
                        label="Belum Diproses"
                        value={
                            safeStats.terkirim ||
                            0
                        }
                        description="Menunggu mulai dikerjakan"
                        icon="clock"
                        background="#fffbeb"
                        color="#d97706"
                    />

                    <StatCard
                        label="Dalam Proses"
                        value={
                            safeStats.in_progress ||
                            0
                        }
                        description="Sedang ditindaklanjuti"
                        icon="clock"
                        background="#eff6ff"
                        color="#2563eb"
                    />

                    <StatCard
                        label="Selesai"
                        value={
                            safeStats.selesai ||
                            0
                        }
                        description="Sudah dituntaskan"
                        icon="check"
                        background="#ecfdf5"
                        color="#059669"
                    />

                </section>

                {/* =================================================
                    ATTENTION
                ================================================= */}

                <section className="ud-attention">

                    <AttentionCard
                        icon="alert"
                        label="Disposisi Terlambat"
                        value={
                            jumlahTerlambat
                        }
                        background="#fef2f2"
                        color="#dc2626"
                    />

                    <AttentionCard
                        icon="calendar"
                        label="Jatuh Tempo Hari Ini"
                        value={
                            jumlahHariIni
                        }
                        background="#fff7ed"
                        color="#ea580c"
                    />

                    <AttentionCard
                        icon="message"
                        label="Pesan di Disposisi Terbaru"
                        value={
                            jumlahPesan
                        }
                        background="#eff6ff"
                        color="#2563eb"
                    />

                </section>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="ud-content-grid">

                    {/* =================================================
                        DISPOSISI TERBARU
                    ================================================= */}

                    <section className="ud-panel">

                        <div className="ud-panel-header">

                            <div>

                                <div className="ud-panel-title">
                                    Disposisi Terbaru
                                </div>

                                <div className="ud-panel-subtitle">
                                    Daftar disposisi yang
                                    masuk ke unit Anda.
                                </div>

                            </div>

                            <a
                                href="/unit/disposisi"
                                className="ud-panel-link"
                            >
                                Lihat semua
                                <Icon
                                    name="arrowRight"
                                    size={12}
                                />
                            </a>

                        </div>

                        {safeDisposisi.length ===
                        0 ? (

                            <div className="ud-list-empty">

                                <div className="ud-list-empty-icon">
                                    <Icon
                                        name="inbox"
                                        size={22}
                                    />
                                </div>

                                <div className="ud-list-empty-title">
                                    Belum ada disposisi
                                </div>

                                <div className="ud-list-empty-text">
                                    Belum ada disposisi
                                    yang dikirim ke
                                    unit Anda.
                                </div>

                            </div>

                        ) : (

                            <div>

                                {safeDisposisi.map(
                                    (item) => {

                                        const style =
                                            getStatusStyle(
                                                item.status
                                            );

                                        const terlambatItem =
                                            isTerlambat(
                                                item
                                            );

                                        const jatuhTempo =
                                            isJatuhTempoHariIni(
                                                item
                                            );

                                        const messageCount =
                                            Array.isArray(
                                                item?.pesans
                                            )
                                                ? item.pesans
                                                    .length
                                                : 0;

                                        return (
                                            <a
                                                key={
                                                    item.id
                                                }
                                                href={`/unit/disposisi/${item.id}`}
                                                className="ud-item"
                                            >

                                                <div className="ud-item-main">

                                                    <div className="ud-item-content">

                                                        <div className="ud-item-title">

                                                            {
                                                                item
                                                                    ?.surat_masuk
                                                                    ?.perihal ||
                                                                'Tanpa perihal'
                                                            }

                                                        </div>

                                                        <div className="ud-item-number">

                                                            Nomor surat:{' '}

                                                            {
                                                                item
                                                                    ?.surat_masuk
                                                                    ?.nomor_surat ||
                                                                '-'
                                                            }

                                                        </div>

                                                        <div className="ud-item-meta">

                                                            <span className="ud-meta-item">

                                                                <Icon
                                                                    name="user"
                                                                    size={10}
                                                                />

                                                                {
                                                                    item
                                                                        ?.dari_user
                                                                        ?.name ||
                                                                    '-'
                                                                }

                                                            </span>

                                                            <span className="ud-meta-dot" />

                                                            <span className="ud-meta-item">

                                                                <Icon
                                                                    name="calendar"
                                                                    size={10}
                                                                />

                                                                {
                                                                    formatTanggal(
                                                                        item.tanggal_disposisi
                                                                    )
                                                                }

                                                            </span>

                                                            {messageCount >
                                                                0 && (
                                                                <>
                                                                    <span className="ud-meta-dot" />

                                                                    <span className="ud-message-count">

                                                                        <Icon
                                                                            name="message"
                                                                            size={10}
                                                                        />

                                                                        {messageCount}{' '}
                                                                        pesan

                                                                    </span>
                                                                </>
                                                            )}

                                                        </div>

                                                        {item.batas_waktu && (
                                                            <div
                                                                className="ud-deadline"
                                                                style={{
                                                                    background:
                                                                        terlambatItem
                                                                            ? '#fef2f2'
                                                                            : jatuhTempo
                                                                            ? '#fff7ed'
                                                                            : '#f8fafc',
                                                                    color:
                                                                        terlambatItem
                                                                            ? '#dc2626'
                                                                            : jatuhTempo
                                                                            ? '#ea580c'
                                                                            : '#64748b',
                                                                }}
                                                            >

                                                                <Icon
                                                                    name={
                                                                        terlambatItem
                                                                            ? 'alert'
                                                                            : 'calendar'
                                                                    }
                                                                    size={10}
                                                                />

                                                                {terlambatItem
                                                                    ? `Terlambat · Batas ${formatTanggal(
                                                                          item.batas_waktu
                                                                      )}`
                                                                    : jatuhTempo
                                                                    ? 'Jatuh tempo hari ini'
                                                                    : `Batas ${formatTanggal(
                                                                          item.batas_waktu
                                                                      )}`}

                                                            </div>
                                                        )}

                                                    </div>

                                                    <span
                                                        className="ud-status-pill"
                                                        style={{
                                                            background:
                                                                style.background,
                                                            color:
                                                                style.color,
                                                            borderColor:
                                                                style.border,
                                                        }}
                                                    >

                                                        {getStatusLabel(
                                                            item.status
                                                        )}

                                                    </span>

                                                </div>

                                            </a>
                                        );
                                    }
                                )}

                            </div>

                        )}

                    </section>

                    {/* =================================================
                        PRIORITAS
                    ================================================= */}

                    <section className="ud-panel">

                        <div className="ud-panel-header">

                            <div>

                                <div className="ud-panel-title">
                                    Perlu Perhatian
                                </div>

                                <div className="ud-panel-subtitle">
                                    Disposisi yang sebaiknya
                                    segera ditindaklanjuti.
                                </div>

                            </div>

                        </div>

                        {prioritasDisposisi.length ===
                        0 ? (

                            <div className="ud-side-empty">

                                Tidak ada disposisi
                                yang perlu
                                diperhatikan saat ini.

                            </div>

                        ) : (

                            <div className="ud-priority-list">

                                {prioritasDisposisi.map(
                                    (item) => {

                                        const late =
                                            isTerlambat(
                                                item
                                            );

                                        return (
                                            <a
                                                key={
                                                    item.id
                                                }
                                                href={`/unit/disposisi/${item.id}`}
                                                className="ud-priority-item"
                                            >

                                                <div className="ud-priority-top">

                                                    <div
                                                        className="ud-priority-icon"
                                                        style={{
                                                            background:
                                                                late
                                                                    ? '#fef2f2'
                                                                    : '#fff7ed',
                                                            color:
                                                                late
                                                                    ? '#dc2626'
                                                                    : '#ea580c',
                                                        }}
                                                    >

                                                        <Icon
                                                            name={
                                                                late
                                                                    ? 'alert'
                                                                    : 'clock'
                                                            }
                                                            size={14}
                                                        />

                                                    </div>

                                                    <div>

                                                        <div className="ud-priority-title">

                                                            {
                                                                item
                                                                    ?.surat_masuk
                                                                    ?.perihal ||
                                                                'Tanpa perihal'
                                                            }

                                                        </div>

                                                        <div className="ud-priority-date">

                                                            {late
                                                                ? 'Sudah melewati batas waktu'
                                                                : item.batas_waktu
                                                                ? `Batas ${formatTanggal(
                                                                      item.batas_waktu
                                                                  )}`
                                                                : 'Belum ada batas waktu'}

                                                        </div>

                                                    </div>

                                                </div>

                                            </a>
                                        );
                                    }
                                )}

                            </div>

                        )}

                    </section>

                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="ud-footer">
                    SIMAP Poltekkes Maluku
                </div>

            </main>
        </div>
    );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
    label,
    value,
    description,
    icon,
    background,
    color,
}) {
    return (
        <div className="ud-stat">

            <div className="ud-stat-top">

                <div className="ud-stat-label">
                    {label}
                </div>

                <div
                    className="ud-stat-icon"
                    style={{
                        background,
                        color,
                    }}
                >
                    <StatIcon
                        name={icon}
                        size={17}
                    />
                </div>

            </div>

            <div
                className="ud-stat-number"
                style={{
                    color,
                }}
            >
                {value}
            </div>

            <div className="ud-stat-sub">
                {description}
            </div>

        </div>
    );
}


// =====================================================
// ATTENTION CARD
// =====================================================

function AttentionCard({
    icon,
    label,
    value,
    background,
    color,
}) {
    return (
        <div className="ud-attention-card">

            <div
                className="ud-attention-icon"
                style={{
                    background,
                    color,
                }}
            >
                <StatIcon
                    name={icon}
                    size={15}
                />
            </div>

            <div>

                <div className="ud-attention-label">
                    {label}
                </div>

                <div
                    className="ud-attention-value"
                    style={{
                        color,
                    }}
                >
                    {value}
                </div>

            </div>

        </div>
    );
}


// =====================================================
// STAT ICON
// =====================================================

function StatIcon({
    name,
    size = 18,
}) {
    const common = {
        width: size,
        height: size,
        viewBox:
            '0 0 24 24',
        fill: 'none',
        stroke:
            'currentColor',
        strokeWidth: 1.8,
        strokeLinecap:
            'round',
        strokeLinejoin:
            'round',
    };

    if (name === 'inbox') {
        return (
            <svg {...common}>
                <path d="M4 5h16v14H4z" />
                <path d="M4 14h4l2 3h4l2-3h4" />
            </svg>
        );
    }

    if (name === 'clock') {
        return (
            <svg {...common}>
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />
                <path d="M12 7v5l3 2" />
            </svg>
        );
    }

    if (name === 'check') {
        return (
            <svg {...common}>
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />
                <path d="m8.5 12 2.3 2.3 4.7-5" />
            </svg>
        );
    }

    if (name === 'alert') {
        return (
            <svg {...common}>
                <path d="M10.3 3.8 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
            </svg>
        );
    }

    if (name === 'calendar') {
        return (
            <svg {...common}>
                <rect
                    x="3"
                    y="4.5"
                    width="18"
                    height="16"
                    rx="2"
                />
                <path d="M16 2.5v4M8 2.5v4M3 9h18" />
            </svg>
        );
    }

    if (name === 'message') {
        return (
            <svg {...common}>
                <path d="M4 5h16v11H8l-4 4z" />
            </svg>
        );
    }

    return null;
}