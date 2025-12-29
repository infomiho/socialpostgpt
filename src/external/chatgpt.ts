import OpenAI from "openai";
import { env } from "wasp/server";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const chatgpt = {
  async getResponse(prompt: string, temperature?: number) {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.1",
      temperature: temperature ?? 0.8,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates social media content and search queries for stock photos.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generate_social_media_content",
            description:
              "Generate search queries for stock photos and social media post content",
            parameters: {
              type: "object",
              properties: {
                queries: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Search queries for finding relevant stock photos",
                },
                content: {
                  type: "string",
                  description:
                    "The catchy social media post content with emojis and hashtags as requested",
                },
              },
              required: ["queries", "content"],
              additionalProperties: false,
            },
            strict: true,
          },
        },
      ],
      tool_choice: {
        type: "function",
        function: { name: "generate_social_media_content" },
      },
    });

    const toolCall = completion.choices[0].message.tool_calls?.[0];

    if (
      !toolCall ||
      toolCall.function.name !== "generate_social_media_content"
    ) {
      throw new Error(
        "Expected function call to generate_social_media_content",
      );
    }

    const functionArgs = JSON.parse(toolCall.function.arguments);

    return {
      text: JSON.stringify(functionArgs),
    };
  },
};
