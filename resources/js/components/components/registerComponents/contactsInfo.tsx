import InputError from '../input-error';
import { Input } from '../ui/input';

export default function ContactsInfo(props: { form: any }) {
    const { form } = props;
    return (
        <div className="flex w-full flex-col justify-center gap-6">
            {/* Email */}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-[14px] text-muted-foreground">*Email Address</h2>
                <Input
                    required
                    name="email"
                    id="email"
                    type="email"
                    autoFocus
                    placeholder="Enter Your Email"
                    onChange={(e) => form.setData('email', e.target.value)}
                    tabIndex={1}
                />
                <InputError message={form.errors.email} />
            </div>
            {/* Mobile No */}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-[14px] text-muted-foreground">*Mobile Number</h2>
                <Input
                    required
                    name="mbileNo"
                    id="mobileNo"
                    type="number"
                    min={0}
                    autoFocus
                    placeholder="Enter Your Street"
                    onChange={(e) => form.setData('mobileNo', e.target.value)}
                    tabIndex={2}
                />

                <InputError message={form.errors.mobileNo} />
            </div>
        </div>
    );
}
