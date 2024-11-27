import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

import { Document } from "@langchain/core/documents";
import axios from "axios";

export const POST = async (req) => {
    const { question, history } = await req.json();

    // create model
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0.7,
        openAIApiKey: process.env.OPENAI_API_KEY,
        verbose: true,
        // maxTokens: 1000,
    });

    const allData = await axios.get("https://eazybuy-rho.vercel.app/api/products");


    // create prompt
    const prompt = ChatPromptTemplate.fromTemplate(`
        You are a data analizer. Answer the question according to the context.
        Context: {context}
        Question: {userQuestion}
        History: {history}
    `);

    // knowledges
    const document1 = new Document({
        pageContent: JSON.stringify(allData.data),
    });

    // create chain
    const chain = await createStuffDocumentsChain({
        llm: model,
        prompt,
    });

    const result = await chain.invoke({
        userQuestion: question,
        context: [document1],
        history: history,
    });

    return NextResponse.json(result, { status: 200 });
};
