<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('requested_certificates', function (Blueprint $table) {
            $table->enum('userstatus', ['registered', 'guest'])->default('guest')->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requested_certificates', function (Blueprint $table) {
            $table->dropColumn('userstatus');
        });
    }
};
