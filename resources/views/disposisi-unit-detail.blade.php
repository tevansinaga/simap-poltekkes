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


    {{-- =========================================================
        PWA
    ========================================================== --}}

    @include('partials.pwa')


    {{-- =========================================================
        VITE
    ========================================================== --}}

    @viteReactRefresh

    @vite([
        'resources/css/app.css',
        'resources/js/app.jsx'
    ])

</head>


<body>


    {{-- =========================================================
        ROOT REACT
    ========================================================== --}}

    <div
        id="app"
        data-page="disposisi-unit-detail"
    ></div>


    {{-- =========================================================
        DATA UNTUK REACT
    ========================================================== --}}

    <script>

        /*
        |--------------------------------------------------------------------------
        | DATA DISPOSISI
        |--------------------------------------------------------------------------
        */

        window.disposisiUnitDetailData = @json(
            $disposisi ?? null
        );


        /*
        |--------------------------------------------------------------------------
        | ERROR DARI LARAVEL
        |--------------------------------------------------------------------------
        |
        | Contoh:
        |
        | return back()->withErrors([
        |     'pesan' => 'Isi catatan terlebih dahulu.'
        | ]);
        |
        |--------------------------------------------------------------------------
        */

        window.disposisiUnitDetailErrors = @json(
            $errors->all()
        );


        /*
        |--------------------------------------------------------------------------
        | PESAN BERHASIL
        |--------------------------------------------------------------------------
        */

        window.disposisiUnitDetailSuccess = @json(
            session('success')
        );


        /*
        |--------------------------------------------------------------------------
        | CSRF TOKEN
        |--------------------------------------------------------------------------
        |
        | Disediakan juga dalam object agar mudah digunakan React.
        |
        |--------------------------------------------------------------------------
        */

        window.disposisiUnitDetailCsrfToken = @json(
            csrf_token()
        );

    </script>


</body>

</html>