<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('mfa_enabled')->default(false)->after('remember_token');
            $table->string('mfa_token', 100)->nullable()->after('mfa_enabled');
            $table->timestamp('mfa_token_expires_at')->nullable()->after('mfa_token');
            $table->string('mfa_remember_token', 100)->nullable()->after('mfa_token_expires_at');
            $table->timestamp('mfa_remember_expires_at')->nullable()->after('mfa_remember_token');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'mfa_enabled',
                'mfa_token',
                'mfa_token_expires_at',
                'mfa_remember_token',
                'mfa_remember_expires_at',
            ]);
        });
    }
};
