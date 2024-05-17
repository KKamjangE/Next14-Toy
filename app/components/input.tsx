import React, { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

interface InputProps {
    errors?: string[];
    name: string;
}

export default function Input({
    errors = [],
    name,
    ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="flex flex-col gap-2">
            <input
                name={name}
                // type={type}
                // placeholder={placeholder}
                // required={required}
                {...rest}
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
