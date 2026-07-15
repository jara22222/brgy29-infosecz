<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Support\TwoFactorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SecurityController extends Controller
{
    public function __construct(private TwoFactorService $twoFactor) {}

    public function show(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('settings/security', [
            'status' => $this->twoFactor->statusForUser($user),
            'role' => $user->role,
            'canRemove2fa' => $user->role === 'resident' && $user->is_2fa_enrolled,
        ]);
    }

    public function reset(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        if (! $user->is_2fa_enrolled) {
            return back()->with('error', 'Two-factor authentication is not enabled on your account.');
        }

        $this->twoFactor->resetEnrollment($user, clearSessionForCurrentUser: true);

        return redirect()
            ->route('two-factor.enrollment')
            ->with('success', 'Two-factor authentication has been removed. Please enroll again when you are ready.');
    }
}
