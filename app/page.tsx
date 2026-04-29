"use client";

import Grid from "@/components/grid";
import Hero from "@/components/hero";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { FaHome } from "react-icons/fa";
import RecentProjects from "@/components/recentProjects";
import { navItems as serverNavItems } from "@/data";
import Experience from "@/components/experience";
import Approach from "@/components/approach";
import Footer from "@/components/footer";

export default function Home() {
  // Map iconType → JSX, ensuring name is always a string
  const navItems = serverNavItems.map((item) => ({
    name: item.name || "", // Provide fallback for name
    link: item.link,
    icon:
      item.iconType === "home" ? (
        <FaHome className="h-4 w-4 text-neutral-500 dark:text-white" />
      ) : undefined,
  }));

  return (
    // page.tsx
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero />
        <Grid />
        <RecentProjects />
        <Experience />
        <Approach />
        <Footer />
      </div>
    </main>
  );
}
