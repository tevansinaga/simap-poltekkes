<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Dashboard Direktur - SIMAP Poltekkes Maluku</title>

    @viteReactRefresh

    @vite([
        'resources/css/app.css',
        'resources/js/app.jsx'
    ])
</head>

<body>

    <div
        id="app"
        data-page="direktur-dashboard"
    ></div>

    <script>
        window.dashboardData = {
            user: {!! json_encode($user ?? null) !!},

            stats: {!! json_encode($stats ?? [
                'butuhDisposisi' => 0,
                'agendaHariIni' => 0,
                'butuhTandaTangan' => 0,
                'disposisiSelesai' => 0,
            ]) !!},

            pendingSurat: {!! json_encode($pendingSurat ?? []) !!},

            agendaHariIni: {!! json_encode($agendaHariIni ?? []) !!}
        };
    </script>

</body>
</html>