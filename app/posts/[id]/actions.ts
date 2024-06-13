"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";

export const likePost = async (postId: number) => {
    const session = await getSession();
    try {
        await db.like.create({
            data: {
                postId,
                userId: session.id!,
            },
        });
        revalidateTag(`like-status-${postId}`);
    } catch (e) {
        // 중복 클릭 방지
    }
};

export const dislikePost = async (postId: number) => {
    const session = await getSession();
    try {
        await db.like.delete({
            where: {
                id: {
                    postId,
                    userId: session.id!,
                },
            },
        });
        revalidateTag(`like-status-${postId}`);
    } catch (e) {
        // 중복 클릭 방지
    }
};

export async function getComments(postId: number) {
    const comments = await db.comment.findMany({
        where: {
            postId,
        },
        include: {
            user: {
                select: {
                    avatar: true,
                    username: true,
                },
            },
        },
    });

    return comments;
}
