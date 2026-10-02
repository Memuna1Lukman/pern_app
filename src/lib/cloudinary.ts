import { CLOUDINARY_CLOUD_NAME } from "@/constants";

/** Builds an optimized, cropped Cloudinary URL without requiring a client SDK. */
export const bannerPhoto = (
  imageCldPublicId: string,
  width = 1200,
  height = 300,
) =>
  `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,c_fill,w_${width},h_${height}/${imageCldPublicId}`;
