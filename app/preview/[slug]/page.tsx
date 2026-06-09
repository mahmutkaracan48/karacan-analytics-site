import { fetchPreviewBySlug } from "@/lib/supabase";
import { PreviewNotFound, PreviewPage } from "./preview-view";

export const revalidate = 300;

type Props = { params: { slug: string } };

export default async function PreviewRoute({ params }: Props) {
  const slug = String(params.slug || "").trim().toLowerCase();
  if (!slug || !/^[a-f0-9]{16}$/.test(slug)) {
    return <PreviewNotFound slug={slug || "invalid"} />;
  }
  const scan = await fetchPreviewBySlug(slug);
  if (!scan) return <PreviewNotFound slug={slug} />;
  return <PreviewPage scan={scan} />;
}
