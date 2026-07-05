export type Category = {
  slug: string;
  title: string;
  description: string;
};

export const categories: Category[] = [
  {
    slug: "politics",
    title: "Politics",
    description: "Essays on power, institutions, and the stories that shape civic life.",
  },
  {
    slug: "relationships",
    title: "Relationships",
    description: "Tender, unsparing reflections on love, friendship, and belonging.",
  },
  {
    slug: "theology",
    title: "Theology",
    description: "Long-form thinking on belief, doubt, and the spiritual imagination.",
  },
  {
    slug: "sexuality",
    title: "Sexuality",
    description: "Clear-eyed writing on desire, embodiment, and ethical tenderness.",
  },
  {
    slug: "parenting",
    title: "Parenting",
    description: "Practical and poetic reflections on raising children with care.",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
