<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'ip_address',
        'user_agent',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isFailedLogin(): bool
    {
        return self::severityForAction($this->action) === 'danger';
    }

    /**
     * @return 'success'|'warning'|'danger'|'info'
     */
    public static function severityForAction(string $action): string
    {
        if (
            str_starts_with($action, 'Successful Login')
            || str_starts_with($action, 'Account Unlocked')
        ) {
            return 'success';
        }

        if (
            str_contains($action, 'attempts remaining')
            || str_starts_with($action, 'Unlock OTP Sent')
        ) {
            return 'warning';
        }

        if (
            str_starts_with($action, 'Failed Login')
            || str_starts_with($action, 'Failed Unlock')
            || str_starts_with($action, 'Login Lockout')
            || str_starts_with($action, 'Login Blocked')
            || str_starts_with($action, 'Account Locked')
            || str_starts_with($action, 'Unlock OTP Failed')
        ) {
            return 'danger';
        }

        return 'info';
    }
}
