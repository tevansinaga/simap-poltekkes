import React, { useMemo, useState } from 'react';

export default function SuperAdminAktivitas({
    user = null,
    activities = [],
    stats = {},
    filters = {},
    actionOptions = {},
    moduleOptions = {},
    pagination = {},
}) {
    const safeActivities = Array.isArray(activities) ? activities : [];

    const safeStats =
        stats && typeof stats === 'object'
            ? stats
            : {};

    const safeActions =
        actionOptions && typeof actionOptions === 'object'
            ? actionOptions
            : {};

    const safeModules =
        moduleOptions && typeof moduleOptions === 'object'
            ? moduleOptions
            : {};

    const [search, setSearch] = useState(filters?.search || '');
    const [action, setAction] = useState(filters?.action || '');
    const [module, setModule] = useState(filters?.module || '');
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');

    const userName = user?.name || 'Super Admin';
    const userRole = user?.role?.name || 'Super Admin';
    const userInitial =
        userName.trim().charAt(0).toUpperCase() || 'S';

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '';

    const actionLabel = (value) =>
        safeActions[value] || formatAction(value);

    const formatAction = (value) => {
        const labels = {
            login: 'Login',
            logout: 'Logout',
            create: 'Tambah',
            update: 'Perbarui',
            status: 'Ubah Status',
            delete: 'Hapus',
        };

        return labels[value] || value || '-';
    };

    const actionClass = (value) => {
        const classes = {
            login: 'activity-badge activity-badge-login',
            logout: 'activity-badge activity-badge-logout',
            create: 'activity-badge activity-badge-create',
            update: 'activity-badge activity-badge-update',
            status: 'activity-badge activity-badge-status',
            delete: 'activity-badge activity-badge-delete',
        };

        return classes[value] || 'activity-badge';
    };

    const formatDateTime = (value) => {
        if (!value) {
            return '-';
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const paginationLinks = useMemo(() => {
        const links = Array.isArray(pagination?.links)
            ? pagination.links
            : [];

        return links.filter((item) => item?.url);
    }, [pagination]);

    const buildQuery = () => {
        const params = new URLSearchParams();

        if (search.trim()) {
            params.set('search', search.trim());
        }

        if (action) {
            params.set('action', action);
        }

        if (module) {
            params.set('module', module);
        }

        if (dateFrom) {
            params.set('date_from', dateFrom);
        }

        if (dateTo) {
            params.set('date_to', dateTo);
        }

        const query = params.toString();

        return query ? `?${query}` : '';
    };

    const submitFilter = (event) => {
        event.preventDefault();

        window.location.href =
            `/super-admin/aktivitas${buildQuery()}`;
    };

    const resetFilter = () => {
        window.location.href =
            '/super-admin/aktivitas';
    };

    const openPagination = (url) => {
        if (url) {
            window.location.href = url;
        }
    };

    const handleLogout = (event) => {
        if (!window.confirm('Yakin ingin keluar dari SIMAP?')) {
            event.preventDefault();
        }
    };

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

                .activity-page {
                    min-height: 100vh;
                    background:
                        linear-gradient(
                            180deg,
                            #f8fafc 0%,
                            #f5f7fb 100%
                        );
                }

                /* =====================================================
                   TOP NAV
                ====================================================== */

                .activity-navbar {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    width: 100%;
                    background: rgba(255, 255, 255, .94);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border-bottom: 1px solid #e7edf4;
                    box-shadow:
                        0 4px 18px rgba(15, 23, 42, .035);
                }

                .activity-navbar-inner {
                    width: 100%;
                    max-width: 1480px;
                    min-height: 70px;
                    margin: 0 auto;
                    padding: 0 28px;
                    display: flex;
                    align-items: center;
                    gap: 24px;
                }

                .activity-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    flex-shrink: 0;
                }

                .activity-brand-logo {
                    width: 40px;
                    height: 40px;
                    display: grid;
                    place-items: center;
                    border-radius: 11px;
                    background: #eff6ff;
                    border: 1px solid #dbeafe;
                    overflow: hidden;
                }

                .activity-brand-logo img {
                    width: 28px;
                    height: 28px;
                    object-fit: contain;
                }

                .activity-brand-copy {
                    min-width: 0;
                }

                .activity-brand-title {
                    color: #10223d;
                    font-size: 15px;
                    font-weight: 850;
                    line-height: 1;
                    letter-spacing: .03em;
                }

                .activity-brand-subtitle {
                    margin-top: 4px;
                    color: #8492a7;
                    font-size: 9px;
                    line-height: 1;
                    white-space: nowrap;
                }

                .activity-nav {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                }

                .activity-nav-item {
                    min-height: 38px;
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding: 0 12px;
                    border-radius: 10px;
                    color: #68788e;
                    font-size: 10px;
                    font-weight: 750;
                    white-space: nowrap;
                    transition:
                        background .18s ease,
                        color .18s ease,
                        transform .18s ease;
                }

                .activity-nav-item:hover {
                    color: #1c5fd1;
                    background: #f2f6fc;
                }

                .activity-nav-item.active {
                    color: #fff;
                    background:
                        linear-gradient(
                            135deg,
                            #1768df 0%,
                            #1358c8 100%
                        );
                    box-shadow:
                        0 7px 17px rgba(21, 95, 209, .18);
                }

                .activity-nav-icon {
                    width: 19px;
                    height: 19px;
                    display: grid;
                    place-items: center;
                    border-radius: 6px;
                    flex-shrink: 0;
                }

                .activity-nav-item:not(.active) .activity-nav-icon {
                    background: #f1f5f9;
                }

                .activity-nav-item.active .activity-nav-icon {
                    background: rgba(255, 255, 255, .12);
                }

                /* =====================================================
                   NAV RIGHT / USER
                ====================================================== */

                .activity-nav-right {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    flex-shrink: 0;
                }

                .activity-user-box {
                    min-height: 42px;
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    padding: 4px 8px 4px 10px;
                    background: #f8fafc;
                    border: 1px solid #e6ebf2;
                    border-radius: 11px;
                }

                .activity-user-copy {
                    min-width: 0;
                    max-width: 115px;
                }

                .activity-user-name {
                    overflow: hidden;
                    color: #1a2c45;
                    font-size: 9px;
                    font-weight: 800;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .activity-user-role {
                    margin-top: 2px;
                    overflow: hidden;
                    color: #8996a8;
                    font-size: 7px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .activity-avatar {
                    width: 30px;
                    height: 30px;
                    display: grid;
                    place-items: center;
                    border-radius: 9px;
                    background: #eaf2ff;
                    color: #185fcf;
                    font-size: 10px;
                    font-weight: 850;
                    flex-shrink: 0;
                }

                .activity-logout-form {
                    margin: 0;
                    padding: 0;
                }

                .activity-logout {
                    min-height: 40px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    padding: 0 12px;
                    border: 1px solid #e3e9f1;
                    border-radius: 10px;
                    background: #fff;
                    color: #62738a;
                    font-size: 9px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: .18s ease;
                }

                .activity-logout:hover {
                    color: #c23f3f;
                    background: #fff7f7;
                    border-color: #f0d4d4;
                }

                /* =====================================================
                   MOBILE NAV
                ====================================================== */

                .activity-mobile-nav {
                    display: none;
                    overflow-x: auto;
                    border-top: 1px solid #edf1f5;
                    background: rgba(255, 255, 255, .96);
                    scrollbar-width: none;
                    -webkit-overflow-scrolling: touch;
                }

                .activity-mobile-nav::-webkit-scrollbar {
                    display: none;
                }

                .activity-mobile-nav-inner {
                    min-width: max-content;
                    display: flex;
                    gap: 5px;
                    padding: 8px 12px;
                }

                .activity-mobile-item {
                    min-height: 34px;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 0 10px;
                    border-radius: 9px;
                    color: #66768a;
                    font-size: 9px;
                    font-weight: 750;
                    white-space: nowrap;
                }

                .activity-mobile-item.active {
                    color: #145ecf;
                    background: #eef5ff;
                }

                /* =====================================================
                   MAIN
                ====================================================== */

                .activity-main {
                    width: 100%;
                }

                .activity-container {
                    width: 100%;
                    max-width: 1480px;
                    margin: 0 auto;
                    padding: 28px 28px 42px;
                }

                .activity-topbar {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 20px;
                    margin-bottom: 22px;
                }

                .activity-kicker {
                    color: #73839a;
                    font-size: 9px;
                    font-weight: 850;
                    letter-spacing: .14em;
                }

                .activity-title {
                    margin: 4px 0 0;
                    color: #102139;
                    font-size: 26px;
                    line-height: 1.15;
                    font-weight: 850;
                    letter-spacing: -.025em;
                }

                .activity-subtitle {
                    max-width: 700px;
                    margin: 7px 0 0;
                    color: #8190a4;
                    font-size: 11px;
                    line-height: 1.7;
                }

                .activity-page-user {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 10px 8px 12px;
                    background: #fff;
                    border: 1px solid #e4eaf1;
                    border-radius: 13px;
                    box-shadow: 0 5px 18px rgba(15, 23, 42, .025);
                }

                .activity-page-user-copy {
                    text-align: right;
                }

                .activity-page-user-name {
                    color: #172941;
                    font-size: 9px;
                    font-weight: 800;
                }

                .activity-page-user-role {
                    margin-top: 3px;
                    color: #8b98a9;
                    font-size: 7px;
                }

                /* =====================================================
                   STATS
                ====================================================== */

                .activity-stat-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(4, minmax(0, 1fr));
                    gap: 11px;
                    margin-bottom: 15px;
                }

                .activity-stat {
                    position: relative;
                    min-width: 0;
                    padding: 16px 17px;
                    overflow: hidden;
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 15px;
                    box-shadow:
                        0 7px 25px rgba(15, 23, 42, .035);
                }

                .activity-stat::after {
                    content: "";
                    position: absolute;
                    right: -18px;
                    bottom: -23px;
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: #f5f8fd;
                }

                .activity-stat-label {
                    color: #8391a5;
                    font-size: 9px;
                    font-weight: 760;
                }

                .activity-stat-value {
                    position: relative;
                    z-index: 1;
                    margin-top: 7px;
                    color: #132640;
                    font-size: 24px;
                    line-height: 1;
                    font-weight: 850;
                }

                .activity-stat-note {
                    margin-top: 7px;
                    color: #a3adba;
                    font-size: 8px;
                    line-height: 1.4;
                }

                /* =====================================================
                   CARD
                ====================================================== */

                .activity-card {
                    overflow: hidden;
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    box-shadow:
                        0 10px 30px rgba(15, 23, 42, .035);
                }

                .activity-card-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 15px;
                    padding: 17px 18px;
                    border-bottom: 1px solid #edf1f5;
                }

                .activity-card-title {
                    color: #162840;
                    font-size: 13px;
                    font-weight: 830;
                }

                .activity-card-description {
                    margin-top: 4px;
                    color: #8b98a9;
                    font-size: 9px;
                    line-height: 1.55;
                }

                .activity-count-pill {
                    min-height: 25px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 9px;
                    border-radius: 8px;
                    background: #f2f5fa;
                    color: #61738b;
                    font-size: 8px;
                    font-weight: 800;
                    white-space: nowrap;
                }

                /* =====================================================
                   FILTERS
                ====================================================== */

                .activity-filter {
                    display: grid;
                    grid-template-columns:
                        minmax(230px, 1.7fr)
                        minmax(130px, .75fr)
                        minmax(130px, .75fr)
                        minmax(128px, .65fr)
                        minmax(128px, .65fr)
                        auto
                        auto;
                    gap: 8px;
                    padding: 13px 17px;
                    background: #fbfcfe;
                    border-bottom: 1px solid #edf1f5;
                }

                .activity-input,
                .activity-select {
                    width: 100%;
                    height: 35px;
                    padding: 0 10px;
                    background: #fff;
                    border: 1px solid #dfe6ef;
                    border-radius: 9px;
                    outline: none;
                    color: #334860;
                    font-size: 9px;
                }

                .activity-input::placeholder {
                    color: #adb8c6;
                }

                .activity-input:focus,
                .activity-select:focus {
                    border-color: #77aaf2;
                    box-shadow:
                        0 0 0 3px rgba(23, 104, 223, .07);
                }

                .activity-button {
                    height: 35px;
                    padding: 0 12px;
                    border: 0;
                    border-radius: 9px;
                    font-size: 9px;
                    font-weight: 800;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: .18s ease;
                }

                .activity-button-primary {
                    background: #1265da;
                    color: #fff;
                }

                .activity-button-primary:hover {
                    background: #0f58c1;
                }

                .activity-button-light {
                    background: #eef2f6;
                    color: #5f7187;
                }

                .activity-button-light:hover {
                    background: #e5ebf2;
                }

                /* =====================================================
                   TABLE
                ====================================================== */

                .activity-table-wrap {
                    width: 100%;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                }

                .activity-table {
                    width: 100%;
                    min-width: 940px;
                    border-collapse: collapse;
                }

                .activity-table th {
                    padding: 11px 14px;
                    text-align: left;
                    background: #fbfcfe;
                    border-bottom: 1px solid #edf1f5;
                    color: #8997a8;
                    font-size: 8px;
                    font-weight: 850;
                    letter-spacing: .06em;
                    text-transform: uppercase;
                    white-space: nowrap;
                }

                .activity-table td {
                    padding: 12px 14px;
                    vertical-align: top;
                    border-bottom: 1px solid #f0f3f7;
                    color: #3c4e65;
                    font-size: 9px;
                }

                .activity-table tbody tr:last-child td {
                    border-bottom: 0;
                }

                .activity-table tbody tr:hover td {
                    background: #fcfdff;
                }

                .activity-actor {
                    color: #20324b;
                    font-size: 9px;
                    font-weight: 800;
                }

                .activity-actor-email {
                    margin-top: 3px;
                    color: #9ca8b6;
                    font-size: 8px;
                }

                .activity-module {
                    color: #4d6078;
                    font-weight: 760;
                }

                .activity-description {
                    max-width: 470px;
                    color: #52667d;
                    line-height: 1.6;
                }

                .activity-meta {
                    margin-top: 3px;
                    color: #a0aab7;
                    font-size: 8px;
                    line-height: 1.5;
                }

                /* =====================================================
                   BADGES
                ====================================================== */

                .activity-badge {
                    display: inline-flex;
                    align-items: center;
                    min-height: 22px;
                    padding: 0 8px;
                    border-radius: 7px;
                    background: #eef2f6;
                    color: #64758a;
                    font-size: 8px;
                    font-weight: 820;
                    white-space: nowrap;
                }

                .activity-badge-login {
                    background: #e9f7ef;
                    color: #16824d;
                }

                .activity-badge-logout {
                    background: #eef2f6;
                    color: #62738a;
                }

                .activity-badge-create {
                    background: #eaf2ff;
                    color: #1d66d5;
                }

                .activity-badge-update {
                    background: #f1edff;
                    color: #6d49c6;
                }

                .activity-badge-status {
                    background: #fff6df;
                    color: #a46b00;
                }

                .activity-badge-delete {
                    background: #fff0f0;
                    color: #c74a4a;
                }

                /* =====================================================
                   EMPTY
                ====================================================== */

                .activity-empty {
                    padding: 56px 20px;
                    text-align: center;
                    color: #8e9aaa;
                    font-size: 10px;
                }

                .activity-empty strong {
                    display: block;
                    margin-bottom: 5px;
                    color: #344862;
                    font-size: 12px;
                }

                /* =====================================================
                   FOOTER
                ====================================================== */

                .activity-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    padding: 13px 16px;
                    background: #fbfcfe;
                    border-top: 1px solid #edf1f5;
                }

                .activity-pagination-info {
                    color: #96a2b1;
                    font-size: 8px;
                }

                .activity-pagination {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                    gap: 5px;
                }

                .activity-page-link {
                    min-width: 28px;
                    height: 28px;
                    padding: 0 7px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #dfe6ee;
                    border-radius: 7px;
                    background: #fff;
                    color: #5b6d83;
                    font-size: 8px;
                    font-weight: 780;
                    cursor: pointer;
                }

                .activity-page-link:hover {
                    background: #f5f8fc;
                }

                .activity-page-link.active {
                    background: #1265da;
                    border-color: #1265da;
                    color: #fff;
                }

                .activity-page-link.disabled {
                    opacity: .4;
                    pointer-events: none;
                }

                .activity-bottom-note {
                    margin-top: 13px;
                    text-align: right;
                    color: #a3adba;
                    font-size: 8px;
                    line-height: 1.5;
                }

                /* =====================================================
                   TABLET
                ====================================================== */

                @media (max-width: 1160px) {
                    .activity-navbar-inner {
                        gap: 14px;
                    }

                    .activity-brand-subtitle {
                        display: none;
                    }

                    .activity-nav {
                        justify-content: flex-start;
                    }

                    .activity-nav-item {
                        padding: 0 9px;
                    }

                    .activity-filter {
                        grid-template-columns:
                            repeat(3, minmax(0, 1fr));
                    }

                    .activity-filter > :first-child {
                        grid-column: 1 / -1;
                    }
                }

                /* =====================================================
                   MOBILE
                ====================================================== */

                @media (max-width: 760px) {
                    .activity-navbar-inner {
                        min-height: 62px;
                        padding: 0 13px;
                        gap: 10px;
                    }

                    .activity-brand {
                        gap: 8px;
                    }

                    .activity-brand-logo {
                        width: 36px;
                        height: 36px;
                        border-radius: 10px;
                    }

                    .activity-brand-logo img {
                        width: 25px;
                        height: 25px;
                    }

                    .activity-brand-title {
                        font-size: 13px;
                    }

                    .activity-brand-subtitle {
                        display: block;
                        font-size: 7px;
                        margin-top: 3px;
                    }

                    .activity-nav {
                        display: none;
                    }

                    .activity-nav-right {
                        margin-left: auto;
                    }

                    .activity-user-box {
                        display: none;
                    }

                    .activity-logout {
                        width: 38px;
                        min-height: 38px;
                        padding: 0;
                        border-radius: 10px;
                    }

                    .activity-mobile-nav {
                        display: block;
                    }

                    .activity-container {
                        padding: 18px 12px 30px;
                    }

                    .activity-topbar {
                        flex-direction: column;
                        gap: 12px;
                        margin-bottom: 15px;
                    }

                    .activity-title {
                        font-size: 22px;
                    }

                    .activity-subtitle {
                        font-size: 9px;
                    }

                    .activity-page-user {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .activity-page-user-copy {
                        text-align: left;
                    }

                    .activity-stat-grid {
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                        gap: 8px;
                    }

                    .activity-stat {
                        padding: 12px;
                        border-radius: 13px;
                    }

                    .activity-stat-label {
                        font-size: 8px;
                    }

                    .activity-stat-value {
                        font-size: 20px;
                    }

                    .activity-stat-note {
                        font-size: 7px;
                    }

                    .activity-card {
                        border-radius: 14px;
                    }

                    .activity-card-header {
                        flex-direction: column;
                        gap: 8px;
                        padding: 14px;
                    }

                    .activity-filter {
                        grid-template-columns:
                            1fr 1fr;
                        padding: 11px;
                        gap: 7px;
                    }

                    .activity-filter > :first-child {
                        grid-column: 1 / -1;
                    }

                    .activity-input,
                    .activity-select,
                    .activity-button {
                        height: 36px;
                    }

                    .activity-table {
                        min-width: 900px;
                    }

                    .activity-footer {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 12px;
                    }

                    .activity-pagination {
                        justify-content: flex-start;
                    }

                    .activity-bottom-note {
                        text-align: center;
                    }
                }

                /* =====================================================
                   SMALL PHONE
                ====================================================== */

                @media (max-width: 430px) {
                    .activity-navbar-inner {
                        min-height: 58px;
                        padding: 0 10px;
                    }

                    .activity-brand-logo {
                        width: 34px;
                        height: 34px;
                    }

                    .activity-brand-title {
                        font-size: 12px;
                    }

                    .activity-brand-subtitle {
                        font-size: 6.5px;
                    }

                    .activity-logout {
                        width: 36px;
                        min-height: 36px;
                    }

                    .activity-mobile-nav-inner {
                        padding: 7px 9px;
                    }

                    .activity-mobile-item {
                        min-height: 32px;
                        font-size: 8px;
                        padding: 0 9px;
                    }

                    .activity-container {
                        padding: 15px 8px 25px;
                    }

                    .activity-kicker {
                        font-size: 8px;
                    }

                    .activity-title {
                        font-size: 20px;
                    }

                    .activity-subtitle {
                        font-size: 8.5px;
                    }

                    .activity-stat-grid {
                        gap: 6px;
                    }

                    .activity-stat {
                        padding: 10px;
                    }

                    .activity-stat-value {
                        font-size: 18px;
                    }

                    .activity-stat-note {
                        display: none;
                    }

                    .activity-card-header {
                        padding: 12px;
                    }

                    .activity-card-title {
                        font-size: 12px;
                    }

                    .activity-card-description {
                        font-size: 8px;
                    }

                    .activity-filter {
                        grid-template-columns: 1fr;
                    }

                    .activity-filter > * {
                        grid-column: 1 / -1 !important;
                    }

                    .activity-bottom-note {
                        font-size: 7px;
                    }
                }

                @media (max-width: 350px) {
                    .activity-brand-subtitle {
                        display: none;
                    }

                    .activity-title {
                        font-size: 18px;
                    }

                    .activity-stat-label {
                        font-size: 7px;
                    }

                    .activity-stat-value {
                        font-size: 17px;
                    }
                }
            `}</style>

            <div className="activity-page">

                {/* =====================================================
                    TOP NAVIGATION
                ====================================================== */}
                <header className="activity-navbar">

                    <div className="activity-navbar-inner">

                        {/* BRAND */}
                        <div className="activity-brand">

                            <div className="activity-brand-logo">
                                <img
                                    src="/images/poltekkes-icon.png"
                                    alt="Logo Poltekkes Maluku"
                                />
                            </div>

                            <div className="activity-brand-copy">
                                <div className="activity-brand-title">
                                    SIMAP
                                </div>

                                <div className="activity-brand-subtitle">
                                    Poltekkes Maluku
                                </div>
                            </div>

                        </div>

                        {/* DESKTOP NAV */}
                        <nav className="activity-nav">

                            <NavItem
                                href="/super-admin/dashboard"
                                label="Dashboard"
                                icon="dashboard"
                            />

                            <NavItem
                                href="/super-admin/pengguna"
                                label="Pengguna"
                                icon="users"
                            />

                            <NavItem
                                href="/super-admin/unit"
                                label="Unit"
                                icon="building"
                            />

                            <NavItem
                                href="/super-admin/aktivitas"
                                label="Aktivitas Sistem"
                                icon="activity"
                                active
                            />

                        </nav>

                        {/* USER + LOGOUT */}
                        <div className="activity-nav-right">

                            <div className="activity-user-box">

                                <div className="activity-user-copy">
                                    <div className="activity-user-name">
                                        {userName}
                                    </div>

                                    <div className="activity-user-role">
                                        {userRole}
                                    </div>
                                </div>

                                <div className="activity-avatar">
                                    {userInitial}
                                </div>

                            </div>

                            <form
                                method="POST"
                                action="/logout"
                                className="activity-logout-form"
                                onSubmit={handleLogout}
                            >
                                <input
                                    type="hidden"
                                    name="_token"
                                    value={csrfToken}
                                />

                                <button
                                    type="submit"
                                    className="activity-logout"
                                    title="Keluar dari SIMAP"
                                    aria-label="Keluar dari SIMAP"
                                >
                                    <Icon
                                        name="logout"
                                        size={14}
                                    />

                                    <span className="activity-logout-label">
                                        Keluar
                                    </span>
                                </button>
                            </form>

                        </div>

                    </div>

                    {/* MOBILE HORIZONTAL NAV */}
                    <div className="activity-mobile-nav">

                        <div className="activity-mobile-nav-inner">

                            <MobileNavItem
                                href="/super-admin/dashboard"
                                label="Dashboard"
                                icon="dashboard"
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
                                active
                            />

                        </div>

                    </div>

                </header>

                {/* =====================================================
                    MAIN
                ====================================================== */}
                <main className="activity-main">

                    <div className="activity-container">

                        {/* PAGE HEADER */}
                        <div className="activity-topbar">

                            <div>
                                <div className="activity-kicker">
                                    ADMINISTRASI SISTEM
                                </div>

                                <h1 className="activity-title">
                                    Aktivitas Sistem
                                </h1>

                                <p className="activity-subtitle">
                                    Pantau riwayat tindakan penting yang
                                    tercatat di SIMAP Poltekkes Maluku.
                                </p>
                            </div>

                            <div className="activity-page-user">

                                <div className="activity-page-user-copy">
                                    <div className="activity-page-user-name">
                                        {userName}
                                    </div>

                                    <div className="activity-page-user-role">
                                        {userRole}
                                    </div>
                                </div>

                                <div className="activity-avatar">
                                    {userInitial}
                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            STATS
                        ================================================== */}
                        <div className="activity-stat-grid">

                            <Stat
                                label="Total Aktivitas"
                                value={safeStats.total ?? 0}
                                note="Seluruh log yang tersimpan"
                            />

                            <Stat
                                label="Hari Ini"
                                value={safeStats.today ?? 0}
                                note="Aktivitas pada hari berjalan"
                            />

                            <Stat
                                label="Minggu Ini"
                                value={safeStats.thisWeek ?? 0}
                                note="Aktivitas sejak awal minggu"
                            />

                            <Stat
                                label="Bulan Ini"
                                value={safeStats.thisMonth ?? 0}
                                note="Aktivitas pada bulan berjalan"
                            />

                        </div>

                        {/* =================================================
                            ACTIVITY CARD
                        ================================================== */}
                        <section className="activity-card">

                            <div className="activity-card-header">

                                <div>
                                    <div className="activity-card-title">
                                        Riwayat Aktivitas
                                    </div>

                                    <div className="activity-card-description">
                                        Setiap entri menampilkan pengguna,
                                        modul, tindakan, waktu, dan sumber
                                        akses.
                                    </div>
                                </div>

                                <div className="activity-count-pill">
                                    {Number(
                                        pagination?.total || 0
                                    )}{' '}
                                    aktivitas
                                </div>

                            </div>

                            {/* =================================================
                                FILTER
                            ================================================== */}
                            <form
                                className="activity-filter"
                                onSubmit={submitFilter}
                            >

                                <input
                                    className="activity-input"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Cari pengguna, deskripsi, modul, aksi, atau IP..."
                                />

                                <select
                                    className="activity-select"
                                    value={module}
                                    onChange={(event) =>
                                        setModule(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Semua Modul
                                    </option>

                                    {Object.entries(
                                        safeModules
                                    ).map(
                                        ([key, label]) => (
                                            <option
                                                key={key}
                                                value={key}
                                            >
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>

                                <select
                                    className="activity-select"
                                    value={action}
                                    onChange={(event) =>
                                        setAction(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Semua Aksi
                                    </option>

                                    {Object.entries(
                                        safeActions
                                    ).map(
                                        ([key, label]) => (
                                            <option
                                                key={key}
                                                value={key}
                                            >
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>

                                <input
                                    className="activity-input"
                                    type="date"
                                    value={dateFrom}
                                    onChange={(event) =>
                                        setDateFrom(
                                            event.target.value
                                        )
                                    }
                                />

                                <input
                                    className="activity-input"
                                    type="date"
                                    value={dateTo}
                                    onChange={(event) =>
                                        setDateTo(
                                            event.target.value
                                        )
                                    }
                                />

                                <button
                                    type="submit"
                                    className="activity-button activity-button-primary"
                                >
                                    Terapkan
                                </button>

                                <button
                                    type="button"
                                    className="activity-button activity-button-light"
                                    onClick={resetFilter}
                                >
                                    Reset
                                </button>

                            </form>

                            {/* =================================================
                                TABLE
                            ================================================== */}
                            <div className="activity-table-wrap">

                                {safeActivities.length === 0 ? (
                                    <div className="activity-empty">

                                        <strong>
                                            Belum ada aktivitas tercatat
                                        </strong>

                                        Aktivitas akan muncul setelah
                                        tindakan penting dilakukan di
                                        sistem.

                                    </div>
                                ) : (
                                    <table className="activity-table">

                                        <thead>
                                            <tr>
                                                <th>
                                                    Waktu
                                                </th>

                                                <th>
                                                    Pengguna
                                                </th>

                                                <th>
                                                    Modul
                                                </th>

                                                <th>
                                                    Aksi
                                                </th>

                                                <th>
                                                    Deskripsi
                                                </th>

                                                <th>
                                                    IP
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {safeActivities.map(
                                                (item) => (
                                                    <tr
                                                        key={
                                                            item.id
                                                        }
                                                    >

                                                        <td>
                                                            <div>
                                                                {formatDateTime(
                                                                    item.created_at
                                                                )}
                                                            </div>

                                                            {item
                                                                ?.user
                                                                ?.unit
                                                                ?.name ? (
                                                                <div className="activity-meta">
                                                                    {
                                                                        item
                                                                            .user
                                                                            .unit
                                                                            .name
                                                                    }
                                                                </div>
                                                            ) : null}
                                                        </td>

                                                        <td>
                                                            <div className="activity-actor">
                                                                {item
                                                                    ?.user
                                                                    ?.name ||
                                                                    'Akun dihapus'}
                                                            </div>

                                                            <div className="activity-actor-email">
                                                                {item
                                                                    ?.user
                                                                    ?.email ||
                                                                    '-'}
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <div className="activity-module">
                                                                {item
                                                                    ?.module ||
                                                                    '-'}
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={actionClass(
                                                                    item?.action
                                                                )}
                                                            >
                                                                {actionLabel(
                                                                    item?.action
                                                                )}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <div className="activity-description">
                                                                {item
                                                                    ?.description ||
                                                                    '-'}
                                                            </div>

                                                            {item?.user_agent ? (
                                                                <div className="activity-meta">
                                                                    Perangkat:{' '}
                                                                    {
                                                                        item.user_agent
                                                                    }
                                                                </div>
                                                            ) : null}
                                                        </td>

                                                        <td>
                                                            <div>
                                                                {item
                                                                    ?.ip_address ||
                                                                    '-'}
                                                            </div>
                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>
                                )}

                            </div>

                            {/* =================================================
                                PAGINATION
                            ================================================== */}
                            {Number(
                                pagination?.total || 0
                            ) > 0 && (
                                <div className="activity-footer">

                                    <div className="activity-pagination-info">
                                        Menampilkan{' '}
                                        {pagination?.from || 0}
                                        {'–'}
                                        {pagination?.to || 0}
                                        {' '}dari{' '}
                                        {pagination?.total || 0}
                                        {' '}aktivitas
                                    </div>

                                    <div className="activity-pagination">

                                        <button
                                            type="button"
                                            className={`activity-page-link ${
                                                pagination?.prev_page_url
                                                    ? ''
                                                    : 'disabled'
                                            }`}
                                            onClick={() =>
                                                openPagination(
                                                    pagination?.prev_page_url
                                                )
                                            }
                                        >
                                            ‹
                                        </button>

                                        {paginationLinks
                                            .slice(0, 7)
                                            .map(
                                                (
                                                    link,
                                                    index
                                                ) => (
                                                    <button
                                                        type="button"
                                                        key={`${link.label}-${index}`}
                                                        className={`activity-page-link ${
                                                            link.active
                                                                ? 'active'
                                                                : ''
                                                        }`}
                                                        onClick={() =>
                                                            openPagination(
                                                                link.url
                                                            )
                                                        }
                                                    >
                                                        {stripHtml(
                                                            link.label
                                                        )}
                                                    </button>
                                                )
                                            )}

                                        <button
                                            type="button"
                                            className={`activity-page-link ${
                                                pagination?.next_page_url
                                                    ? ''
                                                    : 'disabled'
                                            }`}
                                            onClick={() =>
                                                openPagination(
                                                    pagination?.next_page_url
                                                )
                                            }
                                        >
                                            ›
                                        </button>

                                    </div>

                                </div>
                            )}

                        </section>

                        <div className="activity-bottom-note">
                            SIMAP Poltekkes Maluku • Aktivitas sistem
                            tersimpan sebagai catatan administrasi.
                        </div>

                    </div>

                </main>

            </div>
        </>
    );
}

/* =========================================================
   STAT
========================================================= */

function Stat({
    label,
    value,
    note,
}) {
    return (
        <div className="activity-stat">

            <div className="activity-stat-label">
                {label}
            </div>

            <div className="activity-stat-value">
                {value}
            </div>

            <div className="activity-stat-note">
                {note}
            </div>

        </div>
    );
}

/* =========================================================
   DESKTOP NAV ITEM
========================================================= */

function NavItem({
    href,
    label,
    icon,
    active = false,
}) {
    return (
        <a
            href={href}
            className={`activity-nav-item ${
                active ? 'active' : ''
            }`}
        >
            <span className="activity-nav-icon">
                <Icon
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
            className={`activity-mobile-item ${
                active ? 'active' : ''
            }`}
        >
            <Icon
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
   HELPERS
========================================================= */

function stripHtml(value) {
    return String(value || '')
        .replace(/<[^>]*>/g, '');
}

/* =========================================================
   ICON
========================================================= */

function Icon({
    name,
    size = 16,
}) {
    const common = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
    };

    const icons = {
        dashboard: (
            <>
                <rect
                    x="4"
                    y="4"
                    width="6"
                    height="6"
                    rx="1"
                />

                <rect
                    x="14"
                    y="4"
                    width="6"
                    height="6"
                    rx="1"
                />

                <rect
                    x="4"
                    y="14"
                    width="6"
                    height="6"
                    rx="1"
                />

                <rect
                    x="14"
                    y="14"
                    width="6"
                    height="6"
                    rx="1"
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

                <path d="M3.5 20c.5-3.5 2.3-5.5 5.5-5.5s5 2 5.5 5.5" />

                <path d="M16 6.5a3 3 0 0 1 0 5.8" />

                <path d="M17 14.5c2.1.5 3.4 2.2 3.7 5.5" />
            </>
        ),

        building: (
            <>
                <path d="M4 20V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v14" />

                <path d="M8 8h2M8 12h2M8 16h2M13 8h1M13 12h1M13 16h1M2 20h20" />
            </>
        ),

        activity: (
            <>
                <path d="M3 12h4l2.2-6 4.1 12 2.1-6H21" />
            </>
        ),

        logout: (
            <>
                <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />

                <path d="M14 8l4 4-4 4" />

                <path d="M9 12h9" />
            </>
        ),
    };

    return (
        <svg {...common}>
            {icons[name] || icons.activity}
        </svg>
    );
}