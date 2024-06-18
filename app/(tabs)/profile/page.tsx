import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToTimeAge } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getUser() {
    const session = await getSession();
    if (session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id,
            },
        });
        if (user) {
            return user;
        }
    }
    notFound();
}

export default async function Profile() {
    const user = await getUser();

    const logOut = async () => {
        "use server";
        const session = await getSession();
        session.destroy();
        redirect("/");
    };

    return (
        <div className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-3">
                <Image
                    src={user.avatar!}
                    alt={user.username}
                    width={50}
                    height={50}
                    className="size-9 rounded-full"
                />
                <h1 className="text-lg font-semibold">{user?.username}</h1>
                <span className="ml-auto text-sm">
                    가입일: {formatToTimeAge(user.created_at.toString())}
                </span>
            </div>
            <div className="flex gap-5">
                <form action={logOut} className="w-full">
                    <button className="h-9 w-full rounded-md bg-red-500 text-sm font-semibold text-white transition-colors hover:bg-red-400">
                        Log out
                    </button>
                </form>
                <Link href={"/profile/edit"} className="w-full">
                    <button className="h-9 w-full rounded-md bg-sky-600 text-sm font-semibold text-white transition-colors hover:bg-sky-500">
                        Edit
                    </button>
                </Link>
            </div>
        </div>
    );
}
