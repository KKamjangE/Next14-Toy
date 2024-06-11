import {
    deletePhoto,
    getProduct,
    getProductTitle,
} from "@/app/products/detail/[id]/actions";
import db from "@/lib/db";
import { formatToWon } from "@/lib/utils";
import { ChevronLeftIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";

// 사용자가 제품의 주인인지 확인하는 함수
async function getIsOwner(userId: number) {
    // const session = await getSession();
    // if (session.id) {
    //     return session.id === userId;
    // }
    return false;
}

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
    tags: ["product-detail"],
});

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
    tags: ["product-title"],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
    const product = await getCachedProductTitle(Number(params.id));
    return {
        title: `Product ${product?.title}`,
    };
}

export default async function ProductDetail({
    params,
}: {
    params: { id: string };
}) {
    const id = Number(params.id);

    if (isNaN(id)) {
        return notFound();
    }

    const product = await getCachedProduct(id);

    if (!product) {
        return notFound();
    }

    const isOwner = await getIsOwner(product.userId);

    async function deleteProduct() {
        "use server";

        const deletedProduct = await db.product.delete({
            where: { id },
            select: {
                photo: true,
            },
        });

        if (deletedProduct) {
            const parts = deletedProduct.photo.split("/");
            const photoId = parts[parts.length - 1];
            deletePhoto(photoId);
        }

        redirect("/home");
    }

    return (
        <div>
            <div className="relative aspect-square">
                <Image
                    fill
                    src={`${product.photo}/public`}
                    alt={product.title}
                    className="object-cover"
                />
                <Link
                    href="/home"
                    className="fixed left-0 top-0 m-5 text-white"
                >
                    <ChevronLeftIcon className="size-10" />
                </Link>
            </div>
            <div className="flex items-center gap-3 border-b border-neutral-700 p-5">
                <div className="size-10 overflow-hidden rounded-full">
                    {product.user.avatar !== null ? (
                        <Image
                            src={product.user.avatar}
                            width={40}
                            height={40}
                            alt={product.user.username}
                        />
                    ) : (
                        <UserIcon />
                    )}
                </div>
                <div>
                    <h3>{product.user.username}</h3>
                </div>
            </div>
            <div className="p-5">
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <p>{product.description}</p>
            </div>
            <div className="fixed bottom-0 left-0 flex w-full items-center justify-between bg-neutral-800 p-5 pb-10">
                <span className="text-lg font-semibold">
                    {formatToWon(product.price)}원
                </span>
                {isOwner && (
                    <form action={deleteProduct}>
                        <button className="rounded-md bg-red-500 px-5 py-2.5 font-semibold text-white">
                            Delete product
                        </button>
                    </form>
                )}
                <Link
                    href={``}
                    className="rounded-md bg-orange-500 px-5 py-2.5 font-semibold text-white"
                >
                    채팅하기
                </Link>
            </div>
        </div>
    );
}

// 파라미터([id])가 뭔지 정의해준다. (SSG)
// 새로운 product가 생성되면 해당 페이지는 dynamic 페이지가 되었다가 HTML로 저장되고 이후에는 static 페이지로 취급된다.
export async function generateStaticParams() {
    const products = await db.product.findMany({
        select: {
            id: true,
        },
    });
    return products.map((product) => ({ id: product.id + "" }));
}
