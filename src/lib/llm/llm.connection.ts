import { LLMService } from "./llm.services";


export async function testLLMConnection() {
    const llm = new LLMService();
    return llm.testConnection();
}