<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTwoFactorEnrolled
{
    /**
     * @var list<string>
     */
    protected array $except = [
        'two-factor.enrollment',
        'two-factor.enrollment.email.send',
        'two-factor.enrollment.email.verify',
        'two-factor.enrollment.totp.setup',
        'two-factor.enrollment.totp.verify',
        'logout',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->is_2fa_enrolled) {
            return $next($request);
        }

        if ($request->routeIs(...$this->except)) {
            return $next($request);
        }

        return redirect()->route('two-factor.enrollment');
    }
}
