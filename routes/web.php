<?php

use App\Http\Controllers\AccountLockedController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\UserTwoFactorController;
use App\Http\Controllers\adminController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\TwoFactorEnrollmentController;
use App\Http\Controllers\Auth\TwoFactorVerificationController;
use App\Http\Controllers\documentLibraryController;
use App\Http\Controllers\GuestCertificateController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\RequestedCertificateController;
use App\Http\Controllers\ResidentDashboardController;
use App\Http\Controllers\StaffDashboardController;
use App\Http\Controllers\TodolistController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\EnsureTokenIsValid;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsurePreAuthenticated;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('guest-form', function () {
    return Inertia::render('guestForm');
})->name('guest.form');

Route::post('guest-certificate-request', [GuestCertificateController::class, 'store'])->name('guest.certificate.request');

Route::get('auth/redirect', function () {
    $user = auth()->user();

    return redirect(app(\App\Support\TwoFactorService::class)->enrollmentDestination($user));
})->middleware('auth')->name('auth.redirect');

// Two-Factor Authentication (enrollment & login verification)
Route::middleware([EnsurePreAuthenticated::class, '2fa.guest'])->group(function () {
    Route::get('2fa-enrollment', [TwoFactorEnrollmentController::class, 'show'])->name('two-factor.enrollment');
    Route::post('2fa-enrollment/email/send', [TwoFactorEnrollmentController::class, 'sendEmailCode'])->name('two-factor.enrollment.email.send');
    Route::post('2fa-enrollment/email/verify', [TwoFactorEnrollmentController::class, 'verifyEmailCode'])->name('two-factor.enrollment.email.verify');
    Route::post('2fa-enrollment/totp/setup', [TwoFactorEnrollmentController::class, 'setupTotp'])->name('two-factor.enrollment.totp.setup');
    Route::post('2fa-enrollment/totp/verify', [TwoFactorEnrollmentController::class, 'verifyTotpCode'])->name('two-factor.enrollment.totp.verify');

    Route::get('2fa-verify', [TwoFactorVerificationController::class, 'show'])->name('two-factor.verify');
    Route::post('2fa-verify/email/send', [TwoFactorVerificationController::class, 'sendEmailCode'])->name('two-factor.verify.email.send');
    Route::post('2fa-verify/email/verify', [TwoFactorVerificationController::class, 'verifyEmailCode'])->name('two-factor.verify.email.verify');
    Route::post('2fa-verify/totp/verify', [TwoFactorVerificationController::class, 'verifyTotpCode'])->name('two-factor.verify.totp.verify');
});

// staff
Route::middleware(['auth', '2fa.enrolled', '2fa.verified', 'role:staff'])->group(function () {
    Route::get('staffdashboard', [StaffDashboardController::class, 'index'])->name('staffdashboard');
    Route::post('staff/verify-certificate', [StaffDashboardController::class, 'verifyCertificate'])->name('staff.verify.certificate');
});

// admin
Route::middleware(['auth', '2fa.enrolled', '2fa.verified', 'role:admin'])->group(function () {
    Route::get('admin/accountmanagement', [adminController::class, 'index'])->name('adminaccountmanagement');

    Route::get('admin/document', [documentLibraryController::class, 'index'])->name('admindocument');
    Route::get('admin/audit-logs', [AuditLogController::class, 'index'])
        ->middleware('admin')
        ->name('admin.audit-logs');

    Route::resource('documents', documentLibraryController::class);

    Route::resource('admin', adminController::class);

    Route::post('admin/users/{user}/two-factor/reset', [UserTwoFactorController::class, 'reset'])
        ->name('admin.users.two-factor.reset');
});

// resident
Route::middleware(['auth', '2fa.enrolled', '2fa.verified', 'role:resident'])->group(function () {
    Route::get('resident-dashboard', [ResidentDashboardController::class, 'index'])->name('residentdashboard');
    Route::get('resident-dashboard/request-history', [ResidentDashboardController::class, 'requestHistory'])->name('resident.request-history');

    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'url_params' => request()->query(),
        ]);
    })->name('dashboard');

    Route::resource('greetings', UserController::class)
        ->middleware('throttle:greetings-limit')->missing(function (Request $req) {
            return Inertia::route('greetings.index');
        });

    Route::get('userz', function () {
        return Inertia::render('user', ['name' => 'Negro de papa']);
    });

    Route::get('todolist', [TodolistController::class, 'index'])->name('todolist');
    Route::post('todolist', [TodolistController::class, 'store'])->name('todolist.store');
    Route::delete('todolist/{id}', [TodolistController::class, 'destroy'])->name('todolist.destroy');
    Route::patch('todolist/{id}', [TodolistController::class, 'update'])->name('todolist.update');

    Route::fallback(function () {
        return 'This is a fall back http!';
    })->middleware('throttle:pagenotfound-limit');

    Route::get('isvalid', function () {
        return 'valid token';
    })->middleware(EnsureTokenIsValid::class);

    Route::get('test', function () {
        return redirect()->away('https://facebook.com');
    });

    Route::resource('requested-certificates', RequestedCertificateController::class);

    Route::get('notifications', [RequestedCertificateController::class, 'getNotifications'])->name('notifications.index');
    Route::post('notifications/{certificateId}/read', [RequestedCertificateController::class, 'markNotificationAsRead'])->name('notifications.read');
});

// Account lockout recovery (separate from 2FA)
Route::middleware('web')->group(function () {
    Route::get('auth/account-locked', [AccountLockedController::class, 'show'])->name('account.locked');
    Route::post('auth/account-locked/send-otp', [AccountLockedController::class, 'sendOtp'])->name('account.locked.send-otp');
    Route::post('auth/account-locked/verify', [AccountLockedController::class, 'verify'])->name('account.locked.verify');
});

Route::middleware('auth')->group(function () {
    Route::post('email/verification-code', [EmailVerificationController::class, 'sendCode'])->name('verification.send-code');
    Route::post('email/verify-code', [EmailVerificationController::class, 'verifyCode'])->name('verification.verify-code');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
