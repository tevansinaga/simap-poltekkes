<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(
        Request $request,
        Closure $next,
        ...$roles
    ): Response {
        $user = $request->user();

        // Belum login
        if (!$user) {
            return redirect()->route('login');
        }

        // Ambil slug role user
        $roleSlug = $user->role?->slug;

        // Role tidak ditemukan atau tidak diizinkan
        if (!$roleSlug || !in_array($roleSlug, $roles, true)) {
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }

        return $next($request);
    }
}