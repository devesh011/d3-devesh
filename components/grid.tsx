import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bentoGrid";
import { gridItems } from "@/data";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delay: 0.1, // small delay before grid appears
      staggerChildren: 0.6, // each item appears slightly after
    },
  },
};

const Grid = () => {
  return (
    <section id="about" className="w-full">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <BentoGrid>
          {gridItems.map(
            ({
              id,
              title,
              description,
              className,
              img,
              imgClassName,
              titleClassName,
              spareImg,
            }) => (
              <BentoGridItem
                key={id}
                id={id}
                title={title}
                description={description}
                className={className}
                img={img}
                imgClassName={imgClassName}
                titleClassName={titleClassName}
                spareImg={spareImg}
              />
            ),
          )}
        </BentoGrid>
      </motion.div>
    </section>
  );
};

export default Grid;
