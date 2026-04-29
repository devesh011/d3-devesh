"use client";

import React, { useState, useRef, useEffect } from "react";
import emailjs from "emailjs-com";
import toast, { Toaster } from "react-hot-toast";
import { BackgroundBeams } from "./ui/spotlight";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { EncryptedText } from "./ui/encrypted-text";
import MagicButton from "./ui/magicButton";

import { FaCode, FaPaperPlane } from "react-icons/fa";

const Hero = () => {
  const [open, setOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  const formRef = useRef(null);

  /* ================= SCROLL LOCK + NAVBAR HIDE ================= */
  useEffect(() => {
    const navbar = document.getElementById("navbar");

    if (open) {
      document.body.style.overflow = "hidden";
      if (navbar) navbar.style.display = "none";
    } else {
      document.body.style.overflow = "auto";
      if (navbar) navbar.style.display = "flex";
    }

    return () => {
      document.body.style.overflow = "auto";
      if (navbar) navbar.style.display = "flex";
    };
  }, [open]);

  /* ================= CLOSE MODAL ================= */
  const handleClose = () => {
    if (isDirty) {
      toast.custom(() => (
        <div className="bg-[#04071d] border border-yellow-500/30 text-white px-6 py-4 rounded-2xl flex items-center gap-4">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          <div>
            <p className="font-semibold text-yellow-300">Message not sent</p>
            <p className="text-sm text-gray-400">
              You closed the form before submitting
            </p>
          </div>
        </div>
      ));
    }

    setOpen(false);
    setIsDirty(false);
  };

  /* ================= SEND EMAIL ================= */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) {
      toast.error("Form reference not found");
      return;
    }

    setLoading(true); // ✅ START loading

    const toastId = toast.loading("Sending message...", {
      style: {
        background: "#04071d",
        color: "#fff",
        border: "1px solid #374151",
      },
    });

    emailjs
      .sendForm(
        "service_ihqwm6r",
        "template_z6mv89k",
        formRef.current,
        "ayUrdo2AsLGLkwQuQ",
      )
      .then(
        () => {
          toast.dismiss(toastId);
          setLoading(false); // ✅ STOP loading

          toast.custom(() => (
            <div className="bg-[#04071d] border border-purple-500/30 shadow-lg shadow-purple-500/20 text-white px-6 py-4 rounded-2xl flex items-center gap-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold text-purple-300">
                  Message Sent Successfully
                </p>
                <p className="text-sm text-gray-400">
                  Thanks for reaching out 🚀
                </p>
              </div>
            </div>
          ));

          (e.target as HTMLFormElement).reset();
          setIsDirty(false);
          setOpen(false);
        },
        () => {
          toast.dismiss(toastId);
          setLoading(false); // ✅ STOP loading

          toast.custom(() => (
            <div className="bg-[#04071d] border border-red-500/30 text-white px-6 py-4 rounded-2xl flex items-center gap-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold text-red-300">
                  Failed to Send Message
                </p>
                <p className="text-sm text-gray-400">Please try again later</p>
              </div>
            </div>
          ));
        },
      );
  };

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 5); // small delay so everything syncs

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pb-15 pt-36" id="home">
      <Toaster position="top-right" />

      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-screen">
        <BackgroundBeams />
      </div>

      {/* Content */}
      <div
        className={`flex justify-center relative my-20 z-10 transition-all duration-8 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center">
          <h2 className="uppercase tracking-widest text-xs text-blue-100">
            FULL-STACK WEB DEVELOPER
          </h2>

          <TextGenerateEffect
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
            words="Turning Ideas into High-Performance Digital Solutions"
          />

          <p className="text-center mb-4 text-sm md:text-lg lg:text-2xl">
            <EncryptedText
              text="Hi, I'm Devesh Prajapati (aka d3 / d3v8ll)"
              revealDelayMs={20}
              flipDelayMs={20}
            />
          </p>

          {/* Buttons */}
          <div className="flex gap-4 w-full max-w-lg">
            <a href="#about" className="flex-1">
              <MagicButton
                title="View My Work"
                icon={<FaCode />}
                position="right"
                otherClasses="!w-full !md:w-full"
              />
            </a>

            <div className="flex-1">
              <MagicButton
                title="Get In Touch"
                icon={<FaPaperPlane />}
                position="right"
                handleClick={() => setOpen(true)}
                otherClasses="!w-full !md:w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-9999"
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#04071d] p-6 rounded-2xl w-full max-w-md relative"
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-white text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">Get In Touch</h2>

            {/* Form */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                onChange={() => setIsDirty(true)}
                className="p-3 rounded-lg bg-black-200 border border-gray-700"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                onChange={() => setIsDirty(true)}
                className="p-3 rounded-lg bg-black-200 border border-gray-700"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                required
                onChange={() => setIsDirty(true)}
                className="p-3 rounded-lg bg-black-200 border border-gray-700"
              />

              <MagicButton
                title={loading ? "Sending..." : "Send Message"}
                icon={<FaPaperPlane />}
                position="right"
                type="submit"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
