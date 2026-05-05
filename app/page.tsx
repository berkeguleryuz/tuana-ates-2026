import { SectionHero } from "./_sections/SectionHero";
import { SectionCountdown } from "./_sections/SectionCountdown";
import { SectionStoryPreview } from "./_sections/SectionStoryPreview";
import { SectionVenuePreview } from "./_sections/SectionVenuePreview";
import { SectionGalleryPreview } from "./_sections/SectionGalleryPreview";
import { SectionCTA } from "./_sections/SectionCTA";

export default function Home() {
  return (
    <>
      <SectionHero />
      <SectionCountdown />
      <SectionStoryPreview />
      <SectionVenuePreview />
      <SectionGalleryPreview />
      <SectionCTA />
    </>
  );
}
