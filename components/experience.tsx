import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

type Experience = {
  _id?: string;
  id?: number;
  title: string;
  company: string;
  duration: string;
  desc: string;
  thumbnail: string;
  className?: string;
};

const Experience = () => {
  const ref = useRef(null);
  const [experience, setExperience] = useState<Experience[]>([]);

  useEffect(() => {
    fetch("/api/experience")
      .then((res) => res.json())
      .then((data) => {
        setExperience(Array.isArray(data) && data.length ? data : []);
      })
      .catch(() => {
        setExperience([]);
      });
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="md:py-10 w-full" id="experience" ref={ref}>
      <h1 className="heading text-center text-2xl md:text-4xl">
        My <span className="text-purple">work experience</span>
      </h1>

      <div className="relative mt-12 md:mt-16 max-w-5xl mx-auto px-4 md:px-0">
        {experience.length === 0 ? (
          <div className="flex flex-col items-center gap-3 mt-20">
            <div className="text-5xl">🚧</div>
            <p className="text-gray-400 text-lg">Experience coming soon</p>
            <p className="text-gray-600 text-sm">Check back later!</p>
          </div>
        ) : (
          <>
            {/* Timeline line */}
            <div className="absolute left-4 md:left-5 top-0 h-full w-0.5 bg-slate-800" />

            {/* Animated progress line */}
            <motion.div
              style={{ height: lineHeight }}
              className="absolute left-4 md:left-5 top-0 w-0.5 bg-linear-to-b from-purple-500 to-purple-300"
            />

            <div className="flex flex-col gap-10 md:gap-12">
              {experience.map((card, index) => (
                <motion.div
                  key={card._id || card.id || index}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-4 md:gap-6 group"
                >
                  {/* Timeline Dot */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm md:text-base font-bold z-10">
                      {index + 1}
                    </div>
                    <div className="absolute w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-500 opacity-30 blur-xl group-hover:opacity-70 transition duration-300" />
                  </div>

                  {/* Card */}
                  <div className="w-full bg-[#04071d] border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 transition-all duration-300 hover:scale-[1.02] md:hover:scale-[1.03] hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20">
                    <div className="flex items-start md:items-center gap-3 md:gap-4">
                      <Image
                        src={card.thumbnail}
                        alt={card.company}
                        width={72}
                        height={72}
                        className="w-18 h-18 object-contain rounded-lg p-1"
                        loading="lazy"
                        quality={80}
                      />
                      <div>
                        <h2 className="text-base md:text-xl font-bold leading-tight">
                          {card.title}
                        </h2>
                        <p className="text-purple font-semibold text-sm md:text-base">
                          {card.company}
                        </p>
                        <p className="text-gray-400 text-xs md:text-sm">
                          {card.duration}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 md:mt-4 text-gray-300 text-sm md:text-base leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Experience;
