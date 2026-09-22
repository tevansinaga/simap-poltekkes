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
    const safeStats = stats && typeof stats === 'object' ? stats : {};
    const safeActions = actionOptions && typeof actionOptions === 'object'
        ? actionOptions
        : {};
    const safeModules = moduleOptions && typeof moduleOptions === 'object'
        ? moduleOptions
        : {};

    const [search, setSearch] = useState(filters?.search || '');
    const [action, setAction] = useState(filters?.action || '');
    const [module, setModule] = useState(filters?.module || '');
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');

    const userName = user?.name || 'Super Admin';
    const userRole = user?.role?.name || 'Super Admin';
    const userInitial = userName.trim().charAt(0).toUpperCase() || 'S';

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
        if (!value) return '-';

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value);

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

        if (search.trim()) params.set('search', search.trim());
        if (action) params.set('action', action);
        if (module) params.set('module', module);
        if (dateFrom) params.set('date_from', dateFrom);
        if (dateTo) params.set('date_to', dateTo);

        const query = params.toString();
        return query ? `?${query}` : '';
    };

    const submitFilter = (event) => {
        event.preventDefault();
        window.location.href = `/super-admin/aktivitas${buildQuery()}`;
    };

    const resetFilter = () => {
        window.location.href = '/super-admin/aktivitas';
    };

    const openPagination = (url) => {
        if (url) window.location.href = url;
    };

    const handleLogout = (event) => {
        if (!window.confirm('Yakin ingin keluar dari SIMAP?')) {
            event.preventDefault();
        }
    };

    return (
        <>
            <style>{`
                * { box-sizing: border-box; }
                body { margin: 0; background: #f4f7fb; }
                button, input, select { font: inherit; }
                a { color: inherit; text-decoration: none; }

                .activity-page {
                    min-height: 100vh;
                    background: #f4f7fb;
                    color: #0f172a;
                }

                .activity-shell {
                    min-height: 100vh;
                    display: flex;
                }

                .activity-sidebar {
                    width: 236px;
                    min-height: 100vh;
                    position: fixed;
                    inset: 0 auto 0 0;
                    background: #0b1f3a;
                    color: #dbeafe;
                    padding: 22px 15px;
                    display: flex;
                    flex-direction: column;
                    z-index: 20;
                }

                .activity-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 3px 7px 22px;
                }

                .activity-brand-logo {
                    width: 38px;
                    height: 38px;
                    border-radius: 11px;
                    background: rgba(255,255,255,.1);
                    border: 1px solid rgba(255,255,255,.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .activity-brand-logo img {
                    width: 26px;
                    height: 26px;
                    object-fit: contain;
                }

                .activity-brand-title {
                    font-size: 15px;
                    font-weight: 800;
                    letter-spacing: .04em;
                    color: #fff;
                }

                .activity-brand-subtitle {
                    margin-top: 2px;
                    font-size: 10px;
                    color: #93a7c4;
                }

                .activity-nav-label {
                    padding: 0 8px 8px;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: .12em;
                    color: #7185a2;
                }

                .activity-nav {
                    display: grid;
                    gap: 5px;
                }

                .activity-nav-item {
                    min-height: 40px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 0 11px;
                    border-radius: 11px;
                    color: #b8c7db;
                    font-size: 11px;
                    font-weight: 650;
                    transition: .18s ease;
                }

                .activity-nav-item:hover {
                    color: #fff;
                    background: rgba(255,255,255,.06);
                }

                .activity-nav-item.active {
                    color: #fff;
                    background: linear-gradient(135deg, #1677ff, #135bd8);
                    box-shadow: 0 8px 22px rgba(19,91,216,.28);
                }

                .activity-nav-icon {
                    width: 23px;
                    height: 23px;
                    display: grid;
                    place-items: center;
                    flex: 0 0 auto;
                    border-radius: 7px;
                    background: rgba(255,255,255,.08);
                }

                .activity-nav-item.active .activity-nav-icon {
                    background: rgba(255,255,255,.12);
                }

                .activity-sidebar-spacer { flex: 1; }

                .activity-profile {
                    padding: 13px 12px;
                    border-radius: 13px;
                    background: rgba(255,255,255,.055);
                    border: 1px solid rgba(255,255,255,.07);
                }

                .activity-profile-name {
                    color: #fff;
                    font-size: 11px;
                    font-weight: 750;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .activity-profile-role {
                    margin-top: 3px;
                    color: #8fa2bc;
                    font-size: 9px;
                }

                .activity-logout {
                    margin-top: 11px;
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    color: #a9bad0;
                    font-size: 10px;
                    font-weight: 700;
                }

                .activity-logout:hover { color: #fff; }

                .activity-main {
                    flex: 1;
                    margin-left: 236px;
                    min-width: 0;
                }

                .activity-container {
                    max-width: 1420px;
                    margin: 0 auto;
                    padding: 27px 29px 40px;
                }

                .activity-topbar {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 18px;
                    margin-bottom: 22px;
                }

                .activity-kicker {
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: .13em;
                    color: #6b7c93;
                }

                .activity-title {
                    margin: 4px 0 0;
                    font-size: 25px;
                    line-height: 1.16;
                    font-weight: 830;
                    letter-spacing: -.025em;
                    color: #0d1b31;
                }

                .activity-subtitle {
                    margin: 6px 0 0;
                    color: #7b8aa0;
                    font-size: 11px;
                    line-height: 1.7;
                }

                .activity-header-user {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    padding: 8px 9px 8px 12px;
                    border-radius: 13px;
                    background: #fff;
                    border: 1px solid #e3eaf2;
                }

                .activity-header-copy {
                    text-align: right;
                }

                .activity-header-name {
                    font-size: 10px;
                    font-weight: 800;
                    color: #13233c;
                }

                .activity-header-role {
                    margin-top: 2px;
                    font-size: 8px;
                    color: #8090a6;
                }

                .activity-avatar {
                    width: 31px;
                    height: 31px;
                    border-radius: 10px;
                    display: grid;
                    place-items: center;
                    background: #eaf2ff;
                    color: #1a63d9;
                    font-size: 11px;
                    font-weight: 800;
                }

                .activity-stat-grid {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 11px;
                    margin-bottom: 14px;
                }

                .activity-stat {
                    padding: 15px 16px;
                    border-radius: 15px;
                    background: #fff;
                    border: 1px solid #e1e8f0;
                    box-shadow: 0 6px 20px rgba(31,52,75,.035);
                }

                .activity-stat-label {
                    color: #8291a6;
                    font-size: 9px;
                    font-weight: 720;
                    letter-spacing: .03em;
                }

                .activity-stat-value {
                    margin-top: 7px;
                    font-size: 23px;
                    line-height: 1;
                    font-weight: 840;
                    color: #12223a;
                }

                .activity-stat-note {
                    margin-top: 7px;
                    color: #a1adbd;
                    font-size: 8px;
                }

                .activity-card {
                    border-radius: 16px;
                    background: #fff;
                    border: 1px solid #e1e8f0;
                    box-shadow: 0 8px 26px rgba(31,52,75,.04);
                    overflow: hidden;
                }

                .activity-card-header {
                    padding: 16px 17px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 14px;
                    border-bottom: 1px solid #eef2f6;
                }

                .activity-card-title {
                    font-size: 13px;
                    font-weight: 820;
                    color: #15243b;
                }

                .activity-card-description {
                    margin-top: 3px;
                    color: #8997a9;
                    font-size: 9px;
                    line-height: 1.5;
                }

                .activity-count-pill {
                    padding: 5px 8px;
                    border-radius: 8px;
                    background: #f1f5fb;
                    color: #58708f;
                    font-size: 8px;
                    font-weight: 760;
                    white-space: nowrap;
                }

                .activity-filter {
                    padding: 13px 17px;
                    display: grid;
                    grid-template-columns: minmax(220px, 1.7fr) repeat(2, minmax(135px, .8fr)) repeat(2, minmax(130px, .75fr)) auto auto;
                    gap: 8px;
                    border-bottom: 1px solid #eef2f6;
                    background: #fbfcfe;
                }

                .activity-input,
                .activity-select {
                    width: 100%;
                    height: 34px;
                    padding: 0 10px;
                    border-radius: 9px;
                    border: 1px solid #dfe7ef;
                    outline: none;
                    background: #fff;
                    color: #31445d;
                    font-size: 9px;
                }

                .activity-input::placeholder { color: #adb8c7; }
                .activity-input:focus,
                .activity-select:focus { border-color: #77aaf5; box-shadow: 0 0 0 3px rgba(23,119,255,.08); }

                .activity-button {
                    height: 34px;
                    border: 0;
                    border-radius: 9px;
                    padding: 0 12px;
                    cursor: pointer;
                    font-size: 9px;
                    font-weight: 800;
                }

                .activity-button-primary {
                    background: #1265dd;
                    color: #fff;
                }

                .activity-button-primary:hover { background: #0f59c4; }

                .activity-button-light {
                    background: #eef3f8;
                    color: #5b6d82;
                }

                .activity-button-light:hover { background: #e5ebf1; }

                .activity-table-wrap { overflow-x: auto; }

                .activity-table {
                    width: 100%;
                    min-width: 930px;
                    border-collapse: collapse;
                }

                .activity-table th {
                    padding: 11px 14px;
                    text-align: left;
                    background: #fbfcfe;
                    border-bottom: 1px solid #edf1f5;
                    color: #8997a8;
                    font-size: 8px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: .06em;
                }

                .activity-table td {
                    padding: 12px 14px;
                    border-bottom: 1px solid #f0f3f7;
                    vertical-align: top;
                    color: #3d4d63;
                    font-size: 9px;
                }

                .activity-table tr:last-child td { border-bottom: 0; }
                .activity-table tbody tr:hover td { background: #fcfdff; }

                .activity-actor {
                    font-size: 9px;
                    font-weight: 790;
                    color: #20324b;
                }

                .activity-actor-email {
                    margin-top: 3px;
                    color: #9aa6b4;
                    font-size: 8px;
                }

                .activity-module {
                    font-weight: 760;
                    color: #4b5f78;
                }

                .activity-description {
                    max-width: 460px;
                    color: #52657c;
                    line-height: 1.6;
                }

                .activity-meta {
                    margin-top: 3px;
                    color: #a2adba;
                    font-size: 8px;
                }

                .activity-badge {
                    display: inline-flex;
                    align-items: center;
                    min-height: 22px;
                    padding: 0 8px;
                    border-radius: 7px;
                    background: #eef2f7;
                    color: #627189;
                    font-size: 8px;
                    font-weight: 800;
                    white-space: nowrap;
                }

                .activity-badge-login { background: #eaf7ef; color: #16824d; }
                .activity-badge-logout { background: #eef2f7; color: #64748b; }
                .activity-badge-create { background: #eaf2ff; color: #1d66d5; }
                .activity-badge-update { background: #f1edff; color: #6d49c6; }
                .activity-badge-status { background: #fff6df; color: #a66e00; }
                .activity-badge-delete { background: #fff0f0; color: #c84c4c; }

                .activity-empty {
                    padding: 52px 18px;
                    text-align: center;
                    color: #8e9caf;
                    font-size: 10px;
                }

                .activity-empty strong {
                    display: block;
                    margin-bottom: 4px;
                    color: #344861;
                    font-size: 12px;
                }

                .activity-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    padding: 13px 16px;
                    border-top: 1px solid #eef2f6;
                    background: #fbfcfe;
                }

                .activity-pagination-info {
                    color: #96a2b1;
                    font-size: 8px;
                }

                .activity-pagination {
                    display: flex;
                    gap: 5px;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                }

                .activity-page-link {
                    min-width: 27px;
                    height: 27px;
                    padding: 0 7px;
                    border: 1px solid #dfe6ee;
                    border-radius: 7px;
                    background: #fff;
                    color: #5b6c82;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 8px;
                    font-weight: 770;
                    cursor: pointer;
                }

                .activity-page-link.active {
                    background: #1265dd;
                    border-color: #1265dd;
                    color: #fff;
                }

                .activity-page-link.disabled {
                    opacity: .45;
                    pointer-events: none;
                }

                .activity-bottom-note {
                    margin-top: 12px;
                    text-align: right;
                    color: #a3aebb;
                    font-size: 8px;
                }

                @media (max-width: 1180px) {
                    .activity-filter {
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }
                }

                @media (max-width: 920px) {
                    .activity-sidebar {
                        width: 76px;
                        padding-left: 9px;
                        padding-right: 9px;
                    }
                    .activity-brand { justify-content: center; padding-left: 0; padding-right: 0; }
                    .activity-brand-copy,
                    .activity-nav-label,
                    .activity-nav-item span:not(.activity-nav-icon),
                    .activity-profile-name,
                    .activity-profile-role,
                    .activity-logout-text { display: none; }
                    .activity-nav-item { justify-content: center; padding-left: 0; padding-right: 0; }
                    .activity-nav-icon { width: 32px; height: 32px; }
                    .activity-profile { padding: 10px; display: flex; justify-content: center; }
                    .activity-logout { margin-top: 0; }
                    .activity-main { margin-left: 76px; }
                    .activity-stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }

                @media (max-width: 640px) {
                    .activity-container { padding: 18px 13px 30px; }
                    .activity-topbar { flex-direction: column; }
                    .activity-header-user { align-self: stretch; justify-content: space-between; }
                    .activity-header-copy { text-align: left; }
                    .activity-stat-grid { grid-template-columns: 1fr 1fr; gap: 7px; }
                    .activity-stat { padding: 12px; }
                    .activity-stat-value { font-size: 20px; }
                    .activity-filter { grid-template-columns: 1fr 1fr; }
                    .activity-filter > :first-child { grid-column: 1 / -1; }
                    .activity-filter > .wide-mobile { grid-column: 1 / -1; }
                    .activity-card-header { padding: 13px; }
                    .activity-footer { align-items: flex-start; flex-direction: column; }
                    .activity-pagination { justify-content: flex-start; }
                }

                @media (max-width: 430px) {
                    .activity-sidebar { display: none; }
                    .activity-main { margin-left: 0; }
                    .activity-stat-grid { grid-template-columns: 1fr 1fr; }
                    .activity-filter { grid-template-columns: 1fr; }
                    .activity-filter > * { grid-column: 1 / -1 !important; }
                }
            `}</style>

            <div className="activity-page">
                <div className="activity-shell">
                    <aside className="activity-sidebar">
                        <div className="activity-brand">
                            <div className="activity-brand-logo">
                                <img src="/images/poltekkes-icon.png" alt="Logo Poltekkes Maluku" />
                            </div>
                            <div className="activity-brand-copy">
                                <div className="activity-brand-title">SIMAP</div>
                                <div className="activity-brand-subtitle">Poltekkes Maluku</div>
                            </div>
                        </div>

                        <div className="activity-nav-label">MENU UTAMA</div>

                        <nav className="activity-nav">
                            <NavItem href="/super-admin/dashboard" label="Dashboard" icon="dashboard" />
                            <NavItem href="/super-admin/pengguna" label="Pengguna" icon="users" />
                            <NavItem href="/super-admin/unit" label="Unit" icon="building" />
                            <NavItem href="/super-admin/aktivitas" label="Aktivitas Sistem" icon="activity" active />
                        </nav>

                        <div className="activity-sidebar-spacer" />

                        <div className="activity-profile">
                            <div>
                                <div className="activity-profile-name">{userName}</div>
                                <div className="activity-profile-role">{userRole}</div>
                            </div>
                            <a className="activity-logout" href="/logout" onClick={handleLogout} title="Keluar dari SIMAP">
                                <Icon name="logout" size={13} />
                                <span className="activity-logout-text">Keluar</span>
                            </a>
                        </div>
                    </aside>

                    <main className="activity-main">
                        <div className="activity-container">
                            <div className="activity-topbar">
                                <div>
                                    <div className="activity-kicker">ADMINISTRASI SISTEM</div>
                                    <h1 className="activity-title">Aktivitas Sistem</h1>
                                    <p className="activity-subtitle">
                                        Pantau riwayat tindakan penting yang tercatat di SIMAP Poltekkes Maluku.
                                    </p>
                                </div>

                                <div className="activity-header-user">
                                    <div className="activity-header-copy">
                                        <div className="activity-header-name">{userName}</div>
                                        <div className="activity-header-role">{userRole}</div>
                                    </div>
                                    <div className="activity-avatar">{userInitial}</div>
                                </div>
                            </div>

                            <div className="activity-stat-grid">
                                <Stat label="Total Aktivitas" value={safeStats.total ?? 0} note="Seluruh log yang tersimpan" />
                                <Stat label="Hari Ini" value={safeStats.today ?? 0} note="Aktivitas pada hari berjalan" />
                                <Stat label="Minggu Ini" value={safeStats.thisWeek ?? 0} note="Aktivitas sejak awal minggu" />
                                <Stat label="Bulan Ini" value={safeStats.thisMonth ?? 0} note="Aktivitas pada bulan berjalan" />
                            </div>

                            <section className="activity-card">
                                <div className="activity-card-header">
                                    <div>
                                        <div className="activity-card-title">Riwayat Aktivitas</div>
                                        <div className="activity-card-description">
                                            Setiap entri menampilkan pengguna, modul, tindakan, waktu, dan sumber akses.
                                        </div>
                                    </div>
                                    <div className="activity-count-pill">
                                        {Number(pagination?.total || 0)} aktivitas
                                    </div>
                                </div>

                                <form className="activity-filter" onSubmit={submitFilter}>
                                    <input
                                        className="activity-input wide-mobile"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Cari pengguna, deskripsi, modul, aksi, atau IP..."
                                    />

                                    <select className="activity-select" value={module} onChange={(event) => setModule(event.target.value)}>
                                        <option value="">Semua Modul</option>
                                        {Object.entries(safeModules).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>

                                    <select className="activity-select" value={action} onChange={(event) => setAction(event.target.value)}>
                                        <option value="">Semua Aksi</option>
                                        {Object.entries(safeActions).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>

                                    <input className="activity-input" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
                                    <input className="activity-input" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />

                                    <button type="submit" className="activity-button activity-button-primary">Terapkan</button>
                                    <button type="button" className="activity-button activity-button-light" onClick={resetFilter}>Reset</button>
                                </form>

                                <div className="activity-table-wrap">
                                    {safeActivities.length === 0 ? (
                                        <div className="activity-empty">
                                            <strong>Belum ada aktivitas tercatat</strong>
                                            Aktivitas akan muncul setelah tindakan penting dilakukan di sistem.
                                        </div>
                                    ) : (
                                        <table className="activity-table">
                                            <thead>
                                                <tr>
                                                    <th>Waktu</th>
                                                    <th>Pengguna</th>
                                                    <th>Modul</th>
                                                    <th>Aksi</th>
                                                    <th>Deskripsi</th>
                                                    <th>IP</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {safeActivities.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <div>{formatDateTime(item.created_at)}</div>
                                                            {item?.user?.unit?.name ? (
                                                                <div className="activity-meta">{item.user.unit.name}</div>
                                                            ) : null}
                                                        </td>
                                                        <td>
                                                            <div className="activity-actor">{item?.user?.name || 'Akun dihapus'}</div>
                                                            <div className="activity-actor-email">{item?.user?.email || '-'}</div>
                                                        </td>
                                                        <td>
                                                            <div className="activity-module">{item?.module || '-'}</div>
                                                        </td>
                                                        <td>
                                                            <span className={actionClass(item?.action)}>
                                                                {actionLabel(item?.action)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="activity-description">{item?.description || '-'}</div>
                                                            {item?.user_agent ? (
                                                                <div className="activity-meta">Perangkat: {item.user_agent}</div>
                                                            ) : null}
                                                        </td>
                                                        <td>
                                                            <div>{item?.ip_address || '-'}</div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                {(Number(pagination?.total || 0) > 0) && (
                                    <div className="activity-footer">
                                        <div className="activity-pagination-info">
                                            Menampilkan {pagination?.from || 0}–{pagination?.to || 0} dari {pagination?.total || 0} aktivitas
                                        </div>

                                        <div className="activity-pagination">
                                            <button
                                                type="button"
                                                className={`activity-page-link ${pagination?.prev_page_url ? '' : 'disabled'}`}
                                                onClick={() => openPagination(pagination?.prev_page_url)}
                                            >
                                                ‹
                                            </button>

                                            {paginationLinks.slice(0, 7).map((link, index) => (
                                                <button
                                                    type="button"
                                                    key={`${link.label}-${index}`}
                                                    className={`activity-page-link ${link.active ? 'active' : ''}`}
                                                    onClick={() => openPagination(link.url)}
                                                >
                                                    {stripHtml(link.label)}
                                                </button>
                                            ))}

                                            <button
                                                type="button"
                                                className={`activity-page-link ${pagination?.next_page_url ? '' : 'disabled'}`}
                                                onClick={() => openPagination(pagination?.next_page_url)}
                                            >
                                                ›
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>

                            <div className="activity-bottom-note">
                                SIMAP Poltekkes Maluku • Aktivitas sistem tersimpan sebagai catatan administrasi.
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

function Stat({ label, value, note }) {
    return (
        <div className="activity-stat">
            <div className="activity-stat-label">{label}</div>
            <div className="activity-stat-value">{value}</div>
            <div className="activity-stat-note">{note}</div>
        </div>
    );
}

function NavItem({ href, label, icon, active = false }) {
    return (
        <a className={`activity-nav-item ${active ? 'active' : ''}`} href={href}>
            <span className="activity-nav-icon"><Icon name={icon} size={14} /></span>
            <span>{label}</span>
        </a>
    );
}

function stripHtml(value) {
    return String(value || '').replace(/<[^>]*>/g, '');
}

function Icon({ name, size = 16 }) {
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
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
            </>
        ),
        users: (
            <>
                <circle cx="9" cy="8" r="3" />
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

    return <svg {...common}>{icons[name] || icons.activity}</svg>;
}
