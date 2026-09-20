const CACHE_NAME =
    'simap-poltekkes-v1';

self.addEventListener(
    'install',
    function (event) {
        self.skipWaiting();
    }
);

self.addEventListener(
    'activate',
    function (event) {
        event.waitUntil(
            (async function () {
                const cacheNames =
                    await caches.keys();

                await Promise.all(
                    cacheNames
                        .filter(
                            function (name) {
                                return (
                                    name !==
                                    CACHE_NAME
                                );
                            }
                        )
                        .map(
                            function (name) {
                                return caches.delete(
                                    name
                                );
                            }
                        )
                );

                await self.clients.claim();
            })()
        );
    }
);

self.addEventListener(
    'fetch',
    function (event) {
        const request =
            event.request;

        if (
            request.method !== 'GET'
        ) {
            return;
        }

        const url =
            new URL(request.url);

        /*
        |--------------------------------------------------------------------------
        | Hanya untuk domain SIMAP.
        |--------------------------------------------------------------------------
        */

        if (
            url.origin !==
            self.location.origin
        ) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Jangan cache halaman/data aplikasi.
        |--------------------------------------------------------------------------
        |
        | SIMAP menggunakan login/session dan data dinamis.
        | Kita tidak mau cache lama menyebabkan dashboard,
        | disposisi, agenda, atau logout menjadi aneh.
        |--------------------------------------------------------------------------
        */

        return;
    }
);