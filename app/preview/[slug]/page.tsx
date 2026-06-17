import type { Metadata } from "next";
import { fetchPreviewBySlug } from "@/lib/supabase";
import { PreviewNotFound, PreviewPage } from "./preview-view";

export const revalidate = 300;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = String(params.slug || "").trim().toLowerCase();
  if (!slug || !/^[a-f0-9]{16}$/.test(slug)) {
    return { title: "Preview not found · Risk Shield" };
  }
  const scan = await fetchPreviewBySlug(slug);
  if (!scan) return { title: "Preview not found · Risk Shield" };
  const company = scan.company_name || "Your business";
  return {
    title: `${company} · ADA risk preview`,
    description: `Personalized accessibility and performance preview for ${company}.`,
    robots: { index: false, follow: false },
  };
}

export default async function PreviewRoute({ params }: Props) {
  const slug = String(params.slug || "").trim().toLowerCase();
  if (!slug || !/^[a-f0-9]{16}$/.test(slug)) {
    return <PreviewNotFound slug={slug || "invalid"} />;
  }
  const scan = await fetchPreviewBySlug(slug);
  if (!scan) return <PreviewNotFound slug={slug} />;
  return <PreviewPage scan={scan} />;
}
