<?php

namespace App\Http\Middleware;

use App\Support\TwoFactorService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTwoFactorVerified
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
        'two-factor.verify',
        'two-factor.verify.email.send',
        'two-factor.verify.email.verify',
        'two-factor.verify.totp.verify',
        'logout',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->is_2fa_enrolled) {
            return $next($request);
        }

        if ($request->routeIs(...$this->except)) {
            return $next($request);
        }

        if (app(TwoFactorService::class)->isSessionVerified()) {
            return $next($request);
        }

        return redirect()->route('two-factor.verify');
    }
}
