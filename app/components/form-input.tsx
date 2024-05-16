import React from "react";

interface FormInputProps {
    type: string;
    placeholder: string;
    required: boolean;
    errors: string[];
    name: string;
}

export default function FormInput({
    type,
    placeholder,
    required,
    errors,
    name,
}: FormInputProps) {
    return (
        <div className="flex flex-col gap-2">
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                className="placeholder:text-neutral-400focus:outline-none h-10 w-full rounded-md border-none bg-transparent ring-2 ring-neutral-200 transition focus:ring-4 focus:ring-orange-500"
            />
            {errors.map((error, index) => (
                <span key={index} className="font-medium text-red-500">
                    {error}
                </span>
            ))}
        </div>
    );
}
