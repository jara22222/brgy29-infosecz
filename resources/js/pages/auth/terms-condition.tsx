import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function TermsCondition() {
    return (
        <div className="Street flex w-full flex-1 items-center gap-5 rounded-md border p-5">
            <Checkbox
                required
                id="agree"
                className="data-[state=checked]:border-[#4b6bec] data-[state=checked]:bg-[#172F92]"
            />
            <Label htmlFor="agree" className="cursor-pointer leading-snug">
                Agree to the <b>Terms and Condition</b> and
                <b> the Privacy Policy</b> <br />
                of 29-C Barangay Online Portal
            </Label>
        </div>
    );
}
