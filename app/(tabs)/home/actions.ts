"use server";

import db from "@/lib/db";

export async function getMoreProducts(page: number) {
    const products = db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        skip: page * 10, // 생략할 데이터의 개수
        take: 10, // 가져올 데이터의 개수
        orderBy: {
            // 정렬
            created_at: "desc",
        },
    });

    return products;
}
