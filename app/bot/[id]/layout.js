"use client";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

function BotLayout({ children }) {
    const items = [
        {
            key: "/bot/1",
            label: <Link href="/bot/1">Playground</Link>,
        },
        {
            key: "/bot/1/sources",
            label: <Link href="/bot/1/sources">Sources</Link>,
        },
        {
            key: "/bot/1/activity",
            label: <Link href="/bot/1/activity">Activity</Link>,
        },
    ];

    const pathName = usePathname();
    return (
        <div className="flex">
            <Menu
                style={{
                    minHeight: "100vh",
                    width: "250px",
                }}
                defaultSelectedKeys={pathName}
                mode="inline"
                theme="dark"
                items={items}
            />
            <div className="w-full">
                <div>
                    
                </div>
                <div className="p-10 bg-slate-100 h-full">{children}</div>
            </div>
        </div>
    );
}

export default BotLayout;
