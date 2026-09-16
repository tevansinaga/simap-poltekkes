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
        Dashboard Unit - SIMAP Poltekkes Maluku
    </title>

    @viteReactRefresh

    @vite([
        'resources/css/app.css',
        'resources/js/app.jsx'
    ])
</head>

<body>
    <div
        id="app"
        data-page="unit-dashboard"
    ></div>

    <script>
        window.unitDashboardData = {
            user: {!! json_encode($user ?? null) !!},
            unit: {!! json_encode($unit ?? null) !!},
            stats: {!! json_encode($stats ?? []) !!},
            disposisiTerbaru: {!! json_encode($disposisiTerbaru ?? []) !!}
        };

        window.flashSuccess = {!! json_encode(
            session('success')
        ) !!};

        window.unitErrors = {!! json_encode(
            $errors->all()
        ) !!};
    </script>
</body>
</html>