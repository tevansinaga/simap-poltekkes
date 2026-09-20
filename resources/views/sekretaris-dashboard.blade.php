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
        Dashboard Sekretaris - SIMAP Poltekkes Maluku
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
        data-page="sekretaris-dashboard"
    ></div>

    <script>
        window.sekretarisDashboardData = {
            user: {!! json_encode(
                $user ?? null
            ) !!},

            stats: {!! json_encode(
                $stats ?? []
            ) !!},

            suratTerbaru: {!! json_encode(
                $suratTerbaru ?? []
            ) !!},

            agendaHariIniData: {!! json_encode(
                $agendaHariIniData ?? []
            ) !!},

            disposisiTerbaru: {!! json_encode(
                $disposisiTerbaru ?? []
            ) !!}
        };

        window.flashSuccess = {!! json_encode(
            session('success')
        ) !!};

        window.sekretarisErrors = {!! json_encode(
            $errors->all()
        ) !!};
    </script>

</body>
</html>