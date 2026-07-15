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
            if (!Schema::hasColumn('users', 'firstName')) {
                $table->string('firstName')->nullable();
            }
            if (!Schema::hasColumn('users', 'middleName')) {
                $table->string('middleName')->nullable();
            }
            if (!Schema::hasColumn('users', 'lastName')) {
                $table->string('lastName')->nullable();
            }
            if (!Schema::hasColumn('users', 'gender')) {
                $table->string('gender')->nullable();
            }
            if (!Schema::hasColumn('users', 'civilStatus')) {
                $table->string('civilStatus')->nullable();
            }
            if (!Schema::hasColumn('users', 'dateOfBirth')) {
                $table->date('dateOfBirth')->nullable();
            }
            if (!Schema::hasColumn('users', 'street')) {
                $table->string('street')->nullable();
            }
            if (!Schema::hasColumn('users', 'purok')) {
                $table->string('purok')->nullable();
            }
            if (!Schema::hasColumn('users', 'barangay')) {
                $table->string('barangay')->nullable();
            }
            if (!Schema::hasColumn('users', 'city')) {
                $table->string('city')->nullable();
            }
            if (!Schema::hasColumn('users', 'province')) {
                $table->string('province')->nullable();
            }
            if (!Schema::hasColumn('users', 'postal')) {
                $table->string('postal')->nullable();
            }
            if (!Schema::hasColumn('users', 'mobileNo')) {
                $table->string('mobileNo')->nullable();
            }
            if (!Schema::hasColumn('users', 'userName')) {
                $table->string('userName')->unique()->nullable();
            }
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('resident');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
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
                'role',
            ]);
        });
    }
};
