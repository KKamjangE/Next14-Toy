import React, { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";

interface InputProps {
    errors?: string[];
    name: string;
}

const _Input = (
    {
        errors = [],
        name,
        ...rest
    }: InputProps & InputHTMLAttributes<HTMLInputElement>,
    ref: ForwardedRef<HTMLInputElement>,
) => {
    return (
        <div className="flex flex-col gap-2">
            <input
                name={name}
                ref={ref}
                className="placeholder:text-neutral-400focus:outline-none h-10 w-full rounded-md border-none bg-transparent ring-2 ring-neutral-200 transition focus:ring-4 focus:ring-orange-500"
                {...rest}
            />
            {errors.map((error, index) => (
                <span key={index} className="font-medium text-red-500">
                    {error}
                </span>
            ))}
        </div>
    );
};

export default forwardRef(_Input);
