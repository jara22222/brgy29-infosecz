<!DOCTYPE html>
<html>
<head>
    <title>Account Unlock Code</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
    <div style="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
        <h2 style="color: #0f172a; margin-bottom: 16px;">Unlock Your Account</h2>
        <p style="color: #475569; line-height: 1.5; margin-bottom: 24px;">
            We received a request to unlock your account for the Brgy. 29-C Portal. Please use the following 6-digit code to verify your identity and restore access:
        </p>
        
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-radius: 8px; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1e40af;">{{ $otp }}</span>
        </div>
        
        <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
            This code will expire in 15 minutes. If you did not request this, please contact the administrator immediately.
        </p>
    </div>
</body>
</html>
