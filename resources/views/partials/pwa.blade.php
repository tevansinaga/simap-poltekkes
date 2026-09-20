{{-- =========================================================
    PWA META
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

{{-- =========================================================
    SERVICE WORKER
========================================================= --}}

<script>
    window.addEventListener('load', function () {
        if (!('serviceWorker' in navigator)) {
            return;
        }

        navigator.serviceWorker
            .register('/sw.js', {
                scope: '/',
            })
            .then(function (registration) {
                console.log(
                    'SIMAP Service Worker aktif:',
                    registration.scope
                );
            })
            .catch(function (error) {
                console.error(
                    'SIMAP Service Worker gagal:',
                    error
                );
            });
    });
</script>