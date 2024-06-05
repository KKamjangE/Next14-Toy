"use server";

import z from "zod";
import fs from "fs/promises";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const productSchema = z.object({
    photo: z.string({
        required_error: "Photo is Required",
    }),
    title: z.string(),
    description: z.string(),
    price: z.coerce.number(),
});

export async function uploadProduct(prevState: any, formData: FormData) {
    const data = {
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description"),
    };

    if (data.photo instanceof File) {
        const photoData = await data.photo.arrayBuffer();
        if (photoData.byteLength === 0) {
            return {
                fieldErrors: {
                    photo: ["이미지를 등록해주세요!"],
                    title: [],
                    price: [],
                    description: [],
                },
            };
        }
        await fs.appendFile(
            `./public/${data.photo.name}`,
            Buffer.from(photoData),
        );
        data.photo = `/${data.photo.name}`;
    }

    const result = productSchema.safeParse(data);

    if (!result.success) {
        console.log(result.error.flatten());
        return result.error.flatten();
    } else {
        const session = await getSession();
        if (session.id) {
            const product = await db.product.create({
                data: {
                    title: result.data.title,
                    price: result.data.price,
                    description: result.data.description,
                    photo: result.data.photo,
                    user: {
                        connect: {
                            id: session.id,
                        },
                    },
                },
                select: {
                    id: true,
                },
            });

            redirect(`/products/${product.id}`);
            // redirect("/products");
        }
    }
}
