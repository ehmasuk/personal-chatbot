"use client";

import ChatBox from "@/components/ChatBox";
import { useParams } from "next/navigation";

function Playground() {
    const params = useParams();

    const messages = [
        {
            role: "bot",
            id: 1,
            message: "Hello, how can I assist you today?.",
            status: "success",
        },

    ];

    return (
        <div>
            <div
                style={{ backgroundColor: "#fafafa", opacity: 1, backgroundImage: "radial-gradient(#001aff 0.5px, #fafafa 0.5px)", backgroundSize: "10px 10px" }}
                className="w-full md:p-10 p-2 flex flex-col items-center justify-center border border-gray-200 rounded-lg"
            >
                <div className="z-20 h-[70vh] w-full md:max-w-md">
                    <ChatBox initialMessages={messages} />
                </div>
            </div>
        </div>
    );
}

export default Playground;
