import z from "zod";

export const ProfileSchema = z.object({
    username: z.string().trim().min(1, "username is required"),
});

export type ProfileType = z.infer<typeof ProfileSchema>;
