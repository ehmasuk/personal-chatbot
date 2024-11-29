import { OpenAIEmbeddings } from "@langchain/openai";

import { Pinecone } from "@pinecone-database/pinecone";

import { NextResponse } from "next/server";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const POST = async (req) => {
    try {
        const { content } = await req.json();

        // Validate content (ensure it's not empty)
        if (!content || content.trim().length === 0) {
            return NextResponse.json({ message: "Content cannot be empty" }, { status: 400 });
        }

        // Initialize Pinecone
        const pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });

        const embeddings = new OpenAIEmbeddings({
            apiKey: process.env.OPENAI_API_KEY,
            batchSize: 512,
            model: "text-embedding-ada-002", // A cost-effective model for embeddings
        });

        const pineconeIndex = pinecone.Index("lmschatbot");

        // Split text into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500, // Adjust based on your data size and query needs
            chunkOverlap: 50, // Overlap for better context retention
        });

        const chunks = await splitter.createDocuments([content.trim()]);

        // Generate embeddings for each chunk and prepare data for Pinecone
        const vectors = await Promise.all(
            chunks.map(async (chunk, idx) => {
                const embedding = await embeddings.embedQuery(chunk.pageContent);
                return {
                    id: `${Date.now()}-${idx}`, // Unique ID for each vector
                    values: embedding,
                    metadata: {
                        text: chunk.pageContent,
                        timestamp: new Date().toISOString(), // Optional metadata
                    },
                };
            })
        );

        try {
            await pineconeIndex.namespace("text-data").deleteAll();
        } catch (error) {
            console.log(error);
        }

        // Upsert vectors into Pinecone
        await pineconeIndex.namespace("text-data").upsert(vectors);

        return NextResponse.json({ message: "Data successfully indexed in chunks!" }, { status: 201 });
    } catch (error) {
        console.error("Error indexing data:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
