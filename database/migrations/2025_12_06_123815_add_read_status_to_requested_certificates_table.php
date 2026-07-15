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
            $table->enum('read_status', ['unread', 'read'])->default('unread')->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requested_certificates', function (Blueprint $table) {
            $table->dropColumn('read_status');
        });
    }
};
