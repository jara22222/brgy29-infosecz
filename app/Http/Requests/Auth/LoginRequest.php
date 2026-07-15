<?php

namespace App\Http\Requests\Auth;

use App\Rules\Recaptcha;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LoginRequest extends FormRequest
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
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
            'recaptcha_token' => ['required', 'string', new Recaptcha],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'recaptcha_token.required' => 'Security verification failed. Please refresh the page and try again.',
        ];
    }

    /**
     * Validate login credentials and reCAPTCHA from a Fortify request.
     *
     * @return array<string, mixed>
     */
    public static function validateFrom(Request $request): array
    {
        return Validator::make(
            $request->all(),
            (new static)->rules(),
            (new static)->messages(),
        )->validate();
    }
}
