"use client";

import Button from "@/app/components/button";
import Input from "@/app/components/input";
import SocialLogin from "@/app/components/social-login";
import { handleForm } from "@/app/login/actions";
import { useFormState } from "react-dom";

export default function Login() {
    const [state, action] = useFormState(handleForm, null);

    return (
        <div className="flex flex-col gap-10 px-6 py-8">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Log in with email and password.</h2>
            </div>
            <form action={action} className="flex flex-col gap-3">
                <Input name="email" type="email" placeholder="Email" required />
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                />
                <Button text="Log in" />
            </form>
            <SocialLogin />
        </div>
    );
}
