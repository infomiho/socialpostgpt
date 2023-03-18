import {
  Button,
  FormControl,
  FormLabel,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import submitPrompt from "@wasp/actions/submitPrompt";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

const MainPage = () => {
  const { register, handleSubmit } = useForm<{ description: string }>();
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
      // Redirect to /{generationId} using React Router.
      history.push(`/${generationId}`);
    }, 3000);
  }, [generationId]);

  return (
    <form onSubmit={onSubmit}>
      <VStack p={8}>
        <FormControl>
          <FormLabel>What is the post about</FormLabel>
          <Textarea
            {...register("description")}
            placeholder="What is your post about? Describe what are you trying to achieve (max 150 characters)."
            variant="filled"
            size="lg"
            disabled={isLoading}
            maxLength={150}
          />
        </FormControl>
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
    </form>
  );
};
export default MainPage;
