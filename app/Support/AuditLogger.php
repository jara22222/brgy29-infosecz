<?php

namespace App\Support;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;

class AuditLogger
{
    public static function log(?int $userId, string $action, ?Request $request = null): void
    {
        $request ??= request();

        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'ip_address' => $request?->ip() ?? 'unknown',
            'user_agent' => $request?->userAgent() ?? 'unknown',
        ]);
    }

    public static function logForUser(
        ?User $user,
        string $action,
        ?string $loginIdentifier = null,
        ?Request $request = null,
    ): void {
        if (! $user && $loginIdentifier) {
            $action = self::withIdentifier($action, $loginIdentifier);
        }

        self::log($user?->id, $action, $request);
    }

    public static function withIdentifier(string $action, string $identifier): string
    {
        if (str_contains($action, '(')) {
            return $action;
        }

        return "{$action} ({$identifier})";
    }
}
