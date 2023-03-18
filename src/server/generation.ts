import { SubmitPrompt } from "@wasp/actions/types";
import { GetResult, GetLatestResults } from "@wasp/queries/types";
import { Generation, Result } from "@wasp/entities";

import { generateResult } from "@wasp/jobs/generateResult.js";

export const submitPrompt: SubmitPrompt<
  {
    description: string;
    includeEmojis: boolean;
    includeHashtags: boolean;
    includeCTA: boolean;
  },
  { success: boolean; generationId?: string }
> = async (args, context) => {
  try {
    const { description, includeEmojis, includeHashtags, includeCTA } = args;
    const generation = await context.entities.Generation.create({
      data: {
        prompt: description.slice(0, 150),
        options: JSON.stringify({ includeEmojis, includeHashtags, includeCTA }),
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
  Generation | null
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
  return generation;
};

export const getLatestResults: GetLatestResults<{}, Result[]> = async (
  _args,
  context
) => {
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
  return generations.map((g) => g.result);
};
