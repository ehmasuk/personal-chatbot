import { Document } from "@langchain/core/documents";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder, PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

import { NextResponse } from "next/server";


export const POST = async (req) => {
    const { bot_id, question, history, currentUrl,bookChapterId } = await req.json();

    if (!bot_id || !question || !history || !currentUrl) {
        return NextResponse.json({ message: "bot_id, question, history,currentUrl cannot be empty" }, { status: 400 });
    }


    const getBookInformations = async (id) => {
        try {
            const res = await axios.get(`https://escuela-ray-bolivar-sosa.com/api/book-chapter/${id}`);
            return { 
                full_text: res.data.full_text || null,
                book_title: res.data.book.title || null,
                chapter_title:res.data.title || null
            };
            
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    try {
        // create model
        const model = new ChatOpenAI({
            modelName: "gpt-3.5-turbo",
            temperature: 0,
            openAIApiKey: process.env.OPENAI_API_KEY,
            verbose: true,
            maxTokens: 1500,
        });

        var bookDocument = null;

        const summarizeChapter = async (chunkText) => {
            const prompt = PromptTemplate.fromTemplate("Resume la siguiente sección de la novela de manera concisa, manteniendo los detalles clave y la coherencia de la historia. Context: {context}");

            const chain = await createStuffDocumentsChain({
                llm: model,
                prompt,
            });

            const result = await chain.invoke({
                context: [new Document({ pageContent: chunkText })],
            });

            return result;
        };


        if (bookChapterId) {
            const {full_text,book_title,chapter_title} = await getBookInformations(bookChapterId);
            if(full_text){
                const summary = await summarizeChapter(full_text);
                bookDocument = new Document({
                    pageContent: `
                    Título del libro: ${book_title}  
                    Título del capítulo: ${chapter_title}  
                    Este es un capítulo de una novela que el usuario está escribiendo. El resumen del capítulo es el siguiente:  
                    ${summary}`
                })
            } else {
                bookDocument = new Document({
                    pageContent: `
                    Título del libro: ${book_title}  
                    Título del capítulo: ${chapter_title}  
                    El usuario aún no ha escrito nada en este capítulo. No hay contenido para resumir.`
                });
            }
            

        }
        

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

        const searchResults = await pineconeIndex.namespace(`chat-bot-${bot_id}`).query(queryRequest);

        // Format the retrieved data as context
        const contextData = searchResults.matches.map((match) => match.metadata.text).join("\n");

        const document1 = new Document({
            pageContent: contextData,
        });

        const deafultInstructions = `You are a helpful and conversational chatbot. Answer user questions naturally without explicitly referencing any additional context unless specifically asked. If the question cannot be answered based on your knowledge, politely explain and guide the user to provide more specific information `;

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

        const allDocs = bookDocument ? [document1,bookDocument] : [document1];

        

        const result = await chain.invoke({
            instructions: instructions.data.instructions || deafultInstructions,
            userQuestion: question,
            context: allDocs,
            history: chatHistory,
            usersCurrentUrl: currentUrl,
        });

        console.log("context data ======> " + contextData);
        console.log("bot answer ========> " + result);
        console.log('allDocs=======================>',allDocs);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 400 });
    }
};

export const GET = async () => {
    return NextResponse.json({ message: "Hello World" });
};
