import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { createRetrieverTool } from "langchain/tools/retriever";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = async () => {
    const question = "can you give me advice me about my business?";

    const history = [
        { role: "user", message: "Hello, i need help" },
        { role: "bot", message: "Sure, i am here to help you!" },
        { role: "user", message: "can you create and account for me?" },
        { role: "bot", message: "Of course! I can help you register an account. Please provide me with your name and email address." },
        { role: "user", message: "my name is masuk" },
        { role: "bot", message: "Great! Can you please provide me with your email address as well?" },
    ];

    try {
        // create model
        const model = new ChatOpenAI({
            modelName: "gpt-3.5-turbo",
            temperature: 0,
            openAIApiKey: process.env.OPENAI_API_KEY,
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

        const searchResults = await pineconeIndex.namespace(`chat-bot-1`).query(queryRequest);

        // Format the retrieved data as context
        const contextData = searchResults.matches.map((match) => match.metadata.text).join("\n");

        console.log("contextData==>" + contextData);
        const retrieverTool = createRetrieverTool(contextData, {
            name: "context",
            description: "Use this tool to get context",
        });

        const chatHistory = history.slice(-5).map((entry) => {
            if (entry.role === "user") {
                return new HumanMessage(entry.message);
            } else if (entry.role === "bot") {
                return new AIMessage(entry.message);
            }
        });

        // Prompt Template
        const prompt = ChatPromptTemplate.fromMessages([
            ("system", "You are a helpful assistant."),
            new MessagesPlaceholder("history"),
            ("human", "{input}"),
            new MessagesPlaceholder("agent_scratchpad"),
        ]);

        // create added tool
        const adderSchema = z.object({
            name: z.string(),
            email: z.string(),
        });
        const adderTool = tool(
            async ({ name, email }) => {
                return "Your account created successfully! Your email is " + email + " and your password is asdf12345";
            },
            {
                name: "register_account",
                description: "You can register an users account with his name and email",
                schema: adderSchema,
            }
        );

        const tools = [adderTool, retrieverTool];

        const agent = await createOpenAIFunctionsAgent({
            llm: model,
            prompt,
            tools,
        });

        // Create the executor
        const agentExecutor = new AgentExecutor({
            agent,
            tools,
        });

        const response = await agentExecutor.invoke({
            input: question,
            history: chatHistory,
        });

        return NextResponse.json(response.output, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(error.message, { status: 400 });
    }
};
