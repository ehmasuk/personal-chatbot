"use client";

import { login } from "@/actions/authActions";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SlEmotsmile } from "react-icons/sl";

function LoginPage() {
    const router = useRouter();

    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        if (password) {
            try {
                await login({ password });
                message.success("Authentication successful");
                router.push("/");
            } catch (error) {
                message.error("Authentication failed");
            }
        } else {
            message.error("Please enter your password");
        }
    };

    return (
        <div className="bg-blue-100 flex h-screen items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-md rounded-md p-8">
                    <SlEmotsmile className="mx-auto text-blue-500" fontSize={50} />

                    <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
                    <form className="space-y-6 mt-4" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    name="email"
                                    type="email-address"
                                    autoComplete="email-address"
                                    className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;