<!DOCTYPE html>
<html lang="id">

<head>

    <meta charset="utf-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    >

    <meta
        name="csrf-token"
        content="{{ csrf_token() }}"
    >

    <title>
        Pengguna — SIMAP Poltekkes Maluku
    </title>


    {{-- PWA --}}

    @include('partials.pwa')


    {{-- VITE --}}

    @viteReactRefresh

    @vite([
        'resources/css/app.css',
        'resources/js/app.jsx'
    ])

</head>


<body>


    {{-- =========================================================
        ROOT REACT
    ========================================================== --}}

    <div
        id="app"
        data-page="super-admin-pengguna"
    ></div>


    {{-- =========================================================
        SIAPKAN DATA SERVER
        ========================================================== --}}

    @php

        $usersData = $users->items();

        $paginationData = [
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'per_page' => $users->perPage(),
            'total' => $users->total(),
            'from' => $users->firstItem(),
            'to' => $users->lastItem(),
            'prev_page_url' => $users->previousPageUrl(),
            'next_page_url' => $users->nextPageUrl(),
            'links' => $users
                ->linkCollection()
                ->toArray(),
        ];

        $flashData = [
            'success' => session('success'),
        ];

        $errorData = $errors->all();

    @endphp


    {{-- =========================================================
        DATA UNTUK REACT
    ========================================================== --}}

    <script>

        window.superAdminPenggunaData = {

            user: @json($user),

            users: @json($usersData),

            roles: @json($roles),

            units: @json($units),

            filters: @json($filters),

            pagination: @json($paginationData),

            csrfToken: @json(csrf_token()),

            flash: @json($flashData),

            errors: @json($errorData),

        };

    </script>


</body>

</html>