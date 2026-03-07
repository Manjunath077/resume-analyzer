import { LLMService } from "../../features/analysis/domain/analysis.service";


export async function testLLMConnection() {
    const llm = new LLMService();
    return llm.testConnection();
}