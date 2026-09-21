<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class PenggunaController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | DAFTAR PENGGUNA
    |--------------------------------------------------------------------------
    */

    public function index(Request $request): View
    {
        $users = User::with([
                'role',
                'unit',
            ])
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {

                    $search = trim(
                        (string) $request->input('search')
                    );

                    $query->where(function ($userQuery) use ($search) {

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
                    });
                }
            )
            ->when(
                $request->filled('role'),
                function ($query) use ($request) {

                    $query->whereHas(
                        'role',
                        function ($roleQuery) use ($request) {

                            $roleQuery->where(
                                'slug',
                                $request->input('role')
                            );
                        }
                    );
                }
            )
            ->when(
                $request->filled('unit'),
                function ($query) use ($request) {

                    $query->where(
                        'unit_id',
                        $request->integer('unit')
                    );
                }
            )
            ->when(
                $request->input('status') !== null &&
                $request->input('status') !== '',
                function ($query) use ($request) {

                    $query->where(
                        'is_active',
                        $request->boolean('status')
                    );
                }
            )
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString();


        /*
        |--------------------------------------------------------------------------
        | ROLE AKTIF
        |--------------------------------------------------------------------------
        */

        $roles = Role::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();


        /*
        |--------------------------------------------------------------------------
        | UNIT AKTIF
        |--------------------------------------------------------------------------
        */

        $units = Unit::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();


        return view(
            'super-admin-pengguna',
            [
                'page' => 'super-admin-pengguna',

                'user' => $request->user(),

                'users' => $users,

                'roles' => $roles,

                'units' => $units,

                'filters' => [
                    'search' => $request->input(
                        'search',
                        ''
                    ),

                    'role' => $request->input(
                        'role',
                        ''
                    ),

                    'unit' => $request->input(
                        'unit',
                        ''
                    ),

                    'status' => $request->has('status')
                        ? $request->input('status')
                        : '',
                ],
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | TAMBAH PENGGUNA
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'email' => [
                    'required',
                    'email',
                    'max:255',
                    'unique:users,email',
                ],

                'password' => [
                    'required',
                    'string',
                    'min:8',
                ],

                'role_id' => [
                    'required',
                    'integer',
                    Rule::exists(
                        'roles',
                        'id'
                    )->where(
                        function ($query) {
                            $query->where(
                                'is_active',
                                true
                            );
                        }
                    ),
                ],

                'unit_id' => [
                    'nullable',
                    'integer',
                    Rule::exists(
                        'units',
                        'id'
                    )->where(
                        function ($query) {
                            $query->where(
                                'is_active',
                                true
                            );
                        }
                    ),
                ],
            ],
            [
                'name.required' =>
                    'Nama pengguna wajib diisi.',

                'email.required' =>
                    'Email wajib diisi.',

                'email.email' =>
                    'Format email tidak valid.',

                'email.unique' =>
                    'Email tersebut sudah digunakan.',

                'password.required' =>
                    'Password wajib diisi.',

                'password.min' =>
                    'Password minimal 8 karakter.',

                'role_id.required' =>
                    'Role wajib dipilih.',

                'unit_id.exists' =>
                    'Unit yang dipilih tidak valid.',
            ]
        );


        $role = Role::findOrFail(
            $validated['role_id']
        );


        /*
        |--------------------------------------------------------------------------
        | KEPALA UNIT / STAF WAJIB UNIT
        |--------------------------------------------------------------------------
        */

        if (
            in_array(
                $role->slug,
                [
                    'kepala-unit',
                    'staf',
                ],
                true
            ) &&
            empty(
                $validated['unit_id']
            )
        ) {
            return back()
                ->withErrors([
                    'unit_id' =>
                        'Role Kepala Unit dan Staf wajib terhubung dengan unit.',
                ])
                ->withInput();
        }


        /*
        |--------------------------------------------------------------------------
        | ROLE NON UNIT
        |--------------------------------------------------------------------------
        | Direktur, Sekretaris Direktur, dan Super Admin
        | tidak wajib memiliki unit.
        |--------------------------------------------------------------------------
        */

        $unitId = $validated['unit_id'] ?? null;


        /*
        |--------------------------------------------------------------------------
        | CREATE
        |--------------------------------------------------------------------------
        */

        User::create([
            'name' =>
                trim(
                    $validated['name']
                ),

            'email' =>
                strtolower(
                    trim(
                        $validated['email']
                    )
                ),

            'password' =>
                Hash::make(
                    $validated['password']
                ),

            'role_id' =>
                $role->id,

            'unit_id' =>
                $unitId,

            'is_active' =>
                true,
        ]);


        return redirect()
            ->route(
                'super-admin.pengguna'
            )
            ->with(
                'success',
                'Pengguna berhasil ditambahkan.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | EDIT PENGGUNA
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        User $user
    ) {
        $currentUser =
            $request->user();


        $validated = $request->validate(
            [
                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'email' => [
                    'required',
                    'email',
                    'max:255',
                    Rule::unique(
                        'users',
                        'email'
                    )->ignore(
                        $user->id
                    ),
                ],

                'password' => [
                    'nullable',
                    'string',
                    'min:8',
                ],

                'role_id' => [
                    'required',
                    'integer',
                    Rule::exists(
                        'roles',
                        'id'
                    )->where(
                        function ($query) {
                            $query->where(
                                'is_active',
                                true
                            );
                        }
                    ),
                ],

                'unit_id' => [
                    'nullable',
                    'integer',
                    Rule::exists(
                        'units',
                        'id'
                    )->where(
                        function ($query) {
                            $query->where(
                                'is_active',
                                true
                            );
                        }
                    ),
                ],
            ],
            [
                'name.required' =>
                    'Nama pengguna wajib diisi.',

                'email.required' =>
                    'Email wajib diisi.',

                'email.email' =>
                    'Format email tidak valid.',

                'email.unique' =>
                    'Email tersebut sudah digunakan.',

                'password.min' =>
                    'Password minimal 8 karakter.',
            ]
        );


        $role = Role::findOrFail(
            $validated['role_id']
        );


        /*
        |--------------------------------------------------------------------------
        | KEPALA UNIT / STAF WAJIB UNIT
        |--------------------------------------------------------------------------
        */

        if (
            in_array(
                $role->slug,
                [
                    'kepala-unit',
                    'staf',
                ],
                true
            ) &&
            empty(
                $validated['unit_id']
            )
        ) {
            return back()
                ->withErrors([
                    'unit_id' =>
                        'Role Kepala Unit dan Staf wajib terhubung dengan unit.',
                ])
                ->withInput();
        }


        /*
        |--------------------------------------------------------------------------
        | PROTEKSI AKUN SENDIRI
        |--------------------------------------------------------------------------
        */

        if (
            (int) $currentUser->id ===
            (int) $user->id
        ) {

            $currentRole =
                $currentUser->role?->slug;


            /*
            |------------------------------------------------------------------
            | SUPER ADMIN TIDAK BOLEH MENGUBAH ROLE DIRI SENDIRI
            |------------------------------------------------------------------
            */

            if (
                $currentRole === 'super-admin' &&
                $role->slug !== 'super-admin'
            ) {
                return back()
                    ->withErrors([
                        'role_id' =>
                            'Role Super Admin pada akun yang sedang digunakan tidak dapat diubah dari halaman ini.',
                    ])
                    ->withInput();
            }


            /*
            |------------------------------------------------------------------
            | SUPER ADMIN TIDAK BOLEH MENONAKTIFKAN DIRI SENDIRI
            |------------------------------------------------------------------
            */

            if (
                !$request->boolean(
                    'is_active',
                    true
                )
            ) {
                return back()
                    ->withErrors([
                        'is_active' =>
                            'Akun Super Admin yang sedang digunakan tidak dapat dinonaktifkan.',
                    ])
                    ->withInput();
            }
        }


        /*
        |--------------------------------------------------------------------------
        | DATA UPDATE
        |--------------------------------------------------------------------------
        */

        $data = [
            'name' =>
                trim(
                    $validated['name']
                ),

            'email' =>
                strtolower(
                    trim(
                        $validated['email']
                    )
                ),

            'role_id' =>
                $role->id,

            'unit_id' =>
                $validated['unit_id'] ?? null,
        ];


        /*
        |--------------------------------------------------------------------------
        | PASSWORD
        |--------------------------------------------------------------------------
        */

        if (
            $request->filled(
                'password'
            )
        ) {
            $data['password'] =
                Hash::make(
                    $validated['password']
                );
        }


        /*
        |--------------------------------------------------------------------------
        | STATUS
        |--------------------------------------------------------------------------
        */

        if (
            !$user->is_active ||
            $request->has('is_active')
        ) {
            $data['is_active'] =
                $request->boolean(
                    'is_active'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | UPDATE
        |--------------------------------------------------------------------------
        */

        $user->update(
            $data
        );


        return redirect()
            ->route(
                'super-admin.pengguna'
            )
            ->with(
                'success',
                'Data pengguna berhasil diperbarui.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | AKTIF / NONAKTIF
    |--------------------------------------------------------------------------
    */

    public function toggleStatus(
        Request $request,
        User $user
    ) {
        $currentUser =
            $request->user();


        /*
        |--------------------------------------------------------------------------
        | DIRI SENDIRI
        |--------------------------------------------------------------------------
        */

        if (
            (int) $currentUser->id ===
            (int) $user->id
        ) {
            return back()
                ->withErrors([
                    'status' =>
                        'Akun Super Admin yang sedang digunakan tidak dapat dinonaktifkan dari halaman pengguna.',
                ]);
        }


        /*
        |--------------------------------------------------------------------------
        | TOGGLE
        |--------------------------------------------------------------------------
        */

        $user->update([
            'is_active' =>
                !$user->is_active,
        ]);


        return back()
            ->with(
                'success',
                $user->is_active
                    ? 'Akun berhasil diaktifkan.'
                    : 'Akun berhasil dinonaktifkan.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | HAPUS PENGGUNA
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request,
        User $user
    ) {
        $currentUser =
            $request->user();


        /*
        |--------------------------------------------------------------------------
        | JANGAN HAPUS DIRI SENDIRI
        |--------------------------------------------------------------------------
        */

        if (
            (int) $currentUser->id ===
            (int) $user->id
        ) {
            return back()
                ->withErrors([
                    'user' =>
                        'Akun Super Admin yang sedang digunakan tidak dapat dihapus.',
                ]);
        }


        /*
        |--------------------------------------------------------------------------
        | CEK DATA TERKAIT
        |--------------------------------------------------------------------------
        |
        | Jangan menghapus user yang masih direferensikan oleh data
        | administratif. Ini mencegah kerusakan histori surat/disposisi.
        |
        |--------------------------------------------------------------------------
        */

        $suratMasukCount =
            DB::table('surat_masuks')
                ->where(
                    'created_by',
                    $user->id
                )
                ->count();


        $disposisiCount =
            DB::table('disposisis')
                ->where(
                    'dari_user_id',
                    $user->id
                )
                ->count();


        $pesanCount =
            DB::table('disposisi_pesans')
                ->where(
                    'user_id',
                    $user->id
                )
                ->count();


        $agendaCount =
            DB::table('agendas')
                ->where(
                    'created_by',
                    $user->id
                )
                ->count();


        $relatedData = [];


        if ($suratMasukCount > 0) {
            $relatedData[] =
                "{$suratMasukCount} surat masuk";
        }


        if ($disposisiCount > 0) {
            $relatedData[] =
                "{$disposisiCount} disposisi";
        }


        if ($pesanCount > 0) {
            $relatedData[] =
                "{$pesanCount} pesan disposisi";
        }


        if ($agendaCount > 0) {
            $relatedData[] =
                "{$agendaCount} agenda";
        }


        /*
        |--------------------------------------------------------------------------
        | JIKA MASIH MEMILIKI DATA TERKAIT
        |--------------------------------------------------------------------------
        */

        if (
            !empty(
                $relatedData
            )
        ) {

            return back()
                ->withErrors([
                    'user' =>
                        'Pengguna tidak dapat dihapus karena masih memiliki data terkait: ' .
                        implode(
                            ', ',
                            $relatedData
                        ) .
                        '. Nonaktifkan akun jika pengguna sudah tidak digunakan.',
                ]);
        }


        /*
        |--------------------------------------------------------------------------
        | HAPUS USER
        |--------------------------------------------------------------------------
        */

        $userName =
            $user->name;


        $user->delete();


        /*
        |--------------------------------------------------------------------------
        | SELESAI
        |--------------------------------------------------------------------------
        */

        return back()
            ->with(
                'success',
                "Pengguna \"{$userName}\" berhasil dihapus."
            );
    }
}