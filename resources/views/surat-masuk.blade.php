<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Surat Masuk - SIMAP Poltekkes Maluku</title>

    @viteReactRefresh

    @vite([
        'resources/css/app.css',
        'resources/js/app.jsx'
    ])
</head>

<body>

    <div
        id="app"
        data-page="{{ $page ?? 'surat-masuk' }}"
    ></div>

    <script>
    window.suratMasukData = @json($suratMasuk ?? null);
    window.suratMasukErrors = @json($errors->all());
    window.flashSuccess = @json(session('success'));

    window.disposisiData = @json($disposisis ?? []);
    window.disposisiUnits = @json($units ?? []);
</script>


</body>
</html>