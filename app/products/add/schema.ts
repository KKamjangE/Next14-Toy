import z from "zod";

export const productSchema = z.object({
    id: z.coerce.number().optional(),
    photo: z.string({
        required_error: "Photo is required",
    }),
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().min(1, "Description is required"),
    price: z.coerce.number().min(1, "Price is requried"),
});

export type ProductType = z.infer<typeof productSchema>; // zod schema로 type을 만들어준다.
