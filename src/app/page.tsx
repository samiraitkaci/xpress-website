"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Share2, Play, Pause } from "lucide-react";

export default function PlayerPage() {
  const [nowPlaying, setNowPlaying] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [currentShow, setCurrentShow] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.broadcast.radio/api/nowplaying/2916");
        const data = await res.json();

        const np = data.body.now_playing || {};
        const schedule = data.body.schedule || [];
        const current = schedule.find((s: any) => s.current);

        setNowPlaying({
          title: np.title || "Unknown Title",
          artist: np.artist || "Unknown Artist",
          artwork: np.artworkUrl
            ? `https://api.broadcast.radio${np.artworkUrl}`
            : "/fallback-artwork.jpg"
        });

        if (current && current.content?.length > 0) {
          const show = current.content.find((c: any) => c.contentType?.slug === "show");
          const featuredImage = current.content.find((c: any) => c.contentType?.slug === "featuredImage");

          let imageUrl = "/fallback-presenter.jpg";
          if (featuredImage?.body?.startsWith("cms-blob_image/")) {
            const parts = featuredImage.body.split(":");
            if (parts.length >= 3) {
              const format = parts[0].split("/")[1];
              const uuid = parts[1];
              const alignment = parts[2];
              imageUrl = `https://brusercontent.broadcast.radio/api/image/${uuid}.${format}?g=${alignment}&w=500&c=true`;
            }
          }

          setCurrentShow({
            title: show?.display_title || "Live Show",
            image: imageUrl
          });
        }

        const recentTracks = data.body.recently_played || [];
        setRecent(
          recentTracks.map((track: any) => ({
            title: track.title || "Unknown Title",
            artist: track.artist || "Unknown Artist",
            artwork: track.artworkUrl
              ? `https://api.broadcast.radio${track.artworkUrl}`
              : "/fallback-artwork.jpg"
          }))
        );
      } catch (err) {
        console.error("Error fetching player data:", err);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.error("Playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <main className="relative min-h-screen text-black overflow-hidden pb-[100px]">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-60 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255, 0, 191, 1) 0%, transparent 80%)",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -20%)"
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle,rgba(255, 186, 253, 1) 0%, rgba(255, 255, 255, 1) 100%)"
          }}
        />
      </div>

      <img
        src="/x_shapes.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 w-full h-full object-cover opacity-30"
      />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 bg-white text-black backdrop-blur-md shadow-md border-b border-white/10 py-1.5">
          <div className="w-full px-4 py-2 flex items-center justify-start space-x-6 overflow-x-auto">
            <div className="flex-shrink-0 mr-4">
              <Link href="/">
                <Image
                  src="/xpress-logo-purple.png"
                  alt="Xpress Logo"
                  width={64}
                  height={64}
                  className="cursor-pointer"
                />
              </Link>
            </div>
            <nav className="overflow-x-auto flex-1 w-full md:w-auto md:flex-nowrap flex items-center space-x-6 text-sm md:text-lg scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">
              <Link href="/" className="hover:text-[#8e2de2] transition-colors">Home</Link>
              <Link href="/schedule" className="hover:text-[#8e2de2] transition-colors">Schedule</Link>
              <Link href="/#culture" className="flex-shrink-0">
                <Image
                  src="/quench-logo.png"
                  alt="Quench"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </Link>
            </nav>
          </div>
        </header>

        {currentShow && (
          <div className="flex flex-col items-center justify-center text-center my-10 px-4">
            <Image
              src={currentShow.image}
              alt={currentShow.title}
              width={240}
              height={240}
              className="rounded-lg shadow-xl object-cover mb-4"
            />
            <div className="flex items-center bg-pink-500 text-white font-medium px-5 py-2 rounded-full text-sm shadow-lg mb-2">
              <span className="relative flex w-2 h-2 mr-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              On air
            </div>
            <h1 className="text-2xl font-bold text-black">{currentShow.title}</h1>
            <div className="flex gap-4 mt-4">
              <Link href="/schedule">
                <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition">
                  Schedule
                </button>
              </Link>

              <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-gray-100 transition">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 px-4">
          <h2 className="text-xl font-semibold mb-4 text-center">Recently Played</h2>
          <div className="flex justify-center">
            <div className="flex overflow-x-auto space-x-4 max-w-full px-4 scrollbar-thin scrollbar-thumb-white/30">
              {recent.slice(0, 10).map((track, i) => (
                <div key={i} className="flex-shrink-0 w-40">
                  <div className="w-40 h-40 rounded-lg overflow-hidden mb-2">
                    <Image
                      src={track.artwork}
                      alt={track.title}
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-sm font-semibold truncate text-black">{track.title}</p>
                  <p className="text-xs text-black/70 truncate">{track.artist}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-50 bg-white text-black border-t border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          {nowPlaying && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                <Image
                  src={nowPlaying.artwork}
                  alt="Artwork"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold truncate text-black">{nowPlaying.title}</p>
                <p className="text-xs text-black/70 truncate">{nowPlaying.artist}</p>
              </div>
            </div>
          )}
          <button
            onClick={togglePlayback}
            className="bg-black text-white p-2 rounded-full hover:bg-pink-600 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white" />
            )}
          </button>
          <audio
            ref={audioRef}
            preload="none"
            src="https://streaming.broadcast.radio/xpress"
          />
        </div>
      </div>
    </main>
  );
}
