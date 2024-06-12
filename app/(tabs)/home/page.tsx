import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

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

// export const dynamic = "force-dynamic"; // 빌드할때 강제로 동적 페이지로 만든다.

// export const revalidate = 60; // 60초마다 페이지를 재검증한다. (ISR)

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
