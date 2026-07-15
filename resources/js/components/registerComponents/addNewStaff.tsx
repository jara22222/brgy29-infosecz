import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Input,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { router } from '@inertiajs/react';
import { Check, Eye, EyeOff, Loader2, X } from 'lucide-react';
import React, { Fragment, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import InputError from '@/components/input-error';
import { fieldErrorMessage, fieldInputClasses } from '@/lib/form-field';

// FIXED: The previous Button component was calling itself recursively.
// Changed to render a standard HTML <button> tag.
const Button = ({ children, className, ...props }: any) => (
    <button className={className} {...props}>
        {children}
    </button>
);

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddNewStaffComponent({ isOpen, onClose }: ModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Address fields
    const [street, setStreet] = useState('');
    const [purok, setPurok] = useState('');
    const [barangay, setBarangay] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postal, setPostal] = useState('');

    // Contact fields
    const [email, setEmail] = useState('');
    const [mobileNo, setMobileNo] = useState('');

    // Account fields
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    // Name fields
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');

    // Name Validation
    const nameRegex = /\d/;
    const firstNameError = useMemo(
        () => (nameRegex.test(firstName) ? 'First name cannot contain numbers' : ''),
        [firstName],
    );
    const middleNameError = useMemo(
        () => (nameRegex.test(middleName) ? 'Middle name cannot contain numbers' : ''),
        [middleName],
    );
    const lastNameError = useMemo(
        () => (nameRegex.test(lastName) ? 'Last name cannot contain numbers' : ''),
        [lastName],
    );

    const staffNameError = fieldErrorMessage(errors, 'name');
    const staffEmailError = fieldErrorMessage(errors, 'email');
    const nameFieldsHaveError = Boolean(staffNameError);
    const emailHasError = Boolean(staffEmailError);

    const staffInputBase =
        'h-11 w-full rounded-lg border border-border px-3 transition focus:ring-2 focus:outline-none disabled:bg-muted disabled:text-muted-foreground';

    // Additional fields
    const [gender, setGender] = useState('');
    const [civilStatus, setCivilStatus] = useState('');

    const updateDateOfBirth = () => {
        if (birthMonth && birthDate && birthYear) {
            const month = birthMonth.padStart(2, '0');
            const date = birthDate.padStart(2, '0');
            const dateStr = `${birthYear}-${month}-${date}`;
            setDateOfBirth(dateStr);
        }
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

    // Password requirements logic
    const pw = password || '';
    const hasMinLength = pw.length >= 12;
    const hasUpperCase = /[A-Z]/.test(pw);
    const hasLowerCase = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(pw);

    const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
        <li
            className={`flex items-center gap-2 text-xs ${met ? 'text-green-600' : 'text-muted-foreground'}`}
        >
            {met ? (
                <Check className="h-3 w-3" />
            ) : (
                <X className="h-3 w-3 text-red-400" />
            )}
            <span>{text}</span>
        </li>
    );

    // Password Security Aggregated Check
    const isPasswordSecure =
        hasMinLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar;

    const lowerPw = (password || '').toLowerCase();
    const identifiers = [
        firstName,
        middleName,
        lastName,
        email.split('@')[0],
        userName,
    ]
        .filter(Boolean)
        .map((id) => id.toLowerCase());

    const foundIdentifier = identifiers.find(
        (id) => id.length > 2 && lowerPw.includes(id),
    );
    const isPasswordContextSafe = !foundIdentifier;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side context-specific password validation
        const lowerPw = (password || '').toLowerCase();
        const identifiers = [
            firstName,
            middleName,
            lastName,
            email.split('@')[0],
            userName,
        ]
            .filter(Boolean)
            .map((id) => id.toLowerCase());

        const foundIdentifier = identifiers.find(
            (id) => id.length > 2 && lowerPw.includes(id),
        );

        if (foundIdentifier) {
            setIsSubmitting(false);
            toast.error(
                `Password cannot contain personal information like your name, email, or username (${foundIdentifier}).`,
                {
                    duration: 5000,
                    position: 'top-center',
                    style: {
                        background: '#fee2e2',
                        color: '#991b1b',
                        border: '1px solid #fecaca',
                        fontWeight: 'bold',
                    },
                },
            );
            return;
        }

        setIsSubmitting(true);

        const formData = {
            firstName,
            middleName,
            lastName,
            gender,
            civilStatus,
            dateOfBirth,
            street,
            purok,
            barangay,
            city,
            province,
            postal,
            email,
            mobileNo,
            userName,
            password,
            password_confirmation: passwordConfirmation,
        };

        router.post('/admin', formData, {
            onSuccess: () => {
                onClose();
                setErrors({});
            },
            onError: (err: Record<string, string | string[]>) => {
                const normalized = Object.fromEntries(
                    Object.entries(err).map(([key, value]) => [
                        key,
                        Array.isArray(value) ? value[0] : value,
                    ]),
                );
                setErrors(normalized);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop / Overlay */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </TransitionChild>

                {/* Modal Positioning Wrapper */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-background text-left align-middle shadow-2xl transition-all">
                                {/* Modal Header */}
                                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
                                    <DialogTitle
                                        as="h2"
                                        className="text-xl font-bold text-foreground"
                                    >
                                        Add New Staff Account
                                    </DialogTitle>
                                    <Button
                                        onClick={onClose}
                                        type="button"
                                        disabled={isSubmitting}
                                        className="rounded-full p-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                                    >
                                        <X size={20} />
                                    </Button>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <fieldset
                                        disabled={isSubmitting}
                                        className="group"
                                    >
                                        {/* Modal Body */}
                                        <div className="space-y-6 p-6 transition-opacity group-disabled:opacity-60">
                                            {/* Basic Info Section */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold text-foreground">
                                                    Basic Information
                                                </h3>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {/* First Name Field */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-muted-foreground">
                                                            *First name
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            required
                                                            placeholder="Enter First Name"
                                                            value={firstName}
                                                            onChange={(e) => {
                                                                setFirstName(e.target.value);
                                                                if (errors.name) {
                                                                    setErrors((prev) => {
                                                                        const next = { ...prev };
                                                                        delete next.name;
                                                                        return next;
                                                                    });
                                                                }
                                                            }}
                                                            className={fieldInputClasses(
                                                                nameFieldsHaveError || !!firstNameError,
                                                                `${staffInputBase} focus:ring-blue-500`,
                                                            )}
                                                            aria-invalid={nameFieldsHaveError || !!firstNameError}
                                                        />
                                                        <InputError message={firstNameError} />
                                                    </div>
                                                    {/* Middle Name Field */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-muted-foreground">
                                                            Middle name (as
                                                            applicable)
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Enter Middle Name"
                                                            value={middleName}
                                                            onChange={(e) =>
                                                                setMiddleName(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-11 w-full rounded-lg border border-border px-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                        />
                                                        <InputError message={middleNameError} />
                                                    </div>
                                                    {/* Last Name Field */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-muted-foreground">
                                                            *Last name
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            required
                                                            placeholder="Enter Last Name"
                                                            value={lastName}
                                                            onChange={(e) => {
                                                                setLastName(e.target.value);
                                                                if (errors.name) {
                                                                    setErrors((prev) => {
                                                                        const next = { ...prev };
                                                                        delete next.name;
                                                                        return next;
                                                                    });
                                                                }
                                                            }}
                                                            className={fieldInputClasses(
                                                                nameFieldsHaveError || !!lastNameError,
                                                                `${staffInputBase} focus:ring-blue-500`,
                                                            )}
                                                            aria-invalid={nameFieldsHaveError || !!lastNameError}
                                                        />
                                                        <InputError message={lastNameError} />
                                                        <InputError message={staffNameError} />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-muted-foreground">
                                                            What's gender?
                                                            (optional)
                                                        </label>
                                                        <select
                                                            className="h-11 w-full cursor-pointer rounded-lg border border-border bg-background px-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                            value={gender}
                                                            onChange={(e) =>
                                                                setGender(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        >
                                                            <option value="">
                                                                Select Gender
                                                            </option>
                                                            <option value="Female">
                                                                Female
                                                            </option>
                                                            <option value="Male">
                                                                Male
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-muted-foreground">
                                                            *What's Civil
                                                            Status?
                                                        </label>
                                                        <select
                                                            className="h-11 w-full cursor-pointer rounded-lg border border-border bg-background px-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                            value={civilStatus}
                                                            onChange={(e) =>
                                                                setCivilStatus(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            required
                                                        >
                                                            <option value="">
                                                                Select civil
                                                                status
                                                            </option>
                                                            <option value="Single">
                                                                Single
                                                            </option>
                                                            <option value="Married">
                                                                Married
                                                            </option>
                                                            <option value="Divorced">
                                                                Divorced
                                                            </option>
                                                            <option value="Widowed">
                                                                Widowed
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-sm font-semibold text-muted-foreground">
                                                        Date of Birth
                                                    </label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <select
                                                            className="h-9 w-full cursor-pointer rounded-lg border border-border bg-background px-2 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                            value={birthMonth}
                                                            onChange={(e) => {
                                                                setBirthMonth(
                                                                    e.target
                                                                        .value,
                                                                );
                                                                setTimeout(
                                                                    updateDateOfBirth,
                                                                    0,
                                                                );
                                                            }}
                                                        >
                                                            <option value="">
                                                                Month
                                                            </option>
                                                            {months.map(
                                                                (
                                                                    month,
                                                                    index,
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            month
                                                                        }
                                                                        value={(
                                                                            index +
                                                                            1
                                                                        ).toString()}
                                                                    >
                                                                        {month}
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                        <select
                                                            className="h-9 w-full cursor-pointer rounded-lg border border-border bg-background px-2 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                            value={birthDate}
                                                            onChange={(e) => {
                                                                setBirthDate(
                                                                    e.target
                                                                        .value,
                                                                );
                                                                setTimeout(
                                                                    updateDateOfBirth,
                                                                    0,
                                                                );
                                                            }}
                                                        >
                                                            <option value="">
                                                                Date
                                                            </option>
                                                            {days.map((day) => (
                                                                <option
                                                                    key={day}
                                                                    value={day.toString()}
                                                                >
                                                                    {day}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            className="h-9 w-full cursor-pointer rounded-lg border border-border bg-background px-2 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                            value={birthYear}
                                                            onChange={(e) => {
                                                                setBirthYear(
                                                                    e.target
                                                                        .value,
                                                                );
                                                                setTimeout(
                                                                    updateDateOfBirth,
                                                                    0,
                                                                );
                                                            }}
                                                        >
                                                            <option value="">
                                                                Year
                                                            </option>
                                                            {years.map(
                                                                (year) => (
                                                                    <option
                                                                        key={
                                                                            year
                                                                        }
                                                                        value={year.toString()}
                                                                    >
                                                                        {year}
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <hr className="border-border" />

                                            {/* Contact Information */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold text-foreground">
                                                    Address Information
                                                </h3>

                                                <div className="space-y-1.5">
                                                    <label className="text-sm font-semibold text-muted-foreground">
                                                        House No. / Street
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Street"
                                                        value={street}
                                                        onChange={(e) =>
                                                            setStreet(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-12 w-full rounded-lg border border-border px-4 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-sm font-semibold text-muted-foreground">
                                                        Purok / Zone / Sitio
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Purok"
                                                        value={purok}
                                                        onChange={(e) =>
                                                            setPurok(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-12 w-full rounded-lg border border-border px-4 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-sm font-semibold text-muted-foreground">
                                                        Barangay Name
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Barangay"
                                                        value={barangay}
                                                        onChange={(e) =>
                                                            setBarangay(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-12 w-full rounded-lg border border-border px-4 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-muted-foreground">
                                                            City / Municipality
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Enter City"
                                                            value={city}
                                                            onChange={(e) =>
                                                                setCity(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-11 w-full rounded-lg border border-border px-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-muted-foreground">
                                                            Province
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Enter Province"
                                                            value={province}
                                                            onChange={(e) =>
                                                                setProvince(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-11 w-full rounded-lg border border-border px-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-sm font-semibold text-muted-foreground">
                                                        Postal Code
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Postal Code"
                                                        value={postal}
                                                        onChange={(e) =>
                                                            setPostal(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-11 w-full rounded-lg border border-border px-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                    />
                                                </div>

                                                <div className="mt-10">
                                                    <h3 className="text-lg font-bold text-foreground">
                                                        Contacts Information
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-muted-foreground">
                                                            Email Address
                                                        </label>
                                                        <Input
                                                            type="email"
                                                            placeholder="oliviarhye@gmail.com"
                                                            value={email}
                                                            onChange={(e) => {
                                                                setEmail(e.target.value);
                                                                if (errors.email) {
                                                                    setErrors((prev) => {
                                                                        const next = { ...prev };
                                                                        delete next.email;
                                                                        return next;
                                                                    });
                                                                }
                                                            }}
                                                            className={fieldInputClasses(
                                                                emailHasError,
                                                                `${staffInputBase} focus:ring-blue-500`,
                                                            )}
                                                            aria-invalid={emailHasError}
                                                        />
                                                        <InputError message={staffEmailError} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-muted-foreground">
                                                            Mobile Number
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            placeholder="+639876543456"
                                                            value={mobileNo}
                                                            onChange={(e) =>
                                                                setMobileNo(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-11 w-full rounded-lg border border-border px-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                        />
                                                        <InputError
                                                            message={fieldErrorMessage(errors, 'mobileNo')}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <hr className="border-border" />

                                            {/* Privacy Security */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold text-foreground">
                                                    Privacy Security
                                                </h3>

                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-muted-foreground">
                                                            Username
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            placeholder="@oliviarhye123"
                                                            value={userName}
                                                            onChange={(e) =>
                                                                setUserName(
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="h-12 w-full rounded-lg border border-border px-4 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                        />
                                                        <InputError
                                                            message={fieldErrorMessage(errors, 'userName')}
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-muted-foreground">
                                                            Password
                                                        </label>
                                                        <div className="relative">
                                                            <Input
                                                                type={showPassword ? 'text' : 'password'}
                                                                placeholder="••••••••••"
                                                                value={password}
                                                                onChange={(e) =>
                                                                    setPassword(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="h-12 w-full rounded-lg border border-border px-4 pr-12 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-muted-foreground focus:outline-none"
                                                            >
                                                                {showPassword ? (
                                                                    <EyeOff size={18} />
                                                                ) : (
                                                                    <Eye size={18} />
                                                                )}
                                                            </button>
                                                        </div>

                                                        {/* Password Requirements List */}
                                                        <div className="mt-2 rounded-md border border-border bg-muted p-3">
                                                            <p className="mb-2 text-xs font-semibold text-muted-foreground">
                                                                Password
                                                                Requirements:
                                                            </p>
                                                            <ul className="space-y-1">
                                                                <RequirementItem
                                                                    met={
                                                                        hasMinLength
                                                                    }
                                                                    text="At least 12 characters"
                                                                />
                                                                <RequirementItem
                                                                    met={
                                                                        hasUpperCase
                                                                    }
                                                                    text="At least one uppercase letter"
                                                                />
                                                                <RequirementItem
                                                                    met={
                                                                        hasLowerCase
                                                                    }
                                                                    text="At least one lowercase letter"
                                                                />
                                                                <RequirementItem
                                                                    met={
                                                                        hasNumber
                                                                    }
                                                                    text="At least one number"
                                                                />
                                                                <RequirementItem
                                                                    met={
                                                                        hasSpecialChar
                                                                    }
                                                                    text="At least one special character"
                                                                />
                                                            </ul>
                                                        </div>
                                                        <InputError
                                                            message={fieldErrorMessage(errors, 'password')}
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-muted-foreground">
                                                            Confirm Password
                                                        </label>
                                                        <div className="relative">
                                                            <Input
                                                                type={showConfirmPassword ? 'text' : 'password'}
                                                                placeholder="••••••••••"
                                                                value={
                                                                    passwordConfirmation
                                                                }
                                                                onChange={(e) =>
                                                                    setPasswordConfirmation(
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                className="h-12 w-full rounded-lg border border-border px-4 pr-12 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-muted-foreground focus:outline-none"
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <EyeOff size={18} />
                                                                ) : (
                                                                    <Eye size={18} />
                                                                )}
                                                            </button>
                                                        </div>
                                                        <InputError
                                                            message={fieldErrorMessage(
                                                                errors,
                                                                'password_confirmation',
                                                            )}
                                                        />
                                                    </div>
                                            </div>
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="sticky bottom-0 z-10 flex justify-end gap-3 rounded-b-xl border-t border-border bg-muted px-8 py-5">
                                            <Button
                                                onClick={onClose}
                                                type="button"
                                                disabled={isSubmitting}
                                                className="rounded-lg border border-border bg-background px-6 py-2.5 font-medium text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    isSubmitting ||
                                                    !!firstNameError ||
                                                    !!middleNameError ||
                                                    !!lastNameError ||
                                                    !isPasswordSecure ||
                                                    !isPasswordContextSafe
                                                }
                                                className="flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-blue-900 px-6 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2
                                                            className="animate-spin"
                                                            size={18}
                                                        />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    'Create Account'
                                                )}
                                            </Button>
                                        </div>
                                    </fieldset>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
