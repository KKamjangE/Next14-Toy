"use client";

import { HandThumbUpIcon as SolidHandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/posts/[id]/actions";

interface LikeButtonProps {
    isLiked: boolean;
    likeCount: number;
    postId: number;
}

export default function LikeButton({
    isLiked,
    likeCount,
    postId,
}: LikeButtonProps) {
    const [state, reducerFn] = useOptimistic(
        { isLiked, likeCount }, // 초기값
        // reducer
        (prevState, payload) => ({
            isLiked: !prevState.isLiked,
            likeCount: prevState.isLiked
                ? prevState.likeCount - 1
                : prevState.likeCount + 1,
        }),
    );

    const onSubmit = async () => {
        reducerFn(undefined);
        if (isLiked) {
            await dislikePost(postId);
        } else {
            await likePost(postId);
        }
    };

    return (
        <form action={onSubmit}>
            <button
                className={`flex items-center gap-2 rounded-full border border-neutral-400 p-2 text-sm text-neutral-400 ${state.isLiked ? "border-orange-500 bg-orange-500 text-white" : ""}`}
            >
                {state.isLiked ? (
                    <>
                        <SolidHandThumbUpIcon className="size-5" />
                        <span>{state.likeCount}</span>
                    </>
                ) : (
                    <>
                        <OutlineHandThumbUpIcon className="size-5" />
                        <span>공감하기 ({state.likeCount})</span>
                    </>
                )}
            </button>
        </form>
    );
}
