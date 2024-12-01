"use client";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoBookOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { RiRobot3Line } from "react-icons/ri";

function BotLayout({ children }) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(window.innerHeight);
    }, []);

    const items = [
        {
            key: "/bot/1",
            label: <Link href="/bot/1">Playground</Link>,
            icon: <IoChatboxEllipsesOutline />,
        },
        {
            key: "/bot/1/instruction",
            label: <Link href="/bot/1/instruction">Instruction</Link>,
            icon: <RiRobot3Line />,
        },
        {
            key: "/bot/1/knowledge",
            label: <Link href="/bot/1/knowledge">Knowledge</Link>,
            icon: <IoBookOutline />,
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
