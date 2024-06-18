"use client";

import { editProfile } from "@/app/(tabs)/profile/edit/actions";
import { ProfileSchema, ProfileType } from "@/app/(tabs)/profile/edit/schema";
import Button from "@/components/button";
import Input from "@/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function ProfileEditForm({ user }: { user: ProfileType }) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ProfileType>({
        resolver: zodResolver(ProfileSchema),
    });

    const onSubmit = handleSubmit(async (data: ProfileType) => {
        console.log(data);

        const formData = new FormData();
        formData.append("username", data.username);
        const errors = await editProfile(formData);
        if (errors) {
            for (const [field, message] of Object.entries(errors.fieldErrors)) {
                setError(field as keyof ProfileType, {
                    message: message.join(", "),
                });
            }
        }
    });

    const onValid = async () => {
        await onSubmit();
    };

    return (
        <div className="p-5">
            <form onSubmit={onValid} className="flex flex-col gap-5">
                <Input
                    defaultValue={user.username}
                    type="text"
                    errors={[errors.username?.message ?? ""]}
                    required
                    {...register("username")}
                />
                <Button text="변경하기" />
            </form>
        </div>
    );
}
