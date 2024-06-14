import z from "zod";

export const commentSchema = z.object({
    postId: z.coerce.number(),
    payload: z.string({ required_error: "Comment is required" }),
});

export type CommentType = z.infer<typeof commentSchema>;
