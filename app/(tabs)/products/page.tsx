import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

async function getInitialProducts() {
    const products = db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        take: 10, // 가져올 데이터 개수
        orderBy: {
            // 정렬
            created_at: "desc",
        },
    });

    return products;
}

// prisma를 활용하여 반환값의 타입을 가져온다.
export type InitialProducts = Prisma.PromiseReturnType<
    typeof getInitialProducts
>;

export default async function Products() {
    const initialProducts = await getInitialProducts();
    return <ProductList initialProducts={initialProducts} />;
}
