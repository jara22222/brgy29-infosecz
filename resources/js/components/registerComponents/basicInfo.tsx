import React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import InputError from '../input-error';

interface BasicInfoProps {
    form: any;
}

interface FormData {
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    civilStatus: string;
    dateOfBirth: string;
    birthMonth: string;
    birthDate: string;
    birthYear: string;
}

export default function BasicInfo({ form }: BasicInfoProps) {
    const handleInputChange =
        (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
            form.setData(field, e.target.value);
        };

    const handleGenderChange = (value: string) => {
        form.setData('gender', value);
    };

    const updateDateOfBirth = () => {
        if (
            form.data.birthMonth &&
            form.data.birthDate &&
            form.data.birthYear
        ) {
            const month = form.data.birthMonth.padStart(2, '0');
            const date = form.data.birthDate.padStart(2, '0');
            const dateStr = `${form.data.birthYear}-${month}-${date}`;
            form.setData('dateOfBirth', dateStr);
        }
    };

    const handleCivilStatusChange = (value: string) => {
        form.setData('civilStatus', value);
    };

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const renderFormField = (
        label: string,
        field: keyof FormData,
        placeholder: string,
        tabIndex: number,
        required = true,
    ) => (
        <div className="flex flex-col gap-2">
            <h2 className="text-sm text-muted-foreground sm:text-[14px]">
                {required && '* '}
                {label}
            </h2>
            <Input
                name={field}
                id={field}
                autoFocus={field === 'firstName'}
                placeholder={placeholder}
                value={form.data[field] || ''}
                onChange={handleInputChange(field)}
                tabIndex={tabIndex}
                required={required}
            />
            <InputError message={form.errors[field]} />
        </div>
    );

    return (
        <div className="flex w-full flex-col gap-5">
            {renderFormField(
                'First name',
                'firstName',
                'Enter Your First Name',
                1,
            )}
            {renderFormField(
                'Middle name (as applicable)',
                'middleName',
                'Enter Your Middle Name',
                2,
                false,
            )}
            {renderFormField(
                'Last name',
                'lastName',
                'Enter Your Last Name',
                3,
            )}

            <div className="flex flex-col gap-2">
                <h2 className="text-sm text-muted-foreground sm:text-[14px]">
                    What's your gender? (optional)
                </h2>
                <RadioGroup
                    name="gender"
                    id="gender"
                    className="mt-3"
                    tabIndex={4}
                    onValueChange={handleGenderChange}
                    value={form.data.gender}
                >
                    <div className="flex gap-4 sm:gap-8">
                        {['Female', 'Male'].map((gender) => (
                            <div
                                key={gender}
                                className="flex items-center gap-2"
                            >
                                <RadioGroupItem
                                    value={gender}
                                    id={gender.toLowerCase()}
                                    className="cursor-pointer"
                                />
                                <Label
                                    htmlFor={gender.toLowerCase()}
                                    className="cursor-pointer"
                                >
                                    {gender}
                                </Label>
                            </div>
                        ))}
                    </div>
                </RadioGroup>
                <InputError message={form.errors.gender} />
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="text-sm text-muted-foreground sm:text-[14px]">
                    * What's your date of birth?
                </h2>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <Select
                        onValueChange={(value) => {
                            form.setData('birthMonth', value);
                            setTimeout(updateDateOfBirth, 0);
                        }}
                        value={form.data.birthMonth}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Month</SelectLabel>
                                {months.map((month, index) => (
                                    <SelectItem
                                        key={month}
                                        value={(index + 1).toString()}
                                    >
                                        {month}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select
                        onValueChange={(value) => {
                            form.setData('birthDate', value);
                            setTimeout(updateDateOfBirth, 0);
                        }}
                        value={form.data.birthDate}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Date</SelectLabel>
                                {days.map((day) => (
                                    <SelectItem
                                        key={day}
                                        value={day.toString()}
                                    >
                                        {day}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select
                        onValueChange={(value) => {
                            form.setData('birthYear', value);
                            setTimeout(updateDateOfBirth, 0);
                        }}
                        value={form.data.birthYear}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Year</SelectLabel>
                                {years.map((year) => (
                                    <SelectItem
                                        key={year}
                                        value={year.toString()}
                                    >
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <InputError message={form.errors.dateOfBirth} />
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="text-sm text-muted-foreground sm:text-[14px]">
                    * What's your Civil Status?
                </h2>
                <Select
                    onValueChange={handleCivilStatusChange}
                    value={form.data.civilStatus}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select civil status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup tabIndex={6} id="civilStatus">
                            <SelectLabel>Civil Status</SelectLabel>
                            {['Single', 'Married', 'Divorced', 'Widowed'].map(
                                (status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ),
                            )}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <InputError message={form.errors.civilStatus} />
            </div>
        </div>
    );
}
