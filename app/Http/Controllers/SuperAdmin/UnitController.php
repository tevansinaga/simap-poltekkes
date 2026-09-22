<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class UnitController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | DAFTAR UNIT
    |--------------------------------------------------------------------------
    */

    public function index(Request $request): View
    {
        $units = Unit::query()
            ->withCount('users')
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {

                    $search = trim(
                        (string) $request->input('search')
                    );

                    $query->where(
                        function ($unitQuery) use ($search) {

                            $unitQuery
                                ->where(
                                    'code',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'name',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'description',
                                    'like',
                                    "%{$search}%"
                                );
                        }
                    );
                }
            )
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return view(
            'super-admin-unit',
            [
                'page' => 'super-admin-unit',

                'user' =>
                    $request
                        ->user()
                        ->load('role'),

                'units' => $units,

                'filters' => [
                    'search' =>
                        $request->input(
                            'search',
                            ''
                        ),
                ],
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | TAMBAH UNIT
    |--------------------------------------------------------------------------
    */

    public function store(
        Request $request
    ): RedirectResponse {

        $validated = $request->validate(
            [
                'code' => [
                    'required',
                    'string',
                    'max:30',

                    /*
                    |--------------------------------------------------------------------------
                    | KODE UNIT
                    |--------------------------------------------------------------------------
                    | Hanya huruf kapital, angka, underscore, dan tanda hubung.
                    |--------------------------------------------------------------------------
                    */

                    'regex:/^[A-Z0-9_-]+$/',

                    Rule::unique(
                        'units',
                        'code'
                    ),
                ],

                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'description' => [
                    'nullable',
                    'string',
                    'max:1000',
                ],
            ],
            [
                'code.required' =>
                    'Kode unit wajib diisi.',

                'code.regex' =>
                    'Kode unit hanya boleh berisi huruf kapital, angka, garis bawah, atau tanda hubung.',

                'code.unique' =>
                    'Kode unit tersebut sudah digunakan.',

                'name.required' =>
                    'Nama unit wajib diisi.',

                'description.max' =>
                    'Deskripsi unit maksimal 1000 karakter.',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | CREATE
        |--------------------------------------------------------------------------
        */

        $unit = Unit::create([
            'code' =>
                strtoupper(
                    trim(
                        $validated['code']
                    )
                ),

            'name' =>
                trim(
                    $validated['name']
                ),

            'description' =>
                isset(
                    $validated['description']
                )
                    ? trim(
                        $validated['description']
                    )
                    : null,

            'is_active' =>
                true,
        ]);

        /*
        |--------------------------------------------------------------------------
        | LOG AKTIVITAS
        |--------------------------------------------------------------------------
        */

        ActivityLogger::log(
            $request,
            'create',
            'Unit',
            'Menambahkan unit baru "' .
                $unit->name .
                '" dengan kode "' .
                $unit->code .
                '".'
        );

        return redirect()
            ->route(
                'super-admin.unit'
            )
            ->with(
                'success',
                'Unit berhasil ditambahkan.'
            );
    }

    /*
    |--------------------------------------------------------------------------
    | EDIT UNIT
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        Unit $unit
    ): RedirectResponse {

        $validated = $request->validate(
            [
                'code' => [
                    'required',
                    'string',
                    'max:30',

                    'regex:/^[A-Z0-9_-]+$/',

                    Rule::unique(
                        'units',
                        'code'
                    )->ignore(
                        $unit->id
                    ),
                ],

                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'description' => [
                    'nullable',
                    'string',
                    'max:1000',
                ],
            ],
            [
                'code.required' =>
                    'Kode unit wajib diisi.',

                'code.regex' =>
                    'Kode unit hanya boleh berisi huruf kapital, angka, garis bawah, atau tanda hubung.',

                'code.unique' =>
                    'Kode unit tersebut sudah digunakan.',

                'name.required' =>
                    'Nama unit wajib diisi.',

                'description.max' =>
                    'Deskripsi unit maksimal 1000 karakter.',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | STATUS YANG DIMINTA
        |--------------------------------------------------------------------------
        */

        $requestedActive =
            $request->boolean(
                'is_active'
            );

        /*
        |--------------------------------------------------------------------------
        | PROTEKSI NONAKTIF
        |--------------------------------------------------------------------------
        |
        | Unit yang masih dipakai pengguna tidak boleh dinonaktifkan.
        |--------------------------------------------------------------------------
        */

        if (
            !$requestedActive &&
            $unit->is_active
        ) {

            $usersCount =
                DB::table(
                    'users'
                )
                ->where(
                    'unit_id',
                    $unit->id
                )
                ->count();

            if (
                $usersCount > 0
            ) {

                return back()
                    ->withErrors([
                        'unit' =>
                            "Unit {$unit->name} masih digunakan oleh {$usersCount} pengguna. Pindahkan pengguna terlebih dahulu sebelum menonaktifkan unit.",
                    ])
                    ->withInput();
            }
        }

        /*
        |--------------------------------------------------------------------------
        | SIMPAN DATA LAMA UNTUK LOG
        |--------------------------------------------------------------------------
        */

        $oldCode =
            $unit->code;

        $oldName =
            $unit->name;

        $oldStatus =
            $unit->is_active;

        /*
        |--------------------------------------------------------------------------
        | UPDATE
        |--------------------------------------------------------------------------
        */

        $unit->update([
            'code' =>
                strtoupper(
                    trim(
                        $validated['code']
                    )
                ),

            'name' =>
                trim(
                    $validated['name']
                ),

            'description' =>
                isset(
                    $validated['description']
                )
                    ? trim(
                        $validated['description']
                    )
                    : null,

            'is_active' =>
                $requestedActive,
        ]);

        /*
        |--------------------------------------------------------------------------
        | LOG AKTIVITAS
        |--------------------------------------------------------------------------
        */

        ActivityLogger::log(
            $request,
            'update',
            'Unit',
            'Mengubah data unit "' .
                $oldName .
                '" dari kode "' .
                $oldCode .
                '" menjadi "' .
                $unit->name .
                '" (' .
                $unit->code .
                ').'
        );

        /*
        |--------------------------------------------------------------------------
        | CATAT PERUBAHAN STATUS JIKA BERUBAH
        |--------------------------------------------------------------------------
        */

        if (
            $oldStatus !==
            $unit->is_active
        ) {

            ActivityLogger::log(
                $request,
                'status',
                'Unit',
                'Mengubah status unit "' .
                    $unit->name .
                    '" menjadi ' .
                    (
                        $unit->is_active
                            ? 'aktif'
                            : 'tidak aktif'
                    ) .
                    '.'
            );
        }

        return redirect()
            ->route(
                'super-admin.unit'
            )
            ->with(
                'success',
                'Data unit berhasil diperbarui.'
            );
    }

    /*
    |--------------------------------------------------------------------------
    | AKTIF / NONAKTIF UNIT
    |--------------------------------------------------------------------------
    */

    public function toggleStatus(
        Request $request,
        Unit $unit
    ): RedirectResponse {

        $newStatus =
            !$unit->is_active;

        /*
        |--------------------------------------------------------------------------
        | PROTEKSI NONAKTIF
        |--------------------------------------------------------------------------
        */

        if (
            !$newStatus
        ) {

            $usersCount =
                DB::table(
                    'users'
                )
                ->where(
                    'unit_id',
                    $unit->id
                )
                ->count();

            if (
                $usersCount > 0
            ) {

                return back()
                    ->withErrors([
                        'unit' =>
                            "Unit {$unit->name} masih digunakan oleh {$usersCount} pengguna. Pindahkan pengguna terlebih dahulu sebelum menonaktifkan unit.",
                    ]);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | UPDATE STATUS
        |--------------------------------------------------------------------------
        */

        $unit->update([
            'is_active' =>
                $newStatus,
        ]);

        /*
        |--------------------------------------------------------------------------
        | LOG AKTIVITAS
        |--------------------------------------------------------------------------
        */

        ActivityLogger::log(
            $request,
            'status',
            'Unit',
            'Mengubah status unit "' .
                $unit->name .
                '" menjadi ' .
                (
                    $newStatus
                        ? 'aktif'
                        : 'tidak aktif'
                ) .
                '.'
        );

        return back()
            ->with(
                'success',
                $newStatus
                    ? 'Unit berhasil diaktifkan.'
                    : 'Unit berhasil dinonaktifkan.'
            );
    }

    /*
    |--------------------------------------------------------------------------
    | HAPUS UNIT
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request,
        Unit $unit
    ): RedirectResponse {

        /*
        |--------------------------------------------------------------------------
        | CEK PENGGUNA
        |--------------------------------------------------------------------------
        */

        $usersCount =
            DB::table(
                'users'
            )
            ->where(
                'unit_id',
                $unit->id
            )
            ->count();

        /*
        |--------------------------------------------------------------------------
        | CEK DISPOSISI
        |--------------------------------------------------------------------------
        */

        $disposisiCount =
            DB::table(
                'disposisis'
            )
            ->where(
                'ke_unit_id',
                $unit->id
            )
            ->count();

        /*
        |--------------------------------------------------------------------------
        | DATA TERKAIT
        |--------------------------------------------------------------------------
        */

        $related = [];

        if (
            $usersCount > 0
        ) {

            $related[] =
                "{$usersCount} pengguna";
        }

        if (
            $disposisiCount > 0
        ) {

            $related[] =
                "{$disposisiCount} disposisi";
        }

        /*
        |--------------------------------------------------------------------------
        | BLOK JIKA MASIH DIGUNAKAN
        |--------------------------------------------------------------------------
        */

        if (
            !empty(
                $related
            )
        ) {

            return back()
                ->withErrors([
                    'unit' =>
                        'Unit tidak dapat dihapus karena masih digunakan oleh ' .
                        implode(
                            ', ',
                            $related
                        ) .
                        '. Nonaktifkan unit atau pindahkan data terkait terlebih dahulu.',
                ]);
        }

        /*
        |--------------------------------------------------------------------------
        | SIMPAN DATA UNTUK LOG
        |--------------------------------------------------------------------------
        */

        $unitName =
            $unit->name;

        $unitCode =
            $unit->code;

        /*
        |--------------------------------------------------------------------------
        | HAPUS
        |--------------------------------------------------------------------------
        */

        $unit->delete();

        /*
        |--------------------------------------------------------------------------
        | LOG AKTIVITAS
        |--------------------------------------------------------------------------
        */

        ActivityLogger::log(
            $request,
            'delete',
            'Unit',
            'Menghapus unit "' .
                $unitName .
                '" dengan kode "' .
                $unitCode .
                '".'
        );

        return back()
            ->with(
                'success',
                'Unit "' .
                    $unitName .
                    '" berhasil dihapus.'
            );
    }
}