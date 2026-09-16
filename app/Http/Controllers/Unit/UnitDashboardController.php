<?php

namespace App\Http\Controllers\Unit;

use App\Http\Controllers\Controller;
use App\Models\Disposisi;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class UnitDashboardController extends Controller
{
    public function index(): View
    {
        $user = Auth::user();

        $baseQuery = Disposisi::query()
            ->where('tujuan_type', 'unit')
            ->where(
                'ke_unit_id',
                $user->unit_id
            );

        $totalDisposisi = (clone $baseQuery)
            ->count();

        $terkirim = (clone $baseQuery)
            ->where('status', 'terkirim')
            ->count();

        $inProgress = (clone $baseQuery)
            ->where('status', 'in_progress')
            ->count();

        $selesai = (clone $baseQuery)
            ->where('status', 'selesai')
            ->count();

        $disposisiTerbaru = (clone $baseQuery)
            ->with([
                'suratMasuk',
                'dariUser',
            ])
            ->orderByDesc('tanggal_disposisi')
            ->orderByDesc('id')
            ->take(5)
            ->get();

        return view('unit-dashboard', [
            'page' => 'unit-dashboard',
            'user' => $user,
            'unit' => $user->unit,
            'stats' => [
                'total' => $totalDisposisi,
                'terkirim' => $terkirim,
                'in_progress' => $inProgress,
                'selesai' => $selesai,
            ],
            'disposisiTerbaru' =>
                $disposisiTerbaru,
        ]);
    }
}