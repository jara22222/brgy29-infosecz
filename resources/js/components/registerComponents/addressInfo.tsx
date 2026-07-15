import InputError from '../input-error';
import { Input } from '../ui/input';

export default function AddressInfo(props: { form: any }) {
    const { form } = props;
    return (
        <div className="flex w-full flex-col justify-center gap-6">
            {/* Enter House No/Street */}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-sm text-muted-foreground sm:text-[14px]">
                    *House No. / Street
                </h2>
                <Input
                    required
                    name="street"
                    id="street"
                    placeholder="Enter Your Street"
                    value={form.data.street}
                    onChange={(e) => form.setData('street', e.target.value)}
                    tabIndex={1}
                />
                <InputError message={form.errors.street} />
            </div>
            {/*Purok / Zone / Sitio*/}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-sm text-muted-foreground sm:text-[14px]">
                    *Purok / Zone / Sitio
                </h2>
                <Input
                    required
                    name="purok"
                    id="purok"
                    placeholder="Enter Your Purok"
                    value={form.data.purok}
                    onChange={(e) => form.setData('purok', e.target.value)}
                    tabIndex={2}
                />
                <InputError message={form.errors.purok} />
            </div>
            {/*Barangay Name*/}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-sm text-muted-foreground sm:text-[14px]">*Barangay Name</h2>
                <Input
                    required
                    name="barangay"
                    id="barangay"
                    placeholder="Enter Your Barangay"
                    value={form.data.barangay}
                    onChange={(e) => form.setData('barangay', e.target.value)}
                    tabIndex={3}
                />
                <InputError message={form.errors.barangay} />
            </div>
            {/*City / Municipality*/}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-sm text-muted-foreground sm:text-[14px]">
                    *City / Municipality
                </h2>
                <Input
                    required
                    name="city"
                    id="city"
                    placeholder="Enter Your City"
                    value={form.data.city}
                    onChange={(e) => form.setData('city', e.target.value)}
                    tabIndex={4}
                />
                <InputError message={form.errors.city} />
            </div>
            {/*Province*/}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-sm text-muted-foreground sm:text-[14px]">*Province</h2>
                <Input
                    required
                    name="province"
                    id="province"
                    placeholder="Enter Your Province"
                    value={form.data.province}
                    onChange={(e) => form.setData('province', e.target.value)}
                    tabIndex={5}
                />
                <InputError message={form.errors.province} />
            </div>
            {/*Postal*/}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-sm text-muted-foreground sm:text-[14px]">*Postal Code</h2>
                <Input
                    required
                    name="postal"
                    id="postal"
                    type="text"
                    placeholder="Enter Your Postal Code"
                    value={form.data.postal}
                    onChange={(e) => form.setData('postal', e.target.value)}
                    tabIndex={6}
                />
                <InputError message={form.errors.postal} />
            </div>
        </div>
    );
}
