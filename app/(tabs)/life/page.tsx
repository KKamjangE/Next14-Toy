import db from "@/lib/db";
import { formatToTimeAge } from "@/lib/utils";
import {
    ChatBubbleBottomCenterIcon,
    HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { unstable_cache as nextCache } from "next/cache";
import Link from "next/link";

const getCachedPosts = nextCache(getPosts, ["posts"], {
    revalidate: 60,
});

async function getPosts() {
    const posts = await db.post.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            views: true,
            created_at: true,
            _count: {
                // 관계를 맺은 데이터의 개수를 알 수 있다.
                select: {
                    comments: true,
                    likes: true,
                },
            },
        },
    });

    return posts;
}

export const metadata = {
    title: "동네생활",
};

export default async function Life() {
    const posts = await getCachedPosts();
    return (
        <div className="flex flex-col p-5">
            {posts.map((post) => (
                <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="mb-5 flex flex-col gap-2 border-b border-neutral-500 pb-5 text-neutral-400 last:border-b-0 last:pb-0"
                >
                    <h2 className="text-lg font-semibold text-white">
                        {post.title}
                    </h2>
                    <p>{post.description}</p>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                            <span>
                                {formatToTimeAge(post.created_at.toString())}
                            </span>
                            <span>.</span>
                            <span>조회 {post.views}</span>
                        </div>
                        <div className="flex items-center gap-4 *:flex *:items-center *:gap-1">
                            <span>
                                <HandThumbUpIcon className="size-4" />
                                {post._count.likes}
                            </span>
                            <span>
                                <ChatBubbleBottomCenterIcon className="size-4" />
                                {post._count.comments}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
