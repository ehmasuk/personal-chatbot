"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { GoPaperAirplane } from "react-icons/go";

function ChatBox({ initialMessages }) {
    const [userMessage, setUserMessage] = useState("");

    const [conversations, setConversations] = useState(initialMessages);

    const [loading, setLoading] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (userMessage.trim() !== "") {
            const message = userMessage.trim();

            setUserMessage("");

            const newUserMessage = {
                role: "user",
                id: crypto.randomUUID(),
                message,
                status: "success",
            };

            setConversations((prev) => {
                return [...prev, newUserMessage];
            });

            try {
                setLoading(true);
                const response = await axios.post("http://localhost:3000/api/chat", {
                    question: message,
                    history: conversations,
                });
                console.log({
                    question: message,
                    history: conversations,
                });
                const botResponse = {
                    role: "bot",
                    id: crypto.randomUUID(),
                    message: response.data,
                    status: "success",
                };
                setConversations((prev) => {
                    return [...prev, botResponse];
                });
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    };



    return (
        <div className="flex h-full w-full flex-col">
            <div className="flex h-full w-full flex-col">
                <div className="h-full w-full overflow-hidden rounded-lg border-[1px]">
                    <main className="group relative flex h-full flex-col bg-white">
                        <header
                            className="relative flex items-center justify-between px-5 text-black"
                            style={{ background: "linear-gradient(0deg, rgba(0, 0, 0, 0.02) 0.44%, rgba(0, 0, 0, 0) 49.5%), rgb(255, 255, 255)" }}
                        >
                            <div className="my-4 flex h-10 items-center">
                                <div className="flex flex-col justify-center gap-px">
                                    <h1 className="font-semibold text-sm">Chat bot</h1>
                                </div>
                            </div>
                        </header>
                        <div className="relative flex flex-1 basis-full flex-col overflow-y-hidden scroll-smooth shadow-inner">
                            <div className="flex w-full flex-1 flex-col space-y-5 overflow-y-auto px-5 pt-5 pb-4 sm:overscroll-contain">
                                {conversations?.map((message, index) => {
                                    if (message.role === "bot") {
                                        return (
                                            <div key={index} className="flex w-full items-end pr-8">
                                                <div className="group/message relative max-w-[min(calc(100%-40px),65ch)]">
                                                    <div className="hyphens-auto break-words text-left text-sm leading-5 relative inline-block max-w-full rounded-[20px] rounded-bl px-5 py-4 bg-zinc-200/50 text-zinc-800">
                                                        <div className="w-full text-sm">
                                                            <div>{message.message}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                key={index}
                                                className="hyphens-auto text-wrap break-words rounded-[20px] text-left text-sm leading-5 antialiased ml-auto rounded-br px-4 py-2 whitespace-pre border-zinc-200 font-sans max-w-[min(calc(100%-40px),65ch)]"
                                                style={{ backgroundColor: "rgb(59, 129, 246)", borderWidth: 0, color: "rgb(255, 255, 255)" }}
                                            >
                                                {message.message}
                                            </div>
                                        );
                                    }
                                })}
                                {loading && <span className="text-sm text-gray-600 !mt-1 animate-pulse">Writing..</span>}
                            </div>
                        </div>
                        <div className="flex shrink-0 flex-col justify-end">
                            <form onSubmit={handleSendMessage}>
                                <div className="flex min-h-16 items-end border-zinc-200 border-t">
                                    <input
                                        className="flex w-full border-zinc-200 bg-white text-sm ring-offset-white sm:overscroll-contain placeholder:text-zinc-500 my-auto max-h-40 min-h-8 resize-none rounded-none border-0 placeholder-zinc-400 sm:text-sm outline-none pointer-events-auto overflow-y-auto p-3"
                                        rows={1}
                                        placeholder="Ingresa tus consultas aquí..."
                                        style={{ height: 44 }}
                                        value={userMessage}
                                        onChange={(e) => setUserMessage(e.target.value)}
                                    />
                                    <button
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors text-zinc-50 h-9 w-9 my-3 mr-2 size-5 bg-transparent shadow-none hover:bg-zinc-100/90"
                                        type="submit"
                                    >
                                        <GoPaperAirplane className="text-zinc-700 text-lg" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default ChatBox;
