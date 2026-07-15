<?php

namespace App\Support;

use App\Mail\TwoFactorCodeMail;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class TwoFactorService
{
    public const SESSION_VERIFIED_KEY = 'two_factor_verified';

    public const PURPOSE_ENROLLMENT_EMAIL = 'enrollment_email';

    public const PURPOSE_VERIFY_EMAIL = 'verify_email';

    public function markSessionVerified(): void
    {
        session()->put(self::SESSION_VERIFIED_KEY, true);
    }

    public function clearSessionVerified(): void
    {
        session()->forget(self::SESSION_VERIFIED_KEY);
    }

    public function isSessionVerified(): bool
    {
        return (bool) session()->get(self::SESSION_VERIFIED_KEY, false);
    }

    public function enrollmentDestination(User $user): string
    {
        if (! $user->is_2fa_enrolled) {
            return route('two-factor.enrollment');
        }

        if (! $this->isSessionVerified()) {
            return route('two-factor.verify');
        }

        return $user->postTwoFactorDashboardRoute();
    }

    public function sendEmailCode(User $user, string $purpose): void
    {
        $code = (string) random_int(100000, 999999);

        try {
            Mail::to($user->email)->send(new TwoFactorCodeMail($code, $purpose));
            Cache::put($this->cacheKey($user, $purpose), $code, now()->addMinutes(10));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('2FA OTP Mail Error: ' . $e->getMessage());
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => 'Unable to send verification email. Please check your email configuration.',
            ]);
        }
    }

    public function verifyEmailCode(User $user, string $purpose, string $code): bool
    {
        $cached = Cache::get($this->cacheKey($user, $purpose));

        if (! $cached || ! hash_equals((string) $cached, $code)) {
            return false;
        }

        Cache::forget($this->cacheKey($user, $purpose));

        return true;
    }

    public function ensureTotpSecret(User $user): string
    {
        if ($user->google2fa_secret) {
            return $user->google2fa_secret;
        }

        $secret = app('pragmarx.google2fa')->generateSecretKey();

        $user->forceFill(['google2fa_secret' => $secret])->save();

        return $secret;
    }

    public function totpQrSvg(User $user): string
    {
        $google2fa = app('pragmarx.google2fa');
        $secret = $this->ensureTotpSecret($user);

        return $google2fa->getQRCodeInline(
            config('app.name'),
            $user->email,
            $secret
        );
    }

    public function verifyTotpCode(User $user, string $code): bool
    {
        if (! $user->google2fa_secret) {
            return false;
        }

        return app('pragmarx.google2fa')->verifyKey($user->google2fa_secret, $code);
    }

    public function completeEnrollmentIfReady(User $user): bool
    {
        $user->refresh();

        if (! $user->email_2fa_enabled || ! $user->totp_2fa_enabled || ! $user->google2fa_secret) {
            return false;
        }

        if ($user->is_2fa_enrolled) {
            return true;
        }

        $user->forceFill(['is_2fa_enrolled' => true])->save();
        $this->markSessionVerified();

        return true;
    }

    /**
     * Clear all 2FA enrollment data for a user (re-enrollment required).
     */
    public function resetEnrollment(User $user, bool $clearSessionForCurrentUser = false): void
    {
        $user->forceFill([
            'is_2fa_enrolled' => false,
            'email_2fa_enabled' => false,
            'totp_2fa_enabled' => false,
            'google2fa_secret' => null,
        ])->save();

        Cache::forget($this->cacheKey($user, self::PURPOSE_ENROLLMENT_EMAIL));
        Cache::forget($this->cacheKey($user, self::PURPOSE_VERIFY_EMAIL));

        if ($clearSessionForCurrentUser && auth()->id() === $user->id) {
            $this->clearSessionVerified();
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function statusForUser(User $user): array
    {
        return [
            'is_2fa_enrolled' => (bool) $user->is_2fa_enrolled,
            'email_2fa_enabled' => (bool) $user->email_2fa_enabled,
            'totp_2fa_enabled' => (bool) $user->totp_2fa_enabled,
            'session_verified' => $this->isSessionVerified(),
        ];
    }

    protected function cacheKey(User $user, string $purpose): string
    {
        return "2fa:email:{$purpose}:{$user->id}";
    }
}
