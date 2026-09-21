<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Proses login pengguna.
     */
    public function login(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | VALIDASI LOGIN
        |--------------------------------------------------------------------------
        */
        $credentials = $request->validate(
            [
                'email' => ['required', 'email'],
                'password' => ['required'],
            ],
            [
                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'password.required' => 'Password wajib diisi.',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | REMEMBER LOGIN
        |--------------------------------------------------------------------------
        | Default true agar pengguna tetap login ketika browser/PWA ditutup
        | kemudian dibuka kembali.
        |
        | Checkbox "Ingat saya" dari Login.jsx tetap dapat digunakan.
        |--------------------------------------------------------------------------
        */
        $remember = $request->boolean('remember', true);

        /*
        |--------------------------------------------------------------------------
        | ATTEMPT LOGIN
        |--------------------------------------------------------------------------
        */
        if (!Auth::attempt($credentials, $remember)) {
            return back()
                ->withErrors([
                    'email' => 'Email atau password yang Anda masukkan salah.',
                ])
                ->withInput(
                    $request->only('email')
                );
        }

        /*
        |--------------------------------------------------------------------------
        | REGENERATE SESSION
        |--------------------------------------------------------------------------
        */
        $request->session()->regenerate();

        /** @var \App\Models\User $user */
        $user = Auth::user();

        /*
        |--------------------------------------------------------------------------
        | CEK AKUN AKTIF
        |--------------------------------------------------------------------------
        */
        if (!$user->is_active) {
            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()
                ->withErrors([
                    'email' => 'Akun Anda tidak aktif.',
                ])
                ->withInput(
                    $request->only('email')
                );
        }

        /*
        |--------------------------------------------------------------------------
        | AMBIL ROLE
        |--------------------------------------------------------------------------
        */
        $roleSlug = $user->role?->slug;

        /*
        |--------------------------------------------------------------------------
        | SUPER ADMIN
        |--------------------------------------------------------------------------
        | Super Admin selalu diarahkan ke dashboard Super Admin.
        | Tidak peduli apakah user memiliki unit_id atau tidak.
        |--------------------------------------------------------------------------
        */
        if ($roleSlug === 'super-admin') {
            return redirect()
                ->route('super-admin.dashboard');
        }

        /*
        |--------------------------------------------------------------------------
        | DIREKTUR
        |--------------------------------------------------------------------------
        */
        if ($roleSlug === 'direktur') {
            return redirect()
                ->route('direktur.dashboard');
        }

        /*
        |--------------------------------------------------------------------------
        | SEKRETARIS DIREKTUR
        |--------------------------------------------------------------------------
        */
        if ($roleSlug === 'sekretaris-direktur') {
            return redirect()
                ->route('sekretaris.dashboard');
        }

        /*
        |--------------------------------------------------------------------------
        | KEPALA UNIT
        |--------------------------------------------------------------------------
        */
        if ($roleSlug === 'kepala-unit') {
            if (!$user->unit_id) {
                Auth::logout();

                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return back()
                    ->withErrors([
                        'email' =>
                            'Akun Kepala Unit belum terhubung dengan unit.',
                    ])
                    ->withInput(
                        $request->only('email')
                    );
            }

            return redirect()
                ->route('unit.dashboard');
        }

        /*
        |--------------------------------------------------------------------------
        | STAF
        |--------------------------------------------------------------------------
        */
        if ($roleSlug === 'staf') {
            if (!$user->unit_id) {
                Auth::logout();

                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return back()
                    ->withErrors([
                        'email' =>
                            'Akun staf belum terhubung dengan unit.',
                    ])
                    ->withInput(
                        $request->only('email')
                    );
            }

            return redirect()
                ->route('unit.dashboard');
        }

        /*
        |--------------------------------------------------------------------------
        | ROLE TIDAK DIKENALI
        |--------------------------------------------------------------------------
        */
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return back()
            ->withErrors([
                'email' =>
                    'Role akun tidak dikenali. Silakan hubungi Super Admin.',
            ])
            ->withInput(
                $request->only('email')
            );
    }

    /**
     * Logout pengguna.
     */
    public function logout(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | LOGOUT
        |--------------------------------------------------------------------------
        */
        Auth::logout();

        /*
        |--------------------------------------------------------------------------
        | INVALIDATE SESSION
        |--------------------------------------------------------------------------
        */
        $request->session()->invalidate();

        /*
        |--------------------------------------------------------------------------
        | REGENERATE CSRF TOKEN
        |--------------------------------------------------------------------------
        */
        $request->session()->regenerateToken();

        return redirect()
            ->route('login');
    }
}