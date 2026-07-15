<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
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
        
        return Inertia::render('welcome', [
            'documents' => $documents
        ]);
    }
}
