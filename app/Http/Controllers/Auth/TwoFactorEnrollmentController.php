<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Support\TwoFactorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class TwoFactorEnrollmentController extends Controller
{
    public function __construct(private TwoFactorService $twoFactor) {}

    protected function resolveUser(Request $request): User
    {
        return $request->user() ?? User::findOrFail($request->session()->get('login.id'));
    }

    public function show(Request $request): Response|RedirectResponse
    {
        $user = $this->resolveUser($request);

        if ($user->is_2fa_enrolled) {
            return redirect()->to($this->twoFactor->enrollmentDestination($user));
        }

        return Inertia::render('auth/two-factor-enrollment', [
            'emailEnabled' => (bool) $user->email_2fa_enabled,
            'totpEnabled' => (bool) $user->totp_2fa_enabled,
            'userEmail' => $user->email,
        ]);
    }

    public function sendEmailCode(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request);

        if ($user->is_2fa_enrolled || $user->email_2fa_enabled) {
            return response()->json(['message' => 'Email 2FA is already enabled.'], 422);
        }

        $this->twoFactor->sendEmailCode($user, TwoFactorService::PURPOSE_ENROLLMENT_EMAIL);

        return response()->json(['message' => 'Verification code sent to your email.']);
    }

    public function verifyEmailCode(Request $request): JsonResponse|RedirectResponse
    {
        $request->validate(['code' => ['required', 'digits:6']]);

        $user = $this->resolveUser($request);

        if (! $this->twoFactor->verifyEmailCode($user, TwoFactorService::PURPOSE_ENROLLMENT_EMAIL, $request->code)) {
            return response()->json(['message' => 'Invalid or expired verification code.'], 422);
        }

        $user->forceFill(['email_2fa_enabled' => true])->save();

        if ($this->twoFactor->completeEnrollmentIfReady($user)) {
            Auth::login($user, $request->session()->get('login.remember', false));
            $request->session()->forget(['login.id', 'login.remember']);

            return response()->json([
                'completed' => true,
                'redirect' => $user->fresh()->postTwoFactorDashboardRoute(),
            ]);
        }

        return response()->json([
            'completed' => false,
            'emailEnabled' => true,
            'totpEnabled' => (bool) $user->fresh()->totp_2fa_enabled,
        ]);
    }

    public function setupTotp(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request);

        if ($user->is_2fa_enrolled) {
            return response()->json(['message' => '2FA is already fully enrolled.'], 422);
        }

        $secret = $this->twoFactor->ensureTotpSecret($user);
        $qrCodeSvg = $this->twoFactor->totpQrSvg($user->fresh());

        return response()->json([
            'qrCodeSvg' => $qrCodeSvg,
            'manualKey' => $secret,
        ]);
    }

    public function verifyTotpCode(Request $request): JsonResponse
    {
        $request->validate(['code' => ['required', 'digits:6']]);

        $user = $this->resolveUser($request);

        if (! $this->twoFactor->verifyTotpCode($user, $request->code)) {
            return response()->json(['message' => 'Invalid authenticator code. Please try again.'], 422);
        }

        $user->forceFill(['totp_2fa_enabled' => true])->save();

        if ($this->twoFactor->completeEnrollmentIfReady($user)) {
            Auth::login($user, $request->session()->get('login.remember', false));
            $request->session()->forget(['login.id', 'login.remember']);

            return response()->json([
                'completed' => true,
                'redirect' => $user->fresh()->postTwoFactorDashboardRoute(),
            ]);
        }

        return response()->json([
            'completed' => false,
            'emailEnabled' => (bool) $user->fresh()->email_2fa_enabled,
            'totpEnabled' => true,
        ]);
    }
}
