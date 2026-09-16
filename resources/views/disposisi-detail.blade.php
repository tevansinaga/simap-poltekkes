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

    @viteReactRefresh

    @vite([
        'resources/css/app.css',
        'resources/js/app.jsx'
    ])
</head>

<body>

    <div
        id="app"
        data-page="disposisi-detail"
    ></div>

    <script>
        window.disposisiDetailData = {!! json_encode(
            $disposisi ?? null
        ) !!};

        window.flashSuccess = {!! json_encode(
            session('success')
        ) !!};

        window.disposisiErrors = {!! json_encode(
            $errors->all()
        ) !!};
    </script>

</body>
</html>