<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $auditLogs = AuditLog::query()
            ->with('user:id,name,email')
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        $auditLogs->getCollection()->transform(function (AuditLog $log) {
            return [
                'id' => $log->id,
                'user_id' => $log->user_id,
                'user_name' => $log->user?->name,
                'user_email' => $log->user?->email,
                'action' => $log->action,
                'ip_address' => $log->ip_address,
                'action_severity' => AuditLog::severityForAction($log->action),
                'is_failed_login' => $log->isFailedLogin(),
                'created_at' => $log->created_at?->toIso8601String(),
            ];
        });

        return Inertia::render('auth/audit-logs', [
            'auditLogs' => $auditLogs,
        ]);
    }
}
