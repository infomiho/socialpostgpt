import {
  Box,
  Button,
  HStack,
  Image,
  Link,
  Spinner,
  Text,
  VStack,
  AspectRatio,
} from "@chakra-ui/react";
import {
  Image as ImageEntity,
  Result,
  ImageAuthor,
  Generation,
} from "@wasp/entities";
import { useQuery } from "@wasp/queries";
import getResult from "@wasp/queries/getResult";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ImageProviderLink } from "../components/ImageProviderLink";

const ResultPage = () => {
  const { generationId } = useParams<{ generationId: string }>();
  const [isFetched, setIsFetched] = useState(false);
  const [currentImage, setCurrentImage] = useState<
    (ImageEntity & { author: ImageAuthor }) | null
  >(null);
  const { data: result, isLoading } = useQuery<
    { generationId: string | null },
    Generation & {
      result:
        | (Result & { images?: (ImageEntity & { author: ImageAuthor })[] })
        | null;
    }
  >(
    getResult,
    { generationId },
    { enabled: !!generationId && !isFetched, refetchInterval: 3000 }
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  function nextImage() {
    if (!result?.result?.images) {
      return;
    }
    setCurrentImageIndex(
      (currentImageIndex + 1) % result.result?.images.length
    );
  }

  function previousImage() {
    if (!result?.result?.images) {
      return;
    }
    setCurrentImageIndex(
      (currentImageIndex + result.result.images.length - 1) %
        result.result.images.length
    );
  }

  useEffect(() => {
    if (result?.result) {
      setIsFetched(true);
    }
  }, [result]);

  useEffect(() => {
    if (result?.result?.images) {
      setCurrentImage(result.result.images[currentImageIndex]);
    }
  }, [result, currentImageIndex]);

  return (
    <VStack p={8}>
      {(isLoading || result?.status === "pending") && <Spinner />}
      {result && result.result && (
        <VStack alignItems="flex-start">
          {/* <Text color="gray.500" fontSize="sm">
            Result ID: {result.generationId}
          </Text> */}
          <Box boxShadow="base" borderRadius="md" p={6} mb={4}>
            <Text colorScheme="brand">{result.result.description}</Text>
            {currentImage && (
              <Box>
                <Box style={{ position: "relative" }} my={2}>
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={currentImage.url}
                      alt={result.result.searchQuery}
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </AspectRatio>
                  {currentImage.downloadUrl && (
                    <Button
                      size="sm"
                      style={{
                        position: "absolute",
                        bottom: "0.5rem",
                        right: "0.5rem",
                      }}
                    >
                      <a href={currentImage.downloadUrl} target="_blank">
                        Download
                      </a>
                    </Button>
                  )}
                </Box>
                <Text fontSize="xs" color="gray.600">
                  Photo by{" "}
                  <Link href={currentImage.author.url}>
                    {currentImage.author.name}
                  </Link>{" "}
                  on <ImageProviderLink />
                </Text>
              </Box>
            )}
          </Box>
          <Box>
            <Text mb={2} fontSize="sm" color="gray.500">
              We found multiple pictures using the search query{" "}
              <Text as="span" color="brand.700">
                "{result.result.searchQuery}"
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
      {result?.status === "pending" && (
        <Text textAlign="center">
          <strong>
            You are in the queue ✨ <br />
          </strong>
          The page will refresh when your result is ready.
        </Text>
      )}
      {result?.status === "inProgress" && (
        <Text textAlign="center">
          <strong>We are generating your result 🏃‍♂️</strong>
          <br />
          We'll recheck if it's done every few seconds.
        </Text>
      )}
      {result && result.status === "failed" && (
        <Text>
          <strong>We couldn't generate your result ❌</strong>
          <br />
          Please try again inputing a different idea.
        </Text>
      )}
    </VStack>
  );
};
export default ResultPage;
