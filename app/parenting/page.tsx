import { CategoryArticlesPage } from "@/app/components/category-articles-page";

type ParentingPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ParentingPage({ searchParams }: ParentingPageProps) {
  const { q } = await searchParams;

  return <CategoryArticlesPage slug="parenting" search={q} />;
}
