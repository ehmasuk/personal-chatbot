"use client";

import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import { Button, message, notification } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function SourcesTab() {
    const [defaultValue, setDefaultValue] = useState("");

    const [newText, setText] = useState(null);

    const params = useParams();

    const { data: botData, loading } = useGet({ baseUrl: "https://escuela-ray-bolivar-sosa.com/api", endpoint: `/instructions?bot_id=${params.id}` });

    useEffect(() => {
        botData && setDefaultValue(botData.text_data || "");
    }, [botData]);

    const { postData, loading: postLoading } = usePost();

    const handleTextSubmit = async () => {
        message.loading({ content: "🤖 Training model, it may take a upto 10 minutes...", key: 1, duration: 10000 });

        postData({
            endpoint: "/text",
            data: { content: newText, bot_id: botData.bot_id },
            allowMessage: false,
            onSuccess: () => {
                message.destroy(1);

                message.loading({ content: "Finalizing training...", key: 2, duration: 10000 });

                postData({
                    baseUrl: "https://escuela-ray-bolivar-sosa.com/api",
                    endpoint: `/instructions?bot_id=${params.id}`,
                    allowMessage: false,
                    data: {
                        text_data: newText,
                        bot_name: botData.bot_name,
                        bot_id: botData.bot_id,
                    },
                    onSuccess: () => {
                        setText(null);
                        message.destroy(2);
                        message.success("Completed!");
                        notification.success({ message: "🥳Hurray!", description: "Your chatbot is trained with new knowledge", duration: 0, placement: "bottomRight" });
                    },
                });
            },
            onError: () => {
                message.destroy(1);
                message.error("Something went wrong..");
            },
        });
    };

    return (
        <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 w-full shadow-sm">
            <div className="flex flex-col space-y-1.5 md:p-6 p-2 border-b border-zinc-200">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Knowledge</h3>
            </div>
            <div className="md:p-6 p-2 pt-0">
                <textarea
                    disabled={postLoading || loading}
                    placeholder={loading ? "Loading..." : "Enter your text here..."}
                    className="my-2 min-h-[70vh] w-full min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white p-4 text-zinc-900 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 sm:text-sm"
                    defaultValue={defaultValue}
                    onChange={(e) => setText(e.target.value)}
                />
                <div className="flex justify-end">
                    <Button loading={postLoading} disabled={!newText} type="primary" onClick={handleTextSubmit}>
                        Train
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SourcesTab;
