<?php

namespace Tests\Feature;

use App\Http\Middleware\EnsureTwoFactorEnrolled;
use App\Http\Middleware\EnsureTwoFactorVerified;
use App\Models\AuditLog;
use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_login_creates_audit_log(): void
    {
        $user = User::factory()->create(['role' => 'resident']);

        event(new Login('web', $user, false));

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'Successful Login',
        ]);
    }

    public function test_lockout_actions_use_danger_severity(): void
    {
        $this->assertSame('danger', AuditLog::severityForAction('Login Lockout (1 minute lock applied)'));
        $this->assertSame('danger', AuditLog::severityForAction('Account Locked (excessive failed logins)'));
        $this->assertSame('warning', AuditLog::severityForAction('Failed Login (3 attempts remaining)'));
        $this->assertSame('success', AuditLog::severityForAction('Account Unlocked'));
    }

    public function test_audit_logger_records_lockout_event(): void
    {
        $user = User::factory()->create();

        AuditLogger::log($user->id, 'Login Lockout (1 minute lock applied)');

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'Login Lockout (1 minute lock applied)',
        ]);
    }

    public function test_failed_login_creates_audit_log_with_email(): void
    {
        event(new Failed('web', null, ['email' => 'attacker@example.com']));

        $log = AuditLog::first();
        $this->assertNotNull($log);
        $this->assertNull($log->user_id);
        $this->assertStringContainsString('Failed Login', $log->action);
        $this->assertStringContainsString('attacker@example.com', $log->action);
    }

    public function test_admin_can_view_audit_logs_page(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_2fa_enrolled' => true,
            'email_2fa_enabled' => true,
            'totp_2fa_enabled' => true,
        ]);

        AuditLog::create([
            'user_id' => $admin->id,
            'action' => 'Successful Login',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Test',
        ]);

        $this->withoutMiddleware([
            EnsureTwoFactorEnrolled::class,
            EnsureTwoFactorVerified::class,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.audit-logs'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('auth/audit-logs')
                ->has('auditLogs.data', 1));
    }

    public function test_non_admin_cannot_view_audit_logs(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
            'is_2fa_enrolled' => true,
            'email_2fa_enabled' => true,
            'totp_2fa_enabled' => true,
        ]);

        $this->withoutMiddleware([
            EnsureTwoFactorEnrolled::class,
            EnsureTwoFactorVerified::class,
        ]);

        $this->actingAs($staff)
            ->get(route('admin.audit-logs'))
            ->assertRedirect(route('staffdashboard'));
    }
}
