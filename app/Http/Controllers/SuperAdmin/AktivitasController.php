<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AktivitasController extends Controller
{
    /**
     * Menampilkan daftar aktivitas sistem.
     */
    public function index(Request $request): View
    {
        /*
        |--------------------------------------------------------------------------
        | DATA AKTIVITAS
        |--------------------------------------------------------------------------
        */

        $activities = ActivityLog::query()
            ->with([
                'user.role',
                'user.unit',
            ])

            /*
            |--------------------------------------------------------------------------
            | SEARCH
            |--------------------------------------------------------------------------
            */

            ->when(
                $request->filled('search'),
                function ($query) use ($request) {

                    $search = trim(
                        (string) $request->input('search')
                    );

                    $query->where(
                        function ($activityQuery) use ($search) {

                            $activityQuery
                                ->where(
                                    'description',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'module',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'action',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'ip_address',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhereHas(
                                    'user',
                                    function ($userQuery) use ($search) {

                                        $userQuery
                                            ->where(
                                                'name',
                                                'like',
                                                "%{$search}%"
                                            )
                                            ->orWhere(
                                                'email',
                                                'like',
                                                "%{$search}%"
                                            );
                                    }
                                );
                        }
                    );
                }
            )

            /*
            |--------------------------------------------------------------------------
            | FILTER AKSI
            |--------------------------------------------------------------------------
            */

            ->when(
                $request->filled('action'),
                function ($query) use ($request) {

                    $query->where(
                        'action',
                        $request->input('action')
                    );
                }
            )

            /*
            |--------------------------------------------------------------------------
            | FILTER MODUL
            |--------------------------------------------------------------------------
            */

            ->when(
                $request->filled('module'),
                function ($query) use ($request) {

                    $query->where(
                        'module',
                        $request->input('module')
                    );
                }
            )

            /*
            |--------------------------------------------------------------------------
            | FILTER TANGGAL MULAI
            |--------------------------------------------------------------------------
            */

            ->when(
                $request->filled('date_from'),
                function ($query) use ($request) {

                    $query->whereDate(
                        'created_at',
                        '>=',
                        $request->input('date_from')
                    );
                }
            )

            /*
            |--------------------------------------------------------------------------
            | FILTER TANGGAL AKHIR
            |--------------------------------------------------------------------------
            */

            ->when(
                $request->filled('date_to'),
                function ($query) use ($request) {

                    $query->whereDate(
                        'created_at',
                        '<=',
                        $request->input('date_to')
                    );
                }
            )

            /*
            |--------------------------------------------------------------------------
            | TERBARU DULU
            |--------------------------------------------------------------------------
            */

            ->latest('id')

            /*
            |--------------------------------------------------------------------------
            | PAGINATION
            |--------------------------------------------------------------------------
            */

            ->paginate(15)
            ->withQueryString();


        /*
        |--------------------------------------------------------------------------
        | STATISTIK
        |--------------------------------------------------------------------------
        */

        $stats = [

            'total' =>
                ActivityLog::count(),

            'today' =>
                ActivityLog::whereDate(
                    'created_at',
                    today()
                )->count(),

            'thisWeek' =>
                ActivityLog::whereBetween(
                    'created_at',
                    [
                        now()->startOfWeek(),
                        now()->endOfWeek(),
                    ]
                )->count(),

            'thisMonth' =>
                ActivityLog::whereBetween(
                    'created_at',
                    [
                        now()->startOfMonth(),
                        now()->endOfMonth(),
                    ]
                )->count(),
        ];


        /*
        |--------------------------------------------------------------------------
        | DAFTAR AKSI
        |--------------------------------------------------------------------------
        */

        $actionOptions = [

            'login' =>
                'Login',

            'logout' =>
                'Logout',

            'create' =>
                'Tambah',

            'update' =>
                'Perbarui',

            'status' =>
                'Ubah Status',

            'delete' =>
                'Hapus',
        ];


        /*
        |--------------------------------------------------------------------------
        | DAFTAR MODUL
        |--------------------------------------------------------------------------
        */

        $moduleOptions = [

            'Autentikasi' =>
                'Autentikasi',

            'Pengguna' =>
                'Pengguna',

            'Unit' =>
                'Unit',

            'Surat Masuk' =>
                'Surat Masuk',

            'Disposisi' =>
                'Disposisi',

            'Agenda' =>
                'Agenda',
        ];


        /*
        |--------------------------------------------------------------------------
        | VIEW
        |--------------------------------------------------------------------------
        */

        return view(
            'super-admin-aktivitas',
            [
                'page' =>
                    'super-admin-aktivitas',

                'user' =>
                    $request
                        ->user()
                        ->load(
                            'role',
                            'unit'
                        ),

                'activities' =>
                    $activities,

                'stats' =>
                    $stats,

                'filters' => [

                    'search' =>
                        $request->input(
                            'search',
                            ''
                        ),

                    'action' =>
                        $request->input(
                            'action',
                            ''
                        ),

                    'module' =>
                        $request->input(
                            'module',
                            ''
                        ),

                    'date_from' =>
                        $request->input(
                            'date_from',
                            ''
                        ),

                    'date_to' =>
                        $request->input(
                            'date_to',
                            ''
                        ),
                ],

                'actionOptions' =>
                    $actionOptions,

                'moduleOptions' =>
                    $moduleOptions,
            ]
        );
    }
}