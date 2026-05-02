"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import MagicButton from "@/components/ui/magicButton";
import { useEffect } from "react";

const Hyperspeed = dynamic(() => import("@/components/ui/Hyperspeed"), {
  ssr: false,
});

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Memoize to avoid unnecessary WebGL recreations
  const effectOptions = useMemo(
    () => ({
      distortion: "turbulentDistortion",
      length: 400,
      roadWidth: 10,
      islandWidth: 2,
      lanesPerRoad: 3,
      fov: 80,
      fovSpeedUp: 150,
      speedUp: 2,
      carLightsFade: 0.4,
      totalSideLightSticks: 10,
      lightPairsPerRoadWay: 20,
      shoulderLinesWidthPercentage: 0.05,
      brokenLinesWidthPercentage: 0.1,
      brokenLinesLengthPercentage: 0.5,
      lightStickWidth: [0.12, 0.5] as [number, number],
      lightStickHeight: [1.3, 1.7] as [number, number],
      movingAwaySpeed: [60, 80] as [number, number],
      movingCloserSpeed: [-120, -160] as [number, number],
      carLightsLength: [12, 80] as [number, number],
      carLightsRadius: [0.05, 0.14] as [number, number],
      carWidthPercentage: [0.3, 0.5] as [number, number],
      carShiftX: [-0.8, 0.8] as [number, number],
      carFloorSeparation: [0, 5] as [number, number],
      colors: {
        roadColor: 0x080808,
        islandColor: 0x0a0a0a,
        background: 0x000000,
        shoulderLines: 0xffffff,
        brokenLines: 0xffffff,
        leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
        rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
        sticks: 0x03b3c3,
      },
    }),
    [],
  );

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("admin_token", data.accessToken);
        localStorage.setItem("admin_refresh", data.refreshToken);
        router.push("/ad3minp-d3v");
      } else {
        setError("Invalid username or password");
      }
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen h-dvh w-full overflow-hidden">
      {/*Hyperspeed Background — full screen, interactive */}
      <div className="absolute inset-0 z-0">
        {ready && <Hyperspeed effectOptions={effectOptions} />}
      </div>

      {/* Form overlay — pointer-events-none so canvas gets clicks */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 pointer-events-none">
        <div className="w-full max-w-sm p-8 rounded-2xl border border-purple-500/20 bg-black/60 backdrop-blur-md pointer-events-auto">
          <h1 className="text-2xl font-bold text-purple-300 mb-2 text-center">
            Admin Login
          </h1>
          <p className="text-gray-400 text-sm text-center mb-8">
            Enter your credentials to continue
          </p>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/50 border border-purple-500/20 focus:border-purple-400 outline-none text-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full p-3 rounded-xl bg-black/50 border border-purple-500/20 focus:border-purple-400 outline-none text-white"
            />

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <MagicButton
              title={loading ? "Logging in..." : "Login"}
              icon={null}
              position="right"
              handleClick={handleLogin}
              otherClasses="w-full justify-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
