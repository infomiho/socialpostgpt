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
  Icon,
} from "@chakra-ui/react";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi2";
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
  const { data: result, isLoading } = useQuery(
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
    <VStack px={8}>
      {(!result || !result.result) && (
        <Box
          boxShadow="lg"
          bg="white"
          padding={6}
          borderRadius="lg"
          textAlign="center"
        >
          {(isLoading || !["done", "failed"].includes(result?.status!)) && (
            <Spinner />
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
              The page will refresh when your result is ready.
            </Text>
          )}
          {result && result.status === "failed" && (
            <Text>
              <strong>We couldn't generate your result ❌</strong>
              <br />
              Please try again inputing a different idea.
            </Text>
          )}
        </Box>
      )}
      {result && result.result && (
        <VStack alignItems="flex-start">
          {/* <Text color="gray.500" fontSize="sm">
            Result ID: {result.generationId}
          </Text> */}
          <Box
            boxShadow="base"
            borderRadius="md"
            p={6}
            mb={4}
            bg="white"
            width="full"
          >
            <Text colorScheme="brand">{result.result.description}</Text>
            {currentImage && (
              <Box>
                <Box style={{ position: "relative" }} my={2}>
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={currentImage.url}
                      alt={result.result.searchQuery}
                      objectFit="cover"
                      objectPosition="center"
                      borderRadius="md"
                    />
                  </AspectRatio>
                  <HStack
                    spacing={2}
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                    }}
                  >
                    <Button
                      size="sm"
                      colorScheme="brand"
                      onClick={previousImage}
                    >
                      <Icon as={HiArrowLeft} />
                    </Button>
                    <Button size="sm" colorScheme="brand" onClick={nextImage}>
                      <Icon as={HiArrowRight} />
                    </Button>
                  </HStack>
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
                  on{" "}
                  <ImageProviderLink
                    isUnsplashUsed={currentImage.provider === "unsplash"}
                  />
                </Text>
              </Box>
            )}
          </Box>
          <Box>
            <Text mb={2} fontSize="sm" color="gray.600">
              We found multiple photos by searching for{" "}
              {result.result.searchQuery.map((query, index) => (
                <span key={query}>
                  <Text as="span" color="brand.700">
                    "{query}"
                  </Text>
                  {index !== result.result!.searchQuery.length - 1 && " and "}
                </span>
              ))}
              , pick the best one.
            </Text>
          </Box>
        </VStack>
      )}
    </VStack>
  );
};
export default ResultPage;
