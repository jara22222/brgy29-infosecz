<?php

namespace App\Http\Controllers;

use App\Models\RequestedCertificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ResidentDashboardController extends Controller
{

   
    public function requestHistory()
    {
        $user = Auth::user();
        
        // Get all certificates for the resident using the RequestedCertificate model with pagination
        $certificates = RequestedCertificate::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(5);
        
        return Inertia::render('residents/RequestHistory', [
            'certificates' => $certificates
        ]);
    }

    /**
     * Display the resident dashboard.
     */
    public function index()
    {
        $user = Auth::user();
        
        $documents = \App\Models\Document::all()->map(function ($document) {
            return [
                'id' => $document->id,
                'documentName' => $document->documentName,
                'documentType' => $document->documentType,
                'documentPurpose' => $document->documentPurpose,
                'commonUse' => $document->commonUse,
                'physicalRequirements' => $document->physicalRequirements,
                'status' => $document->status,
                'created_at' => $document->created_at->format('Y-m-d'),
            ];
        });
        
        // Get user's certificate requests with pagination
        $certificates = RequestedCertificate::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(5);
        
        // Get completed certificates for request history with pagination
        $completedCertificates = RequestedCertificate::where('user_id', $user->id)
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->paginate(5);
        
        return Inertia::render('settings/residentDashboard', [
            'documents' => $documents,
            'certificates' => $certificates,
            'completedCertificates' => $completedCertificates
        ]);
    }
}