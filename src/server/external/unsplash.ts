import { createApi } from 'unsplash-js';

const api = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY!,
});

export const unsplash = {
    async search(query: string) {
        return api.search.getPhotos({
            query,
            page: 1,
            perPage: 5,
          });
    },
    async getPhoto() {},
    async getDownloadUrl() {},
};