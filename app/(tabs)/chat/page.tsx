import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToTimeAge } from "@/lib/utils";
import Image from "next/image";

async function getChatRooms() {
    const session = await getSession();

    const chatRooms = await db.chatRoom.findMany({
        where: {
            users: {
                some: { id: session.id },
            },
        },
        select: {
            id: true,
            messages: {
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
    console.log(chatRooms[0]);

    return (
        <div>
            {chatRooms.map((chatRoom) => (
                <div key={chatRoom.id}>
                    <Image
                        src={chatRoom.users[0].avatar!}
                        alt={chatRoom.users[0].username}
                        width={50}
                        height={50}
                        className="size-12 rounded-full"
                    />
                    <span>{chatRoom.users[0].username}</span>
                    <span>{chatRoom.messages[0].payload}</span>
                    <span>
                        {formatToTimeAge(
                            chatRoom.messages[0].created_at.toString(),
                        )}
                    </span>
                </div>
            ))}
        </div>
    );
}
