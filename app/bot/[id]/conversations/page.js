"use client";

import { stringFormatter } from "@/helpers/helperFunctions";
import usePost from "@/hooks/usePost";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";

function Conversations() {
    const { postData } = usePost();

    const [conversations, setConversations] = useState(null);

    const [selectedThred, setSelectedThred] = useState(null);

    const getUsersConversations = async () => {
        try {
            const allConversations = await axios.get("https://escuela-ray-bolivar-sosa.com/api/chatbotthreads");
            setConversations(allConversations.data);
            console.log(allConversations);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsersConversations();
    }, []);

    const handleSelectThred = (messages) => {
        setSelectedThred(messages);
    };

    const handleLike = async (id) => {
        setSelectedThred((prev) => {
            const afterLiked = prev.map((item) => {
                if (item.id === id) {
                    return { ...item, like_dislike: { like_dislike: "1" } };
                }
                return item;
            });
            return afterLiked;
        });

        postData({
            baseUrl: "https://escuela-ray-bolivar-sosa.com/api",
            endpoint: "/chatbotconversation_like_dislike",
            data: { message_id: id, like_dislike: 1 },
            allowMessage: false,
        });
    };

    const handleDislike = async (id) => {
        setSelectedThred((prev) => {
            const afterLiked = prev.map((item) => {
                if (item.id === id) {
                    return { ...item, like_dislike: { like_dislike: "0" } };
                }
                return item;
            });
            return afterLiked;
        });

        postData({
            baseUrl: "https://escuela-ray-bolivar-sosa.com/api",
            endpoint: "/chatbotconversation_like_dislike",
            data: { message_id: id, like_dislike: 0 },
            allowMessage: false,
        });
    };

    return (
        <div className="border max-w-5xl mx-auto border-gray-200 bg-white overflow-hidden max-h-[94vh]">
            <p className="p-6 border-b border-gray-200 font-semibold text-xl">Chat history</p>
            <div className="!px-0 h-full grid w-full grid-cols-5 space-y-4 lg:space-y-0">
                <div className="col-span-2">
                    <div className="h-[34rem] overflow-y-auto overflow-x-hidden border-r border-b lg:border-b-0">
                        <ul className="w-full divide-y divide-zinc-200">
                            {conversations ? (
                                conversations.map((item, index) => {
                                    return (
                                        <li
                                            key={index}
                                            onClick={() => handleSelectThred(item.messages)}
                                            className={`relative cursor-pointer  p-6 py-5 pr-4 ${
                                                selectedThred && selectedThred[0]?.visitor === item?.messages[1]?.visitor ? "bg-zinc-100" : "bg-white hover:bg-zinc-100"
                                            }`}
                                        >
                                            <div className="flex flex-row gap-2">
                                                <div className="flex-1">
                                                    <div className="flex justify-between space-x-3">
                                                        <p className="w-1 flex-1 truncate font-semibold text-sm text-zinc-800">{item?.messages[1]?.body}</p>
                                                        <time dateTime="2024-12-10T09:47:05.288495+00:00" className="shrink-0 whitespace-nowrap text-sm text-zinc-500">
                                                            <span>{moment(item?.messages[0]?.updated_at).fromNow()}</span>
                                                        </time>
                                                    </div>
                                                    <div>
                                                        <p className="line-clamp-1 text-sm text-zinc-500">{item?.messages[0]?.body}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <p className="p-6">Loading...</p>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="flex grow justify-center col-span-3 relative">
                    <div className="relative mx-2 flex h-[34rem] w-full flex-col">
                        <div className="flex max-h-full w-full flex-col justify-between overflow-y-auto overflow-x-hidden border-zinc-200 p-2 pt-5">
                            {selectedThred ? (
                                selectedThred?.map((item, index) => {
                                    if (item.robo === "1") {
                                        return (
                                            <div key={index} className="mr-8 mb-8 flex justify-start">
                                                <div className="relative inline-block hyphens-auto break-words rounded-[20px] rounded-bl max-w-[min(calc(100%-40px),65ch)] bg-zinc-200/50 px-5 py-4 text-left text-sm leading-5 antialiased">
                                                    <div className="flex flex-col items-start gap-4 break-words">
                                                        <div className="prose dark:prose-invert w-full break-words text-left text-inherit">
                                                            <div className="w-full text-sm [&_table]:block [&_.katex-html]:overflow-x-auto [&_table]:overflow-x-auto">
                                                                <div className="prose-zinc prose group-data-[theme=dark]:prose-invert w-full text-sm [&_table]:block [&_.katex-html]:overflow-x-auto [&_table]:overflow-x-auto">
                                                                    <p dangerouslySetInnerHTML={{ __html: stringFormatter(item.body) }}></p>

                                                                    {/* start here */}
                                                                    <div className="absolute top-full align-middle rounded-xl bg-white p-0.5 text-zinc-800">
                                                                        {!item.like_dislike ? (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => handleLike(item.id)}
                                                                                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-zinc-100 hover:text-zinc-900 rounded-md mt-0.5 h-6 px-1"
                                                                                >
                                                                                    <FiThumbsUp className="text-zinc-600 h-4 w-4" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDislike(item.id)}
                                                                                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-zinc-100 hover:text-zinc-900 rounded-md mt-0.5 h-6 px-1"
                                                                                >
                                                                                    <FiThumbsDown className="text-zinc-600 h-4 w-4" />
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {item?.like_dislike?.like_dislike === "1" ? (
                                                                                    <>
                                                                                        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-zinc-100 hover:text-zinc-900 rounded-md mt-0.5 h-6 px-1">
                                                                                            <BiSolidLike className="text-blue-600 h-[18px] w-[18px]" />
                                                                                        </button>
                                                                                        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-zinc-100 hover:text-zinc-900 rounded-md mt-0.5 h-6 px-1">
                                                                                            <FiThumbsDown className="text-zinc-600 h-4 w-4" />
                                                                                        </button>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-zinc-100 hover:text-zinc-900 rounded-md mt-0.5 h-6 px-1">
                                                                                            <FiThumbsUp className="text-zinc-600 h-4 w-4" />
                                                                                        </button>
                                                                                        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-zinc-100 hover:text-zinc-900 rounded-md mt-0.5 h-6 px-1">
                                                                                            <BiSolidDislike className="text-blue-600 h-[18px] w-[18px]" />
                                                                                        </button>
                                                                                    </>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="-mt-4 absolute top-full w-full rounded-xl p-0.5 lg:w-fit" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={index} className="mb-5 ml-8 flex justify-end">
                                                <div className="relative inline-block hyphens-auto break-words rounded-[20px] rounded-br max-w-[min(calc(100%-40px),65ch)] bg-blue-600 px-5 py-4 text-left text-sm leading-5 antialiased">
                                                    <div className="flex flex-col items-start gap-4 break-words">
                                                        <div className="prose dark:prose-invert w-full break-words text-left text-inherit">
                                                            <div className="[&_a]:text-white [&_p]:text-white w-full text-sm [&_table]:block [&_.katex-html]:overflow-x-auto [&_table]:overflow-x-auto">
                                                                <div className="prose-zinc prose group-data-[theme=dark]:prose-invert w-full text-sm [&_table]:block [&_.katex-html]:overflow-x-auto [&_table]:overflow-x-auto">
                                                                    <p>{item.body}</p>
                                                                </div>
                                                            </div>
                                                            <div className="-mt-4 absolute top-full w-full rounded-xl p-0.5 lg:w-fit" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })
                            ) : (
                                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">Select conversation</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Conversations;
