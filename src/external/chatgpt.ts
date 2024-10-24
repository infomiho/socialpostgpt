import { ChatGPTAPI } from "chatgpt";

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const chatgpt = {
  async getResponse(prompt: string, temperature?: number) {
    const res = await api.sendMessage(prompt, {
      completionParams: {
        temperature,
        model: "gpt-4o",
      },
      systemMessage: `You must respond ONLY with raw JSON that looks like this: { "queries": ["some search query", "other search query"], "content": "some catchy post content"} and no extra text or markup. Escape quotes with backslash.`,
    });
    return res;
  },
};
