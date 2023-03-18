import { Link } from "@chakra-ui/react";

const isUnsplashUsed = false;

export function ImageProviderLink({ link }: { link?: string }) {
  const title = isUnsplashUsed ? "Unsplash" : "Pexels";
  const defaultHref = isUnsplashUsed
    ? "https://unsplash.com/"
    : "https://www.pexels.com/";
  const href = link || defaultHref;
  return (
    <Link href={href} target="_blank">
      {title}
    </Link>
  );
}
