<?php

namespace App\Actions\Auth;

use Illuminate\Auth\Events\Failed;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\LoginRateLimiter;
use Illuminate\Http\Request;

class RedirectToTwoFactor
{
    /**
     * The guard implementation.
     *
     * @var \Illuminate\Contracts\Auth\StatefulGuard
     */
    protected $guard;

    /**
     * The login rate limiter instance.
     *
     * @var \Laravel\Fortify\LoginRateLimiter
     */
    protected $limiter;

    /**
     * Create a new controller instance.
     *
     * @param  \Illuminate\Contracts\Auth\StatefulGuard  $guard
     * @param  \Laravel\Fortify\LoginRateLimiter  $limiter
     * @return void
     */
    public function __construct(StatefulGuard $guard, LoginRateLimiter $limiter)
    {
        $this->guard = $guard;
        $this->limiter = $limiter;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  callable  $next
     * @return mixed
     */
    public function handle($request, $next)
    {
        // Validate credentials using Fortify's custom callback (which handles lockout logic)
        $user = tap(call_user_func(Fortify::$authenticateUsingCallback, $request), function ($user) use ($request) {
            if (! $user) {
                event(new Failed(config('fortify.guard'), null, [
                    Fortify::username() => $request->{Fortify::username()},
                    'password' => $request->password,
                ]));

                $this->limiter->increment($request);

                throw ValidationException::withMessages([
                    Fortify::username() => [trans('auth.failed')],
                ]);
            }
        });

        // Save pre-authenticated session state
        $request->session()->put([
            'login.id' => $user->getKey(),
            'login.remember' => $request->boolean('remember'),
        ]);

        // Redirect based on whether they have completed 2FA enrollment
        if (! $user->is_2fa_enrolled) {
            return $request->wantsJson()
                ? response()->json(['two_factor' => true, 'redirect' => route('two-factor.enrollment')])
                : redirect()->route('two-factor.enrollment');
        }

        return $request->wantsJson()
            ? response()->json(['two_factor' => true, 'redirect' => route('two-factor.verify')])
            : redirect()->route('two-factor.verify');
    }
}
