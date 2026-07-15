<?php

namespace App\Listeners;

use App\Support\AuditLogger;
use Illuminate\Auth\Events\Failed;

class LogFailedLogin
{
    public function handle(Failed $event): void
    {
        $email = $event->credentials['email']
            ?? $event->credentials['username']
            ?? 'unknown';

        AuditLogger::logForUser(
            $event->user,
            'Failed Login',
            $email,
        );
    }
}
