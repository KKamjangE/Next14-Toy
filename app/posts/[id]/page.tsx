import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToTimeAge } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";
import { Prisma } from "@prisma/client";
import PostComments from "@/components/post-comments";

async function getPost(id: number) {
    try {
        // update할 레코드를 찾지 못하면 에러를 반환한다.
        const post = await db.post.update({
            where: { id },
            data: {
                views: {
                    increment: 1, // 현재 값을 몰라도 + 1 할 수 있다.
                },
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
        });

        return post;
    } catch (e) {
        return null;
    }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
    revalidate: 60,
    tags: ["post-detail"],
});

async function getLikeStatus(postId: number) {
    const session = await getSession();
    const isLiked = await db.like.findUnique({
        where: {
            id: {
                postId,
                userId: session.id!,
            },
        },
    });

    const likeCount = await db.like.count({
        where: {
            postId,
        },
    });

    return {
        likeCount,
        isLiked: Boolean(isLiked),
    };
}

function getCachedLikeStatus(postId: number) {
    const cachedOperation = nextCache(getLikeStatus, ["post-like-status"], {
        tags: [`like-status-${postId}`],
    });

    return cachedOperation(postId);
}

async function getComments(postId: number) {
    const comments = await db.comment.findMany({
        where: {
            postId,
        },
        include: {
            user: {
                select: {
                    avatar: true,
                    username: true,
                    id: true,
                },
            },
        },
    });

    return comments;
}

function getCachedComments(postId: number) {
    const cachedOperation = nextCache(getComments, ["post-comments"], {
        tags: [`post-comments-${postId}`],
    });

    return cachedOperation(postId);
}

export type CommentsType = Prisma.PromiseReturnType<typeof getComments>;

export default async function PostDetail({
    params,
}: {
    params: { id: string };
}) {
    const id = Number(params.id);

    if (isNaN(id)) {
        return notFound();
    }

    const post = await getCachedPost(id);

    if (!post) {
        return notFound();
    }

    const { isLiked, likeCount } = await getCachedLikeStatus(id);

    const comments = await getCachedComments(id);

    const session = await getSession();

    return (
        <>
            <div className="p-5 text-white">
                <div className="mb-2 flex items-center gap-2">
                    <Image
                        width={28}
                        height={28}
                        className="size-7 rounded-full"
                        src={post.user.avatar!}
                        alt={post.user.username}
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                            {post.user.username}
                        </span>
                        <span className="text-xs">
                            {formatToTimeAge(post.created_at.toString())}
                        </span>
                    </div>
                </div>
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="mb-5">{post.description}</p>
                <div className="flex flex-col items-start gap-5 border-b border-neutral-500 pb-5">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <EyeIcon className="size-5" />
                        <span>조회 {post.views}</span>
                    </div>
                    <LikeButton
                        isLiked={isLiked}
                        likeCount={likeCount}
                        postId={id}
                    />
                </div>
            </div>
            <PostComments
                postId={id}
                userId={session.id!}
                comments={comments}
            />
        </>
    );
}
