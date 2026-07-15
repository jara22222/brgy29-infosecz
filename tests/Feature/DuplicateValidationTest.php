<?php

namespace Tests\Feature;

use App\Http\Middleware\EnsureTwoFactorEnrolled;
use App\Http\Middleware\EnsureTwoFactorVerified;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DuplicateValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_check_email_endpoint_detects_duplicates(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $this->getJson(route('register.check-email', ['email' => 'taken@example.com']))
            ->assertOk()
            ->assertJson([
                'available' => false,
                'message' => 'This email address is already registered.',
            ]);

        $this->getJson(route('register.check-email', ['email' => 'free@example.com']))
            ->assertOk()
            ->assertJson([
                'available' => true,
                'message' => null,
            ]);
    }

    public function test_registration_rejects_duplicate_email_with_custom_message(): void
    {
        User::factory()->create(['email' => 'existing@example.com']);

        $response = $this->post(route('register.store'), $this->registrationPayload([
            'email' => 'existing@example.com',
        ]));

        $response->assertSessionHasErrors([
            'email' => 'This email address is already registered.',
        ]);
    }

    public function test_admin_staff_store_rejects_duplicate_email(): void
    {
        $this->withoutMiddleware([
            EnsureTwoFactorEnrolled::class,
            EnsureTwoFactorVerified::class,
        ]);

        $admin = User::factory()->create([
            'role' => 'admin',
            'is_2fa_enrolled' => true,
            'email_2fa_enabled' => true,
            'totp_2fa_enabled' => true,
        ]);
        User::factory()->create([
            'email' => 'staff@example.com',
            'name' => 'Jane Staff',
            'role' => 'staff',
        ]);

        $response = $this->actingAs($admin)
            ->withSession(['two_factor_verified' => true])
            ->post('/admin', $this->staffPayload([
                'email' => 'staff@example.com',
            ]));

        $response->assertSessionHasErrors([
            'email' => 'This email is already assigned to another account.',
        ]);
    }

    public function test_admin_staff_store_rejects_duplicate_name(): void
    {
        $this->withoutMiddleware([
            EnsureTwoFactorEnrolled::class,
            EnsureTwoFactorVerified::class,
        ]);

        $admin = User::factory()->create([
            'role' => 'admin',
            'is_2fa_enrolled' => true,
            'email_2fa_enabled' => true,
            'totp_2fa_enabled' => true,
        ]);
        User::factory()->create([
            'name' => 'John Smith',
            'email' => 'john@example.com',
            'role' => 'staff',
        ]);

        $response = $this->actingAs($admin)
            ->withSession(['two_factor_verified' => true])
            ->post('/admin', $this->staffPayload([
                'firstName' => 'John',
                'lastName' => 'Smith',
                'email' => 'newemail@example.com',
                'userName' => 'john.smith2',
            ]));

        $response->assertSessionHasErrors([
            'name' => 'A staff member with this name already exists.',
        ]);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function registrationPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Test Resident',
            'firstName' => 'Test',
            'middleName' => '',
            'lastName' => 'Resident',
            'gender' => 'Male',
            'civilStatus' => 'Single',
            'dateOfBirth' => '2000-01-01',
            'street' => '123 Main St',
            'purok' => '1',
            'barangay' => '29-C',
            'city' => 'Davao City',
            'province' => 'Davao del Sur',
            'postal' => '8000',
            'mobileNo' => '+639171234567',
            'email' => 'newuser@example.com',
            'userName' => 'newuser123',
            'password' => 'SecurePass!123',
            'password_confirmation' => 'SecurePass!123',
        ], $overrides);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function staffPayload(array $overrides = []): array
    {
        return array_merge([
            'firstName' => 'Olivia',
            'middleName' => '',
            'lastName' => 'Rhye',
            'gender' => 'Female',
            'civilStatus' => 'Single',
            'dateOfBirth' => '1995-06-15',
            'street' => '456 Staff Ave',
            'purok' => '2',
            'barangay' => '29-C',
            'city' => 'Davao City',
            'province' => 'Davao del Sur',
            'postal' => '8000',
            'email' => 'olivia@example.com',
            'mobileNo' => '+639181234567',
            'userName' => 'olivia.rhye',
            'password' => 'StaffPass!12345',
            'password_confirmation' => 'StaffPass!12345',
        ], $overrides);
    }
}
