"use client";

import ChatBox from "@/components/ChatBox";
import useGet from "@/hooks/useGet";
import { useParams } from "next/navigation";

function Playground() {
    const params = useParams();

    const { data } = useGet({ baseUrl: "https://escuela-ray-bolivar-sosa.com/api", endpoint: `/instructions?bot_id=${params.id}` });

    const messages = [
        {
            robo: "1",
            body: data?.initial_message,
        },
    ];

    return (
        <div>
            <div
                style={{ backgroundColor: "#fafafa", opacity: 1, backgroundImage: "radial-gradient(#001aff 0.5px, #fafafa 0.5px)", backgroundSize: "10px 10px" }}
                className="w-full md:p-10 p-2 flex flex-col items-center justify-center border border-gray-200 rounded-lg"
            >
                <div className="z-20 h-[70vh] w-full md:max-w-md">{data && <ChatBox botId={params.id} initialMessages={messages} />}</div>
            </div>
        </div>
    );
}

export default Playground;
