import { SubmitPrompt } from "@wasp/actions/types";
import { GetResult } from "@wasp/queries/types";
import { Generation } from "@wasp/entities";

import { generateResult } from "@wasp/jobs/generateResult.js";

export const submitPrompt: SubmitPrompt<
  { description: string },
  { success: boolean; generationId?: string }
> = async (args, context) => {
  try {
    const generation = await context.entities.Generation.create({
      data: {
        prompt: args.description.slice(0, 150),
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
