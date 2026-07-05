export type Category = {
  slug: string;
  title: string;
  description: string;
  accent: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
};

export const categories: Category[] = [
  {
    slug: "politics",
    title: "Politics",
    description: "Essays on power, institutions, and the stories that shape civic life.",
    accent: "from-zinc-700 to-zinc-900",
  },
  {
    slug: "relationships",
    title: "Relationships",
    description: "Tender, unsparing reflections on love, friendship, and belonging.",
    accent: "from-zinc-600 to-zinc-800",
  },
  {
    slug: "theology",
    title: "Theology",
    description: "Long-form thinking on belief, doubt, and the spiritual imagination.",
    accent: "from-zinc-500 to-zinc-700",
  },
  {
    slug: "sexuality",
    title: "Sexuality",
    description: "Clear-eyed writing on desire, embodiment, and ethical tenderness.",
    accent: "from-zinc-400 to-zinc-600",
  },
  {
    slug: "parenting",
    title: "Parenting",
    description: "Practical and poetic reflections on raising children with care.",
    accent: "from-zinc-300 to-zinc-500",
  },
];

export const articles: Article[] = [
  {
    slug: "the-cost-of-clarity",
    title: "The Cost of Clarity",
    excerpt: "Why honest language often arrives with a price and why that price is worth paying.",
    content: [
      "Clarity is often mistaken for comfort. In public life, private life, and spiritual practice, the words that cut cleanly are rarely the words that soothe most easily.",
      "To speak plainly is to risk being misunderstood, misread, or reduced to a headline. Yet clarity is not merely a virtue of style; it is a discipline of attention, a refusal to hide behind abstraction when a precise truth is available.",
      "The work of writing is often the work of making room for that kind of truth. Even when it unsettles the room, the honesty is worth the friction."
    ],
    category: "politics",
    author: "Festus M.",
    date: "June 18, 2026",
    readTime: "7 min read",
    featured: true,
  },
  {
    slug: "the-architecture-of-forgiveness",
    title: "The Architecture of Forgiveness",
    excerpt: "Forgiveness is not a feeling but a structure built through repetition and courage.",
    content: [
      "We often talk about forgiveness as if it were a single act. In reality, it is a practice, something assembled slowly over time.",
      "The first draft of forgiveness is often resentment. The second is a decision to stop rehearsing injury. The third is the labor of seeing the other person as more than the wound they caused.",
      "That is why forgiveness can feel like architecture rather than emotion. It is built, not simply felt."
    ],
    category: "relationships",
    author: "Asha Bell",
    date: "June 12, 2026",
    readTime: "6 min read",
  },
  {
    slug: "when-doubt-becomes-prayer",
    title: "When Doubt Becomes Prayer",
    excerpt: "Some of the deepest spiritual language arrives not in certainty but in questioning.",
    content: [
      "Doubt is often treated as the enemy of faith, but in many traditions it is the soil where faith learns to breathe.",
      "A question asked honestly can be more reverent than a certainty repeated without reflection.",
      "The believer who keeps asking becomes a pilgrim again, and that movement is not weakness. It is an encounter with depth."
    ],
    category: "theology",
    author: "Mina K.",
    date: "June 9, 2026",
    readTime: "8 min read",
  },
  {
    slug: "desire-and-boundaries",
    title: "Desire and Boundaries",
    excerpt: "A mature sexual ethic makes room for longing without surrendering self-respect.",
    content: [
      "Desire can be vivid and disorienting. It can also be instructive when we allow it to expose what we truly value.",
      "Boundaries are not the opposite of desire. They are the form that desire takes when it is held responsibly.",
      "To speak honestly about desire is not to reduce it to appetite, but to recognize it as a location of vulnerability and choice."
    ],
    category: "sexuality",
    author: "Jules Arden",
    date: "June 5, 2026",
    readTime: "5 min read",
  },
  {
    slug: "parenting-without-a-script",
    title: "Parenting Without a Script",
    excerpt: "The most useful guidance for parents is often the least polished and most lived-in.",
    content: [
      "There is no perfect parenting script, only the daily work of showing up with steadiness and humility.",
      "Children learn as much from our pauses as our answers. The silence that accompanies a difficult conversation can be more formative than the speech that follows.",
      "Parenting becomes less anxious when we admit that care is not control."
    ],
    category: "parenting",
    author: "Nia Holt",
    date: "June 1, 2026",
    readTime: "6 min read",
  },
  {
    slug: "the-quiet-logic-of-hope",
    title: "The Quiet Logic of Hope",
    excerpt: "Hope is rarely loud, but it is often more durable than certainty.",
    content: [
      "Hope is not optimism in a neat suit. It is a stubborn conviction that meaning can survive what has gone wrong.",
      "It is often found in the ordinary habits of care, in the face of someone who stays, listens, or returns.",
      "Hope is not the absence of grief. It is the willingness to continue building after grief has named its terms."
    ],
    category: "politics",
    author: "Rae S.",
    date: "May 30, 2026",
    readTime: "7 min read",
  },
];

export const featuredArticle = articles.find((article) => article.featured) ?? articles[0];

export const latestArticles = articles.filter((article) => !article.featured);
