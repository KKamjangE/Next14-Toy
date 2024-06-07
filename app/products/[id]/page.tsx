import { deletePhoto, getProduct } from "@/app/products/[id]/actions";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { ChevronLeftIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

// 사용자가 제품의 주인인지 확인하는 함수
async function getIsOwner(userId: number) {
    const session = await getSession();
    if (session.id) {
        return session.id === userId;
    }
    return false;
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

    const product = await getProduct(id);

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

        redirect("/products");
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
                    href="/products"
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
