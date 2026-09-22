import { createFileRoute } from "@tanstack/react-router";
import { WeddingInvitation } from "@/components/WeddingInvitation";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sujin & Jineesha Wedding Invitation" },
      { name: "description", content: "Join Sujin & Jineesha for their wedding celebration on October 7, 2026." },
      { property: "og:title", content: "Sujin & Jineesha | Wedding Invitation" },
      { property: "og:description", content: "A celebration of love — October 7, 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <WeddingInvitation />;
}
