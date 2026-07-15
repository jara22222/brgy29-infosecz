<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'is_2fa_enrolled')) {
                $table->boolean('is_2fa_enrolled')->default(false)->after('password');
            }
            if (! Schema::hasColumn('users', 'email_2fa_enabled')) {
                $table->boolean('email_2fa_enabled')->default(false)->after('is_2fa_enrolled');
            }
            if (! Schema::hasColumn('users', 'totp_2fa_enabled')) {
                $table->boolean('totp_2fa_enabled')->default(false)->after('email_2fa_enabled');
            }
            if (! Schema::hasColumn('users', 'google2fa_secret')) {
                $table->text('google2fa_secret')->nullable()->after('totp_2fa_enabled');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            foreach (['google2fa_secret', 'totp_2fa_enabled', 'email_2fa_enabled', 'is_2fa_enrolled'] as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
