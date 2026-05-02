"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { socialMedia } from "@/data";
import { FaArrowUp } from "react-icons/fa6";

const EDGE = 16;

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState("left");
  const [showTop, setShowTop] = useState(false);

  const startX = useRef(0);
  const footerRef = useRef(null);
  const year = new Date().getFullYear();

  /* -WHATSAPP LINK -*/
  const getWhatsAppLink = () => {
    const message =
      "Hey Devesh, I checked out your portfolio—really liked your work! Would love to connect 🚀";
    return `https://wa.me/918141864929?text=${encodeURIComponent(message)}`;
  };

  /* -EDGE SWIPE -*/
  const onEdgeTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    edge: string,
  ) => {
    startX.current = e.touches[0].clientX;
    setSide(edge);
  };

  const onEdgeTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const diffX = e.touches[0].clientX - startX.current;

    if (side === "left" && diffX > 60) setOpen(true);
    if (side === "right" && diffX < -60) setOpen(true);
  };

  /* -SCROLL CLOSE -*/
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      if (open && currentScrollY > lastScrollY + 8) {
        setOpen(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  /* -FOOTER VISIBILITY -*/
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowTop(entry.isIntersecting);
      },
      { threshold: 0.3 },
    );

    const currentFooter = footerRef.current;

    if (currentFooter) observer.observe(currentFooter);

    return () => {
      if (currentFooter) observer.unobserve(currentFooter);
    };
  }, []);

  return (
    <>
      {/* -FOOTER -*/}
      <footer
        ref={footerRef}
        className="w-full pt-2 pb-10 relative"
        id="contact"
      >
        <div className="flex flex-col items-center text-center px-4">
          <h1 className="heading lg:max-w-[45vw]">
            Got a project in mind?{" "}
            <span className="text-purple">Let’s make it happen</span>
          </h1>

          <p className="text-white-200 my-5">
            Open to new ideas, collaborations, or just a quick chat.
          </p>

          {/* SCROLL TO TOP */}
          {showTop && (
            <div className="mt-5 flex justify-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-12 h-12 flex items-center justify-center
                rounded-full bg-purple-600 text-white
                shadow-lg hover:scale-110 hover:shadow-purple-500/40
                transition duration-300"
              >
                <FaArrowUp />
              </button>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-6">
            © {year} Devesh Prajapati
          </p>
        </div>
      </footer>

      {/* -DESKTOP SOCIAL -*/}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
        {socialMedia.map((info) => {
          const link = info.link === "whatsapp" ? getWhatsAppLink() : info.link;

          return (
            <a
              key={info.id}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center 
              bg-black-200/70 backdrop-blur-md
              rounded-lg border border-black-300/40 
              hover:scale-110 transition duration-300"
            >
              <Image
                src={info.img}
                alt="social"
                width={18}
                height={18}
                style={{ width: "18px", height: "18px" }}
              />
            </a>
          );
        })}
      </div>

      {/* -EDGE SWIPE -*/}
      <div
        className="fixed left-0 top-0 h-full md:hidden z-9999"
        style={{ width: EDGE }}
        onTouchStart={(e) => onEdgeTouchStart(e, "left")}
        onTouchMove={onEdgeTouchMove}
      />

      <div
        className="fixed right-0 top-0 h-full md:hidden z-9999"
        style={{ width: EDGE }}
        onTouchStart={(e) => onEdgeTouchStart(e, "right")}
        onTouchMove={onEdgeTouchMove}
      />

      {/* -MOBILE SIDEBAR -*/}
      <div
        className={`fixed top-1/2 -translate-y-1/2 md:hidden z-9999
        transition-transform duration-300
        ${side === "left" ? "left-0" : "right-0"}
        ${
          open
            ? "translate-x-0"
            : side === "left"
              ? "-translate-x-[85%]"
              : "translate-x-[85%]"
        }`}
      >
        <div
          className={`flex items-center
          bg-white/5 backdrop-blur-2xl
          border border-white/5 shadow-lg
          ${side === "left" ? "rounded-r-xl" : "rounded-l-xl"}`}
        >
          <div className="flex flex-col gap-3 p-3">
            {socialMedia.map((info) => {
              const link =
                info.link === "whatsapp" ? getWhatsAppLink() : info.link;

              return (
                <a
                  key={info.id}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center 
                  bg-black-200/70 backdrop-blur-md
                  border border-black-300/40
                  rounded-lg 
                  hover:scale-110 transition duration-300"
                >
                  <Image
                    src={info.img}
                    alt="social"
                    width={14}
                    height={14}
                    style={{ width: "14px", height: "14px" }}
                  />
                </a>
              );
            })}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="px-2 h-full flex items-center justify-center"
          >
            <span
              className={`text-white/60 transition-transform duration-300
              ${!open ? "animate-[arrowHint_1.4s_ease-in-out_infinite]" : ""}
              ${
                side === "left"
                  ? open
                    ? "rotate-180"
                    : ""
                  : open
                    ? ""
                    : "rotate-180"
              }`}
            >
              ❯
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
