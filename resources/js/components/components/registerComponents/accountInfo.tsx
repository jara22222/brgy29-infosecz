import InputError from '../input-error';
import { Input } from '../ui/input';

export default function AccountInfo(props: { form: any }) {
    const { form } = props;
    return (
        <div className="flex w-full flex-col justify-center gap-6">
            {/* Username */}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-[14px] text-muted-foreground">*Username</h2>
                <Input
                    required
                    name="username"
                    id="username"
                    autoFocus
                    placeholder="Enter Your Username"
                    onChange={(e) => form.setData('userName', e.target.value)}
                    tabIndex={1}
                />
                <InputError message={form.errors.userName} />
            </div>
            {/* Password */}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-[14px] text-muted-foreground">*Password</h2>
                <Input
                    required
                    name="password"
                    id="password"
                    type="password"
                    autoFocus
                    placeholder="Enter Your Street"
                    onChange={(e) => form.setData('password', e.target.value)}
                    tabIndex={2}
                />
                <InputError message={form.errors.password} />
            </div>
            {/* Confirm Password */}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-[14px] text-muted-foreground">*Confirm Password</h2>
                <Input
                    required
                    name="confirmPassword"
                    id="confirmPassword"
                    type="password"
                    autoFocus
                    placeholder="Re-enter Password"
                    onChange={(e) =>
                        form.setData('confirmPassword', e.target.value)
                    }
                    tabIndex={3}
                />
                <InputError message={form.errors.confirmPassword} />
            </div>
        </div>
    );
}
