<?php

namespace App\Http\Controllers\Direktur;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        /*
        |--------------------------------------------------------------------------
        | TANGGAL HARI INI - WIT
        |--------------------------------------------------------------------------
        |
        | Poltekkes Maluku berada pada zona waktu WIT.
        | Gunakan Asia/Jayapura, bukan Asia/Jakarta.
        |
        */

        $today = Date::now(
            'Asia/Jayapura'
        )->toDateString();

        /*
        |--------------------------------------------------------------------------
        | AGENDA HARI INI
        |--------------------------------------------------------------------------
        */

        $agendaHariIni = Agenda::query()
            ->with([
                'suratMasuk',
                'creator',
            ])
            ->whereDate(
                'tanggal',
                $today
            )
            ->orderBy(
                'waktu_mulai'
            )
            ->orderBy(
                'id'
            )
            ->take(10)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | JUMLAH AGENDA HARI INI
        |--------------------------------------------------------------------------
        */

        $jumlahAgendaHariIni = Agenda::query()
            ->whereDate(
                'tanggal',
                $today
            )
            ->count();

        /*
        |--------------------------------------------------------------------------
        | AGENDA MENDATANG
        |--------------------------------------------------------------------------
        */

        $jumlahAgendaMendatang = Agenda::query()
            ->whereDate(
                'tanggal',
                '>',
                $today
            )
            ->count();

        /*
        |--------------------------------------------------------------------------
        | USER
        |--------------------------------------------------------------------------
        */

        $user = Auth::user();

        /*
        |--------------------------------------------------------------------------
        | VIEW
        |--------------------------------------------------------------------------
        */

        return view('dashboard', [
            'page' => 'direktur-dashboard',

            'user' => $user,

            'stats' => [
                'agendaHariIni' =>
                    $jumlahAgendaHariIni,

                'agendaMendatang' =>
                    $jumlahAgendaMendatang,
            ],

            'agendaHariIni' =>
                $agendaHariIni,
        ]);
    }
}