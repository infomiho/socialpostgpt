interface Window {
  umami?: {
    track: (
      name: string,
      data?: Record<string, string | number | boolean>
    ) => void;
  };
}
