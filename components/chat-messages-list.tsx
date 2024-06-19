"use client";

import { InitialMessages } from "@/app/chats/[id]/page";
import { readMessages, saveMessage } from "@/app/chats/[id]/actions";
import { formatToTimeAge } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SUPABASE_PUBLIC_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdWFkcWxremFrcGRnZ3Fpa3ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNDk1ODEsImV4cCI6MjAzMzkyNTU4MX0.ZMWbhYBNBIOoWfhnJ2EngcYcL9XAmEG3_YloPYUyP9k";

interface ChatMessagesListProps {
    chatRoomId: string;
    initialMessages: InitialMessages;
    userId: number;
    username: string;
    avatar: string;
}

export default function ChatMessagesList({
    chatRoomId,
    initialMessages,
    userId,
    username,
    avatar,
}: ChatMessagesListProps) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(initialMessages);
    const channel = useRef<RealtimeChannel>();

    useEffect(() => {
        const client = createClient(
            "https://wsuadqlkzakpdggqikvo.supabase.co",
            SUPABASE_PUBLIC_KEY,
        );
        channel.current = client.channel(`room-${chatRoomId}`);
        channel.current
            .on(
                "broadcast",
                { event: "message" },
                (payload) => {
                    setMessages((prev) => [...prev, payload.payload]);
                    readMessages(chatRoomId);
                }, // 상대방 채팅 보여주기
            )
            .subscribe();

        return () => {
            channel.current?.unsubscribe();
        };
    }, [chatRoomId]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value },
        } = event;
        setMessage(value);
    };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // 본인 채팅 보여주기
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                userId,
                payload: message,
                created_at: new Date(),
                user: {
                    username: "",
                    avatar: "",
                },
            },
        ]);
        // 상대방에게 채팅 보내기
        channel.current?.send({
            type: "broadcast",
            event: "message",
            payload: {
                payload: message,
                userId,
                created_at: new Date(),
                user: {
                    username,
                    avatar,
                },
            },
        });
        await saveMessage(message, chatRoomId);
        setMessage("");
    };

    return (
        <div className="flex min-h-screen flex-col justify-end gap-5 p-5">
            {messages.map((message, index) => (
                <div
                    key={index}
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
            <form onSubmit={onSubmit} className="relative flex">
                <input
                    type="text"
                    name="message"
                    required
                    onChange={onChange}
                    value={message}
                    className="h-10 w-full rounded-full border-none bg-transparent px-5 ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-50"
                    placeholder="Write a message..."
                />
                <button className="absolute right-0">
                    <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
                </button>
            </form>
        </div>
    );
}
