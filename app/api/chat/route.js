import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { NextResponse } from "next/server";

import { AIMessage, HumanMessage } from "@langchain/core/messages";

export const POST = async (req) => {
    const { bot_id, question, history, currentUrl } = await req.json();

    if (!bot_id || !question || !history || !currentUrl) {
        return NextResponse.json({ message: "bot_id, question, history,currentUrl cannot be empty" }, { status: 400 });
    }

    try {
        // create model
        const model = new ChatOpenAI({
            modelName: "gpt-3.5-turbo",
            temperature: 0,
            openAIApiKey: process.env.OPENAI_API_KEY,
            verbose: true,
            maxTokens: 1500,
        });

        // Initialize Pinecone
        const pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });

        const embeddings = new OpenAIEmbeddings({
            apiKey: process.env.OPENAI_API_KEY,
            model: "text-embedding-ada-002",
        });

        const pineconeIndex = pinecone.Index("lmschatbot");

        // Generate embedding for the user's question
        const questionEmbedding = await embeddings.embedQuery(question);

        const queryRequest = {
            vector: questionEmbedding,
            topK: 3,
            includeMetadata: true,
            includeValues: true,
        };

        // const searchResults = await pineconeIndex.query(queryRequest);

        const searchResults = await pineconeIndex.namespace(`chat-bot-${bot_id}`).query(queryRequest);

        // Format the retrieved data as context
        const contextData = searchResults.matches.map((match) => match.metadata.text).join("\n");

        const document1 = new Document({
            pageContent: contextData,
        });

        const deafultInstructions = `You are a helpful and conversational chatbot. 
        Answer user questions naturally without explicitly referencing any additional context unless specifically asked.
        If the question cannot be answered based on your knowledge, politely explain and guide the user to provide more specific information `;

        const instructions = await axios.get(`https://escuela-ray-bolivar-sosa.com/api/instructions?bot_id=${bot_id}`);

        // create prompt
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", "{instructions} and Context: {context}. El usuario está chateando actualmente desde esta URL: {usersCurrentUrl}"],
            new MessagesPlaceholder("history"),
            ["user", "{userQuestion}"],
        ]);

        // create chain
        const chain = await createStuffDocumentsChain({
            llm: model,
            prompt,
        });

        const chatHistory = history.slice(-5).map((entry) => {
            if (entry.role === "user") {
                return new HumanMessage(entry.message);
            } else if (entry.role === "bot") {
                return new AIMessage(entry.message);
            }
        });

        const result = await chain.invoke({
            instructions: instructions.data.instructions || deafultInstructions,
            userQuestion: question,
            context: [document1],
            history: chatHistory,
            usersCurrentUrl: currentUrl,
        });

        console.log(result);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 400 });
    }
};

export const GET = async () => {
    return NextResponse.json({ message: "Hello World" });
};
