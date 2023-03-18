import {
  Box,
  Button,
  HStack,
  Image,
  Link,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Image as ImageEntity, Result, UnsplashAuthor } from "@wasp/entities";
import { useQuery } from "@wasp/queries";
import getResult from "@wasp/queries/getResult";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ResultPage = () => {
  const { generationId } = useParams<{ generationId: string }>();
  const [isFetched, setIsFetched] = useState(false);
  const { data: result, isLoading } = useQuery<
    { generationId: string | null },
    Result & { images?: (ImageEntity & { author: UnsplashAuthor })[] }
  >(
    getResult,
    { generationId },
    { enabled: !!generationId && !isFetched, refetchInterval: 3000 }
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  function nextImage() {
    if (!result?.images) {
      return;
    }
    setCurrentImageIndex((currentImageIndex + 1) % result.images.length);
  }

  function previousImage() {
    if (!result?.images) {
      return;
    }
    setCurrentImageIndex(
      (currentImageIndex + result.images.length - 1) % result.images.length
    );
  }

  useEffect(() => {
    if (result) {
      setIsFetched(true);
    }
  }, [result]);

  return (
    <VStack p={8}>
      {(isLoading || !result) && <Spinner />}
      {result && (
        <VStack alignItems="flex-start">
          {/* <Text color="gray.500" fontSize="sm">
            Result ID: {result.generationId}
          </Text> */}
          <Box boxShadow="base" borderRadius="md" p={6} mb={4}>
            <Text colorScheme="brand">{result.description}</Text>
            {result.images && (
              <Box>
                <Box style={{ position: "relative" }}>
                  {result.images[currentImageIndex].downloadUrl && (
                    <Button
                      size="sm"
                      style={{
                        position: "absolute",
                        bottom: "0.5rem",
                        right: "0.5rem",
                      }}
                    >
                      <a
                        href={result.images[currentImageIndex].downloadUrl}
                        target="_blank"
                      >
                        Download
                      </a>
                    </Button>
                  )}
                  <Image
                    src={result.images[currentImageIndex].url}
                    my={2}
                    borderRadius="md"
                  />
                </Box>
                <Text fontSize="xs" color="gray.600">
                  Photo by{" "}
                  <Link href={result.images[currentImageIndex].author.url}>
                    {result.images[currentImageIndex].author.name}
                  </Link>{" "}
                  on{" "}
                  <Link href="https://unsplash.com/?utm_source=your_app_name&utm_medium=referral">
                    Unsplash
                  </Link>
                </Text>
              </Box>
            )}
            {/* {result.images?.map((image) => (
              <Image src={image.url} mt={2} borderRadius="md" />
            ))} */}
          </Box>
          <Box>
            <Text mb={2} fontSize="sm" color="gray.500">
              We found multiple pictures using the search query{" "}
              <Text as="span" color="brand.700">
                "{result.unsplashSearchQuery}"
              </Text>
              , pick the best one.
            </Text>
            <HStack spacing={2}>
              <Button variant="outline" onClick={previousImage}>
                Previous image
              </Button>
              <Button variant="outline" onClick={nextImage}>
                Next image
              </Button>
            </HStack>
          </Box>
        </VStack>
      )}
      {!isLoading && !result && (
        <Text>
          We are generating your result. We'll recheck if it's done every few
          seconds.
        </Text>
      )}
    </VStack>
  );
};
export default ResultPage;
