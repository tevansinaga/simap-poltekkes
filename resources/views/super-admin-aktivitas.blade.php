<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Aktivitas Sistem — SIMAP Poltekkes Maluku</title>

    @include('partials.pwa')

    @viteReactRefresh
    @vite([
        'resources/css/app.css',
        'resources/js/app.jsx'
    ])
</head>
<body>

    <div id="app" data-page="super-admin-aktivitas"></div>

    @php
        $paginationData = [
            'current_page' => $activities->currentPage(),
            'last_page' => $activities->lastPage(),
            'per_page' => $activities->perPage(),
            'total' => $activities->total(),
            'from' => $activities->firstItem(),
            'to' => $activities->lastItem(),
            'prev_page_url' => $activities->previousPageUrl(),
            'next_page_url' => $activities->nextPageUrl(),
            'links' => $activities->linkCollection()->toArray(),
        ];
    @endphp

    <script>
        window.superAdminAktivitasData = {
            user: @json($user),
            activities: @json($activities->items()),
            stats: @json($stats),
            filters: @json($filters),
            actionOptions: @json($actionOptions),
            moduleOptions: @json($moduleOptions),
            pagination: @json($paginationData),
            csrfToken: @json(csrf_token()),
        };
    </script>
</body>
</html>
