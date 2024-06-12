"use server";

import { productSchema } from "@/app/products/add/schema";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function deletePhoto(photo: string) {
    const parts = photo.split("/");
    const photoId = parts[parts.length - 1];
    fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_FLARE_ACCOUNT_ID}/images/v1/${photoId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${process.env.CLOUD_FLARE_TOKEN}`,
            },
        },
    );
}

export async function deleteProduct(id: number) {
    const deletedProduct = await db.product.delete({
        where: { id },
        select: {
            photo: true,
        },
    });

    if (deletedProduct) {
        deletePhoto(deletedProduct.photo);
    }

    revalidatePath("/home");
    redirect("/home");
}

export async function updateProduct(formData: FormData) {
    const data = {
        id: formData.get("id"),
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description"),
    };

    const result = productSchema.safeParse(data);

    if (!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if (session.id) {
            const product = await db.product.update({
                where: {
                    id: result.data.id,
                },
                data: {
                    photo: result.data.photo,
                    price: result.data.price,
                    title: result.data.title,
                    description: result.data.description,
                },
                select: {
                    id: true,
                },
            });

            revalidateTag("product-detail");
            revalidatePath("/home");
            redirect(`/products/detail/${product.id}`);
        }
    }
}
