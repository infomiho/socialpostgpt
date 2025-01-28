import { defineEnvValidationSchema } from "wasp/env";
import * as z from "zod";

export const serverEnvSchema = defineEnvValidationSchema(
  z.object({
    UNSPLASH_ACCESS_KEY: z.string({
      required_error: "UNSPLASH_ACCESS_KEY is required",
    }),
    UNSPLASH_SECRET_KEY: z.string({
      required_error: "UNSPLASH_SECRET_KEY is required",
    }),
    PEXELS_API_KEY: z.string({
      required_error: "PEXELS_API_KEY is required",
    }),
    OPENAI_API_KEY: z.string({
      required_error: "OPENAI_API_KEY is required",
    }),
  })
);
