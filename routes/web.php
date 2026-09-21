<?php

use Illuminate\Support\Facades\Auth;
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
use App\Http\Controllers\SuperAdmin\SuperAdminDashboardController;

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
    // Jika pengguna masih terautentikasi (termasuk melalui Remember Me),
    // jangan tampilkan form login lagi. Arahkan langsung ke dashboard sesuai role.
    if (Auth::check()) {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $roleSlug = $user->role?->slug;

        if ($roleSlug === 'direktur') {
            return redirect()->route('direktur.dashboard');
        }

        if ($roleSlug === 'sekretaris-direktur') {
            return redirect()->route('sekretaris.dashboard');
        }

        if ($user->unit_id) {
            return redirect()->route('unit.dashboard');
        }

        return redirect()->route('dashboard');
    }

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
    | AREA SUPER ADMIN
    |--------------------------------------------------------------------------
    */

    Route::prefix('super-admin')
    ->name('super-admin.')
    ->middleware(['role:super-admin'])
    ->group(function () {

        Route::get('/dashboard', [
            SuperAdminDashboardController::class,
            'index',
        ])->name('dashboard');
    });

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

            Route::get('/dashboard', [
                DirekturDashboardController::class,
                'index',
            ])->name('dashboard');

            Route::get('/surat-masuk/{suratMasuk}', [
                SuratMasukController::class,
                'showDirektur',
            ])->name('surat-masuk.show');

            Route::get('/agenda', [
                AgendaController::class,
                'indexDirektur',
            ])->name('agenda');

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

            Route::get('/dashboard', [
                SekretarisDashboardController::class,
                'index',
            ])->name('dashboard');

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

            Route::get('/disposisi', [
                DirekturDisposisiController::class,
                'index',
            ])->name('disposisi');

            Route::get('/disposisi/{disposisi}/detail', [
                DirekturDisposisiController::class,
                'show',
            ])->name('disposisi.show');

            Route::post('/disposisi/{disposisi}/pesan', [
                DisposisiPesanController::class,
                'storeSekretaris',
            ])->name('disposisi.pesan.store');

            Route::get('/disposisi/{suratMasuk}', [
                DirekturDisposisiController::class,
                'create',
            ])->name('disposisi.create');

            Route::post('/disposisi/{suratMasuk}', [
                DirekturDisposisiController::class,
                'store',
            ])->name('disposisi.store');

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

            Route::get('/dashboard', [
                UnitDashboardController::class,
                'index',
            ])->name('dashboard');

            Route::get('/disposisi', [
                DisposisiUnitController::class,
                'index',
            ])->name('disposisi');

            Route::get('/disposisi/{disposisi}', [
                DisposisiUnitController::class,
                'show',
            ])->name('disposisi.show');

            Route::post('/disposisi/{disposisi}/mulai', [
                DisposisiUnitController::class,
                'mulai',
            ])->name('disposisi.mulai');

            Route::post('/disposisi/{disposisi}/pesan', [
                DisposisiPesanController::class,
                'storeUnit',
            ])->name('disposisi.pesan.store');

            Route::post('/disposisi/{disposisi}/catatan', [
                DisposisiUnitController::class,
                'simpanCatatan',
            ])->name('disposisi.catatan');

            Route::post('/disposisi/{disposisi}/selesai', [
                DisposisiUnitController::class,
                'selesai',
            ])->name('disposisi.selesai');
        });
});
