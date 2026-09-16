<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Login - SIMAP Poltekkes Maluku</title>

    @viteReactRefresh
    @vite([
        'resources/css/app.css',
        'resources/js/app.jsx'
    ])
</head>

<body>

    <div
        id="app"
        data-page="login"
        data-error="{{ $errors->first() ?: session('error') }}"
        data-email="{{ old('email') }}"
    ></div>

</body>

</html>