import { createClient } from "pexels";
import { ImageSearchAPI } from "../types.js";

const client = createClient(process.env.PEXELS_API_KEY!);

export const pexels: ImageSearchAPI = {
  async search(query: string) {
    const response = await client.photos.search({ query, per_page: 5 });
    if ("error" in response) {
      return undefined;
    }
    return response.photos.map((image) => ({
      url: image.src.landscape,
      downloadUrl: image.src.original,
      id: image.id.toString(),
      author: {
        name: image.photographer || "",
        url: image.photographer_url || "",
      },
    }));
  },
};
