import type { Metadata } from "next";
import { GalleryGrid } from "../_components/GalleryGrid";
import { getGalleryPhotos } from "../_lib/public-data";

export const metadata: Metadata = {
  title: "Galeri",
};

export default async function GaleriPage() {
  const photos = await getGalleryPhotos();

  return (
    <div className="pt-24 pb-12 px-2 sm:px-4">
      <GalleryGrid initialPhotos={photos} />
    </div>
  );
}
