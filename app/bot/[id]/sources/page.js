"use client";

import { useState } from "react";

function SourcesTab() {
    const [textSource, setTextSource] = useState("");

    const handleTextSubmit = () => {
        console.log(textSource);
    };

    return (
        <div>
            <div className="mx-auto flex max-w-7xl flex-row justify-between px-4">
                <h4 className="my-6 text-3xl font-bold">Sources</h4>
            </div>
            <div className="mx-auto max-w-7xl px-4 grid grid-cols-12 gap-10">
                <div className="right-side-content-wraper col-span-12 lg:col-span-10">
                    {/* text */}
                    <div>
                        <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 w-full shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="text-2xl font-semibold leading-none tracking-tight">Text</h3>
                            </div>
                            <div className="p-6 pt-0">
                                <textarea
                                    placeholder="Enter text ..."
                                    rows={10}
                                    className="my-2 w-full min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white p-1 px-3 text-zinc-900 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 sm:text-sm"
                                    value={textSource}
                                    onChange={(e) => setTextSource(e.target.value)}
                                />

                                <div className="flex justify-end">
                                    <button onClick={handleTextSubmit} className="text-sm text-white bg-violet-500 rounded px-4 py-1">
                                        Submit
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
