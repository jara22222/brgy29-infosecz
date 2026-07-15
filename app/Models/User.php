<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'firstName',
        'middleName',
        'lastName',
        'gender',
        'civilStatus',
        'dateOfBirth',
        'street',
        'purok',
        'barangay',
        'city',
        'province',
        'postal',
        'mobileNo',
        'userName',
        'email',
        'password',
        'role',
        'is_2fa_enrolled',
        'email_2fa_enabled',
        'totp_2fa_enabled',
        'google2fa_secret',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'google2fa_secret',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'dateOfBirth' => 'date',
            'password_changed_at' => 'datetime',
            'is_locked' => 'boolean',
            'is_2fa_enrolled' => 'boolean',
            'email_2fa_enabled' => 'boolean',
            'totp_2fa_enabled' => 'boolean',
        ];
    }

    /**
     * The model's default values for attributes.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'role' => 'resident',
    ];

    /**
     * Get the requested certificates for the user.
     */
    public function requestedCertificates(): HasOne
    {
        return $this->hasOne(RequestedCertificate::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    /**
     * Dashboard route for this user's role (legacy helper).
     */
    public function dashboardRoute(): string
    {
        return match ($this->role) {
            'admin' => route('adminaccountmanagement'),
            'staff' => route('staffdashboard'),
            default => route('residentdashboard'),
        };
    }

    /**
     * Destination after successful 2FA enrollment or verification.
     */
    public function postTwoFactorDashboardRoute(): string
    {
        return match ($this->role) {
            'admin' => route('adminaccountmanagement'),
            'staff' => route('staffdashboard'),
            default => route('residentdashboard'),
        };
    }
}
