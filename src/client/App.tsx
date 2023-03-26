import {
  ChakraProvider,
  Container,
  Heading,
  Link,
  HStack,
  Box,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import "@fontsource/inter/400.css";
import "@fontsource/inter/900.css";

import { useQuery } from "@wasp/queries";
import getNumberOfResults from "@wasp/queries/getNumberOfResults";

import { ImageProviderLink } from "./components/ImageProviderLink";

import { theme } from "./theme";

export function App({ children }: { children: JSX.Element }) {
  const { data: numberOfResults } = useQuery(getNumberOfResults);
  return (
    <ChakraProvider theme={theme}>
      <Container py={8} px={4} maxW="container.md">
        <VStack gap={4}>
          <Box mt={8}>
            <Heading
              fontWeight="black"
              color="brand.700"
              textAlign="center"
              mb={2}
            >
              <Link as={RouterLink} to="/">
                SocialPostGPT
              </Link>
            </Heading>
            <Heading
              as="h3"
              size="sm"
              fontWeight="normal"
              color="black.600"
              textAlign="center"
              lineHeight={1.5}
            >
              ... writes catchy posts for social media and picks images to go
              with it 🤙
              <br />
              Just provide it with a brief and see the magic happen!
            </Heading>
          </Box>
          {children}
          <VStack alignItems="center">
            <p>
              Powered by{" "}
              <Link href="https://wasp-lang.dev" target="_blank">
                Wasp
              </Link>
              ,{" "}
              <Link href="https://openai.com/" target="_blank">
                OpenAI
              </Link>{" "}
              and <ImageProviderLink /> + <ImageProviderLink isUnsplashUsed />.
            </p>
            {numberOfResults && (
              <Text
                bg="white"
                fontSize="sm"
                color="brand.900"
                border="1px"
                borderColor="brand.300"
                boxShadow="base"
                p={1}
                px={2}
                borderRadius="full"
              >
                Total posts generated: {numberOfResults}
              </Text>
            )}
          </VStack>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}
