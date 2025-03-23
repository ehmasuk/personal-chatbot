"use client";
import { stringFormatter } from "@/helpers/helperFunctions";
import usePost from "@/hooks/usePost";
import axios from "axios";
import Cookies from "js-cookie";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoPaperAirplane } from "react-icons/go";

function ChatBox({ initialMessages, botId }) {
    const [userMessage, setUserMessage] = useState("");
    const { postData } = usePost();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const usersUrlLocation = searchParams.get("newchotbot_page_slug");
    const usersBookChapterId = searchParams.get("book_chapter");
    const lmsUsersId = searchParams.get("user_id");
    const chatBoxBodyRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        chatBoxBodyRef.current?.scrollTo({
            top: chatBoxBodyRef.current.scrollHeight,
        });
    }, []);

    const [conversations, setConversations] = useState(initialMessages);

    const [loading, setLoading] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userMessage.trim()) return;

        const message = userMessage.trim();

        setUserMessage("");

        const newUserMessage = {
            robo: "0",
            body: message,
        };

        setConversations((prev) => {
            return [...prev, newUserMessage];
        });

        saveConversationToDatabase({ message, role: "user" });

        try {
            setLoading(true);
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/chat", {
                bot_id: botId,
                question: message,
                history: conversations.map((e) => {
                    return { role: e.robo === "0" ? "user" : "bot", message: e.body };
                }),
                currentUrl: usersUrlLocation || window.location.href,
                bookChapterId: usersBookChapterId || null,
            });

            const botResponse = { robo: "1", body: response.data };
            setConversations((prev) => {
                return [...prev, botResponse];
            });
            saveConversationToDatabase({ message: response.data, role: "bot" });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const offerMessageWhenComesFromPost = {
        robo: "1",
        body: "🎉 ** ¡Felicidades! Te has ganado un descuento del 5% adicional, sumando un total de 15%! ** 🎉 💡 Compra el curso en este enlace y descubre la sorpresa que hemos preparado para ti. ❓ ¿Te esperará un nuevo descuento? ✍️ ¿Clases adicionales para escribir esa gran historia? 🎁 O quizás, simplemente, te recompensaremos por tu fidelidad. 👉** https://escuela-ray-bolivar-sosa.com/newcart/show?addDirectInCart=112 y descúbrelo ahora! ** ✨",
    };

    const userRedirectedFromPost = searchParams.get("redirected_from_post");

    const getUsersConversations = async (id) => {
        try {
            const res = await axios.get("https://escuela-ray-bolivar-sosa.com/api/chatbotconversation_cookie/" + id);
            if (res.data.length) {
                setConversations(res.data);
            }

            // show offer message when user comes from post
            if (userRedirectedFromPost) {
                setConversations((prev) => [...prev, offerMessageWhenComesFromPost]);
                saveConversationToDatabase({ message: offerMessageWhenComesFromPost.body, role: "bot" });

                const nextSearchParams = new URLSearchParams(searchParams.toString());
                nextSearchParams.delete("redirected_from_post");
                router.replace(`${pathname}?${nextSearchParams}`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [unableToSendMessage, setUnableToSendMessage] = useState(false);

    const conversationsRef = useRef(conversations);

    useEffect(() => {
        const handleSendMessageFromLms = (event) => {
            if (event.data?.message) {
                setConversations((prev) => [...prev, event.data.message]);
            }

            if (event.data?.removeSendButtonOnExceedMessage?.maxMessageLength < conversationsRef.current.length) {
                setUnableToSendMessage((prev) => {
                    if (!prev) {
                        setUnableToSendMessage(true);
                        setConversations((prev) => [...prev, event.data?.removeSendButtonOnExceedMessage?.message]);
                    }
                    return prev;
                });
            }
        };

        window.addEventListener("message", handleSendMessageFromLms);

        scrollToBottom();

        return () => {
            window.removeEventListener("message", handleSendMessageFromLms);
        };
    }, []);

    useEffect(() => {
        const cookieData = Cookies.get("conversation-with-chatbot");

        if (cookieData) {
            const parsedData = JSON.parse(cookieData);
            getUsersConversations(parsedData?.conversationId);
        } else {
            Cookies.set("conversation-with-chatbot", JSON.stringify({ conversationId: crypto.randomUUID() }), { expires: 1 });
        }
    }, []);

    // function to save conversation to database
    const saveConversationToDatabase = async ({ message, role }) => {
        const cookieData = Cookies.get("conversation-with-chatbot");

        if (cookieData && role === "user") {
            postData({
                baseUrl: "https://escuela-ray-bolivar-sosa.com/api",
                endpoint: "/chatbotmsg",
                data: { body: message, cookie: JSON.parse(cookieData).conversationId, user_id: lmsUsersId },
                allowMessage: false,
            });
        }

        if (cookieData && role === "bot") {
            postData({
                baseUrl: "https://escuela-ray-bolivar-sosa.com/api",
                endpoint: "/chatbotmsg",
                data: { body: message, cookie: JSON.parse(cookieData).conversationId, robo: true, user_id: lmsUsersId },
                allowMessage: false,
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
        conversationsRef.current = conversations;
    }, [conversations]);

    return (
        <div className="h-full w-full overflow-hidden rounded-lg border-[1px]">
            <main className="group relative flex h-full flex-col bg-white">
                <header
                    className="relative flex items-center justify-between px-5 text-black border-b border-gray-200"
                    style={{ background: "linear-gradient(0deg, rgba(0, 0, 0, 0.02) 0.44%, rgba(0, 0, 0, 0) 49.5%), rgb(255, 255, 255)" }}
                >
                    <div className="flex h-14 items-center">
                        <div className="flex items-center gap-2">
                            <h1 className="font-semibold text-sm">Chat bot</h1>
                            <div className="size-1.5 animate-ping rounded-full bg-green-500"></div>
                        </div>
                    </div>
                </header>
                <div className="relative flex flex-1 basis-full flex-col overflow-y-hidden scroll-smooth shadow-inner">
                    <div ref={chatBoxBodyRef} className="flex w-full flex-1 flex-col space-y-3 overflow-y-auto px-5 pt-5 pb-4 sm:overscroll-contain scroll-smooth">
                        {conversations?.map((item, index) => {
                            if (item.robo === "1") {
                                return (
                                    <div key={index} className="flex w-full items-end pr-8">
                                        <div className="group/message relative max-w-[min(calc(100%-40px),65ch)]">
                                            <div className="hyphens-auto break-words text-left text-sm leading-5 relative inline-block max-w-full rounded-[20px] rounded-bl px-5 py-4 bg-zinc-200/50 text-zinc-800">
                                                <div className="w-full text-sm">
                                                    <div dangerouslySetInnerHTML={{ __html: stringFormatter(item.body) }}></div>
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
                                        {item.body}
                                    </div>
                                );
                            }
                        })}
                        {loading && (
                            <div className="flex w-full items-end pr-8">
                                <div className="group/message relative max-w-[min(calc(100%-40px),65ch)]">
                                    <div className="hyphens-auto break-words text-left text-sm leading-5 relative inline-block max-w-full rounded-[20px] rounded-bl md:px-4 md:py-2 px-3 py-2 bg-zinc-200/50 text-zinc-800">
                                        <div className="w-full text-sm">
                                            <div>
                                                <div className="inline-flex gap-1 items-center animate-pulse">
                                                    <div className="h-1 w-1 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                    <div className="h-1 w-1 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                    <div className="h-1 w-1 bg-black rounded-full animate-bounce" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {!unableToSendMessage && (
                    <div className="flex shrink-0 flex-col justify-end">
                        <form onSubmit={handleSendMessage}>
                            <div className="flex min-h-16 items-end border-zinc-200 border-t">
                                <input
                                    readOnly={loading}
                                    className="flex w-full border-zinc-200 bg-white text-sm ring-offset-white sm:overscroll-contain placeholder:text-zinc-500 my-auto max-h-40 min-h-8 resize-none rounded-none border-0 placeholder-zinc-400 sm:text-sm outline-none pointer-events-auto overflow-y-auto p-3 !text-black"
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
                )}
            </main>
        </div>
    );
}

export default ChatBox;
