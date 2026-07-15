<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestedCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'address',
        'purpose',
        'document_name',
        'status',
        'read_status',
        'read_at',
        'userstatus',
        'remarks',
        'approved_at',
        'completed_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    /**
     * Get the user that owns the requested certificate.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include pending certificates.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include approved certificates.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include completed certificates.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include unread certificates.
     */
    public function scopeUnread($query)
    {
        return $query->where('read_status', 'unread');
    }

    /**
     * Scope a query to only include read certificates.
     */
    public function scopeRead($query)
    {
        return $query->where('read_status', 'read');
    }

    /**
     * Check if the certificate is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if the certificate is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if the certificate is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the certificate is unread.
     */
    public function isUnread(): bool
    {
        return $this->read_status === 'unread';
    }

    /**
     * Check if the certificate is read.
     */
    public function isRead(): bool
    {
        return $this->read_status === 'read';
    }

    /**
     * Mark the certificate as read.
     */
    public function markAsRead(): bool
    {
        return $this->update([
            'read_status' => 'read',
            'read_at' => now(),
        ]);
    }

    /**
     * Mark the certificate as unread.
     */
    public function markAsUnread(): bool
    {
        return $this->update(['read_status' => 'unread']);
    }

    /**
     * Get notifications for the user based on their certificate status changes.
     */
    public static function getUserNotifications($userId)
    {
        return self::where('user_id', $userId)
            ->where('status', 'completed')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($certificate) {
                return [
                    'id' => $certificate->id,
                    'type' => 'certificate_completed',
                    'title' => 'Certificate Completed',
                    'message' => "Your {$certificate->document_name} certificate has been completed and is ready for pickup.",
                    'created_at' => $certificate->updated_at,
                    'read' => $certificate->read_status === 'read',
                    'read_at' => $certificate->read_at,
                    'certificate_id' => $certificate->id,
                ];
            });
    }
}