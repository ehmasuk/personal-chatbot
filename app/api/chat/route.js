import { Document } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    const { question, history } = await req.json();

    // create model
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0.7,
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

    const searchResults = await pineconeIndex.namespace("text-data").query(queryRequest);

    // Format the retrieved data as context
    const contextData = searchResults.matches.map((match) => match.metadata.text).join("\n");

    const document1 = new Document({
        pageContent: contextData,
    });

    const deafultInstructions = `You are a helpful and conversational chatbot. 
        Answer user questions naturally without explicitly referencing any additional context unless specifically asked.
        If the question cannot be answered based on your knowledge, politely explain and guide the user to provide more specific information.`;

    // create prompt
    const prompt = ChatPromptTemplate.fromTemplate(`{instructions}
        Context: {context}
        Chat history: {history}
        Question: {userQuestion}
    `);

    // create chain
    const chain = await createStuffDocumentsChain({
        llm: model,
        prompt,
    });

    const result = await chain.invoke({
        instructions: deafultInstructions,
        userQuestion: question,
        context: [document1],
        history: history.map((message) =>
            message.role === "user" ? message.message : message.message
        ).join("\n"),
    });

    console.log(result);

    return NextResponse.json(result, { status: 200 });
};
