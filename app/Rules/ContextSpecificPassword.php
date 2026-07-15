<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ContextSpecificPassword implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $password = strtolower($value);
        
        $firstName = strtolower(request()->input('firstName') ?? auth()->user()?->firstName ?? '');
        $lastName = strtolower(request()->input('lastName') ?? auth()->user()?->lastName ?? '');
        $email = strtolower(request()->input('email') ?? auth()->user()?->email ?? '');
        $userName = strtolower(request()->input('userName') ?? auth()->user()?->userName ?? request()->input('username') ?? auth()->user()?->username ?? '');
        
        $emailLocal = explode('@', $email)[0] ?? '';

        if (!empty($userName) && str_contains($password, $userName)) {
            $fail('The password cannot contain your username.');
        }

        if (!empty($firstName) && str_contains($password, $firstName)) {
            $fail('The password cannot contain your first name.');
        }

        if (!empty($lastName) && str_contains($password, $lastName)) {
            $fail('The password cannot contain your last name.');
        }

        // Split the local part of the email by dots, underscores, or hyphens
        if (!empty($emailLocal)) {
            $emailParts = preg_split('/[\.\_\-\+]/', $emailLocal);
            foreach ($emailParts as $part) {
                if (strlen($part) >= 3 && str_contains($password, $part)) {
                    $fail("The password cannot contain parts of your email address ('{$part}').");
                }
            }
        }

        // Block highly predictable dictionary words
        $blockedWords = ['admin', 'admin123', 'password', 'qwerty', '123456'];
        foreach ($blockedWords as $word) {
            if (str_contains($password, $word)) {
                $fail("The password cannot contain easily guessable dictionary words like '{$word}'.");
            }
        }
    }
}
