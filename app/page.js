import Link from "next/link";

function HomePage() {
    return (
        <div>
            <div className="mx-auto max-w-5xl px-4">
                <div className="flex align-center justify-between my-6">
                    <div>
                        <h4 className="text-3xl font-bold">Chatbots</h4>
                    </div>
                    <form action="#" className="flex gap-1 items-center hidden">
                        <input type="text" className="border border-gray-300 px-4 py-2 w-full outline-none" placeholder="Chatbot name" />
                        <button className="bg-black text-white font-semibold px-4 py-2 hover:bg-slate-700 min-w-28">Create</button>
                    </form>
                </div>
                <div className="my-8 grid w-full grid-cols-2 gap-8 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3">
                    <Link href="/bot/1">
                        <div className="relative flex w-40 flex-col justify-between overflow-hidden rounded border">
                            <div className="w-full h-[100px] flex items-center justify-center bg-blue-50">
                                <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 256 256">
                                    <defs>
                                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" style={{ stopColor: "rgba(255, 0, 254, 1)", stopOpacity: 1 }} />
                                            <stop offset="100%" style={{ stopColor: "rgba(147, 51, 234, 1)", stopOpacity: 1 }} />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        fill="url(#grad1)"
                                        d="M232 93.17c0 41-29.69 52.47-53.55 61.67c-8.41 3.24-16.35 6.3-22.21 10.28c-11.39 7.72-18.59 21.78-25.55 35.38c-9.94 19.42-20.23 39.5-43.17 39.5c-12.91 0-24.61-11.64-33.85-33.66s-14.31-51-13.61-77.45c1.08-40.65 14.58-62.68 25.7-74c14.95-15.2 35.24-25.3 58.68-29.2c21.79-3.62 44.14-1.38 62.93 6.3C215.73 43.6 232 65.9 232 93.17"
                                    />
                                </svg>
                            </div>
                            <div className="flex h-14 items-center justify-center px-1">
                                <h3 className="m-auto overflow-hidden text-center text-xs font-semibold md:text-sm">Chatbot</h3>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
