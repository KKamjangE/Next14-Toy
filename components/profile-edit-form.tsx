"use client";

import { ProfileSchema, ProfileType } from "@/app/(tabs)/profile/edit/schema";
import Button from "@/components/button";
import Input from "@/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function ProfileEditForm({ user }: { user: ProfileType }) {
    const { register, handleSubmit, setValue } = useForm<ProfileType>({
        resolver: zodResolver(ProfileSchema),
    });

    const onSubmit = handleSubmit(async (data: ProfileType) => {});

    const onValid = async () => {
        await onSubmit();
    };

    return (
        <div className="p-5">
            <form action={onValid} className="flex flex-col gap-5">
                <Input defaultValue={user.username} {...register("username")} />
                <Button text="변경하기" />
            </form>
        </div>
    );
}
