import { unsplash } from "./external/unsplash.js";
import { pexels } from "./external/pexels.js";
import { chatgpt } from "./external/chatgpt.js";
import { ImageSearchResult, jobStatus } from "./types.js";
import { Generation } from "@wasp/entities";

export async function generateResultJob(
  args: { generationId: string },
  context: any
) {
  const { generationId } = args;
  console.log("[job] Processing generation", generationId);
  try {
    const generation = await context.entities.Generation.findUnique({
      where: { id: generationId },
    });

    if (!generation) {
      throw new Error(`[job] Generation ${generationId} not found`);
    }

    const options = getGenerationOptions(generation);

    console.log("[job] Prompt found", generation.prompt);

    await context.entities.Generation.update({
      where: { id: generationId },
      data: {
        status: jobStatus.inProgress,
        retryTimes: { increment: 1 },
      },
    });

    await sleep(3000);

    const result = await getResultFromGPT(generation.prompt, options);

    console.log("[job] Result from GPT", result);

    const images = await getStockPhotos(result.queries);

    await context.entities.Generation.update({
      where: { id: generationId },
      data: {
        status: jobStatus.done,
        result: {
          create: {
            description: result.content,
            searchQuery: JSON.stringify(result.queries),
            images: {
              create: images.map((image) => ({
                url: image.url,
                downloadUrl: image.downloadUrl,
                providerId: image.id,
                provider: image.provider,
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
    console.error("[job] Error while creating the result", error);

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
  queries: string[];
  content: string;
  hashtags: string[];
};

async function getResultFromGPT(
  userPrompt: string,
  options: GenerationOptions
): Promise<ChatGPTResponse> {
  const prompt = getPromptV3(userPrompt, options);

  console.log("[job] Prompt for GPT", prompt);

  const result = await chatgpt.getResponse(prompt, 0.8);

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
  console.log(prompt, options);
  const emojisPart = options.includeEmojis
    ? "Add some emojis where appropriate."
    : `Don't include emojis.`;
  const hashtagsPart = options.includeHashtags
    ? `Add appropriate hashtags at the end.`
    : "Don't include hashtags.";
  const ctaPart = options.includeCTA
    ? `Include a call to action in the post.`
    : "Don't include a call to action in the content.";
  const websiteAdjustment =
    options.adjustForSocialMediaWebsite &&
    options.adjustForSocialMediaWebsite !== "any"
      ? ` optimized for ${options.adjustForSocialMediaWebsite}`
      : "";
  return `You are a creative agency writer and are composing a social media post${websiteAdjustment} about "${prompt}". Write an engaging and professional post and find photos that fit the content.
Generate a 2 search queries to search for photos that fit the content. Be creative to get good stock photos. Two queries should be different. Put in the "queries" field.
Write the post content. ${hashtagsPart} ${emojisPart} ${ctaPart} Put it in the "content" field.
You must respond ONLY with JSON that looks like this: { "queries": ["some search query", "other search query"], "content": "some catchy post content"} and no extra text. Escape quotes with backslash.`;
};

type GenerationOptions = {
  includeEmojis: boolean;
  includeHashtags: boolean;
  includeCTA: boolean;
  adjustForSocialMediaWebsite?: string;
};

function getGenerationOptions(generation: Generation): GenerationOptions {
  try {
    return JSON.parse(generation.options);
  } catch (error) {
    return {
      includeEmojis: true,
      includeHashtags: true,
      includeCTA: false,
      adjustForSocialMediaWebsite: "",
    };
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Combines multiple queries and providers into a list of images
async function getStockPhotos(queries: string[]): Promise<ImageSearchResult[]> {
  const promises = queries
    .map((query) => [pexels.search(query), unsplash.search(query)])
    .flat();
  const results = await Promise.all(promises);
  const availableResults = results.filter((result) => result);
  if (availableResults.length === 0) {
    throw new Error("No search results found");
  }

  return sortImages(
    uniqueImages(availableResults.map((result) => result!.slice(0, 2)).flat())
  );
}

// Generate unique array of ImageSearchResult by url field
function uniqueImages(images: ImageSearchResult[]): ImageSearchResult[] {
  const unique = images.filter(
    (image, index, self) => index === self.findIndex((t) => t.url === image.url)
  );
  return unique;
}

function sortImages(images: ImageSearchResult[]): ImageSearchResult[] {
  const sortedImages = [...images];
  sortedImages.sort((a, b) => {
    if (a.provider === b.provider) {
      return a.id > b.id ? 1 : -1;
    }
    return a.provider === "pexels" ? 1 : -1;
  });
  return sortedImages;
}
