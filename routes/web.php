<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;

use App\Http\Controllers\Direktur\DashboardController as DirekturDashboardController;
use App\Http\Controllers\Direktur\AgendaController;
use App\Http\Controllers\Direktur\SuratMasukController;
use App\Http\Controllers\Direktur\DisposisiController as DirekturDisposisiController;

use App\Http\Controllers\Sekretaris\SekretarisDashboardController;

use App\Http\Controllers\Unit\UnitDashboardController;
use App\Http\Controllers\Unit\DisposisiUnitController;

use App\Http\Controllers\DisposisiPesanController;


/*
|--------------------------------------------------------------------------
| HALAMAN UTAMA
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('login');
});


/*
|--------------------------------------------------------------------------
| AUTENTIKASI
|--------------------------------------------------------------------------
*/

Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::post('/login', [
    AuthController::class,
    'login',
])->name('login.process');


/*
|--------------------------------------------------------------------------
| AREA TERPROTEKSI
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    Route::post('/logout', [
        AuthController::class,
        'logout',
    ])->name('logout');


    /*
    |--------------------------------------------------------------------------
    | DASHBOARD DEFAULT
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');


    /*
    |--------------------------------------------------------------------------
    | AREA DIREKTUR
    |--------------------------------------------------------------------------
    */

    Route::prefix('direktur')
        ->name('direktur.')
        ->middleware(['role:direktur'])
        ->group(function () {

            /*
            |--------------------------------------------------------------------------
            | DASHBOARD DIREKTUR
            |--------------------------------------------------------------------------
            */

            Route::get('/dashboard', [
                DirekturDashboardController::class,
                'index',
            ])->name('dashboard');


            /*
            |--------------------------------------------------------------------------
            | DETAIL SURAT MASUK DIREKTUR
            |--------------------------------------------------------------------------
            |
            | Direktur hanya dapat melihat surat.
            |
            */

            Route::get('/surat-masuk/{suratMasuk}', [
                SuratMasukController::class,
                'showDirektur',
            ])->name('surat-masuk.show');


            /*
            |--------------------------------------------------------------------------
            | DAFTAR AGENDA DIREKTUR
            |--------------------------------------------------------------------------
            */

            Route::get('/agenda', [
                AgendaController::class,
                'indexDirektur',
            ])->name('agenda');


            /*
            |--------------------------------------------------------------------------
            | DETAIL AGENDA DIREKTUR
            |--------------------------------------------------------------------------
            */

            Route::get('/agenda/{agenda}', [
                AgendaController::class,
                'showDirektur',
            ])->name('agenda.show');
        });


    /*
    |--------------------------------------------------------------------------
    | AREA SEKRETARIS DIREKTUR
    |--------------------------------------------------------------------------
    */

    Route::prefix('sekretaris')
        ->name('sekretaris.')
        ->middleware(['role:sekretaris-direktur'])
        ->group(function () {

            /*
            |--------------------------------------------------------------------------
            | DASHBOARD
            |--------------------------------------------------------------------------
            */

            Route::get('/dashboard', [
                SekretarisDashboardController::class,
                'index',
            ])->name('dashboard');


            /*
            |--------------------------------------------------------------------------
            | SURAT MASUK
            |--------------------------------------------------------------------------
            */

            Route::get('/surat-masuk', [
                SuratMasukController::class,
                'index',
            ])->name('surat-masuk');

            Route::get('/surat-masuk/create', [
                SuratMasukController::class,
                'create',
            ])->name('surat-masuk.create');

            Route::post('/surat-masuk', [
                SuratMasukController::class,
                'store',
            ])->name('surat-masuk.store');

            Route::get('/surat-masuk/{suratMasuk}', [
                SuratMasukController::class,
                'show',
            ])->name('surat-masuk.show');

            Route::get('/surat-masuk/{suratMasuk}/edit', [
                SuratMasukController::class,
                'edit',
            ])->name('surat-masuk.edit');

            Route::put('/surat-masuk/{suratMasuk}', [
                SuratMasukController::class,
                'update',
            ])->name('surat-masuk.update');

            Route::delete('/surat-masuk/{suratMasuk}', [
                SuratMasukController::class,
                'destroy',
            ])->name('surat-masuk.destroy');


            /*
            |--------------------------------------------------------------------------
            | DISPOSISI SEKRETARIS
            |--------------------------------------------------------------------------
            */

            Route::get('/disposisi', [
                DirekturDisposisiController::class,
                'index',
            ])->name('disposisi');


            /*
            |--------------------------------------------------------------------------
            | DETAIL MONITORING DISPOSISI
            |--------------------------------------------------------------------------
            |
            | /sekretaris/disposisi/24/detail
            |
            */

            Route::get('/disposisi/{disposisi}/detail', [
                DirekturDisposisiController::class,
                'show',
            ])->name('disposisi.show');


            /*
            |--------------------------------------------------------------------------
            | CHAT / PESAN DISPOSISI SEKRETARIS
            |--------------------------------------------------------------------------
            |
            | Sekretaris dapat:
            | - mengirim pesan
            | - melampirkan PDF
            |
            | PDF maksimal 10 MB dan hanya PDF.
            |
            */

            Route::post('/disposisi/{disposisi}/pesan', [
                DisposisiPesanController::class,
                'storeSekretaris',
            ])->name('disposisi.pesan.store');


            /*
            |--------------------------------------------------------------------------
            | BUAT DISPOSISI
            |--------------------------------------------------------------------------
            */

            Route::get('/disposisi/{suratMasuk}', [
                DirekturDisposisiController::class,
                'create',
            ])->name('disposisi.create');

            Route::post('/disposisi/{suratMasuk}', [
                DirekturDisposisiController::class,
                'store',
            ])->name('disposisi.store');


            /*
            |--------------------------------------------------------------------------
            | AGENDA SEKRETARIS
            |--------------------------------------------------------------------------
            */

            Route::get('/agenda', [
                AgendaController::class,
                'index',
            ])->name('agenda');

            Route::get('/agenda/create', [
                AgendaController::class,
                'create',
            ])->name('agenda.create');

            Route::post('/agenda', [
                AgendaController::class,
                'store',
            ])->name('agenda.store');

            Route::get('/agenda/{agenda}', [
                AgendaController::class,
                'show',
            ])->name('agenda.show');

            Route::get('/agenda/{agenda}/edit', [
                AgendaController::class,
                'edit',
            ])->name('agenda.edit');

            Route::put('/agenda/{agenda}', [
                AgendaController::class,
                'update',
            ])->name('agenda.update');

            Route::delete('/agenda/{agenda}', [
                AgendaController::class,
                'destroy',
            ])->name('agenda.destroy');
        });


    /*
    |--------------------------------------------------------------------------
    | AREA UNIT
    |--------------------------------------------------------------------------
    */

    Route::prefix('unit')
        ->name('unit.')
        ->middleware(['unit'])
        ->group(function () {

            /*
            |--------------------------------------------------------------------------
            | DASHBOARD UNIT
            |--------------------------------------------------------------------------
            */

            Route::get('/dashboard', [
                UnitDashboardController::class,
                'index',
            ])->name('dashboard');


            /*
            |--------------------------------------------------------------------------
            | DISPOSISI UNIT
            |--------------------------------------------------------------------------
            */

            Route::get('/disposisi', [
                DisposisiUnitController::class,
                'index',
            ])->name('disposisi');


            /*
            |--------------------------------------------------------------------------
            | DETAIL DISPOSISI UNIT
            |--------------------------------------------------------------------------
            */

            Route::get('/disposisi/{disposisi}', [
                DisposisiUnitController::class,
                'show',
            ])->name('disposisi.show');


            /*
            |--------------------------------------------------------------------------
            | MULAI PROSES
            |--------------------------------------------------------------------------
            */

            Route::post('/disposisi/{disposisi}/mulai', [
                DisposisiUnitController::class,
                'mulai',
            ])->name('disposisi.mulai');


            /*
            |--------------------------------------------------------------------------
            | CHAT / PESAN DISPOSISI UNIT
            |--------------------------------------------------------------------------
            |
            | Unit dapat:
            | - membalas pesan
            | - mengirim PDF
            |
            */

            Route::post('/disposisi/{disposisi}/pesan', [
                DisposisiPesanController::class,
                'storeUnit',
            ])->name('disposisi.pesan.store');


            /*
            |--------------------------------------------------------------------------
            | CATATAN LAMA
            |--------------------------------------------------------------------------
            |
            | Tetap dipertahankan untuk data lama.
            |
            */

            Route::post('/disposisi/{disposisi}/catatan', [
                DisposisiUnitController::class,
                'simpanCatatan',
            ])->name('disposisi.catatan');


            /*
            |--------------------------------------------------------------------------
            | SELESAI
            |--------------------------------------------------------------------------
            */

            Route::post('/disposisi/{disposisi}/selesai', [
                DisposisiUnitController::class,
                'selesai',
            ])->name('disposisi.selesai');
        });
});