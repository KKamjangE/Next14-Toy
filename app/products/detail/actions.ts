"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";

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

export const getCachedProduct = nextCache(getProduct, ["product-detail"], {
    tags: ["product-detail"],
});

export async function getIsOwner(userId: number) {
    const session = await getSession();
    if (session.id) {
        return session.id === userId;
    }
    return false;
}
