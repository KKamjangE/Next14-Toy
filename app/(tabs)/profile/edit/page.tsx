import { getUser } from "@/app/(tabs)/profile/actions";
import ProfileEditForm from "@/components/profile-edit-form";
import { notFound } from "next/navigation";

export default async function EditProfile() {
    const user = await getUser();

    if (!user) return notFound();

    return <ProfileEditForm user={user} />;
}
