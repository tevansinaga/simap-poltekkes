import React, {
    useMemo,
    useState,
} from 'react';


/*
|--------------------------------------------------------------------------
| SUPER ADMIN - PENGGUNA
|--------------------------------------------------------------------------
*/

export default function SuperAdminPengguna({
    user = null,
    users = [],
    roles = [],
    units = [],
    filters = {},
    pagination = {},
    csrfToken = '',
    flash = {},
    errors = [],
}) {

    /*
    |--------------------------------------------------------------------------
    | DATA AMAN
    |--------------------------------------------------------------------------
    */

    const safeUsers = Array.isArray(users)
        ? users
        : [];

    const safeRoles = Array.isArray(roles)
        ? roles
        : [];

    const safeUnits = Array.isArray(units)
        ? units
        : [];


    /*
    |--------------------------------------------------------------------------
    | FILTER
    |--------------------------------------------------------------------------
    */

    const [search, setSearch] = useState(
        filters?.search || ''
    );

    const [roleFilter, setRoleFilter] = useState(
        filters?.role || ''
    );

    const [unitFilter, setUnitFilter] = useState(
        filters?.unit || ''
    );

    const [statusFilter, setStatusFilter] = useState(
        filters?.status === undefined ||
        filters?.status === null
            ? ''
            : String(filters.status)
    );


    /*
    |--------------------------------------------------------------------------
    | FORM
    |--------------------------------------------------------------------------
    */

    const [showForm, setShowForm] =
        useState(false);

    const [editingUser, setEditingUser] =
        useState(null);

    const [showPassword, setShowPassword] =
        useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role_id: '',
        unit_id: '',
        is_active: true,
    });


    /*
    |--------------------------------------------------------------------------
    | USER LOGIN
    |--------------------------------------------------------------------------
    */

    const currentUserId =
        user?.id ?? null;


    /*
    |--------------------------------------------------------------------------
    | FORM TITLE
    |--------------------------------------------------------------------------
    */

    const formTitle = editingUser
        ? 'Edit Pengguna'
        : 'Tambah Pengguna';


    /*
    |--------------------------------------------------------------------------
    | ROLE TERPILIH
    |--------------------------------------------------------------------------
    */

    const selectedRole = useMemo(() => {

        return (
            safeRoles.find(
                (item) =>
                    String(item?.id) ===
                    String(form.role_id)
            ) || null
        );

    }, [
        safeRoles,
        form.role_id,
    ]);


    /*
    |--------------------------------------------------------------------------
    | ROLE YANG WAJIB UNIT
    |--------------------------------------------------------------------------
    */

    const roleNeedsUnit = useMemo(() => {

        const slug =
            selectedRole?.slug;

        return (
            slug === 'kepala-unit' ||
            slug === 'staf'
        );

    }, [
        selectedRole,
    ]);


    /*
    |--------------------------------------------------------------------------
    | ROLE LABEL
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | STATUS LABEL
    |--------------------------------------------------------------------------
    */

    const formatStatus = (active) => {

        return active
            ? 'Aktif'
            : 'Nonaktif';
    };


    /*
    |--------------------------------------------------------------------------
    | BUKA FORM TAMBAH
    |--------------------------------------------------------------------------
    */

    const openCreate = () => {

        setEditingUser(null);

        setForm({
            name: '',
            email: '',
            password: '',
            role_id:
                safeRoles[0]?.id
                    ? String(
                          safeRoles[0].id
                      )
                    : '',
            unit_id: '',
            is_active: true,
        });

        setShowPassword(false);
        setShowForm(true);
    };


    /*
    |--------------------------------------------------------------------------
    | BUKA FORM EDIT
    |--------------------------------------------------------------------------
    */

    const openEdit = (item) => {

        setEditingUser(item);

        setForm({
            name:
                item?.name ||
                '',

            email:
                item?.email ||
                '',

            password:
                '',

            role_id:
                item?.role_id
                    ? String(
                          item.role_id
                      )
                    : item?.role?.id
                        ? String(
                              item.role.id
                          )
                        : '',

            unit_id:
                item?.unit_id
                    ? String(
                          item.unit_id
                      )
                    : item?.unit?.id
                        ? String(
                              item.unit.id
                          )
                        : '',

            is_active:
                Boolean(
                    item?.is_active
                ),
        });

        setShowPassword(false);
        setShowForm(true);
    };


    /*
    |--------------------------------------------------------------------------
    | TUTUP FORM
    |--------------------------------------------------------------------------
    */

    const closeForm = () => {

        setShowForm(false);
        setEditingUser(null);
        setShowPassword(false);

        setForm({
            name: '',
            email: '',
            password: '',
            role_id: '',
            unit_id: '',
            is_active: true,
        });
    };


    /*
    |--------------------------------------------------------------------------
    | UPDATE FORM
    |--------------------------------------------------------------------------
    */

    const updateForm = (
        key,
        value
    ) => {

        setForm((previous) => ({
            ...previous,
            [key]: value,
        }));
    };


    /*
    |--------------------------------------------------------------------------
    | GANTI ROLE
    |--------------------------------------------------------------------------
    */

    const handleRoleChange = (
        event
    ) => {

        const roleId =
            event.target.value;

        const selected =
            safeRoles.find(
                (item) =>
                    String(item?.id) ===
                    String(roleId)
            );

        const needsUnit =
            selected?.slug ===
                'kepala-unit' ||
            selected?.slug ===
                'staf';

        setForm((previous) => ({
            ...previous,

            role_id: roleId,

            unit_id:
                needsUnit
                    ? previous.unit_id
                    : '',
        }));
    };


    /*
    |--------------------------------------------------------------------------
    | FILTER
    |--------------------------------------------------------------------------
    */

    const submitFilters = (
        event
    ) => {

        event.preventDefault();

        const params =
            new URLSearchParams();


        if (
            search.trim()
        ) {
            params.set(
                'search',
                search.trim()
            );
        }


        if (roleFilter) {
            params.set(
                'role',
                roleFilter
            );
        }


        if (unitFilter) {
            params.set(
                'unit',
                unitFilter
            );
        }


        if (
            statusFilter !== ''
        ) {
            params.set(
                'status',
                statusFilter
            );
        }


        const query =
            params.toString();


        window.location.href =
            `/super-admin/pengguna${
                query
                    ? `?${query}`
                    : ''
            }`;
    };


    /*
    |--------------------------------------------------------------------------
    | RESET FILTER
    |--------------------------------------------------------------------------
    */

    const resetFilters = () => {

        window.location.href =
            '/super-admin/pengguna';
    };


    /*
    |--------------------------------------------------------------------------
    | TOGGLE STATUS
    |--------------------------------------------------------------------------
    */

    const confirmToggle = (
        item
    ) => {

        const itemId =
            item?.id ?? null;

        const isSelf =
            String(itemId) ===
            String(currentUserId);


        /*
        |----------------------------------------------------------------------
        | DIRI SENDIRI
        |----------------------------------------------------------------------
        */

        if (
            isSelf &&
            item?.is_active
        ) {

            window.alert(
                'Akun Super Admin yang sedang digunakan tidak dapat dinonaktifkan.'
            );

            return;
        }


        const target =
            item?.is_active
                ? 'menonaktifkan'
                : 'mengaktifkan';


        const confirmed =
            window.confirm(
                `Yakin ingin ${target} akun ${
                    item?.name ||
                    'pengguna'
                }?`
            );


        if (!confirmed) {
            return;
        }


        /*
        |----------------------------------------------------------------------
        | FORM POST
        |----------------------------------------------------------------------
        */

        const formElement =
            document.createElement(
                'form'
            );

        formElement.method =
            'POST';

        formElement.action =
            `/super-admin/pengguna/${itemId}/status`;


        const token =
            document.createElement(
                'input'
            );

        token.type =
            'hidden';

        token.name =
            '_token';

        token.value =
            csrfToken;


        formElement.appendChild(
            token
        );


        document.body.appendChild(
            formElement
        );

        formElement.submit();
    };


    /*
    |--------------------------------------------------------------------------
    | HAPUS PENGGUNA
    |--------------------------------------------------------------------------
    */

    const confirmDelete = (
        item
    ) => {

        const itemId =
            item?.id ?? null;

        const isSelf =
            String(itemId) ===
            String(currentUserId);


        /*
        |----------------------------------------------------------------------
        | JANGAN HAPUS DIRI SENDIRI
        |----------------------------------------------------------------------
        */

        if (isSelf) {

            window.alert(
                'Akun Super Admin yang sedang digunakan tidak dapat dihapus.'
            );

            return;
        }


        /*
        |----------------------------------------------------------------------
        | KONFIRMASI
        |----------------------------------------------------------------------
        */

        const confirmed =
            window.confirm(
                `Yakin ingin menghapus akun "${
                    item?.name ||
                    'pengguna'
                }"?\n\n` +
                'Data akun akan dihapus secara permanen.'
            );


        if (!confirmed) {
            return;
        }


        /*
        |----------------------------------------------------------------------
        | FORM DELETE
        |----------------------------------------------------------------------
        */

        const formElement =
            document.createElement(
                'form'
            );

        formElement.method =
            'POST';

        formElement.action =
            `/super-admin/pengguna/${itemId}`;


        const token =
            document.createElement(
                'input'
            );

        token.type =
            'hidden';

        token.name =
            '_token';

        token.value =
            csrfToken;


        const method =
            document.createElement(
                'input'
            );

        method.type =
            'hidden';

        method.name =
            '_method';

        method.value =
            'DELETE';


        formElement.appendChild(
            token
        );

        formElement.appendChild(
            method
        );


        document.body.appendChild(
            formElement
        );

        formElement.submit();
    };


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    const handleLogout = (
        event
    ) => {

        const confirmed =
            window.confirm(
                'Yakin ingin keluar dari SIMAP?'
            );

        if (!confirmed) {
            event.preventDefault();
        }
    };


    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    const normalizedErrors =
        Array.isArray(errors)
            ? errors
            : errors &&
                typeof errors ===
                    'object'
                ? Object.values(
                      errors
                  ).flat()
                : [];


    const hasErrors =
        normalizedErrors.length >
        0;


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <>
            <style>{`

                * {
                    box-sizing: border-box;
                }

                html {
                    width: 100%;
                    overflow-x: hidden;
                }

                body {
                    margin: 0;
                    background: #f5f7fb;
                    overflow-x: hidden;
                }

                button,
                input,
                select {
                    font: inherit;
                }

                .sap-page {
                    min-height: 100vh;
                    width: 100%;
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

                .sap-shell {
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 248px minmax(0, 1fr);
                    width: 100%;
                }

                /* =====================================================
                   SIDEBAR
                ====================================================== */

                .sap-sidebar {
                    position: sticky;
                    top: 0;
                    height: 100vh;
                    min-width: 0;
                    padding: 22px 16px;
                    background: #0f2747;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid rgba(255,255,255,.07);
                    z-index: 40;
                }

                .sap-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    min-width: 0;
                    padding: 5px 8px 22px;
                }

                .sap-brand-logo {
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

                .sap-brand-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .sap-brand-title {
                    font-size: 17px;
                    font-weight: 850;
                    line-height: 1;
                }

                .sap-brand-subtitle {
                    margin-top: 5px;
                    color: rgba(255,255,255,.62);
                    font-size: 9px;
                }

                .sap-nav-label {
                    padding: 14px 10px 8px;
                    color: rgba(255,255,255,.43);
                    font-size: 9px;
                    font-weight: 850;
                    letter-spacing: .8px;
                    text-transform: uppercase;
                }

                .sap-nav {
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }

                .sap-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    min-width: max-content;
                    margin-bottom: 4px;
                    padding: 11px 10px;
                    border-radius: 10px;
                    color: rgba(255,255,255,.78);
                    background: transparent;
                    text-decoration: none;
                    font-size: 11px;
                    font-weight: 700;
                    transition: background .18s ease, color .18s ease;
                }

                .sap-nav-item:hover {
                    background: rgba(255,255,255,.07);
                    color: #fff;
                }

                .sap-nav-item-active {
                    background: rgba(255,255,255,.105);
                    color: #fff;
                }

                .sap-nav-icon {
                    width: 26px;
                    height: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex: 0 0 26px;
                    border-radius: 8px;
                    background: rgba(255,255,255,.07);
                }

                .sap-nav-item-active .sap-nav-icon {
                    background: rgba(255,255,255,.13);
                }

                .sap-sidebar-spacer {
                    flex: 1;
                    min-height: 18px;
                }

                /* =====================================================
                   PROFILE
                ====================================================== */

                .sap-profile-box {
                    padding: 12px;
                    border: 1px solid rgba(255,255,255,.09);
                    border-radius: 13px;
                    background: rgba(255,255,255,.045);
                }

                .sap-profile-name {
                    color: #fff;
                    font-size: 10px;
                    font-weight: 800;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .sap-profile-role {
                    margin-top: 4px;
                    color: rgba(255,255,255,.58);
                    font-size: 8px;
                }

                .sap-logout-form {
                    margin: 0;
                    padding: 0;
                }

                .sap-logout {
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
                    font-family: inherit;
                    font-size: 9px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: background .18s ease, color .18s ease;
                }

                .sap-logout:hover {
                    background: rgba(255,255,255,.08);
                    color: #fff;
                }

                /* =====================================================
                   MAIN
                ====================================================== */

                .sap-main {
                    min-width: 0;
                    width: 100%;
                    padding: 28px 30px 50px;
                    overflow: hidden;
                }

                .sap-container {
                    width: 100%;
                    max-width: 1320px;
                    margin: 0 auto;
                }

                /* =====================================================
                   TOPBAR
                ====================================================== */

                .sap-topbar {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .sap-kicker {
                    color: #2563eb;
                    font-size: 10px;
                    font-weight: 850;
                    letter-spacing: .8px;
                }

                .sap-title {
                    margin: 6px 0 0;
                    color: #0f2747;
                    font-size: clamp(24px, 3vw, 30px);
                    line-height: 1.12;
                    font-weight: 850;
                    letter-spacing: -.5px;
                }

                .sap-subtitle {
                    max-width: 680px;
                    margin: 7px 0 0;
                    color: #64748b;
                    font-size: 12px;
                    line-height: 1.6;
                }

                .sap-actions {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                }

                /* =====================================================
                   BUTTON
                ====================================================== */

                .sap-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    min-height: 40px;
                    padding: 10px 13px;
                    border: 1px solid #dbe3ec;
                    border-radius: 10px;
                    background: #fff;
                    color: #334155;
                    text-decoration: none;
                    font-family: inherit;
                    font-size: 10px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: background .18s ease, border-color .18s ease, transform .18s ease;
                    white-space: nowrap;
                }

                .sap-button:hover {
                    background: #f8fafc;
                }

                .sap-button:active {
                    transform: translateY(1px);
                }

                .sap-button-primary {
                    border-color: #0f2747;
                    background: #0f2747;
                    color: #fff;
                }

                .sap-button-primary:hover {
                    background: #173e66;
                }

                /* =====================================================
                   ALERT
                ====================================================== */

                .sap-alert {
                    margin-bottom: 16px;
                    padding: 12px 14px;
                    border-radius: 11px;
                    font-size: 10px;
                    line-height: 1.55;
                    border: 1px solid;
                }

                .sap-alert-success {
                    background: #f0fdf4;
                    border-color: #bbf7d0;
                    color: #166534;
                }

                .sap-alert-error {
                    background: #fef2f2;
                    border-color: #fecaca;
                    color: #991b1b;
                }

                /* =====================================================
                   CARD
                ====================================================== */

                .sap-card {
                    width: 100%;
                    overflow: hidden;
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    box-shadow: 0 6px 20px rgba(15,23,42,.022);
                }

                .sap-filter-card {
                    margin-bottom: 18px;
                }

                .sap-filter-header {
                    padding: 16px 18px;
                    border-bottom: 1px solid #edf1f5;
                }

                .sap-card-title {
                    color: #0f2747;
                    font-size: 13px;
                    font-weight: 850;
                }

                .sap-card-description {
                    margin-top: 4px;
                    color: #94a3b8;
                    font-size: 9px;
                    line-height: 1.5;
                }

                /* =====================================================
                   FILTER
                ====================================================== */

                .sap-filter-body {
                    padding: 16px 18px;
                    display: grid;
                    grid-template-columns: minmax(220px, 1.7fr) repeat(3, minmax(140px, .8fr)) auto;
                    gap: 10px;
                    align-items: end;
                }

                .sap-field {
                    min-width: 0;
                }

                .sap-label {
                    display: block;
                    margin-bottom: 6px;
                    color: #64748b;
                    font-size: 9px;
                    font-weight: 800;
                }

                .sap-input,
                .sap-select {
                    width: 100%;
                    max-width: 100%;
                    height: 40px;
                    padding: 0 11px;
                    border: 1px solid #dbe3ec;
                    border-radius: 10px;
                    outline: none;
                    background: #fff;
                    color: #334155;
                    font-family: inherit;
                    font-size: 10px;
                }

                .sap-input:focus,
                .sap-select:focus {
                    border-color: #93c5fd;
                    box-shadow: 0 0 0 3px rgba(59,130,246,.10);
                }

                .sap-filter-actions {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                /* =====================================================
                   TABLE
                ====================================================== */

                .sap-table-wrap {
                    width: 100%;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                }

                .sap-table {
                    width: 100%;
                    min-width: 900px;
                    border-collapse: collapse;
                }

                .sap-table th {
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

                .sap-table td {
                    padding: 12px;
                    color: #475569;
                    border-bottom: 1px solid #edf1f5;
                    font-size: 10px;
                    vertical-align: middle;
                }

                .sap-table tr:last-child td {
                    border-bottom: 0;
                }

                .sap-name {
                    color: #0f2747;
                    font-weight: 800;
                    overflow-wrap: anywhere;
                }

                .sap-email {
                    margin-top: 2px;
                    color: #94a3b8;
                    font-size: 8px;
                    overflow-wrap: anywhere;
                }

                /* =====================================================
                   BADGES
                ====================================================== */

                .sap-pill {
                    display: inline-flex;
                    align-items: center;
                    padding: 5px 7px;
                    border-radius: 999px;
                    font-size: 8px;
                    font-weight: 800;
                    white-space: nowrap;
                }

                .sap-pill-role {
                    background: #eff6ff;
                    border: 1px solid #dbeafe;
                    color: #1d4ed8;
                }

                .sap-pill-active {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    color: #15803d;
                }

                .sap-pill-inactive {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                }

                .sap-pill-self {
                    margin-left: 5px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    color: #64748b;
                }

                /* =====================================================
                   ACTION
                ====================================================== */

                .sap-actions-cell {
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                }

                .sap-small-button {
                    min-height: 32px;
                    border: 1px solid #dbe3ec;
                    background: #fff;
                    color: #475569;
                    border-radius: 8px;
                    padding: 7px 9px;
                    font-family: inherit;
                    font-size: 8px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: background .18s ease, border-color .18s ease, color .18s ease;
                    white-space: nowrap;
                }

                .sap-small-button:hover {
                    background: #f8fafc;
                }

                .sap-small-button:disabled {
                    opacity: .45;
                    cursor: not-allowed;
                }

                .sap-small-button-success {
                    color: #166534;
                    border-color: #bbf7d0;
                }

                .sap-small-button-danger {
                    color: #b91c1c;
                    border-color: #fecaca;
                    background: #fff;
                }

                .sap-small-button-danger:hover {
                    background: #fef2f2;
                    border-color: #fca5a5;
                    color: #991b1b;
                }

                /* =====================================================
                   EMPTY
                ====================================================== */

                .sap-empty {
                    padding: 50px 20px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 10px;
                }

                /* =====================================================
                   PAGINATION
                ====================================================== */

                .sap-pagination {
                    padding: 14px 18px;
                    border-top: 1px solid #edf1f5;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .sap-pagination-info {
                    color: #94a3b8;
                    font-size: 9px;
                }

                .sap-pagination-nav {
                    display: flex;
                    gap: 5px;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                }

                .sap-page-link {
                    min-width: 31px;
                    min-height: 31px;
                    height: 31px;
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

                .sap-page-link:hover {
                    background: #f8fafc;
                }

                .sap-page-link-active {
                    background: #0f2747;
                    border-color: #0f2747;
                    color: #fff;
                }

                .sap-page-link-disabled {
                    opacity: .45;
                    pointer-events: none;
                }

                /* =====================================================
                   MODAL
                ====================================================== */

                .sap-overlay {
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

                .sap-modal {
                    width: min(620px, 100%);
                    max-height: min(88vh, 760px);
                    overflow-y: auto;
                    border-radius: 17px;
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 25px 70px rgba(15,23,42,.20);
                }

                .sap-modal-header {
                    padding: 17px 19px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    border-bottom: 1px solid #edf1f5;
                }

                .sap-modal-close {
                    width: 31px;
                    height: 31px;
                    flex: 0 0 31px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    background: #fff;
                    color: #64748b;
                    cursor: pointer;
                    font-size: 17px;
                    line-height: 1;
                }

                .sap-modal-close:hover {
                    background: #f8fafc;
                }

                .sap-modal-body {
                    padding: 19px;
                }

                /* =====================================================
                   FORM
                ====================================================== */

                .sap-form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 13px;
                }

                .sap-form-full {
                    grid-column: 1 / -1;
                }

                .sap-required {
                    color: #dc2626;
                }

                .sap-checkbox-wrap {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    min-height: 40px;
                    padding: 0 2px;
                }

                .sap-checkbox {
                    width: 15px;
                    height: 15px;
                    accent-color: #0f2747;
                    flex: 0 0 auto;
                }

                .sap-checkbox-label {
                    color: #475569;
                    font-size: 10px;
                    font-weight: 700;
                }

                .sap-password-wrap {
                    position: relative;
                }

                .sap-password-wrap .sap-input {
                    padding-right: 85px;
                }

                .sap-password-toggle {
                    position: absolute;
                    top: 50%;
                    right: 8px;
                    transform: translateY(-50%);
                    border: 0;
                    background: transparent;
                    color: #64748b;
                    font-family: inherit;
                    font-size: 8px;
                    font-weight: 800;
                    cursor: pointer;
                }

                .sap-password-toggle:hover {
                    color: #0f2747;
                }

                .sap-help {
                    margin-top: 5px;
                    color: #94a3b8;
                    font-size: 8px;
                    line-height: 1.5;
                }

                /* =====================================================
                   MODAL FOOTER
                ====================================================== */

                .sap-modal-footer {
                    padding: 14px 19px 18px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 8px;
                    border-top: 1px solid #edf1f5;
                }

                /* =====================================================
                   FOOTER
                ====================================================== */

                .sap-footer {
                    padding-top: 22px;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 8px;
                }

                /* =====================================================
                   TABLET / SMALL LAPTOP
                ====================================================== */

                @media (max-width: 1180px) {
                    .sap-shell {
                        grid-template-columns: 220px minmax(0, 1fr);
                    }

                    .sap-main {
                        padding-left: 22px;
                        padding-right: 22px;
                    }

                    .sap-filter-body {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .sap-filter-actions {
                        grid-column: 1 / -1;
                        justify-content: flex-end;
                    }
                }

                @media (max-width: 920px) {
                    .sap-shell {
                        display: block;
                    }

                    .sap-sidebar {
                        position: sticky;
                        top: 0;
                        height: auto;
                        min-height: 0;
                        padding: 12px 14px;
                        border-right: 0;
                        border-bottom: 1px solid rgba(255,255,255,.08);
                    }

                    .sap-brand {
                        padding: 3px 4px 10px;
                    }

                    .sap-nav-label,
                    .sap-sidebar-spacer,
                    .sap-profile-box {
                        display: none;
                    }

                    .sap-nav {
                        flex-direction: row;
                        gap: 6px;
                        overflow-x: auto;
                        overflow-y: hidden;
                        padding: 2px 0 4px;
                        scrollbar-width: thin;
                    }

                    .sap-nav-item {
                        width: auto;
                        min-width: max-content;
                        margin: 0;
                        padding: 9px 10px;
                    }

                    .sap-main {
                        padding: 22px 18px 40px;
                    }

                    .sap-topbar {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .sap-actions {
                        width: 100%;
                        justify-content: flex-start;
                    }
                }

                /* =====================================================
                   MOBILE
                ====================================================== */

                @media (max-width: 680px) {
                    .sap-sidebar {
                        padding: 10px 10px 8px;
                    }

                    .sap-brand {
                        padding: 2px 4px 9px;
                    }

                    .sap-brand-logo {
                        width: 36px;
                        height: 36px;
                        flex-basis: 36px;
                        border-radius: 10px;
                    }

                    .sap-brand-title {
                        font-size: 15px;
                    }

                    .sap-brand-subtitle {
                        font-size: 8px;
                    }

                    .sap-nav {
                        gap: 4px;
                    }

                    .sap-nav-item {
                        padding: 8px 9px;
                        border-radius: 9px;
                        font-size: 10px;
                    }

                    .sap-nav-icon {
                        width: 24px;
                        height: 24px;
                        flex-basis: 24px;
                    }

                    .sap-main {
                        padding: 18px 12px 32px;
                    }

                    .sap-topbar {
                        gap: 14px;
                        margin-bottom: 16px;
                    }

                    .sap-kicker {
                        font-size: 8px;
                    }

                    .sap-title {
                        font-size: 24px;
                    }

                    .sap-subtitle {
                        font-size: 10px;
                        line-height: 1.55;
                    }

                    .sap-actions {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        width: 100%;
                        gap: 7px;
                    }

                    .sap-actions .sap-button {
                        width: 100%;
                        min-width: 0;
                        padding-left: 8px;
                        padding-right: 8px;
                        white-space: normal;
                        text-align: center;
                    }

                    .sap-filter-header,
                    .sap-modal-header {
                        padding: 14px;
                    }

                    .sap-filter-body {
                        grid-template-columns: 1fr;
                        padding: 14px;
                        gap: 11px;
                    }

                    .sap-filter-actions {
                        grid-column: auto;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        width: 100%;
                    }

                    .sap-filter-actions .sap-button {
                        width: 100%;
                    }

                    .sap-card-title {
                        font-size: 12px;
                    }

                    .sap-card-description {
                        font-size: 8px;
                    }

                    /* Tabel tetap bisa di-scroll pada layar kecil. */
                    .sap-table-wrap {
                        overflow-x: auto;
                    }

                    .sap-table {
                        min-width: 760px;
                    }

                    .sap-table th,
                    .sap-table td {
                        padding: 10px 9px;
                    }

                    .sap-actions-cell {
                        flex-wrap: nowrap;
                    }

                    .sap-small-button {
                        min-height: 34px;
                        padding: 7px 8px;
                    }

                    .sap-pagination {
                        padding: 12px 14px;
                        align-items: stretch;
                    }

                    .sap-pagination-info {
                        width: 100%;
                    }

                    .sap-pagination-nav {
                        width: 100%;
                        justify-content: flex-start;
                    }

                    .sap-page-link {
                        min-width: 34px;
                        height: 34px;
                    }

                    .sap-overlay {
                        align-items: flex-start;
                        padding: 10px;
                    }

                    .sap-modal {
                        width: 100%;
                        max-height: calc(100vh - 20px);
                        border-radius: 14px;
                    }

                    .sap-modal-body {
                        padding: 14px;
                    }

                    .sap-form-grid {
                        grid-template-columns: 1fr;
                        gap: 11px;
                    }

                    .sap-form-full {
                        grid-column: auto;
                    }

                    .sap-modal-footer {
                        padding: 12px 14px 14px;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                    }

                    .sap-modal-footer .sap-button {
                        width: 100%;
                    }
                }

                /* =====================================================
                   VERY SMALL PHONE
                ====================================================== */

                @media (max-width: 400px) {
                    .sap-main {
                        padding-left: 9px;
                        padding-right: 9px;
                    }

                    .sap-actions {
                        grid-template-columns: 1fr;
                    }

                    .sap-filter-actions {
                        grid-template-columns: 1fr;
                    }

                    .sap-nav-item {
                        font-size: 9px;
                    }

                    .sap-nav-icon {
                        display: none;
                    }

                    .sap-title {
                        font-size: 22px;
                    }

                    .sap-overlay {
                        padding: 6px;
                    }

                    .sap-modal {
                        max-height: calc(100vh - 12px);
                    }

                    .sap-modal-footer {
                        grid-template-columns: 1fr;
                    }

                    .sap-password-wrap .sap-input {
                        padding-right: 75px;
                    }
                }

            `}</style>


            <div className="sap-page">

                <div className="sap-shell">


                    {/* =================================================
                        SIDEBAR
                    ================================================== */}

                    <aside className="sap-sidebar">


                        {/* BRAND */}

                        <div className="sap-brand">

                            <div className="sap-brand-logo">

                                <img
                                    src="/images/poltekkes-icon.png"
                                    alt="Logo Poltekkes Maluku"
                                />

                            </div>


                            <div>

                                <div className="sap-brand-title">
                                    SIMAP
                                </div>

                                <div className="sap-brand-subtitle">
                                    Poltekkes Maluku
                                </div>

                            </div>

                        </div>


                        <div className="sap-nav-label">
                            MENU UTAMA
                        </div>


                        <nav className="sap-nav">


                            {/* DASHBOARD */}

                            <a
                                href="/super-admin/dashboard"
                                className="
                                    sap-nav-item
                                "
                            >

                                <span className="sap-nav-icon">

                                    <Icon
                                        name="dashboard"
                                        size={15}
                                    />

                                </span>

                                Dashboard

                            </a>


                            {/* PENGGUNA */}

                            <a
                                href="/super-admin/pengguna"
                                className="
                                    sap-nav-item
                                    sap-nav-item-active
                                "
                            >

                                <span className="sap-nav-icon">

                                    <Icon
                                        name="users"
                                        size={15}
                                    />

                                </span>

                                Pengguna

                            </a>


                            {/* UNIT */}

                            <a
                                href="/super-admin/unit"
                                className="sap-nav-item"
                            >

                                <span className="sap-nav-icon">

                                    <Icon
                                        name="building"
                                        size={15}
                                    />

                                </span>

                                Unit

                            </a>


                            {/* AKTIVITAS */}

                            <a
                                href="/super-admin/aktivitas"
                                className="sap-nav-item"
                            >

                                <span className="sap-nav-icon">

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
                                sap-sidebar-spacer
                            "
                        />


                        {/* PROFILE */}

                        <div
                            className="
                                sap-profile-box
                            "
                        >

                            <div
                                className="
                                    sap-profile-name
                                "
                            >
                                {
                                    user?.name ||
                                    'Super Admin'
                                }
                            </div>


                            <div
                                className="
                                    sap-profile-role
                                "
                            >
                                Super Admin
                            </div>


                            {/* LOGOUT */}

                            <form
                                method="POST"
                                action="/logout"
                                className="
                                    sap-logout-form
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
                                        sap-logout
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

                    <main className="sap-main">

                        <div className="sap-container">


                            {/* TOPBAR */}

                            <div className="sap-topbar">

                                <div>

                                    <div className="sap-kicker">
                                        ADMINISTRASI SISTEM
                                    </div>


                                    <h1 className="sap-title">
                                        Pengguna
                                    </h1>


                                    <p className="sap-subtitle">

                                        Kelola akun pengguna,
                                        role, unit kerja,
                                        dan status akses
                                        sistem.

                                    </p>

                                </div>


                                <div
                                    className="
                                        sap-actions
                                    "
                                >

                                    <a
                                        href="/super-admin/dashboard"
                                        className="sap-button"
                                    >
                                        Kembali ke Dashboard
                                    </a>


                                    <button
                                        type="button"
                                        className="
                                            sap-button
                                            sap-button-primary
                                        "
                                        onClick={
                                            openCreate
                                        }
                                    >

                                        <Icon
                                            name="plus"
                                            size={13}
                                        />

                                        Tambah Pengguna

                                    </button>

                                </div>

                            </div>


                            {/* SUCCESS */}

                            {
                                flash?.success && (

                                    <div
                                        className="
                                            sap-alert
                                            sap-alert-success
                                        "
                                    >

                                        {
                                            flash.success
                                        }

                                    </div>

                                )
                            }


                            {/* ERROR */}

                            {
                                hasErrors && (

                                    <div
                                        className="
                                            sap-alert
                                            sap-alert-error
                                        "
                                    >

                                        {
                                            normalizedErrors.map(
                                                (
                                                    message,
                                                    index
                                                ) => (

                                                    <div
                                                        key={
                                                            index
                                                        }
                                                    >
                                                        {
                                                            String(
                                                                message
                                                            )
                                                        }
                                                    </div>

                                                )
                                            )
                                        }

                                    </div>

                                )
                            }


                            {/* =================================================
                                FILTER
                            ================================================== */}

                            <section
                                className="
                                    sap-card
                                    sap-filter-card
                                "
                            >

                                <div
                                    className="
                                        sap-filter-header
                                    "
                                >

                                    <div className="sap-card-title">
                                        Filter Pengguna
                                    </div>


                                    <div
                                        className="
                                            sap-card-description
                                        "
                                    >
                                        Gunakan pencarian dan
                                        filter untuk menemukan
                                        akun tertentu.
                                    </div>

                                </div>


                                <form
                                    className="
                                        sap-filter-body
                                    "
                                    onSubmit={
                                        submitFilters
                                    }
                                >


                                    {/* SEARCH */}

                                    <div
                                        className="
                                            sap-field
                                        "
                                    >

                                        <label
                                            className="
                                                sap-label
                                            "
                                        >
                                            Pencarian
                                        </label>


                                        <input
                                            className="
                                                sap-input
                                            "
                                            value={
                                                search
                                            }
                                            onChange={
                                                (
                                                    event
                                                ) =>
                                                    setSearch(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                            }
                                            placeholder="
                                                Nama atau email
                                            "
                                        />

                                    </div>


                                    {/* ROLE */}

                                    <div
                                        className="
                                            sap-field
                                        "
                                    >

                                        <label
                                            className="
                                                sap-label
                                            "
                                        >
                                            Role
                                        </label>


                                        <select
                                            className="
                                                sap-select
                                            "
                                            value={
                                                roleFilter
                                            }
                                            onChange={
                                                (
                                                    event
                                                ) =>
                                                    setRoleFilter(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                            }
                                        >

                                            <option value="">
                                                Semua role
                                            </option>


                                            {
                                                safeRoles.map(
                                                    (
                                                        item
                                                    ) => (

                                                        <option
                                                            key={
                                                                item.id
                                                            }
                                                            value={
                                                                item.slug
                                                            }
                                                        >
                                                            {
                                                                roleLabel(
                                                                    item.slug
                                                                )
                                                            }
                                                        </option>

                                                    )
                                                )
                                            }

                                        </select>

                                    </div>


                                    {/* UNIT */}

                                    <div
                                        className="
                                            sap-field
                                        "
                                    >

                                        <label
                                            className="
                                                sap-label
                                            "
                                        >
                                            Unit
                                        </label>


                                        <select
                                            className="
                                                sap-select
                                            "
                                            value={
                                                unitFilter
                                            }
                                            onChange={
                                                (
                                                    event
                                                ) =>
                                                    setUnitFilter(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                            }
                                        >

                                            <option value="">
                                                Semua unit
                                            </option>


                                            {
                                                safeUnits.map(
                                                    (
                                                        item
                                                    ) => (

                                                        <option
                                                            key={
                                                                item.id
                                                            }
                                                            value={
                                                                item.id
                                                            }
                                                        >

                                                            {
                                                                item.code
                                                                    ? `${item.code} — `
                                                                    : ''
                                                            }

                                                            {
                                                                item.name
                                                            }

                                                        </option>

                                                    )
                                                )
                                            }

                                        </select>

                                    </div>


                                    {/* STATUS */}

                                    <div
                                        className="
                                            sap-field
                                        "
                                    >

                                        <label
                                            className="
                                                sap-label
                                            "
                                        >
                                            Status
                                        </label>


                                        <select
                                            className="
                                                sap-select
                                            "
                                            value={
                                                statusFilter
                                            }
                                            onChange={
                                                (
                                                    event
                                                ) =>
                                                    setStatusFilter(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                            }
                                        >

                                            <option value="">
                                                Semua status
                                            </option>

                                            <option value="1">
                                                Aktif
                                            </option>

                                            <option value="0">
                                                Nonaktif
                                            </option>

                                        </select>

                                    </div>


                                    {/* BUTTON */}

                                    <div
                                        className="
                                            sap-filter-actions
                                        "
                                    >

                                        <button
                                            type="submit"
                                            className="
                                                sap-button
                                                sap-button-primary
                                            "
                                        >
                                            Terapkan
                                        </button>


                                        <button
                                            type="button"
                                            className="
                                                sap-button
                                            "
                                            onClick={
                                                resetFilters
                                            }
                                        >
                                            Reset
                                        </button>

                                    </div>

                                </form>

                            </section>


                            {/* =================================================
                                TABLE
                            ================================================== */}

                            <section
                                className="
                                    sap-card
                                "
                            >

                                <div
                                    className="
                                        sap-filter-header
                                    "
                                >

                                    <div className="sap-card-title">
                                        Daftar Pengguna
                                    </div>


                                    <div
                                        className="
                                            sap-card-description
                                        "
                                    >
                                        {
                                            pagination?.total ??
                                            safeUsers.length
                                        } akun terdaftar.
                                    </div>

                                </div>


                                <div
                                    className="
                                        sap-table-wrap
                                    "
                                >

                                    {
                                        safeUsers.length ===
                                        0

                                            ? (

                                                <div
                                                    className="
                                                        sap-empty
                                                    "
                                                >

                                                    Belum ada
                                                    pengguna yang
                                                    sesuai dengan
                                                    filter.

                                                </div>

                                            )

                                            : (

                                                <table
                                                    className="
                                                        sap-table
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

                                                            <th>
                                                                Aksi
                                                            </th>

                                                        </tr>

                                                    </thead>


                                                    <tbody>

                                                        {
                                                            safeUsers.map(
                                                                (
                                                                    item
                                                                ) => {

                                                                    const isSelf =
                                                                        String(
                                                                            item?.id
                                                                        ) ===
                                                                        String(
                                                                            currentUserId
                                                                        );


                                                                    return (

                                                                        <tr
                                                                            key={
                                                                                item?.id ??
                                                                                item?.email
                                                                            }
                                                                        >


                                                                            {/* USER */}

                                                                            <td>

                                                                                <div
                                                                                    className="
                                                                                        sap-name
                                                                                    "
                                                                                >
                                                                                    {
                                                                                        item?.name ||
                                                                                        '-'
                                                                                    }
                                                                                </div>


                                                                                <div
                                                                                    className="
                                                                                        sap-email
                                                                                    "
                                                                                >
                                                                                    {
                                                                                        item?.email ||
                                                                                        '-'
                                                                                    }
                                                                                </div>


                                                                                {
                                                                                    isSelf && (

                                                                                        <span
                                                                                            className="
                                                                                                sap-pill
                                                                                                sap-pill-self
                                                                                            "
                                                                                        >
                                                                                            Akun Anda
                                                                                        </span>

                                                                                    )
                                                                                }

                                                                            </td>


                                                                            {/* ROLE */}

                                                                            <td>

                                                                                <span
                                                                                    className="
                                                                                        sap-pill
                                                                                        sap-pill-role
                                                                                    "
                                                                                >

                                                                                    {
                                                                                        roleLabel(
                                                                                            item?.role?.slug
                                                                                        )
                                                                                    }

                                                                                </span>

                                                                            </td>


                                                                            {/* UNIT */}

                                                                            <td>

                                                                                {
                                                                                    item?.unit

                                                                                        ? (
                                                                                            <>
                                                                                                {
                                                                                                    item.unit.code
                                                                                                        ? `${item.unit.code} — `
                                                                                                        : ''
                                                                                                }

                                                                                                {
                                                                                                    item.unit.name ||
                                                                                                    '-'
                                                                                                }
                                                                                            </>
                                                                                        )

                                                                                        : '-'
                                                                                }

                                                                            </td>


                                                                            {/* STATUS */}

                                                                            <td>

                                                                                <span
                                                                                    className={`
                                                                                        sap-pill
                                                                                        ${
                                                                                            item?.is_active
                                                                                                ? 'sap-pill-active'
                                                                                                : 'sap-pill-inactive'
                                                                                        }
                                                                                    `}
                                                                                >

                                                                                    {
                                                                                        formatStatus(
                                                                                            item?.is_active
                                                                                        )
                                                                                    }

                                                                                </span>

                                                                            </td>


                                                                            {/* ACTION */}

                                                                            <td>

                                                                                <div
                                                                                    className="
                                                                                        sap-actions-cell
                                                                                    "
                                                                                >


                                                                                    {/* EDIT */}

                                                                                    <button
                                                                                        type="button"
                                                                                        className="
                                                                                            sap-small-button
                                                                                        "
                                                                                        onClick={() =>
                                                                                            openEdit(
                                                                                                item
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Edit
                                                                                    </button>


                                                                                    {/* STATUS */}

                                                                                    <button
                                                                                        type="button"
                                                                                        className={`
                                                                                            sap-small-button
                                                                                            ${
                                                                                                !item?.is_active
                                                                                                    ? 'sap-small-button-success'
                                                                                                    : ''
                                                                                            }
                                                                                        `}
                                                                                        onClick={() =>
                                                                                            confirmToggle(
                                                                                                item
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            isSelf &&
                                                                                            item?.is_active
                                                                                        }
                                                                                    >

                                                                                        {
                                                                                            item?.is_active
                                                                                                ? 'Nonaktifkan'
                                                                                                : 'Aktifkan'
                                                                                        }

                                                                                    </button>


                                                                                    {/* DELETE */}

                                                                                    <button
                                                                                        type="button"
                                                                                        className="
                                                                                            sap-small-button
                                                                                            sap-small-button-danger
                                                                                        "
                                                                                        onClick={() =>
                                                                                            confirmDelete(
                                                                                                item
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            isSelf
                                                                                        }
                                                                                    >
                                                                                        Hapus
                                                                                    </button>


                                                                                </div>

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


                                {/* PAGINATION */}

                                <Pagination
                                    pagination={
                                        pagination
                                    }
                                    filters={{
                                        search,
                                        role:
                                            roleFilter,
                                        unit:
                                            unitFilter,
                                        status:
                                            statusFilter,
                                    }}
                                />

                            </section>


                            {/* FOOTER */}

                            <div
                                className="
                                    sap-footer
                                "
                            >
                                SIMAP Poltekkes Maluku
                            </div>

                        </div>

                    </main>

                </div>

            </div>


            {/* =========================================================
                MODAL TAMBAH / EDIT
            ========================================================== */}

            {
                showForm && (

                    <div
                        className="
                            sap-overlay
                        "
                        role="dialog"
                        aria-modal="true"
                    >

                        <form
                            className="
                                sap-modal
                            "
                            method="POST"
                            action={
                                editingUser
                                    ? `/super-admin/pengguna/${editingUser.id}`
                                    : '/super-admin/pengguna'
                            }
                        >


                            {/* HEADER */}

                            <div
                                className="
                                    sap-modal-header
                                "
                            >

                                <div>

                                    <div
                                        className="
                                            sap-card-title
                                        "
                                    >
                                        {
                                            formTitle
                                        }
                                    </div>


                                    <div
                                        className="
                                            sap-card-description
                                        "
                                    >

                                        {
                                            editingUser
                                                ? 'Perbarui informasi akun pengguna.'
                                                : 'Buat akun pengguna baru untuk SIMAP.'
                                        }

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    className="
                                        sap-modal-close
                                    "
                                    onClick={
                                        closeForm
                                    }
                                    aria-label="Tutup"
                                >
                                    ×
                                </button>

                            </div>


                            {/* BODY */}

                            <div
                                className="
                                    sap-modal-body
                                "
                            >

                                <input
                                    type="hidden"
                                    name="_token"
                                    value={
                                        csrfToken
                                    }
                                />


                                {
                                    editingUser && (

                                        <input
                                            type="hidden"
                                            name="_method"
                                            value="PUT"
                                        />

                                    )
                                }


                                <div
                                    className="
                                        sap-form-grid
                                    "
                                >


                                    {/* NAME */}

                                    <div
                                        className="
                                            sap-field
                                            sap-form-full
                                        "
                                    >

                                        <label
                                            className="
                                                sap-label
                                            "
                                        >

                                            Nama lengkap

                                            <span
                                                className="
                                                    sap-required
                                                "
                                            >
                                                {' '}*
                                            </span>

                                        </label>


                                        <input
                                            className="
                                                sap-input
                                            "
                                            name="name"
                                            value={
                                                form.name
                                            }
                                            onChange={
                                                (
                                                    event
                                                ) =>
                                                    updateForm(
                                                        'name',
                                                        event
                                                            .target
                                                            .value
                                                    )
                                            }
                                            required
                                            maxLength={
                                                255
                                            }
                                            autoFocus
                                        />

                                    </div>


                                    {/* EMAIL */}

                                    <div
                                        className="
                                            sap-field
                                        "
                                    >

                                        <label
                                            className="
                                                sap-label
                                            "
                                        >

                                            Email

                                            <span
                                                className="
                                                    sap-required
                                                "
                                            >
                                                {' '}*
                                            </span>

                                        </label>


                                        <input
                                            className="
                                                sap-input
                                            "
                                            name="email"
                                            type="email"
                                            value={
                                                form.email
                                            }
                                            onChange={
                                                (
                                                    event
                                                ) =>
                                                    updateForm(
                                                        'email',
                                                        event
                                                            .target
                                                            .value
                                                    )
                                            }
                                            required
                                            maxLength={
                                                255
                                            }
                                            autoComplete="username"
                                        />

                                    </div>


                                    {/* ROLE */}

                                    <div
                                        className="
                                            sap-field
                                        "
                                    >

                                        <label
                                            className="
                                                sap-label
                                            "
                                        >

                                            Role

                                            <span
                                                className="
                                                    sap-required
                                                "
                                            >
                                                {' '}*
                                            </span>

                                        </label>


                                        <select
                                            className="
                                                sap-select
                                            "
                                            name="role_id"
                                            value={
                                                form.role_id
                                            }
                                            onChange={
                                                handleRoleChange
                                            }
                                            required
                                        >

                                            <option value="">
                                                Pilih role
                                            </option>


                                            {
                                                safeRoles.map(
                                                    (
                                                        item
                                                    ) => (

                                                        <option
                                                            key={
                                                                item.id
                                                            }
                                                            value={
                                                                item.id
                                                            }
                                                        >

                                                            {
                                                                roleLabel(
                                                                    item.slug
                                                                )
                                                            }

                                                        </option>

                                                    )
                                                )
                                            }

                                        </select>

                                    </div>


                                    {/* UNIT */}

                                    <div
                                        className="
                                            sap-field
                                        "
                                    >

                                        <label
                                            className="
                                                sap-label
                                            "
                                        >

                                            Unit

                                            {
                                                roleNeedsUnit && (

                                                    <span
                                                        className="
                                                            sap-required
                                                        "
                                                    >
                                                        {' '}*
                                                    </span>

                                                )
                                            }

                                        </label>


                                        <select
                                            className="
                                                sap-select
                                            "
                                            name="unit_id"
                                            value={
                                                form.unit_id
                                            }
                                            onChange={
                                                (
                                                    event
                                                ) =>
                                                    updateForm(
                                                        'unit_id',
                                                        event
                                                            .target
                                                            .value
                                                    )
                                            }
                                            required={
                                                roleNeedsUnit
                                            }
                                        >

                                            <option value="">
                                                {
                                                    roleNeedsUnit
                                                        ? 'Pilih unit'
                                                        : 'Tidak terkait unit'
                                                }
                                            </option>


                                            {
                                                safeUnits.map(
                                                    (
                                                        item
                                                    ) => (

                                                        <option
                                                            key={
                                                                item.id
                                                            }
                                                            value={
                                                                item.id
                                                            }
                                                        >

                                                            {
                                                                item.code
                                                                    ? `${item.code} — `
                                                                    : ''
                                                            }

                                                            {
                                                                item.name
                                                            }

                                                        </option>

                                                    )
                                                )
                                            }

                                        </select>


                                        <div
                                            className="
                                                sap-help
                                            "
                                        >

                                            Kepala Unit dan
                                            Staf wajib
                                            terhubung ke unit.
                                            Role lain dapat
                                            dibiarkan tanpa
                                            unit.

                                        </div>

                                    </div>


                                    {/* PASSWORD */}

                                    <div
                                        className="
                                            sap-field
                                        "
                                    >

                                        <label
                                            className="
                                                sap-label
                                            "
                                        >

                                            {
                                                editingUser
                                                    ? 'Password baru'
                                                    : 'Password'
                                            }


                                            {
                                                !editingUser && (

                                                    <span
                                                        className="
                                                            sap-required
                                                        "
                                                    >
                                                        {' '}*
                                                    </span>

                                                )
                                            }

                                        </label>


                                        <div
                                            className="
                                                sap-password-wrap
                                            "
                                        >

                                            <input
                                                className="
                                                    sap-input
                                                "
                                                name="password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={
                                                    form.password
                                                }
                                                onChange={
                                                    (
                                                        event
                                                    ) =>
                                                        updateForm(
                                                            'password',
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                }
                                                minLength={
                                                    8
                                                }
                                                required={
                                                    !editingUser
                                                }
                                                placeholder={
                                                    editingUser
                                                        ? 'Kosongkan jika tidak diubah'
                                                        : 'Minimal 8 karakter'
                                                }
                                                autoComplete="new-password"
                                            />


                                            <button
                                                type="button"
                                                className="
                                                    sap-password-toggle
                                                "
                                                onClick={() =>
                                                    setShowPassword(
                                                        (
                                                            value
                                                        ) =>
                                                            !value
                                                    )
                                                }
                                            >

                                                {
                                                    showPassword
                                                        ? 'Sembunyikan'
                                                        : 'Lihat'
                                                }

                                            </button>

                                        </div>


                                        <div
                                            className="
                                                sap-help
                                            "
                                        >

                                            {
                                                editingUser
                                                    ? 'Isi hanya jika password ingin diganti.'
                                                    : 'Password minimal 8 karakter.'
                                            }

                                        </div>

                                    </div>


                                    {/* STATUS */}

                                    <div
                                        className="
                                            sap-field
                                        "
                                    >

                                        <label
                                            className="
                                                sap-label
                                            "
                                        >
                                            Status akun
                                        </label>


                                        <label
                                            className="
                                                sap-checkbox-wrap
                                            "
                                        >

                                            <input
                                                className="
                                                    sap-checkbox
                                                "
                                                type="checkbox"
                                                name="is_active"
                                                value="1"
                                                checked={
                                                    form.is_active
                                                }
                                                onChange={
                                                    (
                                                        event
                                                    ) =>
                                                        updateForm(
                                                            'is_active',
                                                            event
                                                                .target
                                                                .checked
                                                        )
                                                }
                                                disabled={
                                                    String(
                                                        editingUser?.id
                                                    ) ===
                                                    String(
                                                        currentUserId
                                                    )
                                                }
                                            />


                                            <span
                                                className="
                                                    sap-checkbox-label
                                                "
                                            >
                                                Akun aktif dan
                                                dapat login
                                            </span>

                                        </label>

                                    </div>

                                </div>

                            </div>


                            {/* FOOTER */}

                            <div
                                className="
                                    sap-modal-footer
                                "
                            >

                                <button
                                    type="button"
                                    className="
                                        sap-button
                                    "
                                    onClick={
                                        closeForm
                                    }
                                >
                                    Batal
                                </button>


                                <button
                                    type="submit"
                                    className="
                                        sap-button
                                        sap-button-primary
                                    "
                                >

                                    {
                                        editingUser
                                            ? 'Simpan Perubahan'
                                            : 'Simpan Pengguna'
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                )
            }

        </>
    );
}


/*
|--------------------------------------------------------------------------
| PAGINATION
|--------------------------------------------------------------------------
*/

function Pagination({
    pagination = {},
    filters = {},
}) {

    if (
        !pagination ||
        !pagination.last_page ||
        pagination.last_page <= 1
    ) {
        return null;
    }


    const buildUrl = (url) => {

        if (!url) {
            return '#';
        }


        const target =
            new URL(
                url,
                window.location.origin
            );


        const params =
            target.searchParams;


        if (filters.search) {
            params.set(
                'search',
                filters.search
            );
        }


        if (filters.role) {
            params.set(
                'role',
                filters.role
            );
        }


        if (filters.unit) {
            params.set(
                'unit',
                filters.unit
            );
        }


        if (
            filters.status !== ''
        ) {
            params.set(
                'status',
                filters.status
            );
        }


        target.search =
            params.toString();


        return target.toString();
    };


    const pageLinks =
        Array.isArray(
            pagination.links
        )
            ? pagination.links
            : [];


    return (

        <div
            className="
                sap-pagination
            "
        >

            <div
                className="
                    sap-pagination-info
                "
            >

                Menampilkan{' '}

                {
                    pagination.from ??
                    0
                }

                –

                {
                    pagination.to ??
                    0
                }

                {' '}dari{' '}

                {
                    pagination.total ??
                    0
                }

                {' '}pengguna

            </div>


            <div
                className="
                    sap-pagination-nav
                "
            >


                {/* PREVIOUS */}

                <a
                    className={`
                        sap-page-link
                        ${
                            !pagination.prev_page_url
                                ? 'sap-page-link-disabled'
                                : ''
                        }
                    `}
                    href={
                        buildUrl(
                            pagination.prev_page_url
                        )
                    }
                >
                    Sebelumnya
                </a>


                {/* NUMBERS */}

                {
                    pageLinks
                        .slice(
                            1,
                            -1
                        )
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
                                        key={`
                                            ${link?.label}
                                            -
                                            ${index}
                                        `}
                                        className={`
                                            sap-page-link
                                            ${
                                                link?.active
                                                    ? 'sap-page-link-active'
                                                    : ''
                                            }
                                            ${
                                                !link?.url
                                                    ? 'sap-page-link-disabled'
                                                    : ''
                                            }
                                        `}
                                        href={
                                            buildUrl(
                                                link?.url
                                            )
                                        }
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
                        )
                }


                {/* NEXT */}

                <a
                    className={`
                        sap-page-link
                        ${
                            !pagination.next_page_url
                                ? 'sap-page-link-disabled'
                                : ''
                        }
                    `}
                    href={
                        buildUrl(
                            pagination.next_page_url
                        )
                    }
                >
                    Berikutnya
                </a>

            </div>

        </div>

    );
}


/*
|--------------------------------------------------------------------------
| ICON
|--------------------------------------------------------------------------
*/

function Icon({
    name,
    size = 18,
}) {

    const common = {
        width: size,
        height: size,

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


        plus: (
            <>
                <path
                    d="M12 5v14"
                />

                <path
                    d="M5 12h14"
                />
            </>
        ),


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
            {
                icons[name] ||
                null
            }
        </svg>

    );
}