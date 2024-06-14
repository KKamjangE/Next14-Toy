"use client";

import { InitialMessages } from "@/app/chats/[id]/page";
import Input from "@/components/input";
import { formatToTimeAge } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ChatMessagesListProps {
    initialMessages: InitialMessages;
    userId: number;
}

export default function ChatMessagesList({
    initialMessages,
    userId,
}: ChatMessagesListProps) {
    const [messages, setMessages] = useState(initialMessages);
    return (
        <div className="flex min-h-screen flex-col justify-end gap-5 p-5">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex items-start gap-2 ${userId === message.userId ? "justify-end" : ""}`}
                >
                    {userId === message.userId ? null : (
                        <Image
                            alt={message.user.username}
                            src={message.user.avatar!}
                            width={50}
                            height={50}
                            className="size-8 rounded-full"
                        />
                    )}
                    <div
                        className={`flex flex-col gap-1 ${userId === message.userId ? "items-end" : ""}`}
                    >
                        <span
                            className={`rounded-md ${userId === message.userId ? "bg-neutral-500" : "bg-orange-500"} p-2.5`}
                        >
                            {message.payload}
                        </span>
                        <span className="text-xs">
                            {formatToTimeAge(message.created_at.toString())}
                        </span>
                    </div>
                </div>
            ))}
            <form></form>
        </div>
    );
}
