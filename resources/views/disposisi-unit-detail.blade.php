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
        Detail Disposisi - SIMAP Poltekkes Maluku
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
        data-page="disposisi-unit-detail"
    ></div>

    <script>
        window.disposisiUnitDetailData = {!! json_encode(
            $disposisi ?? null
        ) !!};

        window.flashSuccess = {!! json_encode(
            session('success')
        ) !!};
    </script>
</body>
</html>