import { CategoryArticlesPage } from "@/app/components/category-articles-page";

type RelationshipsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function RelationshipsPage({ searchParams }: RelationshipsPageProps) {
  const { q } = await searchParams;

  return <CategoryArticlesPage slug="relationships" search={q} />;
}
