<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'ariannebartiquien@gmail.com'],
            [
                'firstName'   => 'Super',
                'middleName'  => null,
                'lastName'    => 'Admin',
                'name'        => 'Super Admin',
                'userName'    => 'admin',
                'password'    => Hash::make('password123'),
                'role'        => 'admin',
                'email_verified_at' => now(),
                'gender'      => 'Male',
                'civilStatus' => 'Single',
                'dateOfBirth' => '1990-01-01',
                'mobileNo'    => '09123456789',
                'street'      => 'Barangay Hall',
                'purok'       => '1',
                'barangay'    => 'Centro',
                'city'        => 'Davao City',
                'province'    => 'Davao del Sur',
                'postal'      => '8000',
            ],
        );
    }
}