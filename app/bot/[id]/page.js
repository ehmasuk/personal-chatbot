"use client";

import ChatBox from "@/components/ChatBox";
import { useParams } from "next/navigation";

function Playground() {
    const params = useParams();

    const messages = [
        {
            robo: "1",
            body: "Hola, ¿en qué puedo ayudarte hoy?",
        },
    ];

    return (
        <div>
            <div
                style={{ backgroundColor: "#fafafa", opacity: 1, backgroundImage: "radial-gradient(#001aff 0.5px, #fafafa 0.5px)", backgroundSize: "10px 10px" }}
                className="w-full md:p-10 p-2 flex flex-col items-center justify-center border border-gray-200 rounded-lg"
            >
                <div className="z-20 h-[70vh] w-full md:max-w-md">
                    <ChatBox botId={params.id} initialMessages={messages} />
                </div>
            </div>
        </div>
    );
}

export default Playground;
