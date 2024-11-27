"use client";

import ChatBox from "@/components/ChatBox";
import { useParams } from "next/navigation";

function Playground() {
    const params = useParams();

    const messages = [
        {
            role: "bot",
            id: 1,
            message: "Hello, how can I assist you today?",
            status: "success",
        },

    ];

    return (
        <div>
            <div className="mx-auto flex max-w-7xl flex-row justify-between">
                <h4 className="mb-6 text-3xl font-bold">Playground</h4>
            </div>
            <div
                style={{ backgroundColor: "#fafafa", opacity: 1, backgroundImage: "radial-gradient(#001aff 0.5px, #fafafa 0.5px)", backgroundSize: "10px 10px" }}
                className="w-full p-10 flex flex-col items-center justify-center border border-gray-200 rounded-lg"
            >
                <div className="z-20 h-[70vh] w-full md:max-w-md">
                    <ChatBox initialMessages={messages} />
                </div>
            </div>
        </div>
    );
}

export default Playground;
