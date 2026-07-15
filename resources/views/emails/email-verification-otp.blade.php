<!DOCTYPE html>
<html>
<head>
    <title>Email Verification Code</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
    <div style="max-width: 28rem; margin: 0 auto; background-color: #fff; padding: 32px; border-radius: 8px;">
        <h2 style="color: #0f172a; margin-bottom: 16px;">Verify Your Email</h2>
        <p style="color: #475569; line-height: 1.5; margin-bottom: 24px;">
            Use this 6-digit code to verify your email address for the Brgy. 29-C Portal:
        </p>

        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-radius: 8px; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1e40af;">{{ $otp }}</span>
        </div>

        <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
            This code expires in 15 minutes. If you did not request this, you can ignore this email.
        </p>
    </div>
</body>
</html>
