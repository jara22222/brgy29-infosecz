<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\StoreRegisteredUserRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function checkEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);

        $email = Str::lower($validated['email']);

        $available = ! User::query()->where('email', $email)->exists();

        return response()->json([
            'available' => $available,
            'message' => $available
                ? null
                : 'This email address is already registered.',
        ]);
    }

    public function store(StoreRegisteredUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'] ?? trim($validated['firstName'].' '.$validated['lastName']),
            'firstName' => $validated['firstName'],
            'middleName' => $validated['middleName'] ?? null,
            'lastName' => $validated['lastName'],
            'gender' => $validated['gender'] ?? null,
            'civilStatus' => $validated['civilStatus'],
            'dateOfBirth' => $validated['dateOfBirth'],
            'street' => $validated['street'],
            'purok' => $validated['purok'],
            'barangay' => $validated['barangay'],
            'city' => $validated['city'],
            'province' => $validated['province'],
            'postal' => $validated['postal'],
            'mobileNo' => $validated['mobileNo'],
            'userName' => $validated['userName'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => 'resident',
        ]);

        try {
            event(new Registered($user));
        } catch (\Exception $e) {
            Log::error('Failed to send registration email: '.$e->getMessage());
        }

        $request->session()->put([
            'login.id' => $user->getKey(),
            'login.remember' => false,
        ]);

        return redirect()->route('two-factor.enrollment');
    }
}
