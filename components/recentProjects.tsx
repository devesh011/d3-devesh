"use client";

import Image from "next/image";
import { PinContainer } from "./ui/3d-pin";
import { FaLocationArrow } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { projects as fallbackProjects } from "@/data";

// Define a type at the top of the file
type Project = {
  _id?: string;
  id?: number;
  title: string;
  des: string;
  img: string;
  link: string;
  iconLists: string[];
};

const RecentProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data?.length) {
          setProjects(data); // ✅ DB projects
        } else if (fallbackProjects?.length) {
          setProjects(fallbackProjects); // ✅ fallback from data/index.ts
        } else {
          setProjects([]); // ✅ empty → shows "coming soon"
        }
        setLoading(false);
      })
      .catch(() => {
        setProjects(fallbackProjects?.length ? fallbackProjects : []);
        setLoading(false);
      });
  }, []);

  // ✅ loading UI
  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading projects...</p>
      </div>
    );
  }

  // ✅ empty state
  if (!projects.length) {
    return (
      <div className="py-20 text-center" id="projects">
        <h1 className="heading mb-6">
          A small selection of{" "}
          <span className="text-purple">recent projects</span>
        </h1>
        <div className="flex flex-col items-center gap-3 mt-10">
          <div className="text-5xl">🚧</div>
          <p className="text-gray-400 text-lg">Projects coming soon</p>
          <p className="text-gray-600 text-sm">Check back later!</p>
        </div>
      </div>
    );
  }
  return (
    <div className="py-15" id="projects">
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>

      <div className="flex flex-wrap items-center justify-center p-4 gap-x-24 gap-y-8 mt-2">
        {projects.map((item: Project, index: number) => (
          <div
            key={item._id || item.id || index} // ✅ safe key
            className="sm:h-164 lg:min-h-130 h-128 flex items-center justify-center sm:w-142.5 w-[80vw]"
          >
            <PinContainer title={item.title} href={item.link}>
              {/* IMAGE SECTION */}
              <div className="relative flex items-center justify-center sm:w-142.5 sm:h-[40vh] w-[80vw] overflow-hidden h-[30vh] mb-10">
                <div
                  className="relative w-full h-full overflow-hidden lg:rounded-3xl"
                  style={{ backgroundColor: "#13162D" }}
                >
                  <Image
                    src="/bg.png"
                    alt="bgimg"
                    fill
                    sizes="(max-width: 768px) 80vw, 570px"
                  />
                </div>

                <Image
                  src={item.img}
                  alt="cover"
                  className="z-10 absolute bottom-0"
                  width={500}
                  height={500}
                  style={{ width: "auto", height: "auto" }}
                />
              </div>

              {/* TITLE */}
              <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                {item.title}
              </h1>

              {/* DESCRIPTION */}
              <p
                className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                style={{ color: "#BEC1DD", margin: "1vh 0" }}
              >
                {item.des}
              </p>

              {/* FOOTER */}
              <div className="flex items-center justify-between mt-7 mb-3">
                {/* TECH ICONS */}
                <div className="flex items-center">
                  {item.iconLists?.map((icon: string, i: number) => (
                    <div
                      key={i}
                      className="border border-white/20 rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                      style={{
                        transform: `translateX(-${5 * i + 2}px)`,
                      }}
                    >
                      <Image
                        src={icon}
                        alt="tech"
                        width={32}
                        height={32}
                        className="p-2"
                      />
                    </div>
                  ))}
                </div>

                {/* LINK */}
                <a
                  href={item.link}
                  target="_blank"
                  className="flex items-center"
                >
                  <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                    Check Live Site
                  </p>
                  <FaLocationArrow className="ms-3" color="#CBACF9" />
                </a>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;
