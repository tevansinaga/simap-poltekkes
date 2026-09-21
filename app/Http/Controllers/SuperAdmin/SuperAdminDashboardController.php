<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Models\User;
use Illuminate\View\View;

class SuperAdminDashboardController extends Controller
{
    public function index(): View
    {
        $stats = [
            'totalUsers' => User::count(),

            'activeUsers' => User::where(
                'is_active',
                true
            )->count(),

            'inactiveUsers' => User::where(
                'is_active',
                false
            )->count(),

            'totalUnits' => Unit::count(),

            'activeUnits' => Unit::where(
                'is_active',
                true
            )->count(),
        ];

        $usersTerbaru = User::with([
            'role',
            'unit',
        ])
            ->latest('id')
            ->limit(8)
            ->get();

        return view('super-admin-dashboard', [
            'page' => 'super-admin-dashboard',
            'user' => auth()->user(),
            'stats' => $stats,
            'usersTerbaru' => $usersTerbaru,
        ]);
    }
}
