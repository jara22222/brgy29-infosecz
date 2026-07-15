<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class DocumentLibraryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $documents = Document::all()->map(function ($document) {
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
        
        return Inertia::render('auth/documentPage', [
            'documents' => $documents
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'documentName' => 'required|string|max:255',
            'documentType' => 'required|in:certificate,clearance,special',
            'documentPurpose' => 'required|string',
            'commonUse' => 'required|string',
            'physicalRequirements' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $document = Document::create([
            'documentName' => $request->documentName,
            'documentType' => $request->documentType,
            'documentPurpose' => $request->documentPurpose,
            'commonUse' => $request->commonUse,
            'physicalRequirements' => $request->physicalRequirements,
            'status' => 'active', // Default status
        ]);

        return redirect()->route('documents.index')
            ->with('success', 'Document created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $document = Document::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $document->status = $request->status;
        $document->save();

        return redirect()->route('admindocument')
            ->with('success', 'Document status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}