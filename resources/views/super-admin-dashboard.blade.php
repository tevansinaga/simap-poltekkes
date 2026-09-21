<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="csrf-token"
        content="{{ csrf_token() }}"
    >

    <title>
        Dashboard Super Admin - SIMAP Poltekkes Maluku
    </title>

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
        data-page="super-admin-dashboard"
    ></div>

    <script>
        window.superAdminDashboardData = {
            user: {!! json_encode($user ?? null) !!},

            stats: {!! json_encode($stats ?? [
                'totalUsers' => 0,
                'activeUsers' => 0,
                'inactiveUsers' => 0,
                'totalUnits' => 0,
                'activeUnits' => 0,
            ]) !!},

            usersTerbaru: {!! json_encode($usersTerbaru ?? []) !!}
        };
    </script>

</body>
</html>
