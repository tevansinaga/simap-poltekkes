<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Throwable;

class ActivityLogger
{
    public static function log(
        Request $request,
        string $action,
        string $module,
        string $description,
        ?User $user = null,
    ): ?ActivityLog {
        $actor = $user ?: $request->user();

        if (!$actor) {
            return null;
        }

        try {
            return ActivityLog::create([
                'user_id' => $actor->id,
                'action' => $action,
                'module' => $module,
                'description' => $description,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        } catch (Throwable $e) {
            report($e);

            // Kegagalan pencatatan aktivitas tidak boleh membuat
            // proses utama aplikasi ikut gagal.
            return null;
        }
    }
}
