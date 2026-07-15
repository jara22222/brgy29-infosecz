<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Locked - Brgy. 29-C Portal</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css'])
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <style>
        body { font-family: 'Inter', sans-serif; }
        [x-cloak] { display: none !important; }
    </style>
</head>
<body
    class="relative flex min-h-full items-center justify-center overflow-hidden bg-slate-50 p-4 text-slate-800 antialiased"
    x-data="otpForm()"
>
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div class="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-200/30 blur-3xl"></div>
        <div class="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl"></div>
    </div>

    <div class="relative z-10 w-full max-w-md space-y-6">
        <div class="text-center">
            <div class="mx-auto mb-4 inline-flex p-1">
                <img src="/myassets/Logo.png" alt="BRGY. 29-C" class="h-12 w-auto sm:h-14">
            </div>

            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
            </div>

            <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Account locked</h1>
            <p class="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                For your security, your account was temporarily locked after multiple failed login attempts.
            </p>
            @if(!empty($email))
                <p class="mt-2 text-xs font-medium text-slate-500">{{ $email }}</p>
            @endif
        </div>

        <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
            @if(session('status'))
                <div class="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-800">
                    {{ session('status') }}
                </div>
            @endif

            @if($errors->has('email'))
                <div class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
                    {{ $errors->first('email') }}
                </div>
            @endif

            <div x-show="!showVerify" x-transition.opacity class="space-y-4">
                <p class="text-center text-sm text-slate-600">
                    We can send a secure unlock code to your registered email address.
                </p>
                <form action="{{ route('account.locked.send-otp') }}" method="POST">
                    @csrf
                    <button
                        type="submit"
                        @click="showVerify = true"
                        class="w-full rounded-xl border border-slate-300 bg-white py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md"
                    >
                        Send unlock code to email
                    </button>
                </form>
            </div>

            <div x-show="showVerify" x-cloak x-transition.opacity class="space-y-5">
                <form action="{{ route('account.locked.verify') }}" method="POST" id="verifyForm">
                    @csrf
                    <p class="text-center text-sm font-medium text-slate-700">Enter the 6-digit code</p>

                    <div class="mt-3 flex justify-between gap-2">
                        <template x-for="i in 6">
                            <input
                                type="text"
                                name="code_digits[]"
                                maxlength="1"
                                inputmode="numeric"
                                x-model="otp[i-1]"
                                @keyup="handleOtpInput($event, i-1)"
                                @keydown="handleKeyDown($event, i-1)"
                                @paste="handlePaste($event)"
                                :id="'otp-' + (i-1)"
                                class="h-12 w-11 rounded-xl border bg-white text-center text-lg font-semibold text-slate-900 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 sm:h-14 sm:w-12 {{ $errors->has('code') ? 'border-red-400 ring-1 ring-red-400/30' : 'border-slate-200' }}"
                                required
                            >
                        </template>
                    </div>

                    <input type="hidden" name="code" :value="otp.join('')">

                    @if($errors->has('code'))
                        <p class="mt-2 text-center text-sm font-medium text-red-600">
                            {{ $errors->first('code') }}
                        </p>
                    @endif

                    <div class="mt-6 space-y-3">
                        <button
                            type="submit"
                            :disabled="otp.join('').length < 6"
                            class="w-full rounded-xl bg-blue-700 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Verify &amp; unlock
                        </button>
                        <div class="text-center">
                            <button
                                type="button"
                                @click="showVerify = false"
                                class="text-sm font-medium text-slate-500 transition hover:text-slate-800"
                            >
                                Try another way
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="text-center">
            <a
                href="{{ route('login') }}"
                class="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-red-600"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Return to login
            </a>
        </div>
    </div>

    <script>
        function otpForm() {
            return {
                showVerify: {{ session('status') || $errors->has('code') ? 'true' : 'false' }},
                otp: ['', '', '', '', '', ''],

                handleOtpInput(e, index) {
                    const value = e.target.value;
                    if (value && /^\d$/.test(value)) {
                        this.otp[index] = value;
                        if (index < 5) {
                            document.getElementById(`otp-${index + 1}`).focus();
                        }
                    } else if (value !== '') {
                        this.otp[index] = '';
                    }
                },

                handleKeyDown(e, index) {
                    if (e.key === 'Backspace') {
                        if (!this.otp[index] && index > 0) {
                            document.getElementById(`otp-${index - 1}`).focus();
                        }
                        this.otp[index] = '';
                    }
                },

                handlePaste(e) {
                    e.preventDefault();
                    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
                    if (pastedData.every(char => /^\d$/.test(char))) {
                        pastedData.forEach((char, i) => {
                            if (i < 6) this.otp[i] = char;
                        });
                        const focusIndex = Math.min(pastedData.length, 5);
                        document.getElementById(`otp-${focusIndex}`).focus();
                    }
                }
            }
        }
    </script>
</body>
</html>
