"use client";

import { message } from "antd";
import SkeletonInput from "antd/es/skeleton/Input";
import axios from "axios";
import { useEffect, useState } from "react";

function SourcesTab() {
    const [textSource, setTextSource] = useState("");
    const [instructionSource, setInstructionSource] = useState("");

    const [loading, setLoading] = useState(false);

    const getData = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https://escuela-ray-bolivar-sosa.com/api/instructions");
            console.log(res.data);
            setTextSource(res.data.text_data || "");
            setInstructionSource(res.data.instructions || "");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleTextSubmit = async () => {
        try {
            await axios.post("https://escuela-ray-bolivar-sosa.com/api/instructions", { text_data: textSource });
            await axios.post(process.env.NEXT_PUBLIC_API_URL + "/text", {content: textSource});
        } catch (error) {
            console.log(error);
        }finally{
            console.log('done');
        }
    };

    const handleInstructionSubmit = () => {
        console.log(instructionSource);
        message.success("done")
    };

    return (
        <div>
            <div className="mx-auto flex max-w-7xl flex-row justify-between px-4">
                <h4 className="my-6 text-3xl font-bold">Sources</h4>
            </div>
            <div className="mx-auto max-w-7xl px-4 grid grid-cols-12 gap-10">
                <div className="right-side-content-wraper col-span-12 lg:col-span-10 space-y-10">
                    {/* text */}
                    <div>
                        <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 w-full shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="text-2xl font-semibold leading-none tracking-tight">Instructions</h3>
                            </div>
                            <div className="p-6 pt-0">
                                {!loading ? (
                                    <textarea
                                        placeholder="Enter your instructions here..."
                                        rows={10}
                                        className="my-2 w-full min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white p-1 px-3 text-zinc-900 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 sm:text-sm"
                                        value={instructionSource}
                                        onChange={(e) => setInstructionSource(e.target.value)}
                                    />
                                ) : (
                                    <SkeletonInput className="min-h-40 !w-full" active={true} />
                                )}

                                <div className="flex justify-end">
                                    <button onClick={handleInstructionSubmit} className="text-sm text-white bg-violet-500 rounded px-4 py-1">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 w-full shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="text-2xl font-semibold leading-none tracking-tight">Text</h3>
                            </div>
                            <div className="p-6 pt-0">
                                {!loading ? (
                                    <textarea
                                        placeholder="Enter your text here..."
                                        rows={30}
                                        className="my-2 w-full min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white p-1 px-3 text-zinc-900 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 sm:text-sm"
                                        value={textSource}
                                        onChange={(e) => setTextSource(e.target.value)}
                                    />
                                ) : (
                                    <SkeletonInput className="min-h-40 !w-full" active={true} />
                                )}
                                <div className="flex justify-end">
                                    <button onClick={handleTextSubmit} className="text-sm text-white bg-violet-500 rounded px-4 py-1">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SourcesTab;
