"use client";

import { addComment, getUser } from "@/app/posts/[id]/actions";
import { CommentsType } from "@/app/posts/[id]/page";
import { CommentType, commentSchema } from "@/app/posts/[id]/schema";
import Button from "@/components/button";
import CommentList from "@/components/comment-list";
import Input from "@/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { notFound } from "next/navigation";
import { useEffect, useOptimistic } from "react";
import { useForm } from "react-hook-form";

interface CommentFormProps {
    postId: number;
    comments: CommentsType;
}

export default function CommentForm({ postId, comments }: CommentFormProps) {
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
    }, []);

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

    return (
        <div>
            <CommentList comments={state} />
            <form
                action={onValid}
                className="fixed bottom-0 left-0 flex w-full max-w-screen-sm flex-col gap-5 p-5"
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
        </div>
    );
}
