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

class TwoFactorVerificationController extends Controller
{
    public function __construct(private TwoFactorService $twoFactor) {}

    protected function resolveUser(Request $request): User
    {
        return $request->user() ?? User::findOrFail($request->session()->get('login.id'));
    }

    public function show(Request $request): Response|RedirectResponse
    {
        $user = $this->resolveUser($request);

        if (! $user->is_2fa_enrolled) {
            return redirect()->route('two-factor.enrollment');
        }

        if ($this->twoFactor->isSessionVerified()) {
            return redirect()->to($user->postTwoFactorDashboardRoute());
        }

        return Inertia::render('auth/two-factor-verify', [
            'userEmail' => $user->email,
        ]);
    }

    public function sendEmailCode(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request);

        if (! $user->is_2fa_enrolled || ! $user->email_2fa_enabled) {
            return response()->json(['message' => 'Email 2FA is not available for this account.'], 422);
        }

        $this->twoFactor->sendEmailCode($user, TwoFactorService::PURPOSE_VERIFY_EMAIL);

        return response()->json(['message' => 'Verification code sent to your email.']);
    }

    public function verifyEmailCode(Request $request): JsonResponse
    {
        $request->validate(['code' => ['required', 'digits:6']]);

        $user = $this->resolveUser($request);

        if (! $this->twoFactor->verifyEmailCode($user, TwoFactorService::PURPOSE_VERIFY_EMAIL, $request->code)) {
            return response()->json(['message' => 'Invalid or expired verification code.'], 422);
        }

        Auth::login($user, $request->session()->get('login.remember', false));
        $this->twoFactor->markSessionVerified();
        $request->session()->forget(['login.id', 'login.remember']);

        return response()->json([
            'redirect' => $user->postTwoFactorDashboardRoute(),
        ]);
    }

    public function verifyTotpCode(Request $request): JsonResponse
    {
        $request->validate(['code' => ['required', 'digits:6']]);

        $user = $this->resolveUser($request);

        if (! $this->twoFactor->verifyTotpCode($user, $request->code)) {
            return response()->json(['message' => 'Invalid authenticator code. Please try again.'], 422);
        }

        Auth::login($user, $request->session()->get('login.remember', false));
        $this->twoFactor->markSessionVerified();
        $request->session()->forget(['login.id', 'login.remember']);

        return response()->json([
            'redirect' => $user->postTwoFactorDashboardRoute(),
        ]);
    }
}
