<?php

namespace App\Http\Requests\Auth;

use App\Rules\ContextSpecificPassword;
use App\Rules\Recaptcha;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreRegisteredUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'firstName' => ['required', 'string', 'max:255'],
            'middleName' => ['nullable', 'string', 'max:255'],
            'lastName' => ['required', 'string', 'max:255'],
            'gender' => ['nullable', 'in:Male,Female'],
            'civilStatus' => ['required', 'string', 'max:255'],
            'dateOfBirth' => ['required', 'date'],
            'street' => ['required', 'string', 'max:255'],
            'purok' => ['required', 'string', 'max:255'],
            'barangay' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'province' => ['required', 'string', 'max:255'],
            'postal' => ['required', 'string', 'max:255'],
            'mobileNo' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique('users', 'email'),
            ],
            'userName' => ['required', 'string', 'max:255', Rule::unique('users', 'userName')],
            'password' => ['required', 'confirmed', Password::defaults(), new ContextSpecificPassword],
            'recaptcha_token' => ['required', 'string', new Recaptcha],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'This email address is already registered.',
            'gender.in' => 'Please select a valid gender (Male or Female).',
            'recaptcha_token.required' => 'Security verification failed. Please refresh the page and try again.',
        ];
    }
}
