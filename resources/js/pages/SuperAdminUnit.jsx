import React, { useMemo, useState } from 'react';

export default function SuperAdminUnit({
    user = null,
    units = [],
    pagination = {},
    filters = {},
    csrfToken = '',
    flash = {},
    errors = [],
}) {
    const safeUnits = Array.isArray(units) ? units : [];

    const [search, setSearch] = useState(filters?.search || '');
    const [showForm, setShowForm] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);

    const [form, setForm] = useState({
        code: '',
        name: '',
        description: '',
        is_active: true,
    });

    const currentTitle = editingUnit ? 'Edit Unit' : 'Tambah Unit';

    const normalizedErrors = useMemo(() => {
        if (Array.isArray(errors)) return errors;

        if (errors && typeof errors === 'object') {
            return Object.values(errors).flat();
        }

        return [];
    }, [errors]);

    const roleText = user?.role?.name || 'Super Admin';

    const openCreate = () => {
        setEditingUnit(null);
        setShowForm(true);

        setForm({
            code: '',
            name: '',
            description: '',
            is_active: true,
        });
    };

    const openEdit = (unit) => {
        setEditingUnit(unit);
        setShowForm(true);

        setForm({
            code: unit?.code || '',
            name: unit?.name || '',
            description: unit?.description || '',
            is_active: Boolean(unit?.is_active),
        });
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingUnit(null);
    };

    const updateForm = (key, value) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const submitSearch = (event) => {
        event.preventDefault();

        const params = new URLSearchParams();

        if (search.trim()) {
            params.set('search', search.trim());
        }

        const query = params.toString();

        window.location.href = `/super-admin/unit${query ? `?${query}` : ''}`;
    };

    const resetSearch = () => {
        window.location.href = '/super-admin/unit';
    };

    const submitStatus = (unit) => {
        const action = unit?.is_active
            ? 'menonaktifkan'
            : 'mengaktifkan';

        const confirmed = window.confirm(
            `Yakin ingin ${action} unit "${unit?.name || 'unit'}"?`
        );

        if (!confirmed) return;

        const formElement = document.createElement('form');

        formElement.method = 'POST';
        formElement.action = `/super-admin/unit/${unit.id}/status`;

        const token = document.createElement('input');

        token.type = 'hidden';
        token.name = '_token';
        token.value = csrfToken;

        formElement.appendChild(token);

        document.body.appendChild(formElement);

        formElement.submit();
    };

    const submitDelete = (unit) => {
        const confirmed = window.confirm(
            `Hapus unit "${unit?.name || 'unit'}"?\n\n` +
            'Unit hanya dapat dihapus jika belum digunakan oleh pengguna atau disposisi.'
        );

        if (!confirmed) return;

        const formElement = document.createElement('form');

        formElement.method = 'POST';
        formElement.action = `/super-admin/unit/${unit.id}`;

        const token = document.createElement('input');

        token.type = 'hidden';
        token.name = '_token';
        token.value = csrfToken;

        const method = document.createElement('input');

        method.type = 'hidden';
        method.name = '_method';
        method.value = 'DELETE';

        formElement.appendChild(token);
        formElement.appendChild(method);

        document.body.appendChild(formElement);

        formElement.submit();
    };

    const buildUrl = (url) => {
        if (!url) return '#';

        const target = new URL(
            url,
            window.location.origin
        );

        if (search.trim()) {
            target.searchParams.set(
                'search',
                search.trim()
            );
        }

        return target.toString();
    };

    return (
        <>
            <style>{`
                * {
                    box-sizing: border-box;
                }

                html {
                    width: 100%;
                    min-height: 100%;
                    overflow-x: hidden;
                }

                body {
                    margin: 0;
                    width: 100%;
                    min-width: 0;
                    background: #f5f7fb;
                    overflow-x: hidden;
                }

                button,
                input,
                textarea {
                    font-family: inherit;
                }

                button,
                a {
                    -webkit-tap-highlight-color: transparent;
                }

                .sau-page {
                    width: 100%;
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

                /* ========================================
                   SHELL
                ======================================== */

                .sau-shell {
                    width: 100%;
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns:
                        248px
                        minmax(0, 1fr);
                }

                /* ========================================
                   SIDEBAR
                ======================================== */

                .sau-sidebar {
                    position: sticky;
                    top: 0;
                    z-index: 20;
                    width: 248px;
                    height: 100vh;
                    padding: 22px 16px;
                    background: #0f2747;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .sau-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 5px 8px 22px;
                    min-width: 0;
                }

                .sau-logo {
                    width: 40px;
                    height: 40px;
                    padding: 5px;
                    flex: 0 0 40px;
                    border-radius: 11px;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .sau-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .sau-brand-title {
                    font-size: 17px;
                    font-weight: 850;
                    line-height: 1;
                }

                .sau-brand-subtitle {
                    margin-top: 5px;
                    color: rgba(255,255,255,.62);
                    font-size: 9px;
                }

                .sau-nav-label {
                    padding: 14px 10px 8px;
                    color: rgba(255,255,255,.43);
                    font-size: 9px;
                    font-weight: 850;
                    letter-spacing: .8px;
                    text-transform: uppercase;
                }

                .sau-nav {
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }

                .sau-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    margin-bottom: 4px;
                    padding: 11px 10px;
                    border-radius: 10px;
                    color: rgba(255,255,255,.78);
                    text-decoration: none;
                    font-size: 11px;
                    font-weight: 700;
                    transition: .18s ease;
                    white-space: nowrap;
                }

                .sau-nav-item:hover {
                    background: rgba(255,255,255,.07);
                    color: #fff;
                }

                .sau-nav-active {
                    background: rgba(255,255,255,.105);
                    color: #fff;
                }

                .sau-nav-icon {
                    width: 26px;
                    height: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex: 0 0 26px;
                    border-radius: 8px;
                    background: rgba(255,255,255,.07);
                }

                .sau-nav-active .sau-nav-icon {
                    background: rgba(255,255,255,.13);
                }

                .sau-spacer {
                    flex: 1;
                    min-height: 20px;
                }

                .sau-profile {
                    padding: 12px;
                    border: 1px solid rgba(255,255,255,.09);
                    border-radius: 13px;
                    background: rgba(255,255,255,.045);
                    min-width: 0;
                }

                .sau-profile-name {
                    font-size: 10px;
                    font-weight: 800;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .sau-profile-role {
                    margin-top: 4px;
                    color: rgba(255,255,255,.58);
                    font-size: 8px;
                }

                .sau-logout-form {
                    margin: 0;
                }

                .sau-logout {
                    width: 100%;
                    margin-top: 9px;
                    padding: 9px 10px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    border: 1px solid rgba(255,255,255,.12);
                    border-radius: 9px;
                    background: transparent;
                    color: rgba(255,255,255,.82);
                    font: inherit;
                    font-size: 9px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: .18s ease;
                }

                .sau-logout:hover {
                    background: rgba(255,255,255,.08);
                    color: #fff;
                }

                /* ========================================
                   MAIN
                ======================================== */

                .sau-main {
                    min-width: 0;
                    width: 100%;
                    padding: 28px 30px 50px;
                }

                .sau-container {
                    width: 100%;
                    max-width: 1320px;
                    margin: 0 auto;
                }

                .sau-topbar {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 18px;
                    margin-bottom: 18px;
                }

                .sau-topbar > div:first-child {
                    min-width: 0;
                }

                .sau-kicker {
                    color: #7c3aed;
                    font-size: 10px;
                    font-weight: 850;
                    letter-spacing: .8px;
                }

                .sau-title {
                    margin: 6px 0 0;
                    color: #0f2747;
                    font-size: 30px;
                    line-height: 1.1;
                    font-weight: 850;
                    word-break: break-word;
                }

                .sau-subtitle {
                    max-width: 760px;
                    margin: 7px 0 0;
                    color: #64748b;
                    font-size: 12px;
                    line-height: 1.6;
                }

                .sau-actions {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                    flex-shrink: 0;
                }

                /* ========================================
                   BUTTON
                ======================================== */

                .sau-btn {
                    min-height: 40px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    padding: 10px 13px;
                    border: 1px solid #dbe3ec;
                    border-radius: 10px;
                    background: #fff;
                    color: #334155;
                    text-decoration: none;
                    font: inherit;
                    font-size: 10px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: .18s ease;
                    white-space: nowrap;
                }

                .sau-btn:hover {
                    background: #f8fafc;
                }

                .sau-btn-primary {
                    border-color: #0f2747;
                    background: #0f2747;
                    color: #fff;
                }

                .sau-btn-primary:hover {
                    background: #173e66;
                }

                /* ========================================
                   ALERT
                ======================================== */

                .sau-alert {
                    margin-bottom: 14px;
                    padding: 12px 14px;
                    border-radius: 11px;
                    border: 1px solid;
                    font-size: 10px;
                    line-height: 1.55;
                }

                .sau-success {
                    background: #f0fdf4;
                    border-color: #bbf7d0;
                    color: #166534;
                }

                .sau-error {
                    background: #fef2f2;
                    border-color: #fecaca;
                    color: #991b1b;
                }

                /* ========================================
                   CARD
                ======================================== */

                .sau-card {
                    width: 100%;
                    overflow: hidden;
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    box-shadow: 0 6px 20px rgba(15,23,42,.022);
                }

                .sau-filter-head {
                    padding: 16px 18px;
                    border-bottom: 1px solid #edf1f5;
                }

                .sau-card-title {
                    color: #0f2747;
                    font-size: 13px;
                    font-weight: 850;
                }

                .sau-card-description {
                    margin-top: 4px;
                    color: #94a3b8;
                    font-size: 9px;
                    line-height: 1.5;
                }

                /* ========================================
                   SEARCH
                ======================================== */

                .sau-filter-body {
                    display: grid;
                    grid-template-columns:
                        minmax(0, 1fr)
                        auto;
                    gap: 10px;
                    padding: 16px 18px;
                    align-items: end;
                }

                .sau-label {
                    display: block;
                    margin-bottom: 6px;
                    color: #64748b;
                    font-size: 9px;
                    font-weight: 800;
                }

                .sau-input,
                .sau-textarea {
                    width: 100%;
                    max-width: 100%;
                    border: 1px solid #dbe3ec;
                    border-radius: 10px;
                    background: #fff;
                    color: #334155;
                    font: inherit;
                    outline: none;
                    transition: .18s ease;
                }

                .sau-input {
                    height: 40px;
                    padding: 0 11px;
                    font-size: 10px;
                }

                .sau-textarea {
                    min-height: 100px;
                    padding: 11px;
                    resize: vertical;
                    font-size: 10px;
                    line-height: 1.6;
                }

                .sau-input:focus,
                .sau-textarea:focus {
                    border-color: #a78bfa;
                    box-shadow:
                        0 0 0 3px
                        rgba(139,92,246,.10);
                }

                .sau-filter-actions {
                    display: flex;
                    gap: 8px;
                }

                /* ========================================
                   TABLE DESKTOP
                ======================================== */

                .sau-table-wrap {
                    width: 100%;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                }

                .sau-table {
                    width: 100%;
                    min-width: 850px;
                    border-collapse: collapse;
                }

                .sau-table th {
                    padding: 11px 12px;
                    text-align: left;
                    color: #94a3b8;
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                    font-size: 8px;
                    font-weight: 850;
                    letter-spacing: .55px;
                    text-transform: uppercase;
                    white-space: nowrap;
                }

                .sau-table td {
                    padding: 13px 12px;
                    border-bottom: 1px solid #edf1f5;
                    color: #475569;
                    font-size: 10px;
                    vertical-align: middle;
                }

                .sau-table tr:last-child td {
                    border-bottom: 0;
                }

                .sau-code {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 52px;
                    padding: 6px 8px;
                    border-radius: 8px;
                    background: #f5f3ff;
                    border: 1px solid #ddd6fe;
                    color: #6d28d9;
                    font-size: 9px;
                    font-weight: 850;
                }

                .sau-name {
                    color: #0f2747;
                    font-weight: 850;
                }

                .sau-desc {
                    margin-top: 3px;
                    color: #94a3b8;
                    font-size: 8px;
                    line-height: 1.5;
                    max-width: 520px;
                }

                .sau-pill {
                    display: inline-flex;
                    align-items: center;
                    padding: 5px 7px;
                    border-radius: 999px;
                    font-size: 8px;
                    font-weight: 800;
                    white-space: nowrap;
                }

                .sau-active {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    color: #15803d;
                }

                .sau-inactive {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                }

                .sau-count {
                    background: #eff6ff;
                    border: 1px solid #dbeafe;
                    color: #1d4ed8;
                }

                .sau-actions-cell {
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                }

                .sau-small {
                    min-height: 32px;
                    padding: 7px 9px;
                    border: 1px solid #dbe3ec;
                    border-radius: 8px;
                    background: #fff;
                    color: #475569;
                    font: inherit;
                    font-size: 8px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: .18s ease;
                }

                .sau-small:hover {
                    background: #f8fafc;
                }

                .sau-small-success {
                    color: #166534;
                    border-color: #bbf7d0;
                }

                .sau-small-danger {
                    color: #b91c1c;
                    border-color: #fecaca;
                }

                .sau-small-danger:hover {
                    background: #fef2f2;
                }

                /* ========================================
                   MOBILE UNIT CARD
                ======================================== */

                .sau-mobile-list {
                    display: none;
                }

                .sau-unit-card {
                    padding: 15px;
                    border-bottom: 1px solid #edf1f5;
                }

                .sau-unit-card:last-child {
                    border-bottom: 0;
                }

                .sau-unit-card-head {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 10px;
                }

                .sau-unit-card-code {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6px 9px;
                    border-radius: 8px;
                    background: #f5f3ff;
                    border: 1px solid #ddd6fe;
                    color: #6d28d9;
                    font-size: 9px;
                    font-weight: 850;
                }

                .sau-unit-card-name {
                    margin-top: 9px;
                    color: #0f2747;
                    font-size: 13px;
                    font-weight: 850;
                    line-height: 1.35;
                }

                .sau-unit-card-desc {
                    margin-top: 5px;
                    color: #94a3b8;
                    font-size: 9px;
                    line-height: 1.55;
                }

                .sau-unit-meta {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 8px;
                    margin-top: 13px;
                }

                .sau-unit-meta-item {
                    min-width: 0;
                    padding: 9px 10px;
                    border-radius: 9px;
                    background: #f8fafc;
                    border: 1px solid #edf1f5;
                }

                .sau-unit-meta-label {
                    color: #94a3b8;
                    font-size: 7px;
                    font-weight: 850;
                    letter-spacing: .4px;
                    text-transform: uppercase;
                }

                .sau-unit-meta-value {
                    margin-top: 4px;
                    color: #334155;
                    font-size: 9px;
                    font-weight: 750;
                }

                .sau-unit-actions {
                    display: grid;
                    grid-template-columns:
                        repeat(3, minmax(0, 1fr));
                    gap: 7px;
                    margin-top: 12px;
                }

                .sau-unit-actions .sau-small {
                    width: 100%;
                    min-height: 36px;
                }

                .sau-empty {
                    padding: 55px 20px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 10px;
                }

                /* ========================================
                   PAGINATION
                ======================================== */

                .sau-pagination {
                    padding: 14px 18px;
                    border-top: 1px solid #edf1f5;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .sau-pagination-info {
                    color: #94a3b8;
                    font-size: 9px;
                }

                .sau-pagination-nav {
                    display: flex;
                    gap: 5px;
                    flex-wrap: wrap;
                }

                .sau-page-link {
                    min-width: 31px;
                    min-height: 31px;
                    padding: 0 9px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #dbe3ec;
                    border-radius: 8px;
                    background: #fff;
                    color: #475569;
                    text-decoration: none;
                    font-size: 8px;
                    font-weight: 800;
                }

                .sau-page-link-active {
                    background: #0f2747;
                    border-color: #0f2747;
                    color: #fff;
                }

                .sau-page-link-disabled {
                    opacity: .45;
                    pointer-events: none;
                }

                /* ========================================
                   MODAL
                ======================================== */

                .sau-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    background: rgba(15,23,42,.48);
                    backdrop-filter: blur(4px);
                    overflow-y: auto;
                }

                .sau-modal {
                    width: min(620px, 100%);
                    max-height: calc(100vh - 40px);
                    overflow-y: auto;
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 17px;
                    box-shadow: 0 25px 70px rgba(15,23,42,.20);
                }

                .sau-modal-head {
                    padding: 17px 19px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    border-bottom: 1px solid #edf1f5;
                }

                .sau-modal-head > div:first-child {
                    min-width: 0;
                }

                .sau-close {
                    width: 34px;
                    height: 34px;
                    flex: 0 0 34px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    background: #fff;
                    color: #64748b;
                    cursor: pointer;
                    font-size: 18px;
                    line-height: 1;
                }

                .sau-close:hover {
                    background: #f8fafc;
                }

                .sau-modal-body {
                    padding: 19px;
                }

                .sau-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(2, minmax(0, 1fr));
                    gap: 13px;
                }

                .sau-full {
                    grid-column: 1 / -1;
                }

                .sau-check-wrap {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    min-height: 40px;
                }

                .sau-check {
                    width: 16px;
                    height: 16px;
                    flex: 0 0 16px;
                    margin-top: 2px;
                    accent-color: #0f2747;
                }

                .sau-check-label {
                    color: #475569;
                    font-size: 10px;
                    font-weight: 700;
                    line-height: 1.45;
                }

                .sau-help {
                    margin-top: 5px;
                    color: #94a3b8;
                    font-size: 8px;
                    line-height: 1.5;
                }

                .sau-modal-footer {
                    padding: 14px 19px 18px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 8px;
                    border-top: 1px solid #edf1f5;
                }

                .sau-footer {
                    padding-top: 22px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 8px;
                }

                /* ========================================
                   LARGE TABLET
                ======================================== */

                @media (max-width: 1100px) {
                    .sau-shell {
                        grid-template-columns:
                            215px
                            minmax(0, 1fr);
                    }

                    .sau-sidebar {
                        width: 215px;
                    }

                    .sau-main {
                        padding: 24px 22px 45px;
                    }

                    .sau-topbar {
                        align-items: flex-start;
                    }

                    .sau-title {
                        font-size: 28px;
                    }
                }

                /* ========================================
                   TABLET
                ======================================== */

                @media (max-width: 900px) {
                    .sau-shell {
                        display: block;
                    }

                    .sau-sidebar {
                        position: relative;
                        top: auto;
                        width: 100%;
                        height: auto;
                        padding: 14px 15px;
                        overflow: visible;
                    }

                    .sau-brand {
                        padding: 3px 4px 12px;
                    }

                    .sau-brand-title {
                        font-size: 16px;
                    }

                    .sau-nav-label,
                    .sau-spacer,
                    .sau-profile {
                        display: none;
                    }

                    .sau-nav {
                        flex-direction: row;
                        gap: 6px;
                        width: 100%;
                        overflow-x: auto;
                        overflow-y: hidden;
                        padding: 2px 0 3px;
                        scrollbar-width: none;
                    }

                    .sau-nav::-webkit-scrollbar {
                        display: none;
                    }

                    .sau-nav-item {
                        width: auto;
                        min-width: max-content;
                        margin: 0;
                        padding: 9px 11px;
                    }

                    .sau-main {
                        width: 100%;
                        padding: 22px 18px 40px;
                    }

                    .sau-topbar {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .sau-actions {
                        width: 100%;
                        justify-content: flex-start;
                    }

                    .sau-actions .sau-btn {
                        flex: 0 0 auto;
                    }
                }

                /* ========================================
                   SMALL TABLET / PHONE
                ======================================== */

                @media (max-width: 700px) {
                    .sau-main {
                        padding: 18px 13px 35px;
                    }

                    .sau-title {
                        font-size: 25px;
                    }

                    .sau-subtitle {
                        font-size: 11px;
                    }

                    .sau-actions {
                        display: grid;
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                        width: 100%;
                    }

                    .sau-actions .sau-btn {
                        width: 100%;
                    }

                    .sau-filter-body {
                        grid-template-columns: 1fr;
                    }

                    .sau-filter-actions {
                        display: grid;
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                    }

                    .sau-filter-actions .sau-btn {
                        width: 100%;
                    }

                    .sau-table {
                        display: none;
                    }

                    .sau-mobile-list {
                        display: block;
                    }

                    .sau-pagination {
                        align-items: stretch;
                        flex-direction: column;
                    }

                    .sau-pagination-info {
                        text-align: center;
                    }

                    .sau-pagination-nav {
                        justify-content: center;
                    }

                    .sau-page-link {
                        min-height: 34px;
                    }

                    .sau-grid {
                        grid-template-columns: 1fr;
                    }

                    .sau-full {
                        grid-column: auto;
                    }

                    .sau-overlay {
                        align-items: flex-start;
                        padding: 12px;
                    }

                    .sau-modal {
                        width: 100%;
                        max-height: calc(100vh - 24px);
                        border-radius: 14px;
                    }

                    .sau-modal-body {
                        padding: 16px;
                    }

                    .sau-modal-footer {
                        padding: 12px 16px 16px;
                    }
                }

                /* ========================================
                   MOBILE
                ======================================== */

                @media (max-width: 480px) {
                    .sau-sidebar {
                        padding: 11px 10px;
                    }

                    .sau-brand {
                        gap: 9px;
                    }

                    .sau-logo {
                        width: 36px;
                        height: 36px;
                        flex-basis: 36px;
                    }

                    .sau-brand-title {
                        font-size: 15px;
                    }

                    .sau-brand-subtitle {
                        font-size: 8px;
                    }

                    .sau-nav {
                        gap: 4px;
                    }

                    .sau-nav-item {
                        padding: 8px 9px;
                        gap: 7px;
                        font-size: 9px;
                    }

                    .sau-nav-icon {
                        width: 23px;
                        height: 23px;
                        flex-basis: 23px;
                    }

                    .sau-main {
                        padding: 16px 10px 30px;
                    }

                    .sau-topbar {
                        gap: 13px;
                        margin-bottom: 14px;
                    }

                    .sau-kicker {
                        font-size: 8px;
                    }

                    .sau-title {
                        margin-top: 5px;
                        font-size: 23px;
                    }

                    .sau-subtitle {
                        font-size: 10px;
                        line-height: 1.55;
                    }

                    .sau-actions {
                        grid-template-columns: 1fr;
                        gap: 7px;
                    }

                    .sau-btn {
                        min-height: 42px;
                        font-size: 10px;
                    }

                    .sau-filter-head {
                        padding: 14px;
                    }

                    .sau-filter-body {
                        padding: 14px;
                    }

                    .sau-card-title {
                        font-size: 12px;
                    }

                    .sau-card-description {
                        font-size: 8px;
                    }

                    .sau-filter-actions {
                        gap: 6px;
                    }

                    .sau-unit-card {
                        padding: 14px;
                    }

                    .sau-unit-card-head {
                        gap: 8px;
                    }

                    .sau-unit-card-name {
                        font-size: 12px;
                    }

                    .sau-unit-card-desc {
                        font-size: 8px;
                    }

                    .sau-unit-meta {
                        grid-template-columns: 1fr;
                    }

                    .sau-unit-actions {
                        grid-template-columns: 1fr;
                    }

                    .sau-pagination {
                        padding: 13px 12px;
                    }

                    .sau-pagination-nav {
                        width: 100%;
                        display: grid;
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                    }

                    .sau-pagination-nav .sau-page-link {
                        width: 100%;
                    }

                    .sau-modal-head {
                        padding: 14px;
                    }

                    .sau-modal-head .sau-card-title {
                        font-size: 12px;
                    }

                    .sau-modal-body {
                        padding: 14px;
                    }

                    .sau-modal-footer {
                        display: grid;
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                        padding: 12px 14px 14px;
                    }

                    .sau-modal-footer .sau-btn {
                        width: 100%;
                    }

                    .sau-empty {
                        padding: 40px 15px;
                        font-size: 9px;
                    }
                }

                /* ========================================
                   VERY SMALL PHONE
                ======================================== */

                @media (max-width: 360px) {
                    .sau-main {
                        padding-left: 8px;
                        padding-right: 8px;
                    }

                    .sau-title {
                        font-size: 21px;
                    }

                    .sau-nav-item {
                        padding-left: 8px;
                        padding-right: 8px;
                    }

                    .sau-filter-actions {
                        grid-template-columns: 1fr;
                    }

                    .sau-modal-footer {
                        grid-template-columns: 1fr;
                    }
                }

                /* ========================================
                   ACCESSIBILITY
                ======================================== */

                @media (prefers-reduced-motion: reduce) {
                    *,
                    *::before,
                    *::after {
                        scroll-behavior: auto !important;
                        transition: none !important;
                        animation: none !important;
                    }
                }
            `}</style>

            <div className="sau-page">
                <div className="sau-shell">

                    {/* SIDEBAR */}
                    <aside className="sau-sidebar">

                        <div className="sau-brand">
                            <div className="sau-logo">
                                <img
                                    src="/images/poltekkes-icon.png"
                                    alt="Logo Poltekkes Maluku"
                                />
                            </div>

                            <div>
                                <div className="sau-brand-title">
                                    SIMAP
                                </div>

                                <div className="sau-brand-subtitle">
                                    Poltekkes Maluku
                                </div>
                            </div>
                        </div>

                        <div className="sau-nav-label">
                            MENU UTAMA
                        </div>

                        <nav className="sau-nav">

                            <a
                                href="/super-admin/dashboard"
                                className="sau-nav-item"
                            >
                                <span className="sau-nav-icon">
                                    <Icon
                                        name="dashboard"
                                        size={15}
                                    />
                                </span>

                                Dashboard
                            </a>

                            <a
                                href="/super-admin/pengguna"
                                className="sau-nav-item"
                            >
                                <span className="sau-nav-icon">
                                    <Icon
                                        name="users"
                                        size={15}
                                    />
                                </span>

                                Pengguna
                            </a>

                            <a
                                href="/super-admin/unit"
                                className="sau-nav-item sau-nav-active"
                            >
                                <span className="sau-nav-icon">
                                    <Icon
                                        name="building"
                                        size={15}
                                    />
                                </span>

                                Unit
                            </a>

                            <a
                                href="/super-admin/aktivitas"
                                className="sau-nav-item"
                            >
                                <span className="sau-nav-icon">
                                    <Icon
                                        name="activity"
                                        size={15}
                                    />
                                </span>

                                Aktivitas Sistem
                            </a>

                        </nav>

                        <div className="sau-spacer" />

                        <div className="sau-profile">

                            <div className="sau-profile-name">
                                {user?.name || 'Super Admin'}
                            </div>

                            <div className="sau-profile-role">
                                {roleText}
                            </div>

                            <form
                                method="POST"
                                action="/logout"
                                className="sau-logout-form"
                            >
                                <input
                                    type="hidden"
                                    name="_token"
                                    value={csrfToken}
                                />

                                <button
                                    type="submit"
                                    className="sau-logout"
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

                    {/* MAIN */}
                    <main className="sau-main">

                        <div className="sau-container">

                            {/* HEADER */}
                            <div className="sau-topbar">

                                <div>

                                    <div className="sau-kicker">
                                        ADMINISTRASI SISTEM
                                    </div>

                                    <h1 className="sau-title">
                                        Unit
                                    </h1>

                                    <p className="sau-subtitle">
                                        Kelola daftar unit kerja yang
                                        digunakan dalam pengguna dan
                                        disposisi SIMAP.
                                    </p>

                                </div>

                                <div className="sau-actions">

                                    <a
                                        href="/super-admin/dashboard"
                                        className="sau-btn"
                                    >
                                        Kembali ke Dashboard
                                    </a>

                                    <button
                                        type="button"
                                        className="sau-btn sau-btn-primary"
                                        onClick={openCreate}
                                    >
                                        <Icon
                                            name="plus"
                                            size={13}
                                        />

                                        Tambah Unit
                                    </button>

                                </div>

                            </div>

                            {/* SUCCESS */}
                            {flash?.success && (
                                <div className="sau-alert sau-success">
                                    {flash.success}
                                </div>
                            )}

                            {/* ERRORS */}
                            {normalizedErrors.length > 0 && (
                                <div className="sau-alert sau-error">
                                    {normalizedErrors.map(
                                        (message, index) => (
                                            <div key={index}>
                                                {String(message)}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {/* SEARCH */}
                            <section
                                className="sau-card"
                                style={{ marginBottom: 18 }}
                            >

                                <div className="sau-filter-head">

                                    <div className="sau-card-title">
                                        Cari Unit
                                    </div>

                                    <div className="sau-card-description">
                                        Cari berdasarkan kode, nama,
                                        atau deskripsi unit.
                                    </div>

                                </div>

                                <form
                                    className="sau-filter-body"
                                    onSubmit={submitSearch}
                                >

                                    <div>

                                        <label className="sau-label">
                                            Pencarian
                                        </label>

                                        <input
                                            className="sau-input"
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Contoh: akademik, BAA, kepegawaian"
                                        />

                                    </div>

                                    <div className="sau-filter-actions">

                                        <button
                                            type="submit"
                                            className="sau-btn sau-btn-primary"
                                        >
                                            Cari
                                        </button>

                                        <button
                                            type="button"
                                            className="sau-btn"
                                            onClick={resetSearch}
                                        >
                                            Reset
                                        </button>

                                    </div>

                                </form>

                            </section>

                            {/* LIST UNIT */}
                            <section className="sau-card">

                                <div className="sau-filter-head">

                                    <div className="sau-card-title">
                                        Daftar Unit
                                    </div>

                                    <div className="sau-card-description">
                                        {pagination?.total ??
                                            safeUnits.length}{' '}
                                        unit terdaftar.
                                    </div>

                                </div>

                                {safeUnits.length === 0 ? (
                                    <div className="sau-empty">
                                        Belum ada unit yang sesuai
                                        dengan pencarian.
                                    </div>
                                ) : (
                                    <>
                                        {/* DESKTOP TABLE */}
                                        <div className="sau-table-wrap">

                                            <table className="sau-table">

                                                <thead>
                                                    <tr>
                                                        <th>Kode</th>
                                                        <th>
                                                            Nama Unit
                                                        </th>
                                                        <th>
                                                            Pengguna
                                                        </th>
                                                        <th>
                                                            Status
                                                        </th>
                                                        <th>
                                                            Aksi
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {safeUnits.map(
                                                        (unit) => (
                                                            <tr
                                                                key={
                                                                    unit?.id ??
                                                                    unit?.code
                                                                }
                                                            >

                                                                <td>
                                                                    <span className="sau-code">
                                                                        {unit?.code ||
                                                                            '-'}
                                                                    </span>
                                                                </td>

                                                                <td>

                                                                    <div className="sau-name">
                                                                        {unit?.name ||
                                                                            '-'}
                                                                    </div>

                                                                    {unit?.description && (
                                                                        <div className="sau-desc">
                                                                            {
                                                                                unit.description
                                                                            }
                                                                        </div>
                                                                    )}

                                                                </td>

                                                                <td>

                                                                    <span className="sau-pill sau-count">
                                                                        {Number(
                                                                            unit?.users_count ??
                                                                                0
                                                                        )}{' '}
                                                                        pengguna
                                                                    </span>

                                                                </td>

                                                                <td>

                                                                    <span
                                                                        className={`sau-pill ${
                                                                            unit?.is_active
                                                                                ? 'sau-active'
                                                                                : 'sau-inactive'
                                                                        }`}
                                                                    >
                                                                        {unit?.is_active
                                                                            ? 'Aktif'
                                                                            : 'Nonaktif'}
                                                                    </span>

                                                                </td>

                                                                <td>

                                                                    <div className="sau-actions-cell">

                                                                        <button
                                                                            type="button"
                                                                            className="sau-small"
                                                                            onClick={() =>
                                                                                openEdit(
                                                                                    unit
                                                                                )
                                                                            }
                                                                        >
                                                                            Edit
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            className={`sau-small ${
                                                                                unit?.is_active
                                                                                    ? ''
                                                                                    : 'sau-small-success'
                                                                            }`}
                                                                            onClick={() =>
                                                                                submitStatus(
                                                                                    unit
                                                                                )
                                                                            }
                                                                        >
                                                                            {unit?.is_active
                                                                                ? 'Nonaktifkan'
                                                                                : 'Aktifkan'}
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            className="sau-small sau-small-danger"
                                                                            onClick={() =>
                                                                                submitDelete(
                                                                                    unit
                                                                                )
                                                                            }
                                                                        >
                                                                            Hapus
                                                                        </button>

                                                                    </div>

                                                                </td>

                                                            </tr>
                                                        )
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>

                                        {/* MOBILE CARD LIST */}
                                        <div className="sau-mobile-list">

                                            {safeUnits.map(
                                                (unit) => (
                                                    <div
                                                        className="sau-unit-card"
                                                        key={
                                                            `mobile-${unit?.id ?? unit?.code}`
                                                        }
                                                    >

                                                        <div className="sau-unit-card-head">

                                                            <span className="sau-unit-card-code">
                                                                {unit?.code ||
                                                                    '-'}
                                                            </span>

                                                            <span
                                                                className={`sau-pill ${
                                                                    unit?.is_active
                                                                        ? 'sau-active'
                                                                        : 'sau-inactive'
                                                                }`}
                                                            >
                                                                {unit?.is_active
                                                                    ? 'Aktif'
                                                                    : 'Nonaktif'}
                                                            </span>

                                                        </div>

                                                        <div className="sau-unit-card-name">
                                                            {unit?.name ||
                                                                '-'}
                                                        </div>

                                                        {unit?.description && (
                                                            <div className="sau-unit-card-desc">
                                                                {
                                                                    unit.description
                                                                }
                                                            </div>
                                                        )}

                                                        <div className="sau-unit-meta">

                                                            <div className="sau-unit-meta-item">

                                                                <div className="sau-unit-meta-label">
                                                                    Pengguna
                                                                </div>

                                                                <div className="sau-unit-meta-value">
                                                                    {Number(
                                                                        unit?.users_count ??
                                                                            0
                                                                    )}{' '}
                                                                    pengguna
                                                                </div>

                                                            </div>

                                                            <div className="sau-unit-meta-item">

                                                                <div className="sau-unit-meta-label">
                                                                    Kode Unit
                                                                </div>

                                                                <div className="sau-unit-meta-value">
                                                                    {unit?.code ||
                                                                        '-'}
                                                                </div>

                                                            </div>

                                                        </div>

                                                        <div className="sau-unit-actions">

                                                            <button
                                                                type="button"
                                                                className="sau-small"
                                                                onClick={() =>
                                                                    openEdit(
                                                                        unit
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className={`sau-small ${
                                                                    unit?.is_active
                                                                        ? ''
                                                                        : 'sau-small-success'
                                                                }`}
                                                                onClick={() =>
                                                                    submitStatus(
                                                                        unit
                                                                    )
                                                                }
                                                            >
                                                                {unit?.is_active
                                                                    ? 'Nonaktifkan'
                                                                    : 'Aktifkan'}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="sau-small sau-small-danger"
                                                                onClick={() =>
                                                                    submitDelete(
                                                                        unit
                                                                    )
                                                                }
                                                            >
                                                                Hapus
                                                            </button>

                                                        </div>

                                                    </div>
                                                )
                                            )}

                                        </div>
                                    </>
                                )}

                                {/* PAGINATION */}
                                {pagination?.last_page > 1 && (
                                    <div className="sau-pagination">

                                        <div className="sau-pagination-info">
                                            Menampilkan{' '}
                                            {pagination?.from ?? 0}
                                            –
                                            {pagination?.to ?? 0}{' '}
                                            dari{' '}
                                            {pagination?.total ?? 0}{' '}
                                            unit
                                        </div>

                                        <div className="sau-pagination-nav">

                                            <a
                                                className={`sau-page-link ${
                                                    !pagination?.prev_page_url
                                                        ? 'sau-page-link-disabled'
                                                        : ''
                                                }`}
                                                href={buildUrl(
                                                    pagination?.prev_page_url
                                                )}
                                            >
                                                Sebelumnya
                                            </a>

                                            {(pagination?.links || [])
                                                .slice(1, -1)
                                                .map(
                                                    (
                                                        link,
                                                        index
                                                    ) => {
                                                        if (
                                                            !link?.url &&
                                                            !link?.active
                                                        ) {
                                                            return null;
                                                        }

                                                        return (
                                                            <a
                                                                key={`${link?.label}-${index}`}
                                                                className={`sau-page-link ${
                                                                    link?.active
                                                                        ? 'sau-page-link-active'
                                                                        : ''
                                                                } ${
                                                                    !link?.url
                                                                        ? 'sau-page-link-disabled'
                                                                        : ''
                                                                }`}
                                                                href={buildUrl(
                                                                    link?.url
                                                                )}
                                                            >
                                                                <span
                                                                    dangerouslySetInnerHTML={{
                                                                        __html:
                                                                            link?.label ||
                                                                            '',
                                                                    }}
                                                                />
                                                            </a>
                                                        );
                                                    }
                                                )}

                                            <a
                                                className={`sau-page-link ${
                                                    !pagination?.next_page_url
                                                        ? 'sau-page-link-disabled'
                                                        : ''
                                                }`}
                                                href={buildUrl(
                                                    pagination?.next_page_url
                                                )}
                                            >
                                                Berikutnya
                                            </a>

                                        </div>

                                    </div>
                                )}

                            </section>

                            <div className="sau-footer">
                                SIMAP Poltekkes Maluku
                            </div>

                        </div>

                    </main>

                </div>
            </div>

            {/* MODAL TAMBAH / EDIT */}
            {showForm && (
                <div
                    className="sau-overlay"
                    role="dialog"
                    aria-modal="true"
                >

                    <form
                        className="sau-modal"
                        method="POST"
                        action={
                            editingUnit
                                ? `/super-admin/unit/${editingUnit.id}`
                                : '/super-admin/unit'
                        }
                    >

                        <div className="sau-modal-head">

                            <div>

                                <div className="sau-card-title">
                                    {currentTitle}
                                </div>

                                <div className="sau-card-description">
                                    {editingUnit
                                        ? 'Perbarui data unit kerja.'
                                        : 'Tambahkan unit kerja baru ke SIMAP.'}
                                </div>

                            </div>

                            <button
                                type="button"
                                className="sau-close"
                                onClick={closeForm}
                                aria-label="Tutup"
                            >
                                ×
                            </button>

                        </div>

                        <div className="sau-modal-body">

                            <input
                                type="hidden"
                                name="_token"
                                value={csrfToken}
                            />

                            {editingUnit && (
                                <input
                                    type="hidden"
                                    name="_method"
                                    value="PUT"
                                />
                            )}

                            <div className="sau-grid">

                                {/* KODE */}
                                <div>

                                    <label className="sau-label">
                                        Kode Unit *
                                    </label>

                                    <input
                                        className="sau-input"
                                        name="code"
                                        value={form.code}
                                        onChange={(event) =>
                                            updateForm(
                                                'code',
                                                event.target.value.toUpperCase()
                                            )
                                        }
                                        required
                                        maxLength={30}
                                        placeholder="Contoh: BAA"
                                    />

                                    <div className="sau-help">
                                        Gunakan kode singkat dan unik,
                                        misalnya BAA, PEG, KEU, TI.
                                    </div>

                                </div>

                                {/* NAMA */}
                                <div>

                                    <label className="sau-label">
                                        Nama Unit *
                                    </label>

                                    <input
                                        className="sau-input"
                                        name="name"
                                        value={form.name}
                                        onChange={(event) =>
                                            updateForm(
                                                'name',
                                                event.target.value
                                            )
                                        }
                                        required
                                        maxLength={255}
                                        placeholder="Contoh: Bagian Akademik"
                                    />

                                </div>

                                {/* DESKRIPSI */}
                                <div className="sau-full">

                                    <label className="sau-label">
                                        Deskripsi
                                    </label>

                                    <textarea
                                        className="sau-textarea"
                                        name="description"
                                        value={form.description}
                                        onChange={(event) =>
                                            updateForm(
                                                'description',
                                                event.target.value
                                            )
                                        }
                                        maxLength={1000}
                                        placeholder="Deskripsi singkat mengenai unit ini..."
                                    />

                                </div>

                                {/* STATUS */}
                                <div>

                                    <label className="sau-label">
                                        Status Unit
                                    </label>

                                    <label className="sau-check-wrap">

                                        <input
                                            className="sau-check"
                                            type="checkbox"
                                            name="is_active"
                                            value="1"
                                            checked={form.is_active}
                                            onChange={(event) =>
                                                updateForm(
                                                    'is_active',
                                                    event.target.checked
                                                )
                                            }
                                        />

                                        <span className="sau-check-label">
                                            Unit aktif dan dapat dipilih
                                            oleh pengguna
                                        </span>

                                    </label>

                                </div>

                                {/* INFORMASI PENGGUNAAN */}
                                {editingUnit &&
                                    Number(
                                        editingUnit?.users_count ?? 0
                                    ) > 0 && (
                                        <div>

                                            <div className="sau-label">
                                                Informasi Penggunaan
                                            </div>

                                            <div
                                                className="sau-help"
                                                style={{
                                                    marginTop: 0,
                                                }}
                                            >
                                                Unit ini sedang digunakan
                                                oleh{' '}
                                                {Number(
                                                    editingUnit.users_count
                                                )}{' '}
                                                pengguna. Pemindahan
                                                pengguna disarankan
                                                sebelum menonaktifkan
                                                unit.
                                            </div>

                                        </div>
                                    )}

                            </div>

                        </div>

                        <div className="sau-modal-footer">

                            <button
                                type="button"
                                className="sau-btn"
                                onClick={closeForm}
                            >
                                Batal
                            </button>

                            <button
                                type="submit"
                                className="sau-btn sau-btn-primary"
                            >
                                {editingUnit
                                    ? 'Simpan Perubahan'
                                    : 'Simpan Unit'}
                            </button>

                        </div>

                    </form>

                </div>
            )}

        </>
    );
}

function Icon({ name, size = 18 }) {
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
                <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />

                <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />

                <path d="M9 21v-3h6v3" />
            </>
        ),

        activity: (
            <path d="M3 12h4l2-7 4 14 2-7h6" />
        ),

        plus: (
            <>
                <path d="M12 5v14" />
                <path d="M5 12h14" />
            </>
        ),

        logout: (
            <>
                <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />

                <path d="m14 8 4 4-4 4" />

                <path d="M9 12h9" />
            </>
        ),
    };

    return (
        <svg {...common}>
            {icons[name] || null}
        </svg>
    );
}