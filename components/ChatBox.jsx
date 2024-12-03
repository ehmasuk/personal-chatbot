"use client";
import { stringFormatter } from "@/helpers/helperFunctions";
import axios from "axios";
import { useRef, useState } from "react";
import { GoPaperAirplane } from "react-icons/go";

function ChatBox({ initialMessages }) {
    const [userMessage, setUserMessage] = useState("");

    const chatBoxBodyRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            chatBoxBodyRef.current.scrollTop = chatBoxBodyRef.current.scrollHeight;
        }, 100);
    };

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

            scrollToBottom();

            try {
                setLoading(true);
                const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/chat", {
                    question: message,
                    history: conversations.map((e) => {
                        return { role: e.role, message: e.message };
                    }),
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
                scrollToBottom();
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="h-full w-full overflow-hidden rounded-lg border-[1px]">
            <main className="group relative flex h-full flex-col bg-white">
                <header
                    className="relative flex items-center justify-between px-5 text-black"
                    style={{ background: "linear-gradient(0deg, rgba(0, 0, 0, 0.02) 0.44%, rgba(0, 0, 0, 0) 49.5%), rgb(255, 255, 255)" }}
                >
                    <div className="md:my-4 flex h-10 items-center">
                        <div className="flex items-center gap-2">
                            <h1 className="font-semibold text-sm">Ray masterclasses chat bot</h1>
                            <div className="size-1.5 animate-ping rounded-full bg-green-500"></div>
                        </div>
                    </div>
                </header>
                <div className="relative flex flex-1 basis-full flex-col overflow-y-hidden scroll-smooth shadow-inner">
                    <div ref={chatBoxBodyRef} className="flex w-full flex-1 flex-col space-y-3 overflow-y-auto md:px-5 md:pt-5 md:pb-4 p-2 sm:overscroll-contain scroll-smooth">
                        {conversations?.map((message, index) => {
                            if (message.role === "bot") {
                                return (
                                    <div key={index} className="flex w-full items-end pr-8">
                                        <div className="group/message relative max-w-[min(calc(100%-40px),65ch)]">
                                            <div className="hyphens-auto break-words text-left text-sm leading-5 relative inline-block max-w-full rounded-[20px] rounded-bl md:px-5 md:py-4 px-4 py-3 bg-zinc-200/50 text-zinc-800">
                                                <div className="w-full text-sm">
                                                    <div dangerouslySetInnerHTML={{ __html: stringFormatter(message.message) }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={index}
                                        className="hyphens-auto text-wrap break-words rounded-[20px] text-left text-sm leading-5 antialiased ml-auto rounded-br md:px-4 md:py-2 p-1 whitespace-pre border-zinc-200 font-sans max-w-[min(calc(100%-40px),65ch)]"
                                        style={{ backgroundColor: "rgb(59, 129, 246)", borderWidth: 0, color: "rgb(255, 255, 255)" }}
                                    >
                                        {message.message}
                                    </div>
                                );
                            }
                        })}
                        {loading && (
                            <div className="inline-flex gap-1 items-center animate-pulse">
                                <div className="h-1.5 w-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="h-1.5 w-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="h-1.5 w-1.5 bg-black rounded-full animate-bounce" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex shrink-0 flex-col justify-end">
                    <form onSubmit={handleSendMessage}>
                        <div className="flex min-h-16 items-end border-zinc-200 border-t">
                            <input
                                readOnly={loading}
                                className="flex w-full border-zinc-200 bg-white text-sm ring-offset-white sm:overscroll-contain placeholder:text-zinc-500 my-auto max-h-40 min-h-8 resize-none rounded-none border-0 placeholder-zinc-400 sm:text-sm outline-none pointer-events-auto overflow-y-auto p-3"
                                rows={1}
                                placeholder="Ingresa tus consultas aquí..."
                                style={{ height: 44 }}
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                            />
                            <button
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors text-zinc-50 h-9 w-9 my-3 mr-2 disabled:opacity-50 size-5 bg-transparent shadow-none hover:bg-zinc-100/90"
                                type="submit"
                                disabled={loading}
                            >
                                <GoPaperAirplane className="text-zinc-700 text-lg" />
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default ChatBox;
