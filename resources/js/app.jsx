import React from 'react';
import { createRoot } from 'react-dom/client';

import '../css/app.css';

// =====================================================
// AUTH / DASHBOARD
// =====================================================

import LoginPage from './pages/login';
import Dashboard from './pages/Dashboard';
import DirekturDashboard from './pages/DirekturDashboard';
import SekretarisDashboard from './pages/SekretarisDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminPengguna from './pages/SuperAdminPengguna';

// =====================================================
// UNIT
// =====================================================

import UnitDashboard from './pages/UnitDashboard';

// =====================================================
// SURAT MASUK
// =====================================================

import SuratMasuk from './pages/SuratMasuk';
import SuratMasukCreate from './pages/SuratMasukCreate';
import SuratMasukDetail from './pages/SuratMasukDetail';
import SuratMasukEdit from './pages/SuratMasukEdit';

// =====================================================
// DISPOSISI
// =====================================================

import Disposisi from './pages/Disposisi';
import DisposisiCreate from './pages/DisposisiCreate';
import DisposisiDetail from './pages/DisposisiDetail';

import DisposisiUnit from './pages/DisposisiUnit';
import DisposisiUnitDetail from './pages/DisposisiUnitDetail';

// =====================================================
// AGENDA
// =====================================================

import Agenda from './pages/Agenda';
import AgendaDirektur from './pages/AgendaDirektur';
import AgendaCreate from './pages/AgendaCreate';
import AgendaEdit from './pages/AgendaEdit';
import AgendaDetail from './pages/AgendaDetail';

// =====================================================
// ROOT APP
// =====================================================

const app = document.getElementById('app');

if (app) {

    const page = app.dataset.page;

    // =====================================================
    // LOGIN
    // =====================================================

    if (page === 'login') {

        createRoot(app).render(
            <React.StrictMode>
                <LoginPage />
            </React.StrictMode>
        );

    }

    // =====================================================
    // SUPER ADMIN DASHBOARD
    // =====================================================

    else if (page === 'super-admin-dashboard') {

        createRoot(app).render(
            <React.StrictMode>

                <SuperAdminDashboard
                    user={
                        window.superAdminDashboardData
                            ?.user ||
                        null
                    }

                    stats={
                        window.superAdminDashboardData
                            ?.stats ||
                        {}
                    }

                    usersTerbaru={
                        window.superAdminDashboardData
                            ?.usersTerbaru ||
                        []
                    }
                />

            </React.StrictMode>
        );

    }


    // =====================================================
    // SUPER ADMIN PENGGUNA
    // =====================================================

    else if (page === 'super-admin-pengguna') {

        createRoot(app).render(
            <React.StrictMode>

                <SuperAdminPengguna
                    user={
                        window.superAdminPenggunaData
                            ?.user ||
                        null
                    }

                    users={
                        window.superAdminPenggunaData
                            ?.users ||
                        []
                    }

                    roles={
                        window.superAdminPenggunaData
                            ?.roles ||
                        []
                    }

                    units={
                        window.superAdminPenggunaData
                            ?.units ||
                        []
                    }

                    filters={
                        window.superAdminPenggunaData
                            ?.filters ||
                        {}
                    }

                    pagination={
                        window.superAdminPenggunaData
                            ?.pagination ||
                        {}
                    }

                    csrfToken={
                        window.superAdminPenggunaData
                            ?.csrfToken ||
                        ''
                    }

                    flash={
                        window.superAdminPenggunaData
                            ?.flash ||
                        {}
                    }

                    errors={
                        window.superAdminPenggunaData
                            ?.errors ||
                        []
                    }
                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // DEFAULT DASHBOARD
    // =====================================================

    else if (page === 'dashboard') {

        createRoot(app).render(
            <React.StrictMode>
                <Dashboard />
            </React.StrictMode>
        );

    }

    // =====================================================
    // DIREKTUR DASHBOARD
    // =====================================================

    else if (
        page === 'direktur-dashboard'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <DirekturDashboard

                    user={
                        window.dashboardData
                            ?.user ||
                        null
                    }

                    stats={
                        window.dashboardData
                            ?.stats ||
                        {}
                    }

                    agendaHariIni={
                        window.dashboardData
                            ?.agendaHariIni ||
                        []
                    }

                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // SEKRETARIS DASHBOARD
    // =====================================================

    else if (
        page === 'sekretaris-dashboard'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <SekretarisDashboard

                    user={
                        window.sekretarisDashboardData
                            ?.user ||
                        null
                    }

                    stats={
                        window.sekretarisDashboardData
                            ?.stats ||
                        {}
                    }

                    suratTerbaru={
                        window.sekretarisDashboardData
                            ?.suratTerbaru ||
                        []
                    }

                    agendaHariIniData={
                        window.sekretarisDashboardData
                            ?.agendaHariIniData ||
                        []
                    }

                    disposisiTerbaru={
                        window.sekretarisDashboardData
                            ?.disposisiTerbaru ||
                        []
                    }

                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // UNIT DASHBOARD
    // =====================================================

    else if (
        page === 'unit-dashboard'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <UnitDashboard

                    user={
                        window.unitDashboardData
                            ?.user ||
                        null
                    }

                    unit={
                        window.unitDashboardData
                            ?.unit ||
                        null
                    }

                    stats={
                        window.unitDashboardData
                            ?.stats ||
                        {}
                    }

                    disposisiTerbaru={
                        window.unitDashboardData
                            ?.disposisiTerbaru ||
                        []
                    }

                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // SURAT MASUK
    // =====================================================

    else if (
        page === 'surat-masuk'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <SuratMasuk
                    suratMasuk={
                        window.suratMasukData ||
                        []
                    }
                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // TAMBAH SURAT MASUK
    // =====================================================

    else if (
        page === 'surat-masuk-create'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <SuratMasukCreate
                    errors={
                        window.suratMasukErrors ||
                        []
                    }
                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // DETAIL SURAT MASUK
    // =====================================================

    else if (
        page === 'surat-masuk-detail' ||
        page === 'surat-masuk-detail-direktur'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <SuratMasukDetail
                    surat={
                        window.suratMasukData ||
                        null
                    }
                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // EDIT SURAT MASUK
    // =====================================================

    else if (
        page === 'surat-masuk-edit'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <SuratMasukEdit

                    surat={
                        window.suratMasukData ||
                        null
                    }

                    errors={
                        window.suratMasukErrors ||
                        []
                    }

                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // DISPOSISI SEKRETARIS
    // =====================================================

    else if (
        page === 'disposisi'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <Disposisi
                    disposisis={
                        window.disposisiData ||
                        []
                    }
                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // DETAIL DISPOSISI SEKRETARIS
    // =====================================================

    else if (
        page === 'disposisi-detail'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <DisposisiDetail
                    disposisi={
                        window.disposisiDetailData ||
                        null
                    }
                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // BUAT DISPOSISI
    // =====================================================

    else if (
        page === 'disposisi-create'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <DisposisiCreate

                    surat={
                        window.suratMasukData ||
                        null
                    }

                    units={
                        window.disposisiUnits ||
                        []
                    }

                    errors={
                        window.suratMasukErrors ||
                        []
                    }

                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // DISPOSISI UNIT
    // =====================================================

    else if (
        page === 'disposisi-unit'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <DisposisiUnit
                    disposisis={
                        window.disposisiUnitData ||
                        []
                    }
                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // DETAIL DISPOSISI UNIT
    // =====================================================

    else if (
        page === 'disposisi-unit-detail'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <DisposisiUnitDetail
                    disposisi={
                        window.disposisiUnitDetailData ||
                        null
                    }
                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // AGENDA SEKRETARIS
    // =====================================================

    else if (
        page === 'agenda'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <Agenda
                    agenda={
                        window.agendaData ||
                        []
                    }
                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // AGENDA DIREKTUR
    // =====================================================

    else if (
        page === 'agenda-direktur'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <AgendaDirektur
                    agenda={
                        window.agendaDirekturData ||
                        []
                    }
                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // BUAT AGENDA
    // =====================================================

    else if (
        page === 'agenda-create'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <AgendaCreate

                    suratMasuk={
                        window.agendaSuratMasuk ||
                        null
                    }

                    errors={
                        window.agendaErrors ||
                        []
                    }

                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // EDIT AGENDA SEKRETARIS
    // =====================================================

    else if (
        page === 'agenda-edit'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <AgendaEdit

                    agenda={
                        window.agendaEditData
                            ?.agenda ||
                        null
                    }

                    errors={
                        window.agendaErrors ||
                        []
                    }

                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // DETAIL AGENDA SEKRETARIS
    // =====================================================

    else if (
        page === 'agenda-detail'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <AgendaDetail
                    agenda={
                        window.agendaDetailData
                            ?.agendaDetail ||
                        null
                    }
                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // DETAIL AGENDA DIREKTUR
    // =====================================================

    else if (
        page === 'agenda-detail-direktur'
    ) {

        createRoot(app).render(
            <React.StrictMode>

                <AgendaDetail
                    agenda={
                        window.agendaDetailData
                            ?.agendaDetail ||
                        null
                    }
                />

            </React.StrictMode>
        );

    }

    // =====================================================
    // UNKNOWN PAGE
    // =====================================================

    else {

        console.warn(
            `Halaman "${page}" belum memiliki komponen React.`
        );

        app.innerHTML = `
            <div style="
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                background:#f8fafc;
                font-family:Inter,system-ui,sans-serif;
                color:#475569;
                padding:30px;
            ">

                <div style="
                    text-align:center;
                    background:#ffffff;
                    padding:32px;
                    border-radius:16px;
                    border:1px solid #e2e8f0;
                ">

                    <div style="
                        font-size:18px;
                        font-weight:700;
                        margin-bottom:8px;
                        color:#0f2747;
                    ">
                        Halaman tidak ditemukan
                    </div>

                    <div style="
                        font-size:13px;
                        color:#64748b;
                    ">
                        Page: ${page || 'tidak diketahui'}
                    </div>

                </div>

            </div>
        `;
    }
}