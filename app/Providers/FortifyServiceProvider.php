<?php

namespace App\Providers;

use App\Http\Requests\Auth\LoginRequest;
use App\Support\AuditLogger;
use App\Support\TwoFactorService;
use Illuminate\Auth\Events\Login;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;
use App\Actions\Auth\RedirectToTwoFactor;
use Laravel\Fortify\Actions\AttemptToAuthenticate;
use Laravel\Fortify\Actions\EnsureLoginIsNotThrottled;
use Laravel\Fortify\Actions\PrepareAuthenticatedSession;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Fortify::authenticateThrough(function (Request $request) {
            return array_filter([
                config('fortify.limiters.login') ? null : EnsureLoginIsNotThrottled::class,
                RedirectToTwoFactor::class,
                AttemptToAuthenticate::class,
                PrepareAuthenticatedSession::class,
            ]);
        });

        Fortify::authenticateUsing(function (Request $request) {
            LoginRequest::validateFrom($request);

            $throttleKey = Str::lower($request->email).'|'.$request->ip();

            $user = \App\Models\User::where('email', $request->email)
                ->orWhere('userName', $request->email)
                ->first();

            if ($user && $user->is_locked) {
                AuditLogger::logForUser($user, 'Login Blocked (account locked)', $request->email, $request);
                $request->session()->put('locked_email', $request->email);
                throw new \Illuminate\Http\Exceptions\HttpResponseException(
                    $request->header('X-Inertia')
                        ? Inertia::location(route('account.locked'))
                        : redirect()->route('account.locked')
                );
            }

            $softLockExpiresAt = \Illuminate\Support\Facades\Cache::get("login:soft_lock:{$throttleKey}");
            if ($softLockExpiresAt) {
                $remainingSeconds = max(0, (int) $softLockExpiresAt - now()->timestamp);
                $remainingMinutes = ceil($remainingSeconds / 60);

                AuditLogger::logForUser(
                    $user,
                    "Login Lockout (retry in {$remainingMinutes} minute".($remainingMinutes == 1 ? '' : 's').')',
                    $request->email,
                    $request,
                );

                throw \Illuminate\Validation\ValidationException::withMessages([
                    'email' => 'Too many login attempts. For your security, please try again in '.$remainingMinutes.' minute'.($remainingMinutes == 1 ? '' : 's').'.',
                ]);
            }

            if ($user && \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
                \Illuminate\Support\Facades\Cache::forget("login:attempts:{$throttleKey}");
                \Illuminate\Support\Facades\Cache::forget("login:soft_lock:{$throttleKey}");
                \Illuminate\Support\Facades\Cache::forget("login:tier2_watch:{$throttleKey}");

                return $user;
            }

            if (\Illuminate\Support\Facades\Cache::get("login:tier2_watch:{$throttleKey}")) {
                if ($user) {
                    $user->update(['is_locked' => true]);
                    AuditLogger::logForUser($user, 'Account Locked (excessive failed logins)', $request->email, $request);
                    $request->session()->put('locked_email', $request->email);
                    throw new \Illuminate\Http\Exceptions\HttpResponseException(
                        $request->header('X-Inertia')
                            ? Inertia::location(route('account.locked'))
                            : redirect()->route('account.locked')
                    );
                }
            }

            $attemptKey = "login:attempts:{$throttleKey}";
            $attempts = (int) \Illuminate\Support\Facades\Cache::get($attemptKey, 0) + 1;
            \Illuminate\Support\Facades\Cache::put($attemptKey, $attempts, now()->addHours(24));

            if ($attempts >= 5) {
                $lockoutMinutes = config('auth.login_lockout_minutes', 1);
                $lockoutUntil = now()->addMinutes($lockoutMinutes);

                \Illuminate\Support\Facades\Cache::put("login:soft_lock:{$throttleKey}", $lockoutUntil->timestamp, $lockoutUntil);
                \Illuminate\Support\Facades\Cache::put("login:tier2_watch:{$throttleKey}", true, now()->addHours(24));
                \Illuminate\Support\Facades\Cache::forget($attemptKey);

                AuditLogger::logForUser(
                    $user,
                    "Login Lockout ({$lockoutMinutes} minute".($lockoutMinutes === 1 ? '' : 's').' lock applied)',
                    $request->email,
                    $request,
                );

                throw \Illuminate\Validation\ValidationException::withMessages([
                    'email' => 'Too many login attempts. For your security, please try again in '.$lockoutMinutes.' minute'.($lockoutMinutes === 1 ? '' : 's').'.',
                ]);
            }

            $remaining = 5 - $attempts;

            AuditLogger::logForUser(
                $user,
                "Failed Login ({$remaining} attempt".($remaining === 1 ? '' : 's').' remaining)',
                $request->email,
                $request,
            );

            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => 'Invalid credentials. You have '.$remaining.' attempts remaining.',
            ]);
        });

        Event::listen(Login::class, function (Login $event): void {
            app(TwoFactorService::class)->clearSessionVerified();
        });

        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());
            $lockoutMinutes = max(1, config('auth.login_lockout_minutes', 1));

            return [
                Limit::perMinute(5)->by($throttleKey),
                Limit::perMinutes(5, 6)->by($throttleKey),
                Limit::perMinutes($lockoutMinutes, 7)->by($throttleKey),
            ];
        });
    }

}
