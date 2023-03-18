import { ChatGPTAPI } from 'chatgpt';

const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export const chatgpt = {
    async getResponse(prompt: string) {
        const res = await api.sendMessage(prompt);
        return res;
    },
};