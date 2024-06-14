import { CommentsType } from "@/app/posts/[id]/page";
import { formatToTimeAge } from "@/lib/utils";
import Image from "next/image";

export default function CommentList({ comments }: { comments: CommentsType }) {
    return (
        <>
            {comments.map((comment) => (
                <div key={comment.id} className="my-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Image
                            width={28}
                            height={28}
                            src={comment.user.avatar!}
                            alt={comment.user.username}
                            className="size-7 overflow-hidden rounded-full"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">
                                {comment.user.username}
                            </span>
                            <span className="text-xs">
                                {formatToTimeAge(comment.created_at.toString())}
                            </span>
                        </div>
                    </div>
                    <p>{comment.payload}</p>
                </div>
            ))}
        </>
    );
}
