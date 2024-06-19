"use client";

import { addComment, deleteComment, getUser } from "@/app/posts/[id]/actions";
import { CommentsType } from "@/app/posts/[id]/page";
import { CommentType, commentSchema } from "@/app/posts/[id]/schema";
import Button from "@/components/button";
import Input from "@/components/input";
import { formatToTimeAge } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useOptimistic } from "react";
import { useForm } from "react-hook-form";

interface PostCommentsProps {
    postId: number;
    userId: number;
    comments: CommentsType;
}

export default function PostComments({
    postId,
    userId,
    comments,
}: PostCommentsProps) {
    const {
        register,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
        resetField,
    } = useForm<CommentType>({
        resolver: zodResolver(commentSchema),
    });

    const [state, reducerFn] = useOptimistic(
        comments,
        (prevState, payload: CommentsType) => {
            return [...prevState, ...payload];
        },
    );

    useEffect(() => {
        setValue("postId", postId);
    });

    const onSubmit = handleSubmit(async (data: CommentType) => {
        const formData = new FormData();
        formData.append("payload", data.payload);
        formData.append("postId", postId + "");

        const user = await getUser();

        if (!user) {
            return notFound();
        }

        reducerFn([
            {
                id: 0,
                payload: data.payload,
                postId,
                user,
                userId: user.id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);

        const erorrs = await addComment(formData);

        if (erorrs) {
            for (const [field, message] of Object.entries(erorrs.fieldErrors)) {
                setError(field as keyof CommentType, {
                    message: message.join(", "),
                });
            }
        }

        resetField("payload");
    });

    const onValid = async () => {
        await onSubmit();
    };

    const onDelete = (commentId: number) => {
        const ok = window.confirm("삭제하시겠습니까?");

        if (!ok) return;

        deleteComment(commentId, postId);
    };

    return (
        <>
            <div className="mb-36 px-5">
                {state.map((comment) => (
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
                                    {formatToTimeAge(
                                        comment.created_at.toString(),
                                    )}
                                </span>
                            </div>
                            {userId === comment.user.id ? (
                                <button
                                    onClick={() => onDelete(comment.id)}
                                    className="ml-auto rounded-md bg-red-500 px-3 py-1 font-medium transition-colors hover:bg-red-400"
                                >
                                    삭제
                                </button>
                            ) : null}
                        </div>
                        <p>{comment.payload}</p>
                    </div>
                ))}
            </div>
            <form
                action={onValid}
                className="fixed bottom-0 flex w-full max-w-screen-sm flex-col gap-3 bg-neutral-900 p-5"
            >
                <Input
                    placeholder="hello~"
                    type="text"
                    required
                    {...register("payload")}
                    errors={[errors.payload?.message ?? ""]}
                />
                <Button text="한마디 하기" />
            </form>
        </>
    );
}
