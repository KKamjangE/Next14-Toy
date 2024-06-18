"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";

export async function getUser() {
    const session = await getSession();
    const user = await db.user.findUnique({
        where: {
            id: session.id,
        },
        select: {
            avatar: true,
            username: true,
            created_at: true,
        },
    });

    return user;
}
