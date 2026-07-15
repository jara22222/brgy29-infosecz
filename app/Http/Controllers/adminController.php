<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\StoreStaffUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $residents = User::where('role', 'staff')
            ->select('id', 'name', 'email', 'role', 'is_2fa_enrolled', 'email_2fa_enabled', 'totp_2fa_enabled', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('auth/admindashboard', [
            'residents' => $residents
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
    public function store(StoreStaffUserRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();

            User::create([
                'name' => $validated['name'],
                'firstName' => $validated['firstName'],
                'middleName' => $validated['middleName'] ?? null,
                'lastName' => $validated['lastName'],
                'gender' => $validated['gender'] ?? null,
                'civilStatus' => $validated['civilStatus'],
                'dateOfBirth' => $validated['dateOfBirth'] ?? null,
                'street' => $validated['street'] ?? null,
                'purok' => $validated['purok'] ?? null,
                'barangay' => $validated['barangay'] ?? null,
                'city' => $validated['city'] ?? null,
                'province' => $validated['province'] ?? null,
                'postal' => $validated['postal'] ?? null,
                'email' => $validated['email'],
                'mobileNo' => $validated['mobileNo'] ?? null,
                'userName' => $validated['userName'],
                'password' => $validated['password'],
                'role' => 'staff',
            ]);

            return redirect()->route('adminaccountmanagement')->with('success', 'Staff account created successfully');
        } catch (\Exception $e) {
            Log::error('AdminController@store error: '.$e->getMessage());

            return redirect()->back()
                ->withInput()
                ->with('error', 'An error occurred while creating the staff account. Please try again later.');
        }
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}