<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('mfa_otp_codes');
        Schema::dropIfExists('trusted_devices');

        Schema::table('users', function (Blueprint $table) {
            $columns = [
                'two_factor_secret',
                'two_factor_recovery_codes',
                'two_factor_confirmed_at',
                'mfa_enabled',
                'mfa_token',
                'mfa_token_expires_at',
                'mfa_remember_token',
                'mfa_remember_expires_at',
                'email_mfa_verified',
                'app_mfa_verified',
                'google2fa_secret',
                'mfa_type',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }

    public function down(): void
    {
        // Intentionally empty — 2FA will be rebuilt from scratch.
    }
};
