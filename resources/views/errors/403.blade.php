<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 Forbidden - Brgy. 29-C Portal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50 h-screen flex items-center justify-center p-6">
    <div class="max-w-md w-full text-center">
        <!-- Icon -->
        <div class="mb-8 flex justify-center">
            <div class="relative">
                <div class="absolute inset-0 bg-red-100 rounded-full scale-150 blur-xl opacity-50"></div>
                <div class="relative bg-white p-6 rounded-3xl shadow-xl border border-red-50">
                    <svg class="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m11 3a9 9 0 11-18 0 9 9 0 0118 0zM12 9v2m0 0v2m0-2h2m-2 0H10" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Text -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">403 Forbidden</h1>
        <p class="text-lg text-gray-600 mb-10 leading-relaxed">
            Oops! You don't have permission to access this page. This area is restricted based on your account role.
        </p>

        <!-- Action -->
        <div class="space-y-4">
            <button onclick="window.history.back()" class="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-200 active:scale-[0.98]">
                Go Back to Safety
            </button>
            <a href="/" class="block text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                Return to Homepage
            </a>
        </div>
        
        <!-- Decoration -->
        <div class="mt-16 text-gray-300 text-xs font-medium tracking-widest uppercase">
            Brgy. 29-C Online Portal
        </div>
    </div>
</body>
</html>
