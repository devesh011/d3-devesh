"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { BackgroundGradientAnimation } from "./background-gradient-animation";
import animationData from "@/data/confetti.json";
import MagicButton from "./magicButton";
import Lottie from "lottie-react";
import { useRef, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        // change gap-4 to gap-8, change grid-cols-3 to grid-cols-5, remove md:auto-rows-[18rem], add responsive code
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  id,
  title,
  description,
  //   remove unecessary things here
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  id: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const leftLists = ["ReactJS", "Express", "Typescript", "MongoDB", "HTML"];
  const rightLists = ["Javascript", "NodeJS", "NextJS", "TailwindCSS", "Git"];

  const [copied, setCopied] = useState(false);
  const lottieRef = useRef<any>(null);

  const handleCopy = async () => {
    const text = "0dev.87@gmail.com";

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      //Mobile fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);

    lottieRef.current?.stop();
    lottieRef.current?.play();

    navigator.vibrate?.(40);

    setTimeout(() => {
      setCopied(false);
      lottieRef.current?.stop();
    }, 2000);
  };

  const handleResumeDownload = () => {
    const link = document.createElement("a");
    link.href = "/Devesh Prajapati.pdf"; // path from public folder
    link.download = "Devesh Prajapati.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-300 shadow-input justify-between flex flex-col space-y-4",
        className,
      )}
      style={{
        background: "rgb(4,7,29)",
      }}
    >
      {/* IMAGE WRAPPER */}
      <div className={`${id === 6 && "flex justify-center"} h-full`}>
        <div className="w-full h-full absolute">
          {img && (
            <img
              src={img}
              alt={img}
              className={cn(imgClassName, "object-cover object-center")}
            />
          )}
        </div>

        {/* 🔥 ONLY APPLY OVERLAY FOR ID:1 */}
        {id === 1 && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.6)]" />
          </>
        )}

        <div
          className={`absolute right-0 -bottom-5 ${
            id === 5 && "w-full opacity-80"
          }`}
        >
          {spareImg && (
            <img
              src={spareImg}
              alt={spareImg}
              className="object-cover object-center w-full h-full"
            />
          )}
        </div>
      </div>
      {id === 6 && ( // add background animation , remove the p tag
        <BackgroundGradientAnimation>
          {" "}
          <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>{" "}
        </BackgroundGradientAnimation>
      )}
      {/* MAIN CONTENT */}
      <div
        className={cn(
          titleClassName,
          "group-hover/bento:translate-x-2 transition duration-300 relative md:h-full flex flex-col px-5 p-5 lg:p-10 z-10",
          id === 2 && "items-center text-center",
        )}
      >
        {/* DESCRIPTION */}
        <div className="font-sans font-extralight md:text-xs lg:text-base text-sm text-gray-300 z-10">
          {description}
        </div>

        {/* TITLE */}
        <div className="font-sans text-lg lg:text-3xl max-w-96 font-bold text-white z-10">
          {title}
        </div>

        {/* YOUR EXISTING FEATURES (UNCHANGED) */}
        {id === 3 && (
          <div className="flex gap-2 lg:gap-5 w-fit absolute -right-3 lg:-right-2 rotate-[-45deg]">
            <div className="flex flex-col gap-8 -translate-y-6">
              {leftLists.map((item, i) => (
                <span
                  key={i}
                  className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-60 rounded-lg text-center bg-[#10132E] rotate-[12deg]"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-8 -translate-y-6">
              {rightLists.map((item, i) => (
                <span
                  key={i}
                  className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-60 rounded-lg text-center bg-[#10132E] rotate-[12deg]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* RESUME BUTTON */}
        {id === 2 && (
          <div className="mt-5 flex justify-center w-full z-10">
            <MagicButton
              title="Download My Resume"
              icon={<FiDownload />}
              position="right"
              handleClick={handleResumeDownload}
              otherClasses="!bg-[#161A31]"
            />
          </div>
        )}

        {id === 6 && (
          <div className="mt-5 relative">
            <div
              className={`absolute -bottom-5 right-0 ${copied ? "block" : "block"}`}
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                autoplay={false}
                loop={false}
                style={{ width: 200, height: 200 }}
              />
            </div>
            <MagicButton
              title={copied ? "Email is Copied!" : "Copy my email address"}
              icon={<IoCopyOutline />}
              position="left"
              handleClick={handleCopy}
              otherClasses="!bg-[#161A31]"
            />
          </div>
        )}
      </div>
    </div>
  );
};
