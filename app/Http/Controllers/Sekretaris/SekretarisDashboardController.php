<?php

namespace App\Http\Controllers\Sekretaris;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use App\Models\Disposisi;
use App\Models\SuratMasuk;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class SekretarisDashboardController extends Controller
{
    public function index(): View
    {
        // Gunakan timezone aplikasi agar tanggal "hari ini"
        // mengikuti waktu lokal Maluku (WIT).
        $today = now()->toDateString();

        $totalSurat = SuratMasuk::query()->count();

        $suratMenunggu = SuratMasuk::query()
            ->where('status', 'menunggu_disposisi')
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Agenda Hari Ini
        |--------------------------------------------------------------------------
        */
        $agendaHariIniData = Agenda::query()
            ->with([
                'suratMasuk',
                'creator',
            ])
            ->whereDate('tanggal', $today)
            ->orderBy('waktu_mulai')
            ->orderBy('id')
            ->take(6)
            ->get();

        $agendaHariIni = $agendaHariIniData->count();

        /*
        |--------------------------------------------------------------------------
        | Agenda Mendatang
        |--------------------------------------------------------------------------
        */
        $agendaMendatang = Agenda::query()
            ->whereDate('tanggal', '>', $today)
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Statistik Disposisi
        |--------------------------------------------------------------------------
        */
        $disposisiTerkirim = Disposisi::query()
            ->where('status', 'terkirim')
            ->count();

        $disposisiInProgress = Disposisi::query()
            ->where('status', 'in_progress')
            ->count();

        $disposisiSelesai = Disposisi::query()
            ->where('status', 'selesai')
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Surat Terbaru
        |--------------------------------------------------------------------------
        */
        $suratTerbaru = SuratMasuk::query()
            ->with(['creator'])
            ->orderByDesc('tanggal_diterima')
            ->orderByDesc('id')
            ->take(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Disposisi Terbaru
        |--------------------------------------------------------------------------
        */
        $disposisiTerbaru = Disposisi::query()
            ->with([
                'suratMasuk',
                'unit',
                'dariUser',
            ])
            ->orderByDesc('tanggal_disposisi')
            ->orderByDesc('id')
            ->take(5)
            ->get();

        return view('sekretaris-dashboard', [
            'page' => 'sekretaris-dashboard',

            'user' => Auth::user(),

            'stats' => [
                'totalSurat' => $totalSurat,
                'suratMenunggu' => $suratMenunggu,
                'agendaHariIni' => $agendaHariIni,
                'agendaMendatang' => $agendaMendatang,
                'disposisiTerkirim' => $disposisiTerkirim,
                'disposisiInProgress' => $disposisiInProgress,
                'disposisiSelesai' => $disposisiSelesai,
            ],

            'suratTerbaru' => $suratTerbaru,

            'agendaHariIniData' => $agendaHariIniData,

            'disposisiTerbaru' => $disposisiTerbaru,
        ]);
    }
}