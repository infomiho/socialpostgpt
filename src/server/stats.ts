import { GetNumberOfResults } from "@wasp/queries/types";

export const getNumberOfResults: GetNumberOfResults = async (
  _args,
  context
) => {
  const numberOfResults = await context.entities.Result.count();
  return numberOfResults;
};
