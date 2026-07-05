import { CategoryArticlesPage } from "@/app/components/category-articles-page";

type SexualityPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SexualityPage({ searchParams }: SexualityPageProps) {
  const { q } = await searchParams;

  return <CategoryArticlesPage slug="sexuality" search={q} />;
}
