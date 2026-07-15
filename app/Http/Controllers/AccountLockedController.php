<?php

namespace App\Http\Controllers;

use App\Mail\AccountUnlockOtpMail;
use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class AccountLockedController extends Controller
{
    public function show(Request $request)
    {
        if (!$request->session()->has('locked_email')) {
            return redirect()->route('login');
        }

        return view('auth.account-locked', [
            'email' => $request->session()->get('locked_email')
        ]);
    }

    public function sendOtp(Request $request)
    {
        $email = $request->session()->get('locked_email');
        
        if (!$email) {
            return redirect()->route('login');
        }

        $user = User::where('email', $email)->orWhere('userName', $email)->first();
        if (!$user) {
            return back()->withErrors(['email' => 'User not found.']);
        }

        $otp = rand(100000, 999999);

        try {
            Mail::to($user->email)->send(new AccountUnlockOtpMail($otp));
            Cache::put("locked_otp:{$email}", $otp, now()->addMinutes(15));
            AuditLogger::log($user->id, 'Unlock OTP Sent', $request);

            return back()->with('status', 'Unlock code sent to your email.');
        } catch (\Exception $e) {
            Log::error('OTP Mail Error: '.$e->getMessage());
            AuditLogger::log($user->id, 'Unlock OTP Failed (mail delivery error)', $request);

            return back()->withErrors(['email' => 'Unable to send recovery email. Please contact the administrator.']);
        }
    }

    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|digits:6',
        ]);

        $email = $request->session()->get('locked_email');
        if (!$email) {
            return redirect()->route('login');
        }

        $cachedOtp = Cache::get("locked_otp:{$email}");

        $user = User::where('email', $email)->orWhere('userName', $email)->first();

        if (! $cachedOtp || $cachedOtp != $request->code) {
            AuditLogger::log($user?->id, 'Failed Unlock Attempt (invalid or expired code)', $request);

            return back()->withErrors(['code' => 'Invalid or expired unlock code.']);
        }

        if ($user) {
            $user->update(['is_locked' => false]);
            AuditLogger::log($user->id, 'Account Unlocked', $request);
            
            // Clear rate limiting caches
            $throttleKey = \Illuminate\Support\Str::lower($email).'|'.$request->ip();
            Cache::forget("login:attempts:{$throttleKey}");
            Cache::forget("login:soft_lock:{$throttleKey}");
            Cache::forget("login:tier2_watch:{$throttleKey}");
        }

        Cache::forget("locked_otp:{$email}");
        $request->session()->forget('locked_email');

        return redirect()->route('login')->with('status', 'Account unlocked successfully. You may now log in.');
    }
}
