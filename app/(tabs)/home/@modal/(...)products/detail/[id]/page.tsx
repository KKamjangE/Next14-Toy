import CloseButton from "@/components/close-button";
import db from "@/lib/db";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Modal({ params }: { params: { id: string } }) {
    const id = Number(params.id);

    if (isNaN(id)) {
        return notFound();
    }

    const product = await db.product.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    username: true,
                    avatar: true,
                },
            },
        },
    });

    if (!product) {
        return notFound();
    }

    return (
        <div className="absolute left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-60">
            <CloseButton />
            <div className="flex aspect-square h-1/2 w-full max-w-screen-sm flex-col justify-center">
                <div className="relative aspect-square">
                    <Image
                        src={`${product.photo}/public`}
                        alt={product.title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col bg-neutral-800 p-3">
                    <div className="flex items-center gap-3">
                        <div className="size-10 overflow-hidden rounded-full">
                            {product.user.avatar !== null ? (
                                <Image
                                    src={`${product.user.avatar}`}
                                    alt={product.user.username}
                                    width={40}
                                    height={40}
                                />
                            ) : (
                                <UserIcon />
                            )}
                        </div>
                        <h3>{product.user.username}</h3>
                    </div>
                    <div className="py-5">
                        <h1 className="text-2xl font-semibold">
                            {product.title}
                        </h1>
                        <p>{product.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                            {formatToWon(product.price)}원
                        </span>
                        <Link
                            href={``}
                            className="rounded-md bg-orange-500 px-5 py-2.5 font-semibold text-white"
                        >
                            채팅하기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
