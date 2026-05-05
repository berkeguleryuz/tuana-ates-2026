import { SectionHero } from "./_sections/SectionHero";
import { SectionCountdown } from "./_sections/SectionCountdown";
import { SectionVenuePreview } from "./_sections/SectionVenuePreview";
import { SectionGalleryPreview } from "./_sections/SectionGalleryPreview";
import { SectionShare } from "./_sections/SectionShare";
import { SectionCTA } from "./_sections/SectionCTA";

export default function Home() {
  return (
    <>
      <SectionHero />
      <SectionCountdown />
      <SectionVenuePreview />
      <SectionShare />
      <SectionGalleryPreview />
      <SectionCTA />
    </>
  );
}
