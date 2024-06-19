import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToTimeAge } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

async function getChatRooms() {
    const session = await getSession();

    const chatRooms = await db.chatRoom.findMany({
        where: {
            users: {
                some: { id: session.id },
            },
        },
        select: {
            id: true, // 채팅방으로 이동하기 위한 ID
            _count: {
                // 안 읽은 상대방 메시지 개수
                select: {
                    messages: {
                        where: {
                            isRead: false,
                            userId: {
                                not: session.id,
                            },
                        },
                    },
                },
            },
            messages: {
                // 최신 메시지, 날짜
                select: {
                    payload: true,
                    created_at: true,
                },
                take: 1,
                orderBy: {
                    created_at: "desc",
                },
            },
            users: {
                // 상대방 프로필
                where: {
                    id: {
                        not: session.id,
                    },
                },
                select: {
                    avatar: true,
                    username: true,
                },
            },
        },
    });

    return chatRooms;
}

export default async function Chat() {
    const chatRooms = await getChatRooms();

    return (
        <div>
            {chatRooms.map((chatRoom) => (
                <Link
                    key={chatRoom.id}
                    href={`chats/${chatRoom.id}`}
                    className="relative flex gap-3 border-b border-neutral-500 p-5 *:text-white last:border-0"
                >
                    <Image
                        src={chatRoom.users[0].avatar!}
                        alt={chatRoom.users[0].username}
                        width={50}
                        height={50}
                        className="size-12 rounded-full"
                    />
                    {chatRoom._count.messages > 0 ? (
                        <span className="absolute left-14 top-4 h-5 w-5 rounded-full bg-red-500 text-center text-sm">
                            {chatRoom._count.messages}
                        </span>
                    ) : null}
                    <div className="flex w-full flex-col">
                        <span className="font-semibold">
                            {chatRoom.users[0].username}
                        </span>
                        <div className="flex justify-between">
                            <span>{chatRoom.messages[0].payload}</span>
                            <span>
                                {formatToTimeAge(
                                    chatRoom.messages[0].created_at.toString(),
                                )}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
