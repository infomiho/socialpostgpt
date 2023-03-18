import {
  ChakraProvider,
  Container,
  Heading,
  Link,
  HStack,
  Box,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import "@fontsource/inter/400.css";
import "@fontsource/inter/900.css";

import { ImageProviderLink } from "./components/ImageProviderLink";

import { theme } from "./theme";

export function App({ children }: { children: JSX.Element }) {
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
              SocialPostGPT generates a post and 5 stock images to go with it 🤙
              <br />
              Just provide it with your idea and it'll do the rest!
            </Heading>
          </Box>
          {children}
          <HStack justifyContent="center">
            <p>
              Powered by{" "}
              <Link href="https://wasp-lang.dev" target="_blank">
                Wasp
              </Link>
              ,{" "}
              <Link href="https://openai.com/" target="_blank">
                OpenAI
              </Link>{" "}
              and <ImageProviderLink />.
            </p>
          </HStack>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}
