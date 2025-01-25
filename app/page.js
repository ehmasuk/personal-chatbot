"use client";

import { logout } from "@/actions/authActions";
import useGet from "@/hooks/useGet";
import { Button, message, Skeleton } from "antd";
import Link from "next/link";
import { BiLogOut } from "react-icons/bi";

function HomePage() {
    const { data: allBots, loading } = useGet({ baseUrl: "https://escuela-ray-bolivar-sosa.com/api", endpoint: "/allchatbots" });

    const handleLogout = async () => {
        try {
            logout();
            message.success("Logged out");
        } catch (error) {
            message.error("Something went wrong");
        }
    };

    return (
        <div>
            <div className="mx-auto max-w-5xl px-4">
                <div className="flex align-center justify-between my-6">
                    <div>
                        <h4 title={`${process.env.ENV}`} className="text-3xl font-bold flex items-center gap-3">
                            Chatbots
                        </h4>
                    </div>
                    {/* <form action="#" className="flex gap-1 items-center">
                        <input type="text" className="border border-gray-300 px-4 py-2 w-full outline-none" placeholder="Chatbot name" />
                        <button className="bg-black text-white font-semibold px-4 py-2 hover:bg-slate-700 min-w-28">Create</button>
                    </form> */}
                    <Button onClick={() => handleLogout()} type="text" icon={<BiLogOut fontSize={20} />}>
                        Logout
                    </Button>
                </div>
                <div className="my-8 grid w-full grid-cols-2 gap-8 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3">
                    {allBots?.map((bot, index) => {
                        return (
                            <Link href={`/bot/${bot.bot_id}`} key={index}>
                                <div className="relative flex w-40 flex-col justify-between overflow-hidden rounded border">
                                    <div className="w-full h-[100px] flex items-center justify-center bg-blue-50">
                                        <img src={`https://robohash.org/${bot.bot_name}`} alt="bot avatar" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex h-14 items-center justify-center px-1">
                                        <h3 className="m-auto overflow-hidden text-center text-xs font-semibold md:text-sm">{bot.bot_name}</h3>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                    {loading && (
                        <>
                            <Skeleton active />
                            <Skeleton active />
                            <Skeleton active />
                            <Skeleton active />
                        </>
                    )}

                    {/* masterbot */}
                    <Link href={`/master-bot`}>
                        <div className="relative flex w-40 flex-col justify-between overflow-hidden rounded border">
                            <div className="w-full h-[100px] flex items-center justify-center bg-blue-50">
                                <img src={`https://robohash.org/masterbot`} alt="bot avatar" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex h-14 items-center justify-center px-1">
                                <h3 className="m-auto overflow-hidden text-center text-xs font-semibold md:text-sm">Master bot</h3>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
