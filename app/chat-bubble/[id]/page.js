import ChatBox from "@/components/ChatBox";

function ChatBubble() {
    const messages = [
        {
            role: "bot",
            id: 1,
            message: "Hola, ¿en qué puedo ayudarte hoy?",
            status: "success",
        },
    ];

    return <div className="h-screen">
        <ChatBox initialMessages={messages} />
    </div>;
}

export default ChatBubble;
