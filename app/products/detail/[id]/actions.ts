"use server";

import db from "@/lib/db";

export async function getProduct(id: number) {
    const product = await db.product.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    username: true,
                    avatar: true,
                },
            },
        },
    });

    return product;
}

export async function getProductTitle(id: number) {
    const product = await db.product.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    username: true,
                    avatar: true,
                },
            },
        },
    });

    return product;
}

export async function deletePhoto(photoId: string) {
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
