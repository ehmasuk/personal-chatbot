/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "robohash.org",
            },
        ],
    },
    env: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        MONGODB_ATLAS_URL: process.env.MONGODB_ATLAS_URL,
        PINECONE_API_KEY: process.env.PINECONE_API_KEY,
        AUTH_SECRET: process.env.AUTH_SECRET,
        PINECONE_INDEX_HOST: process.env.PINECONE_INDEX_HOST,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    },
    reactStrictMode: false,
};

export default nextConfig;
