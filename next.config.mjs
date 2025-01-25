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
        MYSQL_HOST: process.env.MYSQL_HOST,
        MYSQL_PORT: process.env.MYSQL_PORT,
        MYSQL_USER: process.env.MYSQL_USER,
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
        MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    },
    reactStrictMode: false,
};

export default nextConfig;
