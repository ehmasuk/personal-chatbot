import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { SqlDatabase } from "langchain/sql_db";
import { QuerySqlTool } from "langchain/tools/sql";
import { NextResponse } from "next/server";
import { DataSource } from "typeorm";
import { z } from "zod";

export const POST = async (req) => {
    const { question, history } = await req.json();

    if (!question || !history) {
        return NextResponse.json({ message: "question, history cannot be empty" }, { status: 400 });
    }

    const chatHistory = history.slice(-5).map((entry) => {
        if (entry.role === "user") {
            return new HumanMessage(entry.message);
        } else if (entry.role === "bot") {
            return new AIMessage(entry.message);
        }
    });

    try {
        const datasource = new DataSource({
            type: "mysql",
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT, 10),
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });

        // Create the SQL database instance from the data source
        const db = await SqlDatabase.fromDataSourceParams({
            appDataSource: datasource,
        });

        // create model
        const llm = new ChatOpenAI({
            modelName: "gpt-4o-mini",
            temperature: 0,
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        const Table = z.object({
            names: z.array(z.string()).describe("Names of tables in SQL database"),
        });

        const tablesToUse = [
            "courses",
            "users",
            "orders",
            "order_items",
            "course_student",
            "new_blogs",
            "newblog_comments",
            "newblog_course",
            "assignments",
            "chapter_comment_replies",
            "chapter_comments",
            "chapters",
            "complete_lessons",
            "coursecompletes",
            "data_mls",
            "direct_accesses",
            "like_dislikelessons",
            "lessons",
            "like_dislikes",
            "likes",
            "lms_subscribers",
            "lms_trials",
            "mind_map_chapters",
            "mind_map_books",
            "order_offers",
            "stripe_plans",
            "trial_courses",
            "user_email_varifieds",
        ];

        const tableNames = tablesToUse.join("\n");

        const promptToGetQuestionReleventTables = ChatPromptTemplate.fromMessages([
            [
                "system",
                `Return the names of ALL the SQL tables that MIGHT be relevant to the user question.
        The tables are:
        ${tableNames}`,
            ],
            new MessagesPlaceholder("history"),
            ["human", "{input}"],
        ]);

        const tableChain = promptToGetQuestionReleventTables.pipe(llm.withStructuredOutput(Table));

        const relevantTables = await tableChain.invoke({ input: question, history: chatHistory });

        const queryPromptTemplate = await pull("langchain-ai/sql-query-system-prompt");

        const queryOutput = z.object({
            query: z.string().describe("Syntactically valid SQL query."),
        });

        const structuredLlm = llm.withStructuredOutput(queryOutput);

        const writeQuery = async (state) => {
            const promptValue = await queryPromptTemplate.invoke({
                dialect: db.appDataSourceOptions.type,
                top_k: 5,
                table_info: await db.getTableInfo(relevantTables?.names),
                input: state.question,
            });
            console.log(promptValue);
            const result = await structuredLlm.invoke(promptValue);
            return { query: result.query };
        };

        const queryInSqlFormet = await writeQuery({ question });

        const executeQuery = async (state) => {
            const executeQueryTool = new QuerySqlTool(db);
            return { result: await executeQueryTool.invoke(state.query) };
        };

        const sqlQueryResult = await executeQuery(queryInSqlFormet);

        const generateAnswer = async (state) => {
            const promptValue = `You are a helpful and intelligent assistant. Based on the following user question, corresponding SQL query, and SQL result, generate an answer that:
- Directly addresses the user's query based on the SQL result, if applicable.
- Includes only unique values from the SQL result when summarizing.
- If the user's query is conversational, off-topic, or not related to the SQL data, respond naturally and conversationally without referencing the SQL data.
Ensure your response is concise, relevant, and helpful.
User Question: ${state.question}
SQL Query: ${state.query}
SQL Result: ${state.result}
`;

            const response = await llm.invoke(promptValue);
            console.log(response);
            return { answer: response.content };
        };

        const result = await generateAnswer({
            question,
            query: queryInSqlFormet.query,
            result: JSON.stringify(sqlQueryResult.result),
        });

        console.log({ relevantTables: relevantTables.names, result, query: queryInSqlFormet, queryResult: sqlQueryResult });

        return NextResponse.json(result?.answer, { status: 200 });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: error, status: 500 });
    }
};
