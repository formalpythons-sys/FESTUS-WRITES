import { CategoryArticlesPage } from "@/app/components/category-articles-page";

type TheologyPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function TheologyPage({ searchParams }: TheologyPageProps) {
  const { q } = await searchParams;

  return <CategoryArticlesPage slug="theology" search={q} />;
}
