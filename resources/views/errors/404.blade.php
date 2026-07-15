<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 Not Found - Brgy. 29-C Portal</title>
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
                <div class="absolute inset-0 bg-blue-100 rounded-full scale-150 blur-xl opacity-50"></div>
                <div class="relative bg-white p-6 rounded-3xl shadow-xl border border-blue-50">
                    <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Text -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">404 Page Not Found</h1>
        <p class="text-lg text-gray-600 mb-10 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>

        <!-- Action -->
        <div class="space-y-4">
            <button onclick="window.history.back()" class="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-200 active:scale-[0.98]">
                Go Back
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
