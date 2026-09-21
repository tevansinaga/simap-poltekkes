import React, { useEffect, useState } from 'react';

// =====================================================
// UTILITAS
// =====================================================

const formatErrorMessage = (msg) => {
    if (!msg) return '';

    const text = String(msg);
    const lower = text.toLowerCase();

    // Cek "required" lebih dulu, karena pesan seperti
    // "The password field is required" juga mengandung kata "password".
    if (lower.includes('required')) {
        return 'Email dan password wajib diisi.';
    }

    if (lower.includes('too many') || lower.includes('throttle')) {
        const seconds = text.match(/(\d+)\s*second/i);
        return seconds
            ? `Terlalu banyak percobaan masuk. Coba lagi dalam ${seconds[1]} detik.`
            : 'Terlalu banyak percobaan masuk. Coba lagi beberapa saat lagi.';
    }

    if (
        lower.includes('credentials') ||
        lower.includes('password') ||
        lower.includes('match')
    ) {
        return 'Email atau password yang Anda masukkan salah.';
    }

    return text;
};

// Data yang dikirim Laravel lewat atribut data-* pada #app.
const readAppData = () => {
    if (typeof document === 'undefined') {
        return { error: '', email: '' };
    }

    const app = document.getElementById('app');

    return {
        error: formatErrorMessage(app?.dataset.error || ''),
        email: app?.dataset.email || '',
    };
};

const readCsrfToken = () => {
    if (typeof document === 'undefined') return '';

    return (
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || ''
    );
};

// =====================================================
// ICON
// =====================================================

const Icon = ({ name, size = 18, strokeWidth = 1.8 }) => {
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
        focusable: 'false',
    };

    const icons = {
        mail: (
            <>
                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                <path d="m3.5 7 8.5 6 8.5-6" />
            </>
        ),
        lock: (
            <>
                <rect x="5" y="10" width="14" height="10" rx="2.5" />
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
        shield: (
            <>
                <path d="M12 3.5 19 7v5.2c0 4.4-2.9 7.2-7 8.3-4.1-1.1-7-3.9-7-8.3V7l7-3.5Z" />
                <path d="m8.8 12 2.1 2.1 4.5-4.7" />
            </>
        ),
        install: (
            <>
                <path d="M12 3v10.5" />
                <path d="m7.5 9 4.5 4.5L16.5 9" />
                <path d="M5 20h14" />
            </>
        ),
        phone: (
            <>
                <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
                <path d="M11 18.5h2" />
            </>
        ),
        check: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12.2 2.5 2.5L16.5 9" />
            </>
        ),
        tick: <path d="m5 12.5 4.5 4.5L19 7.5" />,
        alert: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7.5v5.5" />
                <path d="M12 16.5h.01" />
            </>
        ),
        calendar: (
            <>
                <rect x="4" y="5.5" width="16" height="14" rx="2" />
                <path d="M8 3.5v4M16 3.5v4M4 9.5h16" />
            </>
        ),
    };

    return <svg {...common}>{icons[name] || icons.check}</svg>;
};

// =====================================================
// ELEMEN VISUAL
// =====================================================

// Garis kontur kedalaman laut: kiasan kepulauan Maluku.
const CONTOUR_PATH =
    'M-96,-20 C-90,-62 -48,-92 -4,-84 C38,-76 58,-98 92,-66 C122,-38 104,6 92,34 C80,64 96,96 54,104 C14,112 -8,88 -40,96 C-78,104 -104,64 -98,30 C-94,8 -98,-2 -96,-20 Z';

const SEA_ISLANDS = [
    { key: 'a', x: 620, y: 170, rotate: 0, rings: 10 },
    { key: 'b', x: 90, y: 820, rotate: 150, rings: 7 },
];

const PAPER_ISLANDS = [{ key: 'p', x: 735, y: 90, rotate: 200, rings: 9 }];

const Contours = ({ islands, tone = 'sea', className = 'contours' }) => (
    <svg
        className={className}
        viewBox="0 0 800 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
    >
        {islands.map((island) =>
            Array.from({ length: island.rings }, (_, i) => {
                const scale = 0.5 + i * 0.5;
                const isSea = tone === 'sea';

                let stroke;
                if (isSea) {
                    stroke =
                        i < 3
                            ? 'rgba(138,208,200,0.36)'
                            : `rgba(255,255,255,${Math.max(0.03, 0.12 - i * 0.01).toFixed(3)})`;
                } else {
                    stroke = `rgba(13,59,82,${Math.max(0.025, 0.085 - i * 0.006).toFixed(3)})`;
                }

                const fill =
                    i === 0
                        ? isSea
                            ? 'rgba(47,156,148,0.16)'
                            : 'rgba(47,156,148,0.07)'
                        : 'none';

                return (
                    <path
                        key={`${island.key}-${i}`}
                        d={CONTOUR_PATH}
                        transform={`translate(${island.x} ${island.y}) rotate(${island.rotate}) scale(${scale})`}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                    />
                );
            })
        )}
    </svg>
);

// Garis pantai: batas antara "laut" (panel kiri) dan "daratan" (panel kanan).
const COAST_V =
    'M30,1000 C20,960 40,930 34,890 C28,850 12,832 18,790 C24,748 46,736 42,690 C38,644 16,630 20,580 C24,532 48,520 44,470 C40,420 14,404 20,352 C26,300 46,284 40,236 C34,188 14,172 22,124 C30,76 46,60 38,0';

const COAST_H =
    'M0,24 C60,10 120,34 190,22 C260,10 320,32 400,20 C480,8 540,32 620,22 C700,12 770,34 850,20 C910,10 960,26 1000,18';

const CoastVertical = () => (
    <svg
        className="coast coast-v"
        viewBox="0 0 64 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
    >
        <path d={`${COAST_V} L64,0 L64,1000 Z`} className="coast-land" />
        <path
            d={COAST_V}
            transform="translate(-19 0)"
            fill="none"
            stroke="rgba(138,208,200,0.12)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
        />
        <path
            d={COAST_V}
            transform="translate(-9 0)"
            fill="none"
            stroke="rgba(138,208,200,0.22)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
        />
        <path
            d={COAST_V}
            fill="none"
            stroke="rgba(138,208,200,0.5)"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
        />
    </svg>
);

const CoastHorizontal = () => (
    <svg
        className="coast coast-h"
        viewBox="0 0 1000 50"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
    >
        <g transform="translate(0 10)">
            <path d={`${COAST_H} L1000,40 L0,40 Z`} className="coast-land" />
            <path
                d={COAST_H}
                transform="translate(0 -8)"
                fill="none"
                stroke="rgba(138,208,200,0.22)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
            />
            <path
                d={COAST_H}
                fill="none"
                stroke="rgba(138,208,200,0.5)"
                strokeWidth="1.25"
                vectorEffect="non-scaling-stroke"
            />
        </g>
    </svg>
);

// Contoh alur satu surat, sebagai ilustrasi fitur SIMAP.
const SLIP_STEPS = [
    {
        title: 'Surat diterima',
        note: 'Dicatat oleh sekretariat',
        time: '08.15',
        state: 'done',
    },
    {
        title: 'Disposisi Direktur',
        note: 'Diteruskan ke Wakil Direktur I',
        time: '09.02',
        state: 'done',
    },
    {
        title: 'Tindak lanjut',
        note: 'Sedang diproses unit terkait',
        time: 'Berjalan',
        state: 'current',
    },
];

const DispositionSlip = () => (
    <div className="slip-wrap" aria-hidden="true">
        <div className="slip-stack">
            <div className="slip">
                <div className="slip-head">
                    <p className="slip-title">Lembar disposisi</p>
                    <span className="slip-stamp">Disposisi</span>
                </div>

                <dl className="slip-meta">
                    <div>
                        <dt>Perihal</dt>
                        <dd>Undangan rapat koordinasi</dd>
                    </div>
                    <div>
                        <dt>Asal surat</dt>
                        <dd>Instansi mitra</dd>
                    </div>
                </dl>

                <ol className="slip-steps">
                    {SLIP_STEPS.map((step) => (
                        <li
                            key={step.title}
                            className={`slip-step ${step.state}`}
                        >
                            <span className={`step-dot ${step.state}`}>
                                {step.state === 'done' && (
                                    <Icon name="tick" size={12} strokeWidth={3} />
                                )}
                            </span>
                            <span>
                                <span className="step-title">{step.title}</span>
                                <span className="step-note">{step.note}</span>
                            </span>
                            <span className="step-time">{step.time}</span>
                        </li>
                    ))}
                </ol>

                <div className="slip-agenda">
                    <Icon name="calendar" size={16} />
                    <span>Masuk agenda Direktur, Kamis pukul 10.00</span>
                </div>
            </div>
        </div>

        <p className="slip-caption">Ilustrasi alur surat di SIMAP</p>
    </div>
);

// =====================================================
// LOGIN PAGE
// =====================================================

export default function LoginPage() {
    const [initial] = useState(readAppData);
    const [csrfToken] = useState(readCsrfToken);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(initial.error);
    const [emailValue, setEmailValue] = useState(initial.email);
    const [passwordValue, setPasswordValue] = useState('');
    const [remember, setRemember] = useState(true);
    const [capsLock, setCapsLock] = useState(false);
    const [logoFailed, setLogoFailed] = useState(false);

    // PWA
    const [isInstalled, setIsInstalled] = useState(false);
    const [installAvailable, setInstallAvailable] = useState(false);
    const [installing, setInstalling] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    // =====================================================
    // RESET TOMBOL SAAT KEMBALI DARI CACHE BROWSER
    // =====================================================

    useEffect(() => {
        const handlePageShow = (event) => {
            if (event.persisted) setLoading(false);
        };

        window.addEventListener('pageshow', handlePageShow);

        return () => window.removeEventListener('pageshow', handlePageShow);
    }, []);

    // =====================================================
    // PWA INSTALL LOGIC
    // =====================================================

    useEffect(() => {
        const checkIsInstalled = () => {
            return (
                window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone === true
            );
        };

        setIsInstalled(checkIsInstalled());

        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            setDeferredPrompt(event);
            setInstallAvailable(true);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setInstallAvailable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt
        );
        window.addEventListener('appinstalled', handleAppInstalled);

        // Fallback: event sudah ditangkap script lain / Blade.
        if (window.__SIMAP_PWA__?.installPrompt) {
            setDeferredPrompt(window.__SIMAP_PWA__.installPrompt);
            setInstallAvailable(true);
        }

        if (window.__SIMAP_PWA__?.installed) {
            setIsInstalled(true);
        }

        const handleCustomAvailable = () => {
            if (window.__SIMAP_PWA__?.installPrompt) {
                setDeferredPrompt(window.__SIMAP_PWA__.installPrompt);
                setInstallAvailable(true);
            }
        };

        const handleCustomInstalled = () => setIsInstalled(true);

        window.addEventListener(
            'simap:pwa-install-available',
            handleCustomAvailable
        );
        window.addEventListener(
            'simap:pwa-installed',
            handleCustomInstalled
        );

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt
            );
            window.removeEventListener(
                'appinstalled',
                handleAppInstalled
            );
            window.removeEventListener(
                'simap:pwa-install-available',
                handleCustomAvailable
            );
            window.removeEventListener(
                'simap:pwa-installed',
                handleCustomInstalled
            );
        };
    }, []);

    const handleInstallApp = async () => {
        if (isInstalled || !deferredPrompt) return;

        try {
            setInstalling(true);

            deferredPrompt.prompt();

            const choiceResult = await deferredPrompt.userChoice;
            console.log(
                'SIMAP PWA install result:',
                choiceResult.outcome
            );

            if (choiceResult.outcome === 'accepted') {
                setIsInstalled(true);
            }

            setDeferredPrompt(null);
            setInstallAvailable(false);

            if (window.__SIMAP_PWA__) {
                window.__SIMAP_PWA__.installPrompt = null;
            }
        } catch (error) {
            console.error(
                'Gagal membuka prompt instalasi PWA:',
                error
            );
        } finally {
            setInstalling(false);
        }
    };

    // =====================================================
    // FORM
    // =====================================================

    const handleSubmit = () => {
        setErrorMsg('');
        setLoading(true);
    };

    const handlePasswordKey = (event) => {
        if (typeof event.getModifierState === 'function') {
            setCapsLock(event.getModifierState('CapsLock'));
        }
    };

    const hasError = Boolean(errorMsg);

    return (
        <div className="login-page">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

                html,
                body,
                #app {
                    min-height: 100%;
                    margin: 0;
                }

                body {
                    background: #f5f8f7;
                }

                .login-page,
                .login-page * {
                    box-sizing: border-box;
                }

                .login-page {
                    --sea-950: #061f2d;
                    --sea-900: #082a3b;
                    --sea-800: #0d3b52;
                    --sea-700: #12506a;
                    --lagoon-500: #2f9c94;
                    --lagoon-300: #8ad0c8;
                    --lagoon-100: #e8f4f2;
                    --paper: #f5f8f7;
                    --paper-soft: #fbfcfb;
                    --ink: #10222b;
                    --muted: #566a74;
                    --line: #d3dfde;
                    --clove: #a52a2a;
                    --clove-soft: #fdf1ef;

                    --font-display: 'Bricolage Grotesque', 'Segoe UI', ui-sans-serif, system-ui, sans-serif;
                    --font-body: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;

                    min-height: 100vh;
                    min-height: 100dvh;
                    display: grid;
                    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
                    color: var(--ink);
                    background: var(--paper);
                    font-family: var(--font-body);
                    font-size: 16px;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                .login-page button,
                .login-page input {
                    font: inherit;
                }

                .login-page :focus-visible {
                    outline: 3px solid rgba(47, 156, 148, 0.55);
                    outline-offset: 2px;
                }

                /* Input memakai ring fokus sendiri (box-shadow), bukan outline. */
                .login-page .form-input:focus-visible {
                    outline: none;
                }

                /* =================================================
                   PANEL KIRI
                ================================================= */

                .login-left {
                    position: relative;
                    min-width: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    padding: 40px calc(clamp(28px, 4.5vw, 64px) + 28px) 40px clamp(28px, 4.5vw, 64px);
                    background:
                        radial-gradient(55% 45% at 80% 14%, rgba(47, 156, 148, 0.2), transparent 72%),
                        radial-gradient(60% 50% at 6% 104%, rgba(18, 80, 106, 0.6), transparent 70%),
                        var(--sea-900);
                    color: #fff;
                }

                .contours {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }

                .coast {
                    position: absolute;
                    z-index: 2;
                    pointer-events: none;
                }

                .coast-land {
                    fill: var(--paper);
                }

                .coast-v {
                    top: 0;
                    right: -1px;
                    width: 64px;
                    height: 100%;
                }

                .coast-h {
                    display: none;
                    left: 0;
                    bottom: -1px;
                    width: 100%;
                    height: 36px;
                }

                .left-inner {
                    position: relative;
                    z-index: 1;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .brand-row {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .institution-logo {
                    width: 64px;
                    height: 64px;
                    flex: 0 0 64px;
                    display: grid;
                    place-items: center;
                    padding: 8px;
                    border-radius: 14px;
                    background: #fff;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
                }

                .institution-logo img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .logo-fallback {
                    color: var(--sea-800);
                    font-family: var(--font-display);
                    font-size: 26px;
                    font-weight: 800;
                }

                .institution-copy {
                    min-width: 0;
                }

                .institution-kicker {
                    margin: 0 0 2px;
                    color: rgba(255, 255, 255, 0.64);
                    font-size: 13px;
                }

                .institution-name {
                    margin: 0;
                    font-family: var(--font-display);
                    font-size: 17px;
                    font-weight: 700;
                    line-height: 1.3;
                }

                .hero {
                    margin: auto 0;
                    padding: 36px 0;
                }

                .brand-title {
                    margin: 0;
                    font-family: var(--font-display);
                    font-size: clamp(64px, 8vw, 116px);
                    font-weight: 800;
                    line-height: 0.9;
                    letter-spacing: -0.045em;
                }

                .brand-description {
                    max-width: 50ch;
                    margin: 20px 0 0;
                    color: rgba(255, 255, 255, 0.78);
                    font-size: 16px;
                    line-height: 1.65;
                    text-wrap: pretty;
                }

                /* ---- Lembar disposisi ---- */

                .slip-wrap {
                    max-width: 480px;
                    margin-top: 40px;
                    padding-right: 12px;
                }

                .slip-stack {
                    position: relative;
                    transform: rotate(-1.4deg);
                }

                .slip-stack::before,
                .slip-stack::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    z-index: -1;
                    border-radius: 6px;
                }

                .slip-stack::before {
                    background: #d5e2e1;
                    transform: translate(12px, 9px) rotate(3.2deg);
                    box-shadow: 0 14px 24px -10px rgba(0, 0, 0, 0.45);
                }

                .slip-stack::after {
                    background: #e9f0ef;
                    transform: translate(-7px, 6px) rotate(-2.6deg);
                    box-shadow: 0 14px 24px -10px rgba(0, 0, 0, 0.4);
                }

                .slip {
                    position: relative;
                    padding: 20px 22px 18px;
                    border-radius: 6px;
                    background: var(--paper-soft);
                    color: var(--ink);
                    box-shadow:
                        0 28px 44px -14px rgba(0, 0, 0, 0.5),
                        0 3px 8px rgba(0, 0, 0, 0.22);
                }

                .slip-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    min-height: 34px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid var(--line);
                }

                .slip-title {
                    margin: 0;
                    font-family: var(--font-display);
                    font-size: 17px;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                }

                .slip-stamp {
                    padding: 3px 10px;
                    border: 2px solid var(--clove);
                    border-radius: 4px;
                    color: var(--clove);
                    font-family: var(--font-display);
                    font-size: 13px;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    box-shadow: inset 0 0 0 1px rgba(165, 42, 42, 0.35);
                    transform: rotate(-10deg);
                    opacity: 0.88;
                    animation: stamp-in 0.55s cubic-bezier(0.2, 0.9, 0.3, 1.15) 0.6s both;
                }

                @keyframes stamp-in {
                    0% {
                        opacity: 0;
                        transform: rotate(-16deg) scale(1.9);
                    }
                    60% {
                        opacity: 0.95;
                        transform: rotate(-10deg) scale(0.95);
                    }
                    100% {
                        opacity: 0.88;
                        transform: rotate(-10deg) scale(1);
                    }
                }

                .slip-meta {
                    margin: 14px 0 0;
                    display: grid;
                    gap: 8px;
                }

                .slip-meta > div {
                    display: grid;
                    grid-template-columns: 88px minmax(0, 1fr);
                    gap: 10px;
                }

                .slip-meta dt {
                    color: var(--muted);
                    font-size: 13px;
                }

                .slip-meta dd {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 500;
                }

                .slip-steps {
                    margin: 18px 0 0;
                    padding: 0;
                    list-style: none;
                }

                .slip-step {
                    position: relative;
                    display: grid;
                    grid-template-columns: 20px minmax(0, 1fr) auto;
                    column-gap: 12px;
                    padding-bottom: 14px;
                }

                .slip-step:last-child {
                    padding-bottom: 0;
                }

                .slip-step::before {
                    content: '';
                    position: absolute;
                    left: 9px;
                    top: 22px;
                    bottom: 2px;
                    width: 2px;
                    background: var(--line);
                }

                .slip-step.done::before {
                    background: var(--sea-800);
                }

                .slip-step:last-child::before {
                    display: none;
                }

                .step-dot {
                    width: 20px;
                    height: 20px;
                    display: grid;
                    place-items: center;
                    border-radius: 50%;
                    background: var(--sea-800);
                    color: #fff;
                }

                .step-dot.current {
                    border: 2px solid var(--lagoon-500);
                    background: #fff;
                }

                .step-dot.current::after {
                    content: '';
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--lagoon-500);
                }

                .step-title {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    line-height: 1.35;
                }

                .step-note {
                    display: block;
                    margin-top: 1px;
                    color: var(--muted);
                    font-size: 13px;
                    line-height: 1.4;
                }

                .step-time {
                    color: var(--muted);
                    font-size: 13px;
                    font-variant-numeric: tabular-nums;
                }

                .slip-agenda {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    margin-top: 16px;
                    padding: 10px 12px;
                    border-radius: 6px;
                    background: var(--lagoon-100);
                    color: var(--sea-800);
                    font-size: 13.5px;
                    font-weight: 500;
                }

                .slip-agenda svg {
                    flex: 0 0 auto;
                }

                .slip-caption {
                    margin: 30px 0 0;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 13px;
                }

                .left-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    padding-top: 18px;
                    border-top: 1px solid rgba(255, 255, 255, 0.14);
                    color: rgba(255, 255, 255, 0.64);
                    font-size: 13px;
                    line-height: 1.5;
                }

                .footer-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    white-space: nowrap;
                    color: var(--lagoon-300);
                }

                /* =================================================
                   PANEL KANAN
                ================================================= */

                .login-right {
                    position: relative;
                    min-width: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    padding: 40px clamp(24px, 5vw, 72px) 28px;
                    background: var(--paper);
                }

                .contours-paper {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }

                .login-main,
                .panel-footer {
                    position: relative;
                    z-index: 1;
                }

                .login-main {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px 0;
                }

                .login-card {
                    width: 100%;
                    max-width: 400px;
                }

                .login-header {
                    margin-bottom: 28px;
                }

                .login-title {
                    margin: 0;
                    color: var(--sea-950);
                    font-family: var(--font-display);
                    font-size: 34px;
                    font-weight: 700;
                    line-height: 1.1;
                    letter-spacing: -0.03em;
                    text-wrap: balance;
                }

                .login-subtitle {
                    margin: 12px 0 0;
                    color: var(--muted);
                    font-size: 15px;
                    line-height: 1.6;
                    text-wrap: pretty;
                }

                .error-box {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    margin: 0 0 20px;
                    padding: 12px 14px;
                    border: 1px solid #efc2bb;
                    border-left: 4px solid var(--clove);
                    border-radius: 8px;
                    background: var(--clove-soft);
                    color: #7d2119;
                    font-size: 14px;
                    line-height: 1.55;
                }

                .error-box svg {
                    flex: 0 0 auto;
                    margin-top: 2px;
                    color: var(--clove);
                }

                .form-group {
                    margin-bottom: 18px;
                }

                .form-label {
                    display: block;
                    margin-bottom: 8px;
                    color: var(--ink);
                    font-size: 14px;
                    font-weight: 600;
                }

                .input-wrap {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    display: flex;
                    align-items: center;
                    color: #7d8f98;
                    transform: translateY(-50%);
                    pointer-events: none;
                    transition: color 0.15s ease;
                }

                .input-wrap:focus-within .input-icon {
                    color: var(--lagoon-500);
                }

                .input-wrap:has(.form-input.has-error:focus) .input-icon {
                    color: #c5574b;
                }

                .form-input {
                    width: 100%;
                    height: 52px;
                    padding: 0 48px 0 44px;
                    border: 1.5px solid var(--line);
                    border-radius: 10px;
                    outline: none;
                    background: #fff;
                    color: var(--ink);
                    font-size: 16px;
                    box-shadow: 0 1px 2px rgba(8, 42, 59, 0.04);
                    transition: border-color 0.15s ease, box-shadow 0.15s ease;
                }

                .form-input.no-toggle {
                    padding-right: 16px;
                }

                .form-input::placeholder {
                    color: #7f8f97;
                }

                .form-input:hover {
                    border-color: #b8c9c8;
                }

                .form-input:focus {
                    border-color: var(--lagoon-500);
                    box-shadow: 0 0 0 4px rgba(47, 156, 148, 0.16);
                }

                .form-input.has-error {
                    border-color: #c5574b;
                }

                .form-input.has-error:focus {
                    box-shadow: 0 0 0 4px rgba(197, 87, 75, 0.16);
                }

                .password-button {
                    position: absolute;
                    right: 6px;
                    top: 50%;
                    width: 40px;
                    height: 40px;
                    display: grid;
                    place-items: center;
                    border: 0;
                    border-radius: 8px;
                    background: transparent;
                    color: #6b7f89;
                    cursor: pointer;
                    transform: translateY(-50%);
                    transition: background 0.15s ease, color 0.15s ease;
                }

                .password-button:hover {
                    background: #e9f0ef;
                    color: var(--sea-900);
                }

                .field-note {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin: 8px 0 0;
                    color: #7a4b00;
                    font-size: 13px;
                }

                .remember-row {
                    margin: 2px 0 22px;
                }

                .remember-label {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    color: var(--muted);
                    font-size: 14px;
                    cursor: pointer;
                    user-select: none;
                }

                .remember-label input {
                    width: 18px;
                    height: 18px;
                    margin: 0;
                    accent-color: var(--sea-800);
                    cursor: pointer;
                }

                .login-button {
                    width: 100%;
                    height: 52px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    border: 0;
                    border-radius: 10px;
                    background: var(--sea-800);
                    color: #fff;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.14),
                        0 12px 22px -12px rgba(8, 42, 59, 0.75);
                    transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
                }

                .login-button:hover:not(:disabled) {
                    background: var(--sea-700);
                }

                .login-button:active:not(:disabled) {
                    transform: translateY(1px);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.1),
                        0 6px 12px -8px rgba(8, 42, 59, 0.75);
                }

                .login-button:disabled {
                    cursor: not-allowed;
                    opacity: 0.7;
                }

                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.35);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: login-spin 0.75s linear infinite;
                }

                .spinner.dark {
                    border-color: rgba(13, 59, 82, 0.2);
                    border-top-color: var(--sea-800);
                }

                @keyframes login-spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* ---- Instal aplikasi (PWA) ---- */

                .install-card {
                    margin-top: 26px;
                    padding: 14px 16px;
                    border: 1px solid #cbe3e0;
                    border-radius: 12px;
                    background: var(--lagoon-100);
                }

                .install-card-inner {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .install-symbol {
                    width: 42px;
                    height: 42px;
                    flex: 0 0 42px;
                    display: grid;
                    place-items: center;
                    border-radius: 10px;
                    background: #d3ebe7;
                    color: #17706a;
                }

                .install-copy {
                    min-width: 0;
                    flex: 1;
                }

                .install-title {
                    margin: 0;
                    color: var(--sea-950);
                    font-size: 14px;
                    font-weight: 600;
                    line-height: 1.35;
                }

                .install-text {
                    margin: 2px 0 0;
                    color: var(--muted);
                    font-size: 13px;
                    line-height: 1.45;
                }

                .install-button {
                    min-height: 40px;
                    padding: 0 14px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    border: 1.5px solid var(--sea-800);
                    border-radius: 8px;
                    background: transparent;
                    color: var(--sea-800);
                    font-size: 14px;
                    font-weight: 600;
                    white-space: nowrap;
                    cursor: pointer;
                    transition: background 0.15s ease, color 0.15s ease;
                }

                .install-button:hover:not(:disabled) {
                    background: var(--sea-800);
                    color: #fff;
                }

                .install-button:disabled {
                    cursor: default;
                    opacity: 0.7;
                }

                /* ---- Footer panel kanan ---- */

                .panel-footer {
                    width: 100%;
                    max-width: 400px;
                    margin: 0 auto;
                    padding-top: 16px;
                    border-top: 1px solid var(--line);
                    color: var(--muted);
                    font-size: 13px;
                    line-height: 1.55;
                }

                .security-note {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    margin: 0;
                }

                .security-note svg {
                    flex: 0 0 auto;
                    margin-top: 2px;
                    color: var(--lagoon-500);
                }

                .copyright {
                    margin: 8px 0 0;
                    color: #7b8b93;
                    font-size: 12.5px;
                }

                /* =================================================
                   LAYAR DESKTOP PENDEK (laptop 720p dan sejenisnya)
                ================================================= */

                @media (min-width: 961px) and (max-height: 820px) {
                    .login-left {
                        padding-top: 28px;
                        padding-bottom: 28px;
                    }

                    .hero {
                        padding: 18px 0;
                    }

                    .brand-title {
                        font-size: clamp(56px, 12vh, 96px);
                    }

                    .brand-description {
                        margin-top: 14px;
                    }

                    .slip-wrap {
                        margin-top: 26px;
                    }

                    .slip {
                        padding: 16px 20px 14px;
                    }

                    .slip-meta,
                    .slip-caption {
                        display: none;
                    }

                    .slip-steps {
                        margin-top: 14px;
                    }

                    .login-right {
                        padding-top: 28px;
                        padding-bottom: 20px;
                    }

                    .login-main {
                        padding: 12px 0;
                    }

                    .login-header {
                        margin-bottom: 20px;
                    }

                    .form-group {
                        margin-bottom: 14px;
                    }

                    .remember-row {
                        margin-bottom: 18px;
                    }

                    .install-card {
                        margin-top: 20px;
                    }

                    .panel-footer {
                        padding-top: 12px;
                    }
                }

                /* =================================================
                   RESPONSIVE
                ================================================= */

                @media (max-width: 960px) {
                    .login-page {
                        grid-template-columns: 1fr;
                        align-content: start;
                    }

                    .login-left {
                        padding: 24px 24px 48px;
                    }

                    .coast-v,
                    .contours-paper {
                        display: none;
                    }

                    .coast-h {
                        display: block;
                    }

                    .left-inner {
                        width: 100%;
                        max-width: 460px;
                        margin: 0 auto;
                    }

                    .hero {
                        margin: 0;
                        padding: 22px 0 0;
                    }

                    .brand-title {
                        font-size: 56px;
                    }

                    .brand-description {
                        margin-top: 10px;
                        font-size: 15px;
                    }

                    .desc-rest,
                    .slip-wrap,
                    .left-footer {
                        display: none;
                    }

                    .login-right {
                        padding: 20px 24px 24px;
                    }

                    .login-main {
                        align-items: flex-start;
                        padding: 8px 0 28px;
                    }

                    .login-card {
                        max-width: 460px;
                    }

                    .panel-footer {
                        max-width: 460px;
                    }
                }

                @media (max-width: 480px) {
                    .institution-logo {
                        width: 56px;
                        height: 56px;
                        flex-basis: 56px;
                        border-radius: 12px;
                    }

                    .institution-name {
                        font-size: 15px;
                    }

                    .brand-title {
                        font-size: 48px;
                    }

                    .login-title {
                        font-size: 28px;
                    }

                    .install-card-inner {
                        display: grid;
                        grid-template-columns: 42px minmax(0, 1fr);
                        align-items: start;
                    }

                    .install-button {
                        grid-column: 1 / -1;
                        width: 100%;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .login-page * {
                        animation-duration: 0.001ms !important;
                        animation-delay: 0s !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.001ms !important;
                    }
                }
            `}</style>

            {/* =================================================
                PANEL KIRI
            ================================================= */}
            <section className="login-left" aria-label="Informasi SIMAP">
                <Contours islands={SEA_ISLANDS} />
                <CoastVertical />
                <CoastHorizontal />

                <div className="left-inner">
                    <div className="brand-row">
                        <div className="institution-logo">
                            {logoFailed ? (
                                <span className="logo-fallback" aria-hidden="true">
                                    P
                                </span>
                            ) : (
                                <img
                                    src="/images/poltekkes-maluku.png"
                                    alt="Logo Kemenkes Poltekkes Maluku"
                                    onError={() => setLogoFailed(true)}
                                />
                            )}
                        </div>

                        <div className="institution-copy">
                            <p className="institution-kicker">
                                Sistem Informasi Internal
                            </p>
                            <p className="institution-name">
                                Poltekkes Kemenkes Maluku
                            </p>
                        </div>
                    </div>

                    <div className="hero">
                        <h1 className="brand-title">SIMAP</h1>

                        <p className="brand-description">
                            <span className="desc-name">
                                Sistem Manajemen Administrasi Poltekkes Maluku
                            </span>
                            <span className="desc-rest">
                                {' '}
                                untuk mengelola surat, disposisi, agenda
                                Direktur, dan proses administrasi secara
                                terintegrasi.
                            </span>
                        </p>

                        <DispositionSlip />
                    </div>

                    <div className="left-footer">
                        <span>Platform administrasi internal kampus</span>
                        <span className="footer-badge">
                            <Icon name="shield" size={14} />
                            Akses terbatas
                        </span>
                    </div>
                </div>
            </section>

            {/* =================================================
                PANEL KANAN
            ================================================= */}
            <section className="login-right" aria-label="Form login">
                <Contours
                    islands={PAPER_ISLANDS}
                    tone="paper"
                    className="contours-paper"
                />

                <div className="login-main">
                    <div className="login-card">
                        <div className="login-header">
                            <h2 className="login-title">Masuk ke akun Anda</h2>
                            <p className="login-subtitle">
                                Gunakan akun resmi Anda untuk mengakses seluruh
                                fitur administrasi SIMAP.
                            </p>
                        </div>

                        {hasError && (
                            <div
                                id="login-error"
                                className="error-box"
                                role="alert"
                            >
                                <Icon name="alert" size={18} />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <form
                            method="POST"
                            action="/login"
                            onSubmit={handleSubmit}
                        >
                            <input
                                type="hidden"
                                name="_token"
                                value={csrfToken}
                            />

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>

                                <div className="input-wrap">
                                    <span className="input-icon">
                                        <Icon name="mail" size={18} />
                                    </span>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className={`form-input no-toggle${hasError ? ' has-error' : ''}`}
                                        placeholder="nama@poltekkes-maluku.ac.id"
                                        autoComplete="email"
                                        value={emailValue}
                                        onChange={(event) =>
                                            setEmailValue(event.target.value)
                                        }
                                        aria-invalid={hasError ? 'true' : undefined}
                                        aria-describedby={hasError ? 'login-error' : undefined}
                                        required
                                        autoFocus={!initial.email}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>

                                <div className="input-wrap">
                                    <span className="input-icon">
                                        <Icon name="lock" size={18} />
                                    </span>

                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        className={`form-input${hasError ? ' has-error' : ''}`}
                                        placeholder="Masukkan password"
                                        autoComplete="current-password"
                                        value={passwordValue}
                                        onChange={(event) =>
                                            setPasswordValue(event.target.value)
                                        }
                                        onKeyDown={handlePasswordKey}
                                        onKeyUp={handlePasswordKey}
                                        onBlur={() => setCapsLock(false)}
                                        aria-invalid={hasError ? 'true' : undefined}
                                        aria-describedby={hasError ? 'login-error' : undefined}
                                        required
                                        autoFocus={Boolean(initial.email)}
                                    />

                                    <button
                                        type="button"
                                        className="password-button"
                                        onClick={() =>
                                            setShowPassword((previous) => !previous)
                                        }
                                        aria-label={
                                            showPassword
                                                ? 'Sembunyikan password'
                                                : 'Tampilkan password'
                                        }
                                        aria-pressed={showPassword}
                                    >
                                        <Icon
                                            name={showPassword ? 'eyeOff' : 'eye'}
                                            size={18}
                                        />
                                    </button>
                                </div>

                                {capsLock && (
                                    <p className="field-note" role="status">
                                        <Icon name="alert" size={15} />
                                        Caps Lock sedang aktif.
                                    </p>
                                )}
                            </div>

                            <div className="remember-row">
                                <label className="remember-label">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        value="1"
                                        checked={remember}
                                        onChange={(event) =>
                                            setRemember(event.target.checked)
                                        }
                                    />
                                    <span>Ingat saya di perangkat ini</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner" aria-hidden="true" />
                                        <span>Memproses login...</span>
                                    </>
                                ) : (
                                    <span>Masuk ke SIMAP</span>
                                )}
                            </button>
                        </form>

                        {/* =============================================
                            INSTAL APLIKASI (PWA)
                        ============================================= */}
                        {(installAvailable || isInstalled) && (
                            <div className="install-card">
                                <div className="install-card-inner">
                                    <div className="install-symbol">
                                        <Icon
                                            name={isInstalled ? 'check' : 'phone'}
                                            size={20}
                                        />
                                    </div>

                                    <div className="install-copy">
                                        <p className="install-title">
                                            {isInstalled
                                                ? 'SIMAP sudah terpasang'
                                                : 'Pasang SIMAP di perangkat'}
                                        </p>
                                        <p className="install-text">
                                            {isInstalled
                                                ? 'Buka dari layar utama perangkat ini.'
                                                : 'Buka langsung dari layar utama.'}
                                        </p>
                                    </div>

                                    {!isInstalled && (
                                        <button
                                            type="button"
                                            className="install-button"
                                            onClick={handleInstallApp}
                                            disabled={installing || !installAvailable}
                                        >
                                            {installing ? (
                                                <>
                                                    <span
                                                        className="spinner dark"
                                                        aria-hidden="true"
                                                    />
                                                    Menyiapkan...
                                                </>
                                            ) : (
                                                <>
                                                    <Icon name="install" size={16} />
                                                    Instal
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="panel-footer">
                    <p className="security-note">
                        <Icon name="shield" size={15} />
                        <span>
                            Autentikasi dan sesi pengguna dilindungi oleh
                            mekanisme keamanan Laravel.
                        </span>
                    </p>
                    <p className="copyright">
                        © 2026 SIMAP Poltekkes Kemenkes Maluku
                    </p>
                </div>
            </section>
        </div>
    );
}