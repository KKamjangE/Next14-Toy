"use server";

import { commentSchema } from "@/app/posts/[id]/schema";
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

export async function getUser() {
    const session = await getSession();
    const user = await db.user.findUnique({
        where: {
            id: session.id,
        },
        select: {
            id: true,
            avatar: true,
            username: true,
        },
    });

    return user;
}

export async function addComment(formData: FormData) {
    const data = {
        postId: formData.get("postId"),
        payload: formData.get("payload"),
    };

    const result = commentSchema.safeParse(data);

    if (!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        await db.comment.create({
            data: {
                payload: result.data.payload,
                post: {
                    connect: {
                        id: result.data.postId,
                    },
                },
                user: {
                    connect: {
                        id: session.id,
                    },
                },
            },
        });
    }

    revalidateTag(`post-comments-${result.data.postId}`);
}

export async function deleteComment(commentId: number, postId: number) {
    await db.comment.delete({
        where: {
            id: commentId,
        },
    });

    revalidateTag(`post-comments-${postId}`);
}
