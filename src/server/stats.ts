import { GetNumberOfResults } from "@wasp/queries/types";

export const getNumberOfResults: GetNumberOfResults<void, number> = async (
  _args,
  context
) => {
  const numberOfResults = await context.entities.Result.count();
  return numberOfResults;
};
