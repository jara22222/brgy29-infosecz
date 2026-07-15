<?php

namespace App\Http\Requests\Admin;

use App\Rules\ContextSpecificPassword;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreStaffUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    protected function prepareForValidation(): void
    {
        $parts = array_filter([
            $this->input('firstName'),
            $this->input('middleName'),
            $this->input('lastName'),
        ], fn ($part) => filled($part));

        $this->merge([
            'name' => trim(implode(' ', $parts)),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('users', 'name')],
            'firstName' => ['required', 'string', 'max:255'],
            'middleName' => ['nullable', 'string', 'max:255'],
            'lastName' => ['required', 'string', 'max:255'],
            'gender' => ['nullable', 'in:Male,Female'],
            'civilStatus' => ['required', 'in:Single,Married,Divorced,Widowed'],
            'dateOfBirth' => ['nullable', 'date'],
            'street' => ['nullable', 'string', 'max:255'],
            'purok' => ['nullable', 'string', 'max:255'],
            'barangay' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:255'],
            'postal' => ['nullable', 'string', 'max:20'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email'),
            ],
            'mobileNo' => ['nullable', 'string', 'max:20'],
            'userName' => ['required', 'string', 'max:255', Rule::unique('users', 'userName')],
            'password' => [
                'required',
                'string',
                Password::defaults(),
                'confirmed',
                new ContextSpecificPassword,
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.unique' => 'A staff member with this name already exists.',
            'email.unique' => 'This email is already assigned to another account.',
        ];
    }
}
