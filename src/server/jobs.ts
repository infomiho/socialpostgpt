// import { unsplash } from "./external/unsplash.js";
import { pexels } from "./external/pexels.js";
import { chatgpt } from "./external/chatgpt.js";
import { jobStatus } from "./types.js";
import { Generation } from "@wasp/entities";

export async function generateResultJob(
  args: { generationId: string },
  context: any
) {
  const { generationId } = args;
  console.log("Processing generation", generationId);
  try {
    const generation = await context.entities.Generation.findUnique({
      where: { id: generationId },
    });

    if (!generation) {
      throw new Error(`Generation ${generationId} not found`);
    }

    const options = getGenerationOptions(generation);

    console.log("Prompt found", generation.prompt);

    await context.entities.Generation.update({
      where: { id: generationId },
      data: {
        status: jobStatus.inProgress,
        retryTimes: { increment: 1 },
      },
    });

    await sleep(3000);

    const result = await getResultFromGPT(generation.prompt, options);

    console.log("Result from GPT", result);

    const searchResults = await pexels.search(result.query);

    if (!searchResults) {
      throw new Error("No search results found");
    }

    await context.entities.Generation.update({
      where: { id: generationId },
      data: {
        status: jobStatus.done,
        result: {
          create: {
            description: result.content,
            searchQuery: result.query,
            images: {
              create: searchResults.map((image) => ({
                url: image.url,
                downloadUrl: image.downloadUrl,
                providerId: image.id,
                provider: "pexels",
                author: {
                  create: {
                    name: image.author.name,
                    url: image.author.url,
                  },
                },
              })),
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error while creating the result", error);

    await context.entities.Generation.update({
      where: { id: generationId },
      data: {
        status: jobStatus.failed,
      },
    });

    throw error;
  }

  return { success: true };
}

type ChatGPTResponse = {
  query: string;
  content: string;
  hashtags: string[];
};

async function getResultFromGPT(
  userPrompt: string,
  options: GenerationOptions
): Promise<ChatGPTResponse> {
  const prompt = getPromptV3(userPrompt, options);

  const result = await chatgpt.getResponse(prompt);

  try {
    const parsedResult = JSON.parse(result.text) as ChatGPTResponse;
    return parsedResult;
  } catch (error) {
    throw new Error(
      `Invalid response from ChatGPT. Expected JSON, got: ${result.text}`
    );
  }
}

const getPromptV1 = (
  prompt: string
) => `Generate photo ideas for a social media post with the
following content "${prompt}".

Generate a search query that can be typed into Unsplash.com to find photos that match the prompt.

Next to the search query, also include a catchy social media post content that can be used along with the photos.

Respond only with JSON that looks like this: { "query": "some search query", "content": "some catchy post content" }`;

const getPromptV2 = (
  prompt: string
) => `You must respond ONLY with JSON that looks like this: \`\`\`{ "query": "some search query", "content": "some catchy post content", hashtags: ["one", "two"]}\`\`\` and no extra text.

Generate a search query that can be typed into stock photo websites that will find photos that fit the following content "${prompt}". Use generic words which are more likely to get results on the stock photos website. Put in the "query" field.

Write a professional and modern social media post content that can be used along with the photos. Include hashtags and emojis if appropriate. Put it in the "content" field.

Write appropriate hashtags and put them in the "hashtags" field.`;

const getPromptV3 = (prompt: string, options: GenerationOptions) => {
  const emojisPart = options.includeEmojis
    ? "Include appropriate emojis."
    : `Don't include emojis.`;
  const hashtagsPart = options.includeHashtags
    ? `Write appropriate hashtags and put them in the "hashtags" field.`
    : "Don't include hashtags.";
  const ctaPart = options.includeCTA
    ? `Include a call to action in the post.`
    : "Don't include a call to action in the content.";
  return `You must respond ONLY with JSON that looks like this: \`\`\`{ "query": "some search query", "content": "some catchy post content", hashtags: ["one", "two"]}\`\`\` and no extra text.

  Generate a search query that can be typed into stock photo websites that will find photos that fit the following content "${prompt}". Use generic keywords which are more likely to get results on the stock photos website. Put in the "query" field.
  
  Write a social media post content that can be used along with the photos. ${hashtagsPart} ${emojisPart} ${ctaPart} Put it in the "content" field.`;
};

type GenerationOptions = {
  includeEmojis: boolean;
  includeHashtags: boolean;
  includeCTA: boolean;
};

function getGenerationOptions(generation: Generation): GenerationOptions {
  try {
    return JSON.parse(generation.options);
  } catch (error) {
    return {
      includeEmojis: true,
      includeHashtags: true,
      includeCTA: false,
    };
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
