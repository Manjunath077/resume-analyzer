// Purpose: Low level Groq API communication
// Flow:
// receive prompt
// ↓
// send request using llm.connection
// ↓
// return raw LLM response

import { groqClient } from "../llm.connection";
import { LLM_MODEL, LLM_MAX_TOKENS, LLM_TEMPERATURE, SYSTEM_PROMPT } from "../llm.constants";

export async function callGroq(prompt: string): Promise<string> {

  console.log("🚀 Calling GROQ LLM...");

  const completion = await groqClient.chat.completions.create({
    model: LLM_MODEL,

    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      {
        role: "user",
        content: prompt
      }
    ],

    temperature: LLM_TEMPERATURE,
    max_tokens: LLM_MAX_TOKENS,
    top_p: 0.9,
    stream: false
  });

  console.log("✅ GROQ LLM Response received");

  return completion.choices[0]?.message?.content || "";
}