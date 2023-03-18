import {
  Button,
  FormControl,
  FormLabel,
  Text,
  Textarea,
  VStack,
  HStack,
  Box,
  Flex,
  Checkbox,
  AspectRatio,
  Image,
  Heading,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import submitPrompt from "@wasp/actions/submitPrompt";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useQuery } from "@wasp/queries";
import getLatestResults from "@wasp/queries/getLatestResults";
import { Result, Image as ImageEntity } from "@wasp/entities";

const MainPage = () => {
  const { data: latestResults } = useQuery(getLatestResults);
  const { register, handleSubmit } = useForm<{
    description: string;
    includeEmojis: boolean;
    includeHashtags: boolean;
    includeCTA: boolean;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const history = useHistory();

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    const result = await submitPrompt(data);
    setGenerationId(result.generationId);
  });

  useEffect(() => {
    if (!generationId) {
      return;
    }
    setTimeout(() => {
      history.push(`/${generationId}`);
    }, 1000);
  }, [generationId]);

  return (
    <VStack width="full" gap={20}>
      <form onSubmit={onSubmit} style={{ width: "100%" }}>
        <VStack p={4} gap={3}>
          <FormControl>
            <FormLabel>What is the post about</FormLabel>
            <Textarea
              {...register("description")}
              required
              placeholder="You could write something like: Company Super Shoes is promoting their newest line of flying shoes and they are looking to appeal to the seniors."
              height={150}
              size="lg"
              disabled={isLoading}
              maxLength={150}
              boxShadow="lg"
              backgroundColor="white"
            />
          </FormControl>
          <Flex alignItems="center" gap={4} width="full">
            {/* three checkboxes within boxes, 1. include emojis, 2. include hashtags, 3. add a CTA at the end */}
            <Checkbox {...register("includeEmojis")} flex={1} defaultChecked>
              Include Emojis 🤩
            </Checkbox>
            <Checkbox {...register("includeHashtags")} flex={1} defaultChecked>
              Include Hashtags <strong>#</strong>
            </Checkbox>
            <Checkbox {...register("includeCTA")} flex={1}>
              Add a call to action
            </Checkbox>
          </Flex>
          <Button
            variant="solid"
            colorScheme="brand"
            size="lg"
            type="submit"
            isLoading={isLoading}
          >
            Give me some ideas ✨
          </Button>
          {isLoading && (
            <Text color="gray.500" fontSize="sm">
              It will take some time to generate your result.
            </Text>
          )}
        </VStack>
        {/* <Box boxShadow="lg" p={4} my={12}>
        <Text mb={2}>Here's an example of what you can expect:</Text>
        <AspectRatio ratio={16 / 9}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/dkFP_JDsbAE?rel=0?autoplay=1&controls=0&&showinfo=0&loop=1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; loop; modestbranding; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </AspectRatio>
      </Box> */}
      </form>
      {latestResults && (
        <VStack mt={5}>
          <Heading size="sm">Example posts by others</Heading>
          <HStack scrollBehavior="smooth" overflowX="auto" maxW="full" p={3}>
            {latestResults.map((result: Result & { images: ImageEntity[] }) => (
              <Link to={`/${result.generationId}`}>
                <Box
                  key={result.id}
                  boxShadow="lg"
                  p={4}
                  minW="sm"
                  bg="white"
                  borderRadius="md"
                  // filter="blur(5px) brightness(120%)"
                  // transition={"filter 0.2s ease"}
                  // _hover={{ filter: "blur(0px) brightness(100%)" }}
                >
                  <Text fontSize="sm" maxH={10}>
                    {result.description.slice(0, 100)}...
                  </Text>
                  <AspectRatio ratio={16 / 9} mt={2}>
                    <Image
                      src={result.images[0].url}
                      alt={result.description}
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </AspectRatio>
                </Box>
              </Link>
            ))}
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};
export default MainPage;
