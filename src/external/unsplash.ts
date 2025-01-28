import { createApi } from "unsplash-js";
import type { ImageSearchAPI } from "../types.js";
import { env } from "wasp/server";

const api = createApi({
  accessKey: env.UNSPLASH_ACCESS_KEY,
});

export const unsplash: ImageSearchAPI = {
  async search(query: string) {
    const response = await api.search.getPhotos({
      query,
      page: 1,
      perPage: 5,
    });
    return response.response?.results.map((image) => ({
      provider: "unsplash",
      url: image.urls.regular,
      downloadUrl: image.links.download,
      id: image.id,
      author: {
        name: image.user.name || "",
        url: image.user.portfolio_url || "",
      },
    }));
  },
};
