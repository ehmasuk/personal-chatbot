"use client";

import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import { Button } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function SourcesTab() {
    const [defaultValue, setDefaultValue] = useState("");

    const [newInstruction, setNewInstruction] = useState(null);

    const params = useParams();

    const { data: botData, loading } = useGet({ baseUrl: "https://escuela-ray-bolivar-sosa.com/api", endpoint: `/instructions?bot_id=${params.id}` });

    useEffect(() => {
        botData && setDefaultValue(botData.instructions || "");
        console.log(botData);
    }, [botData]);


    const { postData, loading: postLoading } = usePost();

    const handleInstructionSubmit = () => {
        postData({
            baseUrl: "https://escuela-ray-bolivar-sosa.com/api",
            endpoint: `/instructions?bot_id=${params.id}`,
            data: {
                instructions: newInstruction,
                bot_name: botData.bot_name,
                bot_id: botData.bot_id,
            },
        });
    };

    return (
        <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 w-full shadow-sm">
            <div className="flex flex-col space-y-1.5 md:p-6 p-2 border-b border-zinc-200">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Instructions</h3>

                <p className="text-sm text-red-500">Do not use long text in instructions. Also be carefull changing the instructions because it will directly affect to the bot performance.</p>
            </div>
            <div className="md:p-6 p-2 pt-0">
                <textarea
                    disabled={postLoading || loading}
                    rows={10}
                    placeholder={loading ? "Loading..." : "Enter your text here..."}
                    className="my-2 w-full min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white p-4 text-zinc-900 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 sm:text-sm"
                    defaultValue={defaultValue}
                    onChange={(e) => setNewInstruction(e.target.value)}
                />

                <div className="flex justify-end">
                    <Button loading={postLoading} disabled={!newInstruction} type="primary" onClick={handleInstructionSubmit}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SourcesTab;
