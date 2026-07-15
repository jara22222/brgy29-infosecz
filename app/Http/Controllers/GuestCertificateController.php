<?php

namespace App\Http\Controllers;

use App\Models\RequestedCertificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Rules\Recaptcha;

class GuestCertificateController extends Controller
{
    /**
     * Store a newly created guest certificate request.
     */
    public function store(Request $request)
    {
        // Log the incoming request data for debugging
        Log::info('Guest certificate request data:', $request->all());
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'purpose' => 'required|string|max:1000',
            'document_id' => 'required|integer',
            'document_name' => 'required|string|max:255',
            'recaptcha_token' => ['required', 'string', new Recaptcha],
        ], [
            'recaptcha_token.required' => 'Security verification failed. Please refresh the page and try again.',
        ]);

        // Log validated data
        Log::info('Validated data:', $validated);

        // Create guest certificate request with userstatus set to 'guest'
        $certificate = RequestedCertificate::create([
            'user_id' => null, // Guest users don't have user_id
            'name' => $validated['name'],
            'address' => $validated['address'],
            'purpose' => $validated['purpose'],
            'document_name' => $validated['document_name'],
            'status' => 'pending',
            'userstatus' => 'guest', // Set user status to guest
        ]);

        return redirect()->back()->with('success', 'Certificate request submitted successfully!');
    }
}
