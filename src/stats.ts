import { type GetNumberOfResults } from "wasp/server/operations";

export const getNumberOfResults: GetNumberOfResults<void, number> = async (
  _args,
  context
) => {
  const numberOfResults = await context.entities.Result.count();
  return numberOfResults;
};
