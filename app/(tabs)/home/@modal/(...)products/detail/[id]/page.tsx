import CloseButton from "@/components/close-button";
import db from "@/lib/db";
import { PhotoIcon } from "@heroicons/react/24/solid";
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
        <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60">
            <CloseButton />
            <div className="flex h-1/2 w-full max-w-screen-sm justify-center">
                <div className="flex aspect-square items-center justify-center rounded-md bg-neutral-700 text-neutral-200">
                    <PhotoIcon className="h-28" />
                </div>
            </div>
        </div>
    );
}
