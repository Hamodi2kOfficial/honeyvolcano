import { Navbar } from "@/components/site/navbar";
import { HomeSections } from "@/components/site/home-sections";
import { AdminLink } from "@/components/site/admin-link";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />

      {/* Section order, visibility and content all come from /admin */}
      <HomeSections />

      {/* Owner entrance — always the last thing on the page */}
      <AdminLink />
    </main>
  );
}
