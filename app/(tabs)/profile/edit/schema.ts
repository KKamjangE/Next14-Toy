import z from "zod";

export const ProfileSchema = z.object({
    username: z.string({ required_error: "username is required" }),
});

export type ProfileType = z.infer<typeof ProfileSchema>;
