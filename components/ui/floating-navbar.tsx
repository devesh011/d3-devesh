"use client";
import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious();

    // first load
    if (current < 10) {
      setVisible(true);
      return;
    }

    // scrolling up → show
    if (current < previous!) {
      setVisible(true);
    }
    // scrolling down → hide
    else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "fixed top-10 inset-x-0 mx-auto z-[5000] flex max-w-fit items-center justify-center space-x-4 rounded-full border border-white/[0.2] bg-black-100 px-10 py-5 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]",
        className,
      )}
    >
      {navItems.map((navItem, idx) => (
        <a
          key={idx}
          href={navItem.link}
          className="flex items-center space-x-1 text-sm text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300"
        >
          <span className="inline-block">{navItem.icon}</span>
          <span className="text-sm cursor-pointer">{navItem.name}</span>
        </a>
      ))}
    </motion.div>
  );
};
