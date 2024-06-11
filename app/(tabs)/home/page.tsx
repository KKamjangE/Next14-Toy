import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";
import Link from "next/link";

// 데이터베이스 접근 함수 캐싱하기
const getCachedProducts = nextCache(getInitialProducts, ["home-products"], {
    revalidate: 60,
});

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

export const metadata = {
    title: "Home",
};

export default async function Home() {
    const initialProducts = await getInitialProducts();
    return (
        <div>
            <ProductList initialProducts={initialProducts} />
            <Link
                href={"/products/add"}
                className="fixed bottom-24 right-8 flex size-16 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400"
            >
                <PlusIcon className="size-10" />
            </Link>
        </div>
    );
}
