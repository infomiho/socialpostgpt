export type ImageSearchAPI = {
  search: (query: string) => Promise<ImageSearchResult[] | undefined>;
};

export type ImageSearchResult = {
  provider: "unsplash" | "pexels";
  url: string;
  downloadUrl: string;
  id: string;
  author: {
    name: string;
    url: string;
  };
};

export const jobStatus = {
  pending: "pending",
  inProgress: "inProgress",
  done: "done",
  failed: "failed",
};

export type JobStatus = typeof jobStatus[keyof typeof jobStatus];
