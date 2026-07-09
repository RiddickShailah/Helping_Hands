import Image from "next/image";
import Link from "next/link";
import { fetchCampaigns } from "@/lib/api";
import { parseGallery } from "@/lib/types";

export default async function StoriesPage() {
  const campaigns = await fetchCampaigns();

  const stories = campaigns.flatMap((c) => {
    const photos = [c.coverImageUrl, ...parseGallery(c)].filter(Boolean) as string[];
    return photos.map((url, i) => ({
      url,
      title: c.title,
      neighborhood: c.neighborhood,
      id: c.id,
      key: `${c.id}-${i}`,
    }));
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-2">Community Stories</h1>
      <p className="text-slate text-sm mb-8">
        Real photos from {campaigns.length} neighborhood campaigns — see the faces and places your support reaches.
      </p>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {stories.map((s) => (
          <Link
            key={s.key}
            href={`/campaigns/${s.id}`}
            className="block break-inside-avoid rounded-xl overflow-hidden group relative"
          >
            <Image
              src={s.url}
              alt={s.title}
              width={400}
              height={500}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <div className="text-white text-xs">
                <p className="font-semibold">{s.title}</p>
                {s.neighborhood && <p className="opacity-80">{s.neighborhood}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
