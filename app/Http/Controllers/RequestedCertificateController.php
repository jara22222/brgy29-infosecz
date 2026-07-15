<?php

namespace App\Http\Controllers;

use App\Models\RequestedCertificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RequestedCertificateController extends Controller
{
    /**
     * Display a listing of the requested certificates.
     */
    public function index()
    {
        $user = Auth::user();
        
        // If user is resident, show only their certificates
        if ($user->role === 'resident') {
            $certificates = RequestedCertificate::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            // If admin/staff, show all certificates
            $certificates = RequestedCertificate::with('user')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('RequestedCertificates/Index', [
            'certificates' => $certificates
        ]);
    }

    /**
     * Store a newly created requested certificate in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'purpose' => 'required|string|max:1000',
            'document_name' => 'required|string|max:255',
        ]);

        try {
            $certificate = RequestedCertificate::create([
                'user_id' => Auth::id(),
                'name' => $validated['name'],
                'address' => $validated['address'],
                'purpose' => $validated['purpose'],
                'document_name' => $validated['document_name'] ?? null,
                'status' => 'pending',
                'userstatus' => 'registered', // Set user status to registered for authenticated users
            ]);

            return redirect()->back()
                ->with('success', 'Certificate request submitted successfully!');
                
        } catch (\Exception $e) {
            Log::error('RequestedCertificateController@store error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to submit certificate request. Please try again.');
        }
    }

    /**
     * Display the specified requested certificate.
     */
    public function show(RequestedCertificate $requestedCertificate)
    {
        $user = Auth::user();
        
        // Check if user can view this certificate
        if ($user->role === 'resident' && $requestedCertificate->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('residents/RequestHistory', [
            'certificate' => $requestedCertificate->load('user')
        ]);
    }

    /**
     * Update the specified requested certificate in storage.
     */
    public function update(Request $request, RequestedCertificate $requestedCertificate)
    {
        // Only admin/staff can update certificate status
        if (!in_array(Auth::user()->role, ['admin', 'staff'])) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected,completed',
            'remarks' => 'nullable|string|max:500',
        ]);

        $oldStatus = $requestedCertificate->status;
        $requestedCertificate->update([
            'status' => $validated['status'],
            'remarks' => $validated['remarks'],
            'approved_at' => $validated['status'] === 'approved' ? now() : $requestedCertificate->approved_at,
            'completed_at' => $validated['status'] === 'completed' ? now() : $requestedCertificate->completed_at,
        ]);

        // If status changed to completed, mark as unread for notification
        if ($oldStatus !== 'completed' && $validated['status'] === 'completed') {
            $requestedCertificate->update(['read_status' => 'unread']);
        }

        return redirect()->back()
            ->with('success', 'Certificate status updated successfully!');
    }

    /**
     * Get user notifications for the sidebar.
     */
    public function getNotifications()
    {
        $user = Auth::user();
        $notifications = RequestedCertificate::getUserNotifications($user->id);
        
        return response()->json(['notifications' => $notifications]);
    }

    /**
     * Mark notification as read.
     */
    public function markNotificationAsRead($certificateId)
    {
        $user = Auth::user();
        $certificate = RequestedCertificate::where('id', $certificateId)
            ->where('user_id', $user->id)
            ->firstOrFail();
            
        $certificate->markAsRead();
        
        return redirect()->back()
            ->with('success', 'Notification marked as read');
    }

    /**
     * Remove the specified requested certificate from storage.
     */
    public function destroy(RequestedCertificate $requestedCertificate)
    {
        $user = Auth::user();
        
        // Check if user can delete this certificate
        if ($user->role === 'resident' && $requestedCertificate->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // Only allow deletion of pending certificates
        if ($requestedCertificate->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Cannot delete certificate that is already processed.');
        }

        $requestedCertificate->delete();

        return redirect()->route('requested-certificates.index')
            ->with('success', 'Certificate request deleted successfully!');
    }
}