<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
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
        | Default true agar pengguna tetap login ketika PWA/browser ditutup
        | kemudian dibuka kembali.
        |
        | Checkbox "Ingat saya" dari Login.jsx tetap bisa digunakan.
        |--------------------------------------------------------------------------
        */
        $remember = $request->boolean('remember', true);

        if (!Auth::attempt($credentials, $remember)) {
            return back()
                ->withErrors([
                    'email' =>
                        'Email atau password yang Anda masukkan salah.',
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
                    'email' =>
                        'Akun Anda tidak aktif.',
                ])
                ->withInput(
                    $request->only('email')
                );
        }

        $roleSlug = $user->role?->slug;

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
        | USER UNIT
        |--------------------------------------------------------------------------
        */
        if ($user->unit_id) {
            return redirect()
                ->route('unit.dashboard');
        }

        /*
        |--------------------------------------------------------------------------
        | FALLBACK
        |--------------------------------------------------------------------------
        */
        return redirect()
            ->intended(route('dashboard'));
    }

    public function logout(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | LOGOUT
        |--------------------------------------------------------------------------
        */
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}