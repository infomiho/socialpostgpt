import { generateResult } from "wasp/server/jobs";
import {
  type Generation,
  type Result,
  type Image,
  type ImageAuthor,
} from "wasp/entities";
import { HttpError } from "wasp/server";
import {
  type SubmitPrompt,
  type GetResult,
  type GetLatestResults,
} from "wasp/server/operations";
import { socialMediaWebsitesKeys } from "./socialMediaWebsites.js";

export const submitPrompt: SubmitPrompt<
  {
    description: string;
    includeEmojis: boolean;
    includeHashtags: boolean;
    includeCTA: boolean;
    adjustForSocialMediaWebsite: string;
  },
  { success: false } | { success: true; generationId: string }
> = async (args, context) => {
  try {
    const {
      description,
      includeEmojis,
      includeHashtags,
      includeCTA,
      adjustForSocialMediaWebsite,
    } = args;
    if (!socialMediaWebsitesKeys.includes(adjustForSocialMediaWebsite)) {
      throw new HttpError(400, "Invalid social media website");
    }
    if (description.length === 0) {
      throw new HttpError(400, "Description is too short");
    }
    if (description.length > 150) {
      throw new HttpError(400, "Description is too long");
    }
    const generation = await context.entities.Generation.create({
      data: {
        prompt: description.slice(0, 150),
        options: JSON.stringify({
          includeEmojis,
          includeHashtags,
          includeCTA,
          adjustForSocialMediaWebsite,
        }),
      },
    });
    generateResult.submit({ generationId: generation.id });
    return { success: true, generationId: generation.id };
  } catch (e) {
    return { success: false };
  }
};
export const getResult: GetResult<
  { generationId: string },
  | (Generation & {
      result:
        | (Result & {
            searchQuery: string[];
            images?: (Image & { author: ImageAuthor })[];
          })
        | null;
    })
  | null
> = async (args, context) => {
  const generation = await context.entities.Generation.findUnique({
    where: { id: args.generationId },
    include: {
      result: {
        include: {
          images: { include: { author: true } },
        },
      },
    },
  });
  if (!generation) {
    return null;
  }
  const result = generation.result
    ? {
        ...generation.result,
        searchQuery: getResultSearchQuery(generation.result),
      }
    : null;
  return {
    ...generation,
    result,
  };
};

export const getLatestResults = (async (_args, context) => {
  const generations = await context.entities.Generation.findMany({
    where: {
      result: {
        isNot: null,
      },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      result: {
        include: {
          images: { include: { author: true } },
        },
      },
    },
  });
  return generations.map((g) => g.result!);
}) satisfies GetLatestResults<{}>;

function getResultSearchQuery(result: Result) {
  try {
    return JSON.parse(result.searchQuery);
  } catch (e) {
    return [result.searchQuery];
  }
}
