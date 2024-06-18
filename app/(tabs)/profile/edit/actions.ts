"use server";

import { ProfileSchema } from "@/app/(tabs)/profile/edit/schema";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function editProfile(formData: FormData) {
    const data = {
        username: formData.get("username"),
    };

    const result = ProfileSchema.safeParse(data);

    if (!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        await db.user.update({
            where: {
                id: session.id,
            },
            data: {
                username: result.data.username,
            },
        });
        redirect("/profile");
    }
}
