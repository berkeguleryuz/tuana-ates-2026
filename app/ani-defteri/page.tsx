import type { Metadata } from "next";
import { MemoryForm } from "../_components/MemoryForm";
import { getMemories } from "../_lib/public-data";

export const metadata: Metadata = {
  title: "Anı Defteri",
};

export default async function AniDefteriPage() {
  const memories = await getMemories();

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <MemoryForm initialMemories={memories} />
      </div>
    </div>
  );
}
