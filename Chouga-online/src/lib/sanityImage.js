import imageUrlBuilder from "@sanity/image-url";

import { sanityClient } from "./sanityClient";

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function buildSanityImageUrl(
  source,
  { width, height, quality = 82 } = {},
) {
  if (!builder || !source?.asset) {
    return "";
  }

  let image = builder.image(source).auto("format").quality(quality);

  if (Number.isFinite(width) && width > 0) {
    image = image.width(Math.round(width));
  }

  if (Number.isFinite(height) && height > 0) {
    image = image.height(Math.round(height)).fit("crop");
  }

  return image.url();
}
