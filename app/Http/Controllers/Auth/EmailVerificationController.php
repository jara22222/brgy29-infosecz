<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\EmailVerificationOtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;

class EmailVerificationController extends Controller
{
    /**
     * Send verification code to user email.
     */
    public function sendCode(Request $request)
    {
        $user = Auth::user();
        $otp = (string) random_int(100000, 999999);

        try {
            Mail::to($user->email)->send(new EmailVerificationOtpMail($otp));
            
            Session::put('email_verification_otp', [
                'code' => $otp,
                'expires_at' => now()->addMinutes(15),
            ]);

            return back()->with('status', 'code-sent');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Email Verification OTP Mail Error: ' . $e->getMessage());
            return back()->withErrors(['email' => 'Unable to send verification email. Please check your email configuration.']);
        }
    }

    /**
     * Verify the code and mark email as verified.
     */
    public function verifyCode(Request $request)
    {
        $request->validate([
            'code' => 'required|digits:6',
        ]);

        $sessionOtp = Session::get('email_verification_otp');

        if (! $sessionOtp || $sessionOtp['code'] != $request->code || now()->isAfter($sessionOtp['expires_at'])) {
            return back()->withErrors(['code' => 'The verification code is invalid or has expired.']);
        }

        $user = Auth::user();
        $user->markEmailAsVerified();

        Session::forget('email_verification_otp');

        return redirect()->to($user->dashboardRoute());
    }
}
