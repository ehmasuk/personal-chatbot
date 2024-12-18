"use client";
import useGet from "@/hooks/useGet";
import { Menu } from "antd";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GiConversation } from "react-icons/gi";
import { IoBookOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { MdArrowBackIos } from "react-icons/md";
import { RiRobot3Line } from "react-icons/ri";

function BotLayout({ children }) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(window.innerWidth);
    }, []);

    const params = useParams();
    const router = useRouter();

    const { data } = useGet({ baseUrl: "https://escuela-ray-bolivar-sosa.com/api", endpoint: "/allchatbots" });

    useEffect(() => {
        if (data && !data.some((bot) => bot.bot_id === params.id)) {
            router.push("/");
        }
    }, [data]);

    const items = [
        {
            key: "/",
            label: <Link href="/">All bots</Link>,
            icon: <MdArrowBackIos />,
        },
        {
            key: `/bot/${params.id}`,
            label: <Link href={`/bot/${params.id}`}>Playground</Link>,
            icon: <IoChatboxEllipsesOutline />,
        },
        {
            key: `/bot/${params.id}/instruction`,
            label: <Link href={`/bot/${params.id}/instruction`}>Instruction</Link>,
            icon: <RiRobot3Line />,
        },
        {
            key: `/bot/${params.id}/knowledge`,
            label: <Link href={`/bot/${params.id}/knowledge`}>Knowledge</Link>,
            icon: <IoBookOutline />,
        },
        {
            key: `/bot/${params.id}/conversations`,
            label: <Link href={`/bot/${params.id}/conversations`}>Conversations</Link>,
            icon: <GiConversation />,
        },
    ];

    const pathName = usePathname();
    return (
        <div className="flex">
            <Menu
                style={{
                    minHeight: "100vh",
                    maxWidth: "200px",
                }}
                defaultSelectedKeys={pathName}
                mode="inline"
                theme="dark"
                items={items}
                inlineCollapsed={isReady > 540 ? false : true}
            />
            <div className="w-full">
                <div className="md:p-5 p-3 bg-slate-100 h-full">{children}</div>
            </div>
        </div>
    );
}

export default BotLayout;
