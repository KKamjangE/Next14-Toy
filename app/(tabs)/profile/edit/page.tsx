import ProfileEditForm from "@/components/profile-edit-form";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";

async function getUserName() {
    const session = await getSession();
    const user = await db.user.findUnique({
        where: {
            id: session.id,
        },
        select: {
            username: true,
        },
    });
    return user;
}

export default async function EditProfile() {
    const user = await getUserName();

    if (!user) return notFound();

    return <ProfileEditForm user={user} />;
}
