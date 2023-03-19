import { ChatGPTAPI } from "chatgpt";

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const chatgpt = {
  async getResponse(prompt: string, temperature?: number) {
    const res = await api.sendMessage(prompt, {
      completionParams: { temperature },
    });
    return res;
  },
};
