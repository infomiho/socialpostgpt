import { unsplash } from "./external/unsplash.js";
import { chatgpt } from "./external/chatgpt.js";

export async function generateResultJob(
  args: { generationId: string },
  context: any
) {
  const { generationId } = args;
  const generation = await context.entities.Generation.findUnique({
    where: { id: generationId },
  });

  const photoIdeas =
    await chatgpt.getResponse(`Generate photo ideas for a social media post with the
following content "${generation.prompt}".

Generate a search query that can be typed into Unsplash.com to find photos that match the prompt.

Next to the search query, also include a catchy social media post content that can be used along with the photos.

Respond only with JSON that looks like this: { "query": "some search query", "content": "some catchy post content" }`);

  const parsedPhotoIdeas = JSON.parse(photoIdeas.text) as {
    query: string;
    content: string;
  };

  const unsplashResponse = await unsplash.search(parsedPhotoIdeas.query);

  console.log(unsplashResponse.response?.results);

  console.log(
    "Creating the result",
    JSON.stringify({
      result: {
        create: {
          description: parsedPhotoIdeas.content,
          unsplashSearchQuery: parsedPhotoIdeas.query,
          images: {
            create: unsplashResponse.response?.results.map((image) => ({
              url: image.urls.regular,
              downloadUrl: image.links.download,
              unsplashId: image.id,
              author: {
                create: {
                  name: image.user.name,
                  url: image.user.portfolio_url,
                },
              },
            })),
          },
        },
      },
    })
  );

  try {
    await context.entities.Generation.update({
      where: { id: generationId },
      data: {
        result: {
          create: {
            description: parsedPhotoIdeas.content,
            unsplashSearchQuery: parsedPhotoIdeas.query,
            images: {
              create: unsplashResponse.response?.results.map((image) => ({
                url: image.urls.regular,
                downloadUrl: image.links.download,
                unsplashId: image.id,
                author: {
                  create: {
                    name: image.user.name || "",
                    url: image.user.portfolio_url || "",
                  },
                },
              })),
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error while creating the result", error);
    throw error;
  }

  return { success: true };
}
