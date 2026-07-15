<?php

namespace App\Http\Middleware;

use App\Support\TwoFactorService;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfTwoFactorComplete
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user() ?? ($request->session()->has('login.id') ? User::find($request->session()->get('login.id')) : null);

        if (! $user) {
            return $next($request);
        }

        $twoFactor = app(TwoFactorService::class);

        if ($request->routeIs('two-factor.enrollment') && $user->is_2fa_enrolled) {
            return redirect()->to($twoFactor->enrollmentDestination($user));
        }

        if ($request->routeIs('two-factor.verify')) {
            if (! $user->is_2fa_enrolled) {
                return redirect()->route('two-factor.enrollment');
            }

            if ($twoFactor->isSessionVerified()) {
                return redirect()->to($user->postTwoFactorDashboardRoute());
            }
        }

        return $next($request);
    }
}
