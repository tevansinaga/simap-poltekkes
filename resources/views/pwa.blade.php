{{-- =========================================================
    SIMAP PWA
========================================================= --}}

<link
    rel="manifest"
    href="{{ asset('manifest.webmanifest') }}"
>

<meta
    name="theme-color"
    content="#0f2747"
>

<meta
    name="mobile-web-app-capable"
    content="yes"
>

<meta
    name="apple-mobile-web-app-capable"
    content="yes"
>

<meta
    name="apple-mobile-web-app-status-bar-style"
    content="default"
>

<meta
    name="apple-mobile-web-app-title"
    content="SIMAP"
>

<link
    rel="apple-touch-icon"
    href="{{ asset('images/pwa-192.png') }}"
>

<script>
    (function () {
        /*
         * Tangkap beforeinstallprompt sedini mungkin.
         * Partial ini dimuat sebelum app.jsx / React.
         * Event disimpan di window agar tidak hilang karena
         * urutan loading, React mount, atau HMR.
         */
        window.__SIMAP_PWA__ = window.__SIMAP_PWA__ || {
            installPrompt: null,
            installed: false,
        };

        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;

        if (isStandalone) {
            window.__SIMAP_PWA__.installed = true;
        }

        window.addEventListener(
            'beforeinstallprompt',
            function (event) {
                event.preventDefault();

                window.__SIMAP_PWA__.installPrompt = event;

                console.info(
                    'SIMAP PWA: beforeinstallprompt diterima.'
                );

                window.dispatchEvent(
                    new Event('simap:pwa-install-available')
                );
            }
        );

        window.addEventListener(
            'appinstalled',
            function () {
                window.__SIMAP_PWA__.installPrompt = null;
                window.__SIMAP_PWA__.installed = true;

                console.info(
                    'SIMAP PWA: aplikasi berhasil diinstall.'
                );

                window.dispatchEvent(
                    new Event('simap:pwa-installed')
                );
            }
        );

        /*
         * Service Worker
         */
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker
                    .register('/sw.js', {
                        scope: '/',
                    })
                    .then(function (registration) {
                        console.info(
                            'SIMAP PWA: Service Worker aktif.',
                            registration.scope
                        );
                    })
                    .catch(function (error) {
                        console.error(
                            'SIMAP PWA: Service Worker gagal.',
                            error
                        );
                    });
            });
        }
    })();
</script>
