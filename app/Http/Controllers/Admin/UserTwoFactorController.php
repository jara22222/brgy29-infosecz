<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\TwoFactorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserTwoFactorController extends Controller
{
    public function __construct(private TwoFactorService $twoFactor) {}

    public function reset(Request $request, User $user): RedirectResponse
    {
        $admin = $request->user();

        if ($admin->role !== 'admin') {
            abort(403);
        }

        if ($user->role !== 'staff') {
            return back()->with('error', 'You can only reset two-factor authentication for staff accounts.');
        }

        if (! $user->is_2fa_enrolled) {
            return back()->with('error', 'This user has not completed two-factor enrollment.');
        }

        $clearSession = $admin->id === $user->id;
        $this->twoFactor->resetEnrollment($user, $clearSession);

        if ($clearSession) {
            return redirect()
                ->route('two-factor.enrollment')
                ->with('success', 'Your two-factor authentication has been reset. Please enroll again.');
        }

        return back()->with(
            'success',
            "Two-factor authentication has been reset for {$user->name}. They must enroll again on next login."
        );
    }
}
