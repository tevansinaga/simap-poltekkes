import React, { useEffect, useState } from 'react';

// =====================================================
// PWA INSTALL
// Event beforeinstallprompt ditangkap oleh partial PWA yang
// dimuat lebih dahulu dari React. Event disimpan di window
// agar tidak hilang karena urutan loading / HMR.
// =====================================================

const formatErrorMessage = (msg) => {
    if (!msg) {
        return '';
    }

    const lower = msg.toLowerCase();

    if (
        lower.includes('credentials') ||
        lower.includes('password') ||
        lower.includes('match')
    ) {
        return 'Email atau password yang Anda masukkan salah.';
    }

    if (lower.includes('required')) {
        return 'Email dan password wajib diisi.';
    }

    return msg;
};

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [remember, setRemember] = useState(true);
    
    // Perbaikan state PWA
    const [isInstalled, setIsInstalled] = useState(false);
    const [installAvailable, setInstallAvailable] = useState(false);
    const [installing, setInstalling] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    // =====================================================
    // DATA DARI LARAVEL
    // =====================================================

    useEffect(() => {
        const app = document.getElementById('app');

        if (!app) {
            return;
        }

        setErrorMsg(
            formatErrorMessage(
                app.dataset.error || ''
            )
        );

        setEmailValue(
            app.dataset.email || ''
        );
    }, []);

    // =====================================================
    // PWA INSTALL LOGIC (DIPERBAIKI)
    // =====================================================

    useEffect(() => {
        // Cek apakah aplikasi sudah terinstal (berjalan di mode standalone)
        const checkIsInstalled = () => {
            return window.matchMedia('(display-mode: standalone)').matches || 
                   window.navigator.standalone === true;
        };

        setIsInstalled(checkIsInstalled());

        // 1. Tangkap jika event datang langsung dari native browser
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault(); // Mencegah prompt muncul otomatis
            setDeferredPrompt(e);
            setInstallAvailable(true);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setInstallAvailable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // 2. Fallback: Cek apakah script eksternal (Blade) sudah menangkapnya duluan
        if (window.__SIMAP_PWA__?.installPrompt) {
            setDeferredPrompt(window.__SIMAP_PWA__.installPrompt);
            setInstallAvailable(true);
        }
        if (window.__SIMAP_PWA__?.installed) {
            setIsInstalled(true);
        }

        // 3. Tangkap custom event (jika Anda masih menggunakannya di script luar)
        const handleCustomAvailable = () => {
            if (window.__SIMAP_PWA__?.installPrompt) {
                setDeferredPrompt(window.__SIMAP_PWA__.installPrompt);
                setInstallAvailable(true);
            }
        };
        const handleCustomInstalled = () => setIsInstalled(true);

        window.addEventListener('simap:pwa-install-available', handleCustomAvailable);
        window.addEventListener('simap:pwa-installed', handleCustomInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            window.removeEventListener('simap:pwa-install-available', handleCustomAvailable);
            window.removeEventListener('simap:pwa-installed', handleCustomInstalled);
        };
    }, []);

    const handleInstallApp = async () => {
        if (isInstalled || !deferredPrompt) {
            console.info('Pemasangan PWA tidak tersedia atau sudah terinstal.');
            return;
        }

        try {
            setInstalling(true);

            // Tampilkan prompt instalasi ke user
            deferredPrompt.prompt();

            // Tunggu respon dari user
            const choiceResult = await deferredPrompt.userChoice;
            console.log('SIMAP PWA install result:', choiceResult.outcome);

            if (choiceResult.outcome === 'accepted') {
                setIsInstalled(true);
            }

            // Prompt hanya bisa dipakai satu kali, jadi kita reset
            setDeferredPrompt(null);
            setInstallAvailable(false);
            if (window.__SIMAP_PWA__) {
                window.__SIMAP_PWA__.installPrompt = null;
            }

        } catch (error) {
            console.error('Gagal membuka prompt instalasi PWA:', error);
        } finally {
            setInstalling(false);
        }
    };

    // =====================================================
    // CSRF
    // =====================================================

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '';

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = () => {
        setErrorMsg('');
        setLoading(true);
    };

    // =====================================================
    // ICON
    // =====================================================

    const Icon = ({
        name,
        size = 18,
        strokeWidth = 1.7,
    }) => {
        const common = {
            width: size,
            height: size,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            'aria-hidden': 'true',
        };

        const icons = {
            mail: (
                <>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                </>
            ),

            lock: (
                <>
                    <rect x="5" y="10" width="14" height="10" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </>
            ),

            eye: (
                <>
                    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                    <circle cx="12" cy="12" r="2.5" />
                </>
            ),

            eyeOff: (
                <>
                    <path d="m3 3 18 18" />
                    <path d="M10.6 6.2A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3 3.8" />
                    <path d="M6.2 6.3C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6a10.3 10.3 0 0 0 3.2-.5" />
                </>
            ),

            arrow: (
                <>
                    <path d="M5 12h13" />
                    <path d="m13 6 6 6-6 6" />
                </>
            ),

            seal: (
                <>
                    <circle cx="12" cy="12" r="8" />
                    <path d="m9 12 2 2 4-4" />
                    <path d="M12 4v1.6M12 18.4V20M4 12h1.6M18.4 12H20" />
                </>
            ),

            tray: (
                <>
                    <path d="M4 13h4l1.5 2h5L16 13h4" />
                    <path d="M5.5 6h13l1.5 7v6a1 1 0 0 1-1 1h-14a1 1 0 0 1-1-1v-6z" />
                </>
            ),

            route: (
                <>
                    <circle cx="6" cy="6" r="2" />
                    <circle cx="18" cy="18" r="2" />
                    <path d="M8 6h6a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H9a3 3 0 0 0-3 3v0" />
                </>
            ),

            book: (
                <>
                    <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H18a1 1 0 0 1 1 1v15.5a1 1 0 0 1-1 1H6.5A1.5 1.5 0 0 1 5 19V4.5Z" />
                    <path d="M8 3v17" />
                </>
            ),

            install: (
                <>
                    <path d="M12 3v11" />
                    <path d="m7 9 5 5 5-5" />
                    <path d="M5 20h14" />
                </>
            ),
        };

        return <svg {...common}>{icons[name]}</svg>;
    };

    return (
        <div className="login-page">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&family=Inter:wght@400;500;600;700;800&display=swap');

                * {
                    box-sizing: border-box;
                }

                html, body, #app {
                    min-height: 100%;
                    margin: 0;
                }

                body {
                    margin: 0;
                    background: #efe9dc;
                }

                .login-page {
                    --ink: #1c2521;
                    --navy: #0d2b3c;
                    --navy-deep: #081b28;
                    --clove: #8a3a20;
                    --clove-dark: #6f2d19;
                    --brass: #c39a5a;
                    --paper: #faf6ee;
                    --paper-line: #e4dac6;
                    --slate: #5c6b70;

                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 28px;
                    background: #efe9dc;
                    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
                    color: var(--ink);
                }

                .login-page *:focus-visible {
                    outline: 2px solid var(--clove);
                    outline-offset: 2px;
                }

                @media (prefers-reduced-motion: reduce) {
                    .login-page * {
                        animation-duration: 0.001ms !important;
                        transition-duration: 0.001ms !important;
                    }
                }

                /* =================================================
                   SHELL
                ================================================= */

                .login-shell {
                    width: 100%;
                    max-width: 1160px;
                    min-height: 660px;
                    display: grid;
                    grid-template-columns: 1.05fr 1fr;
                    overflow: hidden;
                    border-radius: 6px;
                    background: var(--paper);
                    box-shadow: 0 40px 90px rgba(8, 27, 40, 0.22);
                    animation: shell-rise 0.5s ease both;
                }

                @keyframes shell-rise {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* =================================================
                   LEFT SIDE — institutional panel
                ================================================= */

                .login-left {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    min-width: 0;
                    overflow: hidden;
                    padding: 46px 46px 30px;
                    background: linear-gradient(175deg, var(--navy) 0%, var(--navy-deep) 100%);
                    color: #f4efe4;
                }

                /* scattered islands — Kepulauan Maluku motif */
                .island-map {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    opacity: 0.55;
                    pointer-events: none;
                }

                .login-left-content {
                    position: relative;
                    z-index: 2;
                }

                /* =================================================
                   LOGO
                ================================================= */

                .institution-logo {
                    display: inline-flex;
                    width: fit-content;
                    max-width: 100%;
                    padding: 14px 20px;
                    background: #ffffff;
                    border-radius: 4px;
                }

                .institution-logo img {
                    display: block;
                    width: auto;
                    height: auto;
                    max-height: 84px;
                    max-width: 280px;
                    object-fit: contain;
                }

                /* =================================================
                   BRANDING
                ================================================= */

                .brand-intro {
                    margin-top: 36px;
                }

                .brand-eyebrow {
                    padding-left: 12px;
                    border-left: 2px solid var(--brass);
                    color: rgba(244, 239, 228, 0.72);
                    font-size: 12.5px;
                    line-height: 1.5;
                }

                .brand-title {
                    margin: 18px 0 0;
                    font-family: 'Source Serif 4', Georgia, serif;
                    font-size: 52px;
                    line-height: 1;
                    letter-spacing: -0.5px;
                    font-weight: 600;
                    color: #f4efe4;
                }

                .brand-description {
                    max-width: 460px;
                    margin: 16px 0 0;
                    color: rgba(244, 239, 228, 0.68);
                    font-size: 13px;
                    line-height: 1.75;
                }

                /* =================================================
                   FEATURES — document index style
                ================================================= */

                .brand-feature-list {
                    margin-top: 34px;
                    border-top: 1px solid rgba(244, 239, 228, 0.14);
                }

                .brand-feature {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    padding: 12px 0;
                    border-bottom: 1px solid rgba(244, 239, 228, 0.14);
                    color: rgba(244, 239, 228, 0.82);
                    font-size: 12.5px;
                    line-height: 1.5;
                }

                .brand-feature svg {
                    flex-shrink: 0;
                    color: var(--brass);
                }

                /* =================================================
                   LEFT FOOTER
                ================================================= */

                .brand-footer {
                    position: relative;
                    z-index: 2;
                    padding-top: 18px;
                    border-top: 1px solid rgba(244, 239, 228, 0.14);
                    color: rgba(244, 239, 228, 0.5);
                    font-size: 11px;
                    line-height: 1.6;
                }

                /* =================================================
                   RIGHT SIDE
                ================================================= */

                .login-right {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 42px;
                    background: var(--paper);
                }

                .login-card {
                    width: 100%;
                    max-width: 380px;
                }

                /* =================================================
                   HEADER
                ================================================= */

                .login-title {
                    margin: 0;
                    font-family: 'Source Serif 4', Georgia, serif;
                    color: var(--navy-deep);
                    font-size: 30px;
                    line-height: 1.2;
                    font-weight: 600;
                }

                .login-subtitle {
                    margin: 10px 0 30px;
                    color: var(--slate);
                    font-size: 13px;
                    line-height: 1.7;
                }

                /* =================================================
                   INPUT
                ================================================= */

                .form-group {
                    margin-bottom: 18px;
                }

                .form-label {
                    display: block;
                    margin-bottom: 7px;
                    color: var(--ink);
                    font-size: 12.5px;
                    font-weight: 600;
                }

                .input-wrap {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 13px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--slate);
                    display: flex;
                    align-items: center;
                    pointer-events: none;
                }

                .form-input {
                    width: 100%;
                    height: 46px;
                    padding: 0 44px 0 39px;
                    border: 1px solid var(--paper-line);
                    border-radius: 5px;
                    outline: none;
                    background: #ffffff;
                    color: var(--ink);
                    font-size: 13px;
                    font-family: inherit;
                    transition: border-color 0.15s ease, box-shadow 0.15s ease;
                }

                .form-input::placeholder {
                    color: #a9a093;
                }

                .form-input:hover {
                    border-color: #d3c7ac;
                }

                .form-input:focus {
                    border-color: var(--clove);
                    box-shadow: 0 0 0 3px rgba(138, 58, 32, 0.12);
                }

                .password-button {
                    position: absolute;
                    right: 6px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 33px;
                    height: 33px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    border-radius: 4px;
                    background: transparent;
                    color: var(--slate);
                    cursor: pointer;
                    transition: background 0.15s ease, color 0.15s ease;
                }

                .password-button:hover {
                    background: #f1ece0;
                    color: var(--navy-deep);
                }

                /* =================================================
                   REMEMBER
                ================================================= */

                .remember-row {
                    margin: 2px 0 22px;
                }

                .remember-label {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    color: var(--slate);
                    font-size: 12.5px;
                    cursor: pointer;
                    user-select: none;
                }

                .remember-label input {
                    width: 15px;
                    height: 15px;
                    margin: 0;
                    accent-color: var(--clove);
                }

                /* =================================================
                   BUTTON
                ================================================= */

                .login-button {
                    width: 100%;
                    height: 48px;
                    border: none;
                    border-radius: 5px;
                    background: var(--navy-deep);
                    color: #f4efe4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 9px;
                    font-size: 13px;
                    font-family: inherit;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s ease, opacity 0.15s ease;
                }

                .login-button:hover:not(:disabled) {
                    background: var(--navy);
                }

                .login-button:disabled {
                    cursor: not-allowed;
                    opacity: 0.65;
                }

                .login-arrow {
                    display: flex;
                    align-items: center;
                }

                /* =================================================
                   PWA INSTALL
                ================================================= */

                .install-wrap {
                    margin-top: 12px;
                }

                .install-button {
                    width: 100%;
                    min-height: 44px;
                    padding: 10px 14px;
                    border: 1px solid var(--paper-line);
                    border-radius: 5px;
                    background: #ffffff;
                    color: var(--navy-deep);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 9px;
                    font-size: 12.5px;
                    font-family: inherit;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
                }

                .install-button:hover:not(:disabled) {
                    background: #f7f2e8;
                    border-color: #d3c7ac;
                }

                .install-button:disabled {
                    cursor: default;
                    opacity: 0.72;
                }

                .install-button:not(:disabled) {
                    box-shadow: 0 6px 18px rgba(8, 27, 40, 0.06);
                }

                .install-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .spinner {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    border: 2px solid rgba(244, 239, 228, 0.35);
                    border-top-color: #f4efe4;
                    animation: login-spin 0.8s linear infinite;
                }

                @keyframes login-spin {
                    to { transform: rotate(360deg); }
                }

                /* =================================================
                   ERROR
                ================================================= */

                .error-box {
                    margin-top: 14px;
                    padding: 11px 13px;
                    border-radius: 5px;
                    background: #fbf1ec;
                    border: 1px solid #e3c3b3;
                    color: var(--clove-dark);
                    font-size: 12px;
                    line-height: 1.6;
                }

                /* =================================================
                   SECURITY
                ================================================= */

                .security {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 26px;
                    padding-top: 18px;
                    border-top: 1px solid var(--paper-line);
                    color: var(--slate);
                    font-size: 11.5px;
                }

                .security svg {
                    flex-shrink: 0;
                    color: var(--brass);
                }

                .copyright {
                    margin-top: 14px;
                    color: #a9a093;
                    font-size: 11px;
                }

                /* =================================================
                   TABLET
                ================================================= */

                @media (max-width: 980px) {
                    .login-shell {
                        grid-template-columns: 1fr;
                        max-width: 560px;
                    }

                    .login-left {
                        min-height: 300px;
                    }

                    .login-right {
                        padding: 30px;
                    }

                    .brand-feature-list {
                        display: none;
                    }
                }

                /* =================================================
                   MOBILE
                ================================================= */

                @media (max-width: 600px) {
                    .login-page {
                        padding: 12px;
                        align-items: flex-start;
                    }

                    .login-shell {
                        border-radius: 4px;
                    }

                    .login-left {
                        min-height: 260px;
                        padding: 28px 24px 22px;
                    }

                    .institution-logo {
                        padding: 10px 16px;
                    }

                    .institution-logo img {
                        max-height: 56px;
                    }

                    .brand-title {
                        font-size: 38px;
                    }

                    .login-right {
                        padding: 26px 20px;
                    }

                    .login-title {
                        font-size: 25px;
                    }
                }
            `}</style>

            <div className="login-shell">

                {/* =================================================
                   PANEL KIRI
                ================================================= */}

                <section className="login-left">

                    <svg
                        className="island-map"
                        viewBox="0 0 460 640"
                        preserveAspectRatio="xMaxYMax slice"
                        aria-hidden="true"
                    >
                        {/* dotted archipelago, loosely evoking Kepulauan Maluku */}
                        {[
                            [340, 120, 3], [365, 150, 2], [300, 170, 2],
                            [390, 230, 3], [355, 260, 2], [410, 300, 2],
                            [330, 330, 4], [370, 360, 2], [300, 390, 2],
                            [420, 410, 3], [350, 440, 2], [390, 470, 2],
                            [310, 490, 3], [430, 520, 2], [360, 540, 3],
                            [300, 560, 2], [400, 580, 2],
                        ].map(([cx, cy, r], i) => (
                            <circle
                                key={i}
                                cx={cx}
                                cy={cy}
                                r={r}
                                fill="#c39a5a"
                            />
                        ))}
                        <path
                            d="M300 170 L340 120 L365 150 L390 230 L410 300 L370 360 L420 410 L390 470 L430 520 L400 580"
                            stroke="rgba(195,154,90,0.25)"
                            strokeWidth="1"
                            fill="none"
                        />
                    </svg>

                    <div className="login-left-content">

                        {/* LOGO */}
                        <div className="institution-logo">
                            <img
                                src="/images/poltekkes-maluku.png"
                                alt="Logo Kemenkes Poltekkes Maluku"
                            />
                        </div>

                        {/* INTRO */}
                        <div className="brand-intro">

                            <p className="brand-eyebrow">
                                Sistem informasi administrasi
                            </p>

                            <h1 className="brand-title">
                                SIMAP
                            </h1>

                            <p className="brand-description">
                                Sistem Manajemen Administrasi Poltekkes
                                Maluku untuk mendukung pengelolaan surat,
                                disposisi, agenda Direktur, dan administrasi
                                secara terintegrasi.
                            </p>

                        </div>

                        {/* FEATURES */}
                        <div className="brand-feature-list">

                            <div className="brand-feature">
                                <Icon name="tray" size={16} />
                                <span>Pengelolaan surat masuk secara terstruktur</span>
                            </div>

                            <div className="brand-feature">
                                <Icon name="route" size={16} />
                                <span>Disposisi dan monitoring tindak lanjut</span>
                            </div>

                            <div className="brand-feature">
                                <Icon name="book" size={16} />
                                <span>Agenda Direktur yang terintegrasi</span>
                            </div>

                        </div>

                    </div>

                    <div className="brand-footer">
                        Sistem administrasi internal Poltekkes Kemenkes Maluku
                    </div>

                </section>

                {/* =================================================
                   PANEL KANAN
                ================================================= */}

                <section className="login-right">

                    <div className="login-card">

                        <h2 className="login-title">
                            Selamat datang kembali
                        </h2>

                        <p className="login-subtitle">
                            Masuk menggunakan akun Anda untuk mengakses
                            sistem administrasi Poltekkes Maluku.
                        </p>

                        {/* FORM */}

                        <form
                            method="POST"
                            action="/login"
                            onSubmit={handleSubmit}
                        >

                            {/* CSRF */}

                            <input
                                type="hidden"
                                name="_token"
                                value={csrfToken}
                            />

                            {/* EMAIL */}

                            <div className="form-group">

                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>

                                <div className="input-wrap">

                                    <span className="input-icon">
                                        <Icon name="mail" size={15} />
                                    </span>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="form-input"
                                        placeholder="Masukkan email"
                                        autoComplete="email"
                                        value={emailValue}
                                        onChange={(e) => setEmailValue(e.target.value)}
                                        required
                                        autoFocus
                                    />

                                </div>

                            </div>

                            {/* PASSWORD */}

                            <div className="form-group">

                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>

                                <div className="input-wrap">

                                    <span className="input-icon">
                                        <Icon name="lock" size={15} />
                                    </span>

                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-input"
                                        placeholder="Masukkan password"
                                        autoComplete="current-password"
                                        value={passwordValue}
                                        onChange={(e) => setPasswordValue(e.target.value)}
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                    >
                                        <Icon name={showPassword ? 'eyeOff' : 'eye'} size={16} />
                                    </button>

                                </div>

                            </div>

                            {/* REMEMBER */}

                            <div className="remember-row">

                                <label className="remember-label">

                                    <input
                                        type="checkbox"
                                        name="remember"
                                        value="1"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                    />

                                    <span>Ingat saya</span>

                                </label>

                            </div>

                            {/* LOGIN */}

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner" />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Masuk ke SIMAP</span>
                                        <span className="login-arrow">
                                            <Icon name="arrow" size={15} />
                                        </span>
                                    </>
                                )}
                            </button>

                            {/* INSTALL PWA */}

                            <div className="install-wrap">
                                <button
                                    type="button"
                                    className="install-button"
                                    onClick={handleInstallApp}
                                    disabled={isInstalled || installing || !installAvailable}
                                    aria-label={
                                        isInstalled
                                            ? 'SIMAP sudah terpasang'
                                            : installAvailable
                                                ? 'Instal Aplikasi SIMAP'
                                                : 'Instal Aplikasi SIMAP'
                                    }
                                >
                                    <span className="install-icon">
                                        <Icon name="install" size={16} />
                                    </span>

                                    <span>
                                        {isInstalled
                                            ? 'SIMAP sudah terpasang'
                                            : installing
                                                ? 'Membuka instalasi...'
                                                : 'Instal Aplikasi SIMAP'}
                                    </span>
                                </button>

                            </div>

                            {/* ERROR */}

                            {errorMsg && (
                                <div className="error-box" role="alert">
                                    {errorMsg}
                                </div>
                            )}

                        </form>

                        {/* SECURITY */}

                        <div className="security">
                            <Icon name="seal" size={14} />
                            <span>Autentikasi sistem dilindungi oleh Laravel.</span>
                        </div>

                        {/* COPYRIGHT */}

                        <div className="copyright">
                            © 2026 SIMAP Poltekkes Maluku
                        </div>

                    </div>

                </section>

            </div>
        </div>
    );
}