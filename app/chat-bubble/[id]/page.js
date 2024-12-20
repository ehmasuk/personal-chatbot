"use client";
import ChatBox from "@/components/ChatBox";
import useGet from "@/hooks/useGet";
import { useParams } from "next/navigation";

function ChatBubble() {
    const params = useParams();

    const { data } = useGet({ baseUrl: "https://escuela-ray-bolivar-sosa.com/api", endpoint: `/instructions?bot_id=${params.id}` });

    const messages = [
        {
            robo: "1",
            body: data?.initial_message,
        },
    ];

    return <div className="h-screen">{data && <ChatBox botId={params.id} initialMessages={messages} />}</div>;
}

export default ChatBubble;
