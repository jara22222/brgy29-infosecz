import InputError from '../input-error';
import { Input } from '../ui/input';

export default function AddressInfo(props: { form: any }) {
    const { form } = props;
    return (
        <div className="flex w-full flex-col justify-center gap-6">
            {/* Enter House No/Street */}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-[14px] text-muted-foreground">
                    *House No. / Street
                </h2>
                <Input
                    required
                    name="Street"
                    id="steet"
                    autoFocus
                    placeholder="Enter Your Street"
                    onChange={(e) => form.setData('street', e.target.value)}
                    tabIndex={1}
                />
                <InputError message={form.errors.street} />
            </div>
            {/*Purok / Zone / Sitio*/}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-[14px] text-muted-foreground">
                    *Purok / Zone / Sitio
                </h2>
                <Input
                    required
                    name="purok"
                    id="purok"
                    autoFocus
                    placeholder="Enter Your Purok"
                    onChange={(e) => form.setData('purok', e.target.value)}
                    tabIndex={2}
                />
                <InputError message={form.errors.purok} />
            </div>
            {/*Barangay Name*/}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-[14px] text-muted-foreground">*Barangay Name</h2>
                <Input
                    required
                    name="barangay"
                    id="barangay"
                    autoFocus
                    placeholder="Enter Your Barangay"
                    onChange={(e) => form.setData('barangay', e.target.value)}
                    tabIndex={3}
                />
                <InputError message={form.errors.barangay} />
            </div>
            {/*City / Municipality*/}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-[14px] text-muted-foreground">
                    *City / Municipality
                </h2>
                <Input
                    required
                    name="city"
                    id="city"
                    autoFocus
                    placeholder="Enter Your City"
                    onChange={(e) => form.setData('city', e.target.value)}
                    tabIndex={4}
                />
                <InputError message={form.errors.city} />
            </div>
            {/*Province*/}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-[14px] text-muted-foreground">*Province</h2>
                <Input
                    required
                    name="province"
                    id="province"
                    autoFocus
                    placeholder="Enter Your Province"
                    onChange={(e) => form.setData('province', e.target.value)}
                    tabIndex={5}
                />
                <InputError message={form.errors.province} />
            </div>
            {/*Postal*/}
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-[14px] text-muted-foreground">*Postal Code</h2>
                <Input
                    required
                    name="postal"
                    id="postal"
                    type="number"
                    min={0}
                    autoFocus
                    placeholder="Enter Your Postal Code"
                    onChange={(e) => form.setData('postal', e.target.value)}
                    tabIndex={6}
                />
                <InputError message={form.errors.postal} />
            </div>
        </div>
    );
}
