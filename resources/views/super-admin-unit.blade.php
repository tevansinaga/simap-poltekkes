<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Unit — SIMAP Poltekkes Maluku</title>

    @include('partials.pwa')

    @viteReactRefresh
    @vite([
        'resources/css/app.css',
        'resources/js/app.jsx'
    ])
</head>
<body>

    <div
        id="app"
        data-page="super-admin-unit"
    ></div>

    @php
        $unitsData = $units->items();

        $paginationData = [
            'current_page' => $units->currentPage(),
            'last_page' => $units->lastPage(),
            'per_page' => $units->perPage(),
            'total' => $units->total(),
            'from' => $units->firstItem(),
            'to' => $units->lastItem(),
            'prev_page_url' => $units->previousPageUrl(),
            'next_page_url' => $units->nextPageUrl(),
            'links' => $units->linkCollection()->toArray(),
        ];

        $flashData = [
            'success' => session('success'),
        ];

        $errorData = $errors->all();
    @endphp

    <script>
        window.superAdminUnitData = {
            user: @json($user),
            units: @json($unitsData),
            pagination: @json($paginationData),
            filters: @json($filters),
            csrfToken: @json(csrf_token()),
            flash: @json($flashData),
            errors: @json($errorData),
        };
    </script>
</body>
</html>
