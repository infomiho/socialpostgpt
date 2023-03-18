import {
  ChakraProvider,
  Container,
  Heading,
  Link,
  HStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import "@fontsource/inter/400.css";
import "@fontsource/inter/900.css";

import { ImageProviderLink } from "./components/ImageProviderLink";

import { theme } from "./theme";

export function App({ children }) {
  return (
    <ChakraProvider theme={theme}>
      <Container p={8} maxW="container.md">
        <header>
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
            size="md"
            fontWeight="normal"
            color="black.600"
            textAlign="center"
          >
            SocialPostGPT generates a post and 5 stock images to go with it.
            Just provide it with your idea and it'll do the rest!
          </Heading>
        </header>
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
      </Container>
    </ChakraProvider>
  );
}
