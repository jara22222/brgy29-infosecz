<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Recaptcha implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $secret = config('services.recaptcha.secret');

        if (empty($secret)) {
            if (app()->environment(['local', 'testing'])) {
                return;
            }

            Log::error('reCAPTCHA secret is not configured.');
            $fail('Security verification is temporarily unavailable. Please try again later.');

            return;
        }

        if (! is_string($value) || $value === '') {
            $fail('Security verification failed. Please refresh the page and try again.');

            return;
        }

        try {
            $response = Http::asForm()
                ->timeout(10)
                ->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret' => $secret,
                    'response' => $value,
                    'remoteip' => request()->ip(),
                ]);
        } catch (\Throwable $exception) {
            Log::error('reCAPTCHA verification request failed.', [
                'message' => $exception->getMessage(),
            ]);
            $fail('Security verification could not be completed. Please try again.');

            return;
        }

        if (! $response->successful()) {
            $fail('Security verification could not be completed. Please try again.');

            return;
        }

        $payload = $response->json();

        if (! ($payload['success'] ?? false)) {
            $fail('Security verification failed. Please try again.');

            return;
        }

        $score = (float) ($payload['score'] ?? 0);
        $minimumScore = (float) config('services.recaptcha.score', 0.5);

        if ($score < $minimumScore) {
            $fail('Security verification failed. Your request could not be verified as legitimate.');
        }
    }
}
