import InputError from '../input-error';
import { Input } from '../ui/input';
import { Check, X, Eye, EyeOff } from 'lucide-react'; // Assuming lucide-react is available, or use standard symbols
import { useState } from 'react';

export default function AccountInfo(props: { form: any }) {
    const { form } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Check individual password requirements
    const pw = form.data.password || '';
    const hasMinLength = pw.length >= 12;
    const hasUpperCase = /[A-Z]/.test(pw);
    const hasLowerCase = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(pw);

    const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
        <li className={`flex items-center gap-2 text-xs ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
            {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 text-red-400" />}
            <span>{text}</span>
        </li>
    );

    const getConfirmError = () => {
        if (!form.data.password_confirmation) return undefined;
        if (form.data.password !== form.data.password_confirmation) return 'Passwords do not match.';
        return undefined;
    };

    const confirmError = form.errors.password_confirmation || getConfirmError();

    return (
        <div className="flex w-full flex-col justify-center gap-6">
            {/* Username */}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-sm text-muted-foreground sm:text-[14px]">*Username</h2>
                <Input
                    required
                    name="username"
                    id="username"
                    placeholder="Enter Your Username"
                    value={form.data.userName}
                    onChange={(e) => form.setData('userName', e.target.value)}
                    tabIndex={1}
                />
                <InputError message={form.errors.userName} />
            </div>
            {/* Password */}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-sm text-muted-foreground sm:text-[14px]">*Password</h2>
                <div className="relative">
                    <Input
                        required
                        name="password"
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter Your Password"
                        value={form.data.password}
                        onChange={(e) => form.setData('password', e.target.value)}
                        tabIndex={2}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-muted-foreground focus:outline-none"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                
                {/* Dynamic Password Requirements List */}
                <div className="mt-1 rounded-md bg-muted p-3 border border-border">
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">Password Requirements:</p>
                    <ul className="space-y-1">
                        <RequirementItem met={hasMinLength} text="At least 12 characters" />
                        <RequirementItem met={hasUpperCase} text="At least one uppercase letter" />
                        <RequirementItem met={hasLowerCase} text="At least one lowercase letter" />
                        <RequirementItem met={hasNumber} text="At least one number" />
                        <RequirementItem met={hasSpecialChar} text="At least one special character" />
                    </ul>
                </div>
                
                <InputError message={form.errors.password} />
            </div>
            {/* Confirm Password */}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-sm text-muted-foreground sm:text-[14px]">*Confirm Password</h2>
                <div className="relative">
                    <Input
                        required
                        name="password_confirmation"
                        id="password_confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter Password"
                        value={form.data.password_confirmation}
                        onChange={(e) =>
                            form.setData('password_confirmation', e.target.value)
                        }
                        tabIndex={3}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-muted-foreground focus:outline-none"
                    >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                <InputError message={confirmError} />
            </div>
        </div>
    );
}
