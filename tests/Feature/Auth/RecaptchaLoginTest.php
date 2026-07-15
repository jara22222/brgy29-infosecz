<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class RecaptchaLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_rejects_missing_recaptcha_token(): void
    {
        config([
            'services.recaptcha.secret' => 'test-secret',
            'services.recaptcha.score' => 0.5,
        ]);

        $user = User::factory()->create();

        $response = $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertSessionHasErrors('recaptcha_token');
        $this->assertGuest();
    }

    public function test_login_accepts_valid_recaptcha_token(): void
    {
        config([
            'services.recaptcha.secret' => 'test-secret',
            'services.recaptcha.score' => 0.5,
        ]);

        Http::fake([
            'www.google.com/recaptcha/api/siteverify' => Http::response([
                'success' => true,
                'score' => 0.9,
                'action' => 'login',
            ], 200),
        ]);

        $user = User::factory()->create();

        $response = $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
            'recaptcha_token' => 'valid-token',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('auth.redirect'));
    }

    public function test_login_rejects_low_recaptcha_score(): void
    {
        config([
            'services.recaptcha.secret' => 'test-secret',
            'services.recaptcha.score' => 0.5,
        ]);

        Http::fake([
            'www.google.com/recaptcha/api/siteverify' => Http::response([
                'success' => true,
                'score' => 0.1,
                'action' => 'login',
            ], 200),
        ]);

        $user = User::factory()->create();

        $response = $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
            'recaptcha_token' => 'bot-token',
        ]);

        $response->assertSessionHasErrors('recaptcha_token');
        $this->assertGuest();
    }
}
