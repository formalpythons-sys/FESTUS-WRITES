import { CategoryArticlesPage } from "@/app/components/category-articles-page";

type PoliticsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function PoliticsPage({ searchParams }: PoliticsPageProps) {
  const { q } = await searchParams;

  return <CategoryArticlesPage slug="politics" search={q} />;
}
