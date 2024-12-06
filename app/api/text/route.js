import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import crypto from "crypto";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NextResponse } from "next/server";

// Function to generate unique IDs based on the chunk content
const generateId = (content) => crypto.createHash("md5").update(content).digest("hex");

export const POST = async (req) => {
    try {
        const { content } = await req.json();

        // Validate content
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
            model: "text-embedding-ada-002",
        });

        const pineconeIndex = pinecone.Index("lmschatbot");

        // Split text into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50,
        });

        const chunks = await splitter.createDocuments([content.trim()]);

        // Generate embeddings and prepare vectors with consistent IDs
        const vectors = await Promise.all(
            chunks.map(async (chunk) => {
                const embedding = await embeddings.embedQuery(chunk.pageContent);
                const id = generateId(chunk.pageContent); // Generate a consistent ID
                return {
                    id,
                    values: embedding,
                    metadata: {
                        text: chunk.pageContent,
                        timestamp: new Date().toISOString(),
                    },
                };
            })
        );

        // Delete existing data in Pinecone
        try {
            await pineconeIndex.namespace("text-data").deleteAll();
        } catch (error) {
            console.log(error);
        }

        // Batch upsert to handle 3MB limit
        const batchUpsert = async (vectors, pineconeIndex) => {
            const batchSize = 100;
            for (let i = 0; i < vectors.length; i += batchSize) {
                const batch = vectors.slice(i, i + batchSize);
                await pineconeIndex.namespace("text-data").upsert(batch);
            }
        };

        // Upsert in batches
        await batchUpsert(vectors, pineconeIndex);

        return NextResponse.json({ message: "Data successfully indexed in chunks!" }, { status: 201 });
    } catch (error) {
        console.error("Error indexing data:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
