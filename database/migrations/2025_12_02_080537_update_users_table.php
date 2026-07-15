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
        Schema::table('users', function (Blueprint $table) {
            $table->string('gender','255');
            $table->string('civilStatus','255');
            $table->date('dateOfBirth')->nullable();
            $table->string('street','255');
            $table->string('purok','255');
            $table->string('barangay','255');
            $table->string('city','255');
            $table->string('province','255');
            $table->string('postal','255');
            $table->string('mobileNo','255');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['gender',
            'civilStatus',
            'dateOfBirth',
            'street',
            'purok',
            'barangay',
        'city',
    'province','postal','mobileNo']);
        });
    }
};