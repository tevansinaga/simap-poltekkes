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
        Disposisi Unit - SIMAP Poltekkes Maluku
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
        data-page="disposisi-unit"
    ></div>

    <script>
        window.disposisiUnitData = {!! json_encode(
            $disposisis ?? []
        ) !!};

        window.flashSuccess = {!! json_encode(
            session('success')
        ) !!};
    </script>
</body>
</html>