import ChatBox from "@/components/ChatBox";

function ChatBubble() {
    const messages = [
        {
            role: "bot",
            id: 1,
            message: "Hello, how can I assist you today?",
            status: "success",
        },
    ];

    return <ChatBox initialMessages={messages} />;
}

export default ChatBubble;
