"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function createChatRoom(sellerId: number) {
    const session = await getSession();
    const room = await db.chatRoom.create({
        data: {
            users: {
                connect: [{ id: sellerId }, { id: session.id }],
            },
        },
        select: {
            id: true,
        },
    });

    redirect(`/chats/${room.id}`);
}
