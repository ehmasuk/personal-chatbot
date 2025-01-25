"use client";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import { Button, Spin } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
function TriggersPage() {
    const params = useParams();

    const [defaultValue, setDefaultValue] = useState("");
    const [isUpgareable, setIsUpgradeable] = useState(false);

    const { data: botData, loading } = useGet({ baseUrl: "https://escuela-ray-bolivar-sosa.com/api", endpoint: `/instructions?bot_id=${params.id}` });

    useEffect(() => {
        botData && setDefaultValue(botData);
    }, [botData]);

    const { postData, loading: postLoading } = usePost();

    const handleChange = (e) => {
        if (e.target.name == "offer_trigger") {
            setDefaultValue({ ...defaultValue, [e.target.name]: e.target.checked ? "1" : "0" });
        } else {
            setDefaultValue({ ...defaultValue, [e.target.name]: e.target.value });
        }
    };

    const handleTriggerSubmit = (e) => {
        e.preventDefault();
        postData({
            baseUrl: "https://escuela-ray-bolivar-sosa.com/api",
            endpoint: `/instructions?bot_id=${params.id}`,
            data: {
                bot_name: botData.bot_name,
                bot_id: botData.bot_id,
                ...defaultValue,
            },
            onSuccess: () => setIsUpgradeable(false),
        });
    };

    useEffect(() => {
        setIsUpgradeable(JSON.stringify(botData) !== JSON.stringify(defaultValue));
    }, [defaultValue]);

    return (
        <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 w-full shadow-sm">
            <div className="flex flex-col space-y-1.5 md:p-6 p-2 border-b border-zinc-200">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Triggers</h3>
            </div>
            <div className="md:p-6 p-2 pt-0">
                <Spin spinning={loading} tip="Loading...">
                    <form onSubmit={handleTriggerSubmit}>
                        <label className="inline-flex items-center me-5 cursor-pointer mb-6">
                            <input onChange={handleChange} name="offer_trigger" type="checkbox" defaultValue className="sr-only peer" checked={defaultValue?.offer_trigger == "1"} />
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                            <span className={`${defaultValue?.offer_trigger == "1" ? "text-purple-600" : "text-red-500"} ms-3 text-lg font-medium`}>
                                {defaultValue?.offer_trigger == "1" ? "Triggers are active" : "Triggers are inactive"}
                            </span>
                        </label>

                        <div class="mb-6">
                            <label class="block mb-2 text-sm font-medium text-gray-900">Popup ignore message</label>
                            <input
                                onChange={handleChange}
                                name="bot_msg_1"
                                type="text"
                                value={defaultValue?.bot_msg_1}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder={loading ? "Loading..." : "Enter your text here..."}
                            />
                        </div>
                        <div class="mb-6">
                            <label class="block mb-2 text-sm font-medium text-gray-900">Inactivity seconds</label>
                            <input
                                onChange={handleChange}
                                type="number"
                                name="bot_msg_1_seconds"
                                value={defaultValue?.bot_msg_1_seconds}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder={loading && "Loading..."}
                            />
                        </div>

                        <div class="mb-6">
                            <label class="block mb-2 text-sm font-medium text-gray-900">Discount message</label>
                            <input
                                onChange={handleChange}
                                name="bot_msg_2"
                                type="text"
                                value={defaultValue?.bot_msg_2}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder={loading ? "Loading..." : "Enter your text here..."}
                            />
                        </div>
                        <div class="mb-6">
                            <label class="block mb-2 text-sm font-medium text-gray-900">Discount amount</label>
                            <input
                                onChange={handleChange}
                                type="number"
                                name="final_discount"
                                value={defaultValue?.final_discount}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder={loading && "Loading..."}
                            />
                        </div>

                        {isUpgareable && (
                            <Button loading={postLoading} type="primary" htmlType="submit" className="mt-3">
                                Update
                            </Button>
                        )}
                    </form>
                </Spin>
            </div>
        </div>
    );
}

export default TriggersPage;
