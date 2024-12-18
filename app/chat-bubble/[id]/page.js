'use client'
import ChatBox from "@/components/ChatBox";
import { useParams } from "next/navigation";

function ChatBubble() {
    const params = useParams();

    const messages = [
        {
            robo: "1",
            body: "Hola, ¿en qué puedo ayudarte hoy?",
        },
    ];

    return (
        <div className="h-screen">
            <ChatBox botId={params.id} initialMessages={messages} />
        </div>
    );
}

export default ChatBubble;
