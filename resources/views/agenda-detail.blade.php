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
        Detail Agenda - SIMAP Poltekkes Maluku
    </title>

    @include('partials.pwa')
    @viteReactRefresh
    @vite([
        'resources/js/app.jsx'
    ])

</head>

<body>

    <div
        id="app"
        data-page="agenda-detail-direktur"
    ></div>

    <script>
        window.agendaDetailData = {
            agenda: {!! json_encode(
                $agenda ?? null,
                JSON_UNESCAPED_UNICODE |
                JSON_UNESCAPED_SLASHES
            ) !!}
        };
    </script>

</body>
</html>