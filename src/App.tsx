import { useQuery, getNumberOfResults } from "wasp/client/operations";
import {
  ChakraProvider,
  Container,
  Heading,
  Link,
  Box,
  VStack,
  Text,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import "@fontsource/inter/400.css";
import "@fontsource/inter/900.css";
import { AiFillGithub } from "react-icons/ai";

import { ImageProviderLink } from "./components/ImageProviderLink";

import { theme } from "./theme";

import { Toaster } from "sonner";

export function App() {
  const { data: numberOfResults } = useQuery(getNumberOfResults);
  return (
    <ChakraProvider theme={theme}>
      <Toaster position="top-right" richColors />
      <Container py={8} px={4} maxW="container.md">
        <VStack gap={4}>
          <Box mt={6} textAlign="center">
            <Text
              fontSize="xs"
              mb={2}
              display="inline-flex"
              alignItems="center"
              gap={1}
            >
              Check out the source code on
              <Link
                href="https://github.com/infomiho/socialpostgpt"
                target="_blank"
                display="inline-flex"
                alignItems="center"
                gap={1}
              >
                <Icon as={AiFillGithub} /> GitHub
              </Link>
            </Text>
            <Heading fontWeight="black" color="brand.700" mb={2}>
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
          <Outlet />
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
