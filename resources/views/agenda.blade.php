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

        @if (($page ?? '') === 'agenda-direktur')

            Agenda Direktur

        @elseif (($page ?? '') === 'agenda-detail-direktur')

            Detail Agenda Direktur

        @elseif (($page ?? '') === 'agenda-detail')

            Detail Agenda

        @elseif (($page ?? '') === 'agenda-create')

            Tambah Agenda

        @elseif (($page ?? '') === 'agenda-edit')

            Edit Agenda

        @else

            Agenda Sekretaris

        @endif

        - SIMAP Poltekkes Maluku

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
        data-page="{{ $page ?? 'agenda' }}"
    ></div>


    <script>

        /*
        |--------------------------------------------------------------------------
        | AGENDA SEKRETARIS
        |--------------------------------------------------------------------------
        */

        window.agendaData = {!! json_encode(
            ($page ?? '') === 'agenda'
                ? ($agenda ?? [])
                : []
        ) !!};


        /*
        |--------------------------------------------------------------------------
        | AGENDA DIREKTUR
        |--------------------------------------------------------------------------
        */

        window.agendaDirekturData = {!! json_encode(
            ($page ?? '') === 'agenda-direktur'
                ? ($agendaDirektur ?? [])
                : []
        ) !!};


        /*
        |--------------------------------------------------------------------------
        | AGENDA EDIT
        |--------------------------------------------------------------------------
        */

        window.agendaEditData = {
            agenda: {!! json_encode(
                ($page ?? '') === 'agenda-edit'
                    ? ($agenda ?? null)
                    : null
            ) !!}
        };


        /*
        |--------------------------------------------------------------------------
        | AGENDA DETAIL
        |--------------------------------------------------------------------------
        */

        window.agendaDetailData = {
            agendaDetail: {!! json_encode(
                in_array(
                    ($page ?? ''),
                    [
                        'agenda-detail',
                        'agenda-detail-direktur'
                    ],
                    true
                )
                    ? ($agendaDetail ?? $agenda ?? null)
                    : null
            ) !!}
        };


        /*
        |--------------------------------------------------------------------------
        | SURAT UNTUK FORM AGENDA
        |--------------------------------------------------------------------------
        */

        window.agendaSuratMasuk = {!! json_encode(
            $suratMasuk ?? null
        ) !!};


        /*
        |--------------------------------------------------------------------------
        | ERROR VALIDASI
        |--------------------------------------------------------------------------
        */

        window.agendaErrors = {!! json_encode(
            $errors->all()
        ) !!};


        /*
        |--------------------------------------------------------------------------
        | FLASH SUCCESS
        |--------------------------------------------------------------------------
        */

        window.flashSuccess = {!! json_encode(
            session('success')
        ) !!};

    </script>

</body>

</html>