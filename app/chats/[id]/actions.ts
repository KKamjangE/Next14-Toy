"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function saveMessage(payload: string, chatRoomId: string) {
    const session = await getSession();

    await db.message.create({
        data: {
            payload,
            chatRoomId: chatRoomId,
            userId: session.id!,
        },
        select: {
            id: true,
        },
    });
}

export async function readMessages(chatRoomId: string) {
    const session = await getSession();
    await db.message.updateMany({
        where: {
            chatRoomId,
            userId: {
                not: session.id,
            },
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });

    revalidateTag("chat-rooms");
}
