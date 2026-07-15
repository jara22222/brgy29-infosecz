<?php

namespace App\Http\Controllers;

use App\Models\RequestedCertificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StaffDashboardController extends Controller
{
    /**
     * Display the staff dashboard with all certificate requests.
     */
    public function index()
    {
        // Get all certificate requests for staff to manage (not filtered by user_id)
        $certificates = RequestedCertificate::with(['user'])
            ->orderBy('created_at', 'desc')
            ->paginate(5);
        
        return Inertia::render('auth/staffdashboard', [
            'certificates' => $certificates
        ]);
    }

    /**
     * Verify a certificate request and update its status to completed.
     */
    public function verifyCertificate(Request $request)
    {
        $request->validate([
            'certificateId' => 'required|exists:requested_certificates,id'
        ]);

        $certificate = RequestedCertificate::find($request->certificateId);
        
        if ($certificate) {
            $certificate->status = 'completed';
            $certificate->completed_at = now();
            $certificate->save();
        }

        return redirect()->route('staffdashboard')->with('success', 'Certificate verified successfully');
    }
}
