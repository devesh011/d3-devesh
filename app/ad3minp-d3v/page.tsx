"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MagicButton from "@/components/ui/magicButton";

export default function AdminPage() {
  const router = useRouter();

  type Message = {
    name: string;
    email: string;
    message: string;
    createdAt: string;
  };

  type Project = {
    _id: string;
    title: string;
    des: string;
    img: string;
    link: string;
    iconLists: string[];
  };

  type FormData = {
    _id?: string;
    title: string;
    des: string;
    img: string;
    link: string;
    iconLists: string[];
  };

  type Experience = {
    _id?: string;
    title: string;
    company: string;
    duration: string;
    desc: string;
    thumbnail: string;
  };

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [expForm, setExpForm] = useState<Experience>({
    title: "",
    company: "",
    duration: "",
    desc: "",
    thumbnail: "",
  });

  /* -TAB -*/
  const [tab, setTab] = useState<"messages" | "projects" | "experience">(
    "messages",
  );

  /* -MESSAGE STATES (UNCHANGED) -*/
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* -PROJECT STATES -*/
  const [projects, setProjects] = useState<Project[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [icons, setIcons] = useState<string[]>([]);

  const [form, setForm] = useState<FormData>({
    title: "",
    des: "",
    img: "",
    link: "",
    iconLists: [],
  });

  const inputStyle =
    "w-full p-3 rounded-xl bg-[#0A0F2C] border border-purple-500/20 focus:border-purple-400 outline-none";

  /* -AUTH (SINGLE CLEAN) -*/
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const refreshToken = localStorage.getItem("admin_refresh");

    if (!token && !refreshToken) {
      router.push("/ad3minp-login");
      return;
    }

    //Verify access token
    fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (!data.valid) {
          // Try refresh token
          if (refreshToken) {
            const refreshRes = await fetch("/api/refresh", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            });

            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              localStorage.setItem("admin_token", refreshData.accessToken);
              //New access token, stay on page
            } else {
              //Refresh also failed, logout
              localStorage.removeItem("admin_token");
              localStorage.removeItem("admin_refresh");
              router.push("/ad3minp-login");
            }
          } else {
            localStorage.removeItem("admin_token");
            router.push("/ad3minp-login");
          }
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -FETCH -*/
  const fetchMessages = () => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      });
  };

  const fetchProjects = () => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects);
  };

  const fetchFiles = () => {
    fetch("/api/files")
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || []);
        setIcons(data.icons || []);
      });
  };

  const fetchExperiences = () => {
    fetch("/api/experience")
      .then((res) => res.json())
      .then(setExperiences);
  };

  useEffect(() => {
    // now they're declared before use
    fetchMessages();
    fetchProjects();
    fetchFiles();
    fetchExperiences();
  }, []);

  const handleExpAdd = async () => {
    const isEdit = !!(expForm as Experience & { _id?: string })._id;
    await fetch("/api/experience", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expForm),
    });
    setExpForm({
      title: "",
      company: "",
      duration: "",
      desc: "",
      thumbnail: "",
    });
    fetchExperiences();
  };

  const handleExpEdit = (exp: Experience) => {
    setExpForm(exp);
    setTab("experience" as "messages" | "projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExpDelete = async (id: string) => {
    await fetch(`/api/experience?id=${id}`, { method: "DELETE" });
    fetchExperiences();
  };

  /* -PROJECT CRUD -*/
  const handleAdd = async () => {
    const isEdit = !!form._id;

    await fetch("/api/projects", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form), //clean,
    });

    setForm({
      title: "",
      des: "",
      img: "",
      link: "",
      iconLists: [],
    });

    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    fetchProjects();
  };

  const handleEdit = (proj: Project) => {
    setForm(proj);
    setTab("projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleIcon = (icon: string) => {
    setForm((prev: FormData) => {
      const exists = prev.iconLists.includes(icon);
      return {
        ...prev,
        iconLists: exists
          ? prev.iconLists.filter((i: string) => i !== icon)
          : [...prev.iconLists, icon],
      };
    });
  };

  /* -MESSAGE LOGIC (UNCHANGED) -*/
  const filteredMessages = messages
    .filter((msg) => {
      const text = `${msg.name} ${msg.email} ${msg.message}`.toLowerCase();
      return text.includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === "latest" ? dateB - dateA : dateA - dateB;
    });

  /* -KEYBOARD NAV -*/
  useEffect(() => {
    if (tab !== "messages") return; // 🔥 important fix

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!filteredMessages.length) return;

      const cols = window.innerWidth >= 768 ? 2 : 1;

      if (e.key === "Escape") {
        setSelectedIndex(-1);
        return;
      }

      if (selectedIndex === -1) {
        if (["ArrowDown", "ArrowRight"].includes(e.key)) {
          setSelectedIndex(0);
          return;
        }
        if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
          setSelectedIndex(filteredMessages.length - 1);
          return;
        }
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          Math.min(prev + cols, filteredMessages.length - 1),
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - cols, 0));
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          Math.min(prev + 1, filteredMessages.length - 1),
        );
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredMessages, selectedIndex, tab]);

  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [selectedIndex]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");

    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-purple-500/20 text-purple-300 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="min-h-screen text-white px-4 sm:px-6 py-6 sm:py-10 relative">
      {/* Premium background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base */}
        <div className="absolute inset-0 bg-[#04071d]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />

        {/* Glowing orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-800/10 rounded-full blur-3xl" />

        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-300">
            Admin Panel
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Messages from your portfolio
          </p>
        </div>
        <MagicButton
          title="Logout"
          icon={null}
          position="right"
          handleClick={() => {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_refresh");
            router.push("/ad3minp-login");
          }}
          containerClass="w-full sm:w-auto"
        />
      </div>

      {/* TABS */}
      <div suppressHydrationWarning className="flex gap-3 mb-8">
        {["messages", "projects", "experience"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as "messages" | "projects" | "experience")}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              tab === t
                ? "bg-purple-600"
                : "border border-purple-500/20 text-gray-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="w-full h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent mb-10" />

      {/* -MESSAGES -*/}
      {tab === "messages" && (
        <>
          {/* SEARCH + SORT */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#04071d] border border-purple-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="mt-2 text-xs text-purple-400"
                  >
                    Clear search
                  </button>
                )}
              </div>

              {/* SORT */}
              <div className="flex bg-[#04071d] border border-purple-500/20 rounded-lg p-1 h-11.5 items-center w-full sm:w-auto">
                <button
                  onClick={() => setSort("latest")}
                  className={`px-4 py-2 rounded-md text-sm transition ${
                    sort === "latest"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Latest
                </button>

                <button
                  onClick={() => setSort("oldest")}
                  className={`px-4 py-2 rounded-md text-sm transition ${
                    sort === "oldest"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Oldest
                </button>
              </div>
            </div>
          </div>

          {/* MESSAGE LIST */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredMessages.map((msg, i) => (
              <div
                key={i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`
    p-4 rounded-xl bg-[#04071d] border transition duration-300

    border-purple-500/20 shadow-md shadow-purple-500/10 hover:shadow-purple-500/30 hover:scale-[1.02]
  "${selectedIndex === i ? "border-purple-400" : ""}`}
              >
                <p className="text-purple-300">
                  {highlightText(msg.name, search)}
                </p>
                <p className="text-gray-500 text-xs">
                  {highlightText(msg.email, search)}
                </p>
                <p>{highlightText(msg.message, search)}</p>
                <p className="text-xs text-gray-500 mt-3">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* -PROJECTS -*/}
      {tab === "projects" && (
        <>
          {/* FORM */}
          <div className="mb-10 p-6 rounded-2xl border border-purple-500/20">
            <h2 className="text-xl text-purple-300 mb-6">
              {form._id ? "Edit Project" : "Add Project"}
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              {/* TITLE */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputStyle}
                />
              </div>

              {/* LINK */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Live Link
                </label>
                <input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className={inputStyle}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 mb-1 block">
                  Description
                </label>
                <textarea
                  value={form.des}
                  onChange={(e) => setForm({ ...form, des: e.target.value })}
                  className={inputStyle}
                />
              </div>

              {/* IMAGE SELECT */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Select Image
                </label>

                <div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto
                    [&::-webkit-scrollbar]:w-1.5
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-purple-500/40
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb:hover]:bg-purple-400/60
                    pr-1"
                >
                  {images.map((img) => (
                    <div
                      key={img}
                      onClick={() => setForm({ ...form, img })}
                      className={`relative border-2 rounded-xl cursor-pointer p-1.5
        transition-all duration-200 hover:scale-105
        ${
          form.img === img
            ? "border-purple-400 bg-purple-500/10 shadow-md shadow-purple-500/20"
            : "border-white/5 bg-white/5 hover:border-purple-500/40"
        }`}
                    >
                      <img
                        src={img}
                        alt="project image"
                        className="w-full h-14 object-contain rounded-lg"
                      />
                      {form.img === img && (
                        <div className="absolute top-1 right-1 w-3 h-3 bg-purple-400 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>

                {form.img && (
                  <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-purple-500/20">
                    <img
                      src={form.img}
                      alt="selected"
                      className="w-16 h-12 object-contain rounded-lg"
                    />
                    <div>
                      <p className="text-xs text-gray-400">Selected</p>
                      <p className="text-xs text-purple-300 truncate max-w-37.5">
                        {form.img}
                      </p>
                    </div>
                    <button
                      onClick={() => setForm({ ...form, img: "" })}
                      className="ml-auto text-xs text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* ICON SELECT */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Select Icons
                </label>

                <div
                  className="flex flex-wrap gap-2 max-h-40 overflow-y-auto
    [&::-webkit-scrollbar]:w-1.5
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-purple-500/40
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb:hover]:bg-purple-400/60
    pr-1"
                >
                  {icons.map((icon) => (
                    <div
                      key={icon}
                      onClick={() => toggleIcon(icon)}
                      className={`w-10 h-10 flex items-center justify-center border rounded cursor-pointer ${
                        form.iconLists.includes(icon)
                          ? "border-purple-400 bg-purple-500/20"
                          : "border-gray-600"
                      }`}
                    >
                      <img
                        src={icon}
                        alt="tech icon"
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleAdd}
              className="mt-6 bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              {form._id ? "Update Project" : "Add Project"}
            </button>
          </div>

          <div className="w-full h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent mb-10" />

          {/* PROJECT LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((proj: Project) => (
              <div
                key={proj._id}
                className="p-5 rounded-2xl border border-purple-500/20 bg-[#0A0F2C] hover:shadow-lg hover:shadow-purple-500/20 transition"
              >
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div className="flex-1">
                    <h2 className="text-purple-300 font-semibold text-lg">
                      {proj.title}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                      {proj.des}
                    </p>
                  </div>

                  <img
                    src={proj.img}
                    alt={proj.title}
                    className="w-full sm:w-16 h-24 sm:h-12 object-contain rounded"
                  />
                </div>

                {/* ICONS */}
                <div className="flex gap-2 mt-3">
                  {proj.iconLists?.map((icon: string, i: number) => (
                    <img
                      key={i}
                      src={icon}
                      alt="tech icon"
                      className="w-5 h-5"
                    />
                  ))}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-5 pt-4 border-t border-purple-500/10">
                  <button
                    onClick={() => handleEdit(proj)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg w-full sm:w-auto justify-center 
    bg-linear-to-r from-yellow-500/10 to-orange-500/10
    border border-yellow-500/20 text-yellow-400 
    hover:border-yellow-400/50 hover:bg-yellow-500/20
    hover:scale-105 active:scale-95
    transition-all duration-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(proj._id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg w-full sm:w-auto justify-center
    bg-linear-to-r from-red-500/10 to-pink-500/10
    border border-red-500/20 text-red-400
    hover:border-red-400/50 hover:bg-red-500/20
    hover:scale-105 active:scale-95
    transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* -EXPERIENCE -*/}
      {tab === "experience" && (
        <>
          {/* FORM */}
          <div className="mb-10 p-6 rounded-2xl border border-purple-500/20">
            <h2 className="text-xl text-purple-300 mb-6">
              {(expForm as Experience & { _id?: string })._id
                ? "Edit Experience"
                : "Add Experience"}
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Job Title
                </label>
                <input
                  value={expForm.title}
                  onChange={(e) =>
                    setExpForm({ ...expForm, title: e.target.value })
                  }
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Company
                </label>
                <input
                  value={expForm.company}
                  onChange={(e) =>
                    setExpForm({ ...expForm, company: e.target.value })
                  }
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Duration
                </label>
                <input
                  value={expForm.duration}
                  placeholder="e.g. Oct 2024 – Jun 2025"
                  onChange={(e) =>
                    setExpForm({ ...expForm, duration: e.target.value })
                  }
                  className={inputStyle}
                />
              </div>

              {/* COMPANY IMAGE — same as project image select */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Company Logo
                </label>
                <div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-purple-500/40
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb:hover]:bg-purple-400/60
            pr-1"
                >
                  {images.map((img) => (
                    <div
                      key={img}
                      onClick={() => setExpForm({ ...expForm, thumbnail: img })}
                      className={`relative border-2 rounded-xl cursor-pointer p-1.5
                transition-all duration-200 hover:scale-105
                ${
                  expForm.thumbnail === img
                    ? "border-purple-400 bg-purple-500/10 shadow-md shadow-purple-500/20"
                    : "border-white/5 bg-white/5 hover:border-purple-500/40"
                }`}
                    >
                      <img
                        src={img}
                        alt="company logo"
                        className="w-full h-14 object-contain rounded-lg"
                      />
                      {expForm.thumbnail === img && (
                        <div className="absolute top-1 right-1 w-3 h-3 bg-purple-400 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>

                {expForm.thumbnail && (
                  <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-purple-500/20">
                    <img
                      src={expForm.thumbnail}
                      alt="selected logo"
                      className="w-16 h-12 object-contain rounded-lg"
                    />
                    <div>
                      <p className="text-xs text-gray-400">Selected</p>
                      <p className="text-xs text-purple-300 truncate max-w-37.5">
                        {expForm.thumbnail}
                      </p>
                    </div>
                    <button
                      onClick={() => setExpForm({ ...expForm, thumbnail: "" })}
                      className="ml-auto text-xs text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 mb-1 block">
                  Description
                </label>
                <textarea
                  value={expForm.desc}
                  onChange={(e) =>
                    setExpForm({ ...expForm, desc: e.target.value })
                  }
                  className={inputStyle}
                  rows={3}
                />
              </div>
            </div>

            <button
              onClick={handleExpAdd}
              className="mt-6 bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              {(expForm as Experience & { _id?: string })._id
                ? "Update Experience"
                : "Add Experience"}
            </button>
          </div>

          <div className="w-full h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent mb-10" />

          {/* EXPERIENCE LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {experiences.map((exp) => (
              <div
                key={(exp as Experience & { _id?: string })._id}
                className="p-5 rounded-2xl border border-purple-500/20 bg-[#0A0F2C] hover:shadow-lg hover:shadow-purple-500/20 transition"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={exp.thumbnail}
                    alt={exp.company}
                    className="w-14 h-14 object-contain rounded-lg border border-purple-500/20 p-1"
                  />
                  <div className="flex-1">
                    <h2 className="text-purple-300 font-semibold">
                      {exp.title}
                    </h2>
                    <p className="text-gray-400 text-sm">{exp.company}</p>
                    <p className="text-gray-500 text-xs">{exp.duration}</p>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mt-3 line-clamp-2">
                  {exp.desc}
                </p>

                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-5 pt-4 border-t border-purple-500/10">
                  <button
                    onClick={() => handleExpEdit(exp)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg w-full sm:w-auto justify-center
              bg-linear-to-r from-yellow-500/10 to-orange-500/10
              border border-yellow-500/20 text-yellow-400
              hover:border-yellow-400/50 hover:bg-yellow-500/20
              hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleExpDelete(
                        (exp as Experience & { _id?: string })._id!,
                      )
                    }
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg w-full sm:w-auto justify-center
              bg-linear-to-r from-red-500/10 to-pink-500/10
              border border-red-500/20 text-red-400
              hover:border-red-400/50 hover:bg-red-500/20
              hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
