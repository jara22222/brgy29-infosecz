import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';
import InputError from '../input-error';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

export default function BasicInfo(props: { form: any }) {
    const { form } = props;
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date>();

    return (
        <>
            {/* Enter first name */}
            <div className="flex w-full flex-col">
                <div className="firstName flex flex-col gap-2">
                    <h2 className="text-[14px] text-muted-foreground">* First name</h2>
                    <Input
                        name="firstName"
                        id="firstName"
                        autoFocus
                        placeholder="Enter Your First Name"
                        onChange={(e) =>
                            form.setData('firstName', e.target.value)
                        }
                        tabIndex={1}
                    />
                    <InputError message={form.errors.firstName} />
                </div>
                {/* Enter Middle Name */}
                <div className="middleName mt-5 flex flex-col gap-2">
                    <h2 className="text-[14px] text-muted-foreground">
                        * Middle name (as applicable)
                    </h2>
                    <Input
                        name="middleName"
                        id="middleName"
                        required
                        autoFocus
                        placeholder="Enter Your Middle Name"
                        onChange={(e) =>
                            form.setData('middleName', e.target.value)
                        }
                        tabIndex={2}
                    />
                    <InputError message={form.errors.middleName} />
                </div>
                {/* Enter Last Name */}
                <div className="lastName mt-5 flex flex-col gap-2">
                    <h2 className="text-[14px] text-muted-foreground">* Last name</h2>
                    <Input
                        required
                        name="lastName"
                        id="lastName"
                        autoFocus
                        placeholder="Enter Your Last Name"
                        tabIndex={3}
                        onChange={(e) =>
                            form.setData('lastName', e.target.value)
                        }
                    />
                </div>
                {/* Select gender */}
                <div className="genderSelect mt-5 flex flex-col gap-2">
                    <div className="text-[14px] text-muted-foreground">
                        * What’s your gender?
                        <RadioGroup
                            name="gender"
                            id="gender"
                            required
                            className="mt-3"
                            tabIndex={4}
                            onValueChange={(e) => form.setData('gender', e)}
                        >
                            <div className="flex gap-8">
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem
                                        required
                                        value={'Female'}
                                        id="female"
                                        className="cursor-pointer"
                                    />
                                    <Label
                                        htmlFor="female"
                                        className="cursor-pointer"
                                    >
                                        Female
                                    </Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <RadioGroupItem
                                        required
                                        value={'Male'}
                                        id="male"
                                        className="cursor-pointer"
                                    />
                                    <Label
                                        htmlFor="male"
                                        className="cursor-pointer"
                                    >
                                        Male
                                    </Label>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Select Date */}
                    <div className="datePicker mt-5 flex flex-col gap-2">
                        <h2 className="text-[14px] text-muted-foreground">
                            * What’s your date of birth?
                        </h2>

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="date"
                                    className="w-full justify-between font-normal"
                                >
                                    {date ? (
                                        date.toLocaleDateString()
                                    ) : (
                                        <>
                                            <span className="text-muted-foreground">
                                                Select date
                                            </span>
                                        </>
                                    )}

                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent
                                tabIndex={5}
                                className="w-auto overflow-hidden p-0"
                                align="start"
                            >
                                <Calendar
                                    required
                                    mode="single"
                                    selected={date}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        form.setData(
                                            'dateOfBirth',
                                            format(date, 'yyyy-MM-dd'),
                                        );
                                        setDate(date);
                                        setOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* Select Civil Status */}
                    <div className="mt-5 flex flex-col gap-2">
                        <h2 className="text-[14px] text-muted-foreground">
                            What’s your Civil Status?
                        </h2>

                        <Select
                            name="civilStatus"
                            onValueChange={(value) => {
                                form.setData('civilStatus', value);
                            }}
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder={'Select civil status'}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup tabIndex={6} id="civilStatus">
                                    <SelectLabel>Civil status</SelectLabel>
                                    <SelectItem value="Single">
                                        Single
                                    </SelectItem>
                                    <SelectItem value="Married">
                                        Married
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </>
    );
}
