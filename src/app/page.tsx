"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Instagram, Music2 } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [nowPlaying, setNowPlaying] = useState(null);

  useEffect(() => {
    async function fetchNowPlaying() {
      try {
        const res = await fetch("https://api.broadcast.radio/api/nowplaying/2916");
        const data = await res.json();
    
        // Find the current show
        const currentShow = data.body.schedule.find((item) => item.current);
        const showTitle = currentShow?.content?.[0]?.display_title;
    
        if (showTitle) {
          setNowPlaying(showTitle);
        } else {
          setNowPlaying("Live show");
        }
      } catch (err) {
        console.error("Failed to fetch current show info:", err);
        setNowPlaying("Live show");
      }
    }
    
    

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="text-white font-sans min-h-screen bg-gradient-to-br from-[#8e2de2] via-[#4d0e87] to-[#ff0066] pb-[80px]">
      {/* Sticky Header Toolbar */}
      <header className="sticky top-0 z-50 bg-white text-[#2b0a59] backdrop-blur-md shadow-md border-b border-white/10 py-1.5">
        <div className="w-full px-4 py-2 flex items-center justify-start space-x-6 overflow-x-auto">
          <div className="flex-shrink-0 mr-4">
            <Link href="/">
              <Image src="/xpress-logo-purple.png" alt="Xpress Logo" width={64} height={64} className="cursor-pointer" />
            </Link>
          </div>
          <nav className="overflow-x-auto flex-1 w-full md:w-auto md:flex-nowrap flex items-center space-x-6 text-sm md:text-lg scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">
            <Link href="#" className="flex-shrink-0 hover:text-[#8e2de2] transition-colors">Shows</Link>
            <Link href="/schedule" className="...">Schedule</Link>
            <Link href="#" className="flex-shrink-0 hover:text-[#8e2de2] transition-colors">Presenters</Link>
            <Link href="#" className="flex-shrink-0 hover:text-[#8e2de2] transition-colors">Get Involved</Link>
            <Link href="#" className="flex-shrink-0 hover:text-[#8e2de2] transition-colors">Our Studio</Link>
            <Link href="#" className="flex-shrink-0 hover:text-[#8e2de2] transition-colors">Contact</Link>
            <Link href="#" className="flex-shrink-0 hover:text-[#8e2de2] transition-colors">About</Link>
            <Link href="#culture" className="flex-shrink-0">
              <Image src="/quench-logo.png" alt="Quench" width={40} height={40} className="object-contain" />
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative w-full min-h-[calc(100vh-80px)] text-white overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, #3e1eaa 0%, #6750ff 45%, #fe30a4 100%)" }} />
        <img src="/x_shapes.svg" alt="" aria-hidden="true" className="absolute inset-0 z-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center text-center max-w-xl w-full">
            <img src="/hero.svg" alt="Xpress Hero Logo" className="w-full max-w-[600px] mb-[-40px]" />
            <div className="flex flex-col items-center space-y-3 mt-[-20px]">
              <div className="flex items-center bg-pink-500 text-white font-medium px-5 py-2 rounded-full text-sm shadow-lg">
                <span className="relative flex w-2 h-2 mr-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                On air now: {nowPlaying || "Loading..."}
              </div>
              <Button className="bg-black hover:bg-pink-600 text-white px-10 py-5 text-xl rounded-full flex items-center gap-2 shadow-xl transition-all duration-200">
                <Play className="w-6 h-6" />
                <span>Listen Live</span>
              </Button>
            </div>
          </div>
          <div className="hidden md:flex w-1/2 h-full items-end justify-end"></div>
        </div>
      </section>

      {/* Featured Shows */}
      <section className="px-6 py-16">
      <div className="flex justify-center mb-8">
  <img
    src="/featured.png"
    alt="Featured Shows"
    className="h-20 md:h-24 object-contain"
  />
</div>


        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/70 scrollbar-track-transparent">
          <div className="flex space-x-6 w-max pb-6 pt-2">
            {[
              { title: "The Underground Frequency", time: "Thursdays 12PM – 1PM", image: "/underground-frequency.png" },
              { title: "Martha's Music Hour", time: "Tuesdays 8PM – 9PM", image: "/martha.jpg" },
              { title: "Josef Swindell's Power Hour", time: "Fridays 4PM – 5PM", image: "/power-hour.png" },
              { title: "The Creature Comforts Podcast", time: "Fridays 5PM – 6PM", image: "/creature-comforts.png" },
              { title: "Boots 'n Strings", time: "Tuesdays 10AM – 11AM", image: "/show5.jpg" },
              { title: "Steph's Special Interest", time: "Wednesdays 12PM – 1PM", image: "/show6.jpg" },
              { title: "The Jazz Show", time: "Wednesdays 2PM – 3PM", image: "/show7.jpg" },
            ].map((show, index) => (
              <div key={index} className="min-w-[280px] bg-white/10 rounded-xl p-4 backdrop-blur-md">
                <Image src={show.image} alt={show.title} width={400} height={200} className="rounded-md mb-4" />
                <h3 className="text-xl font-semibold">{show.title}</h3>
                <p className="text-sm text-white/70 mb-2">{show.time}</p>
                <Button className="bg-white text-black hover:bg-pink-400">Listen now</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Grid */}
      <section className="px-6 py-16 bg-[#1c043b] text-white" id="culture">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Explore culture: <span className="text-pink-400">Brought to you by Quench</span></h2>
            <Image src="/quench-logo.png" alt="Quench Magazine" width={100} height={40} className="object-contain" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Amazing article", snippet: "Amazing article", image: "/culture1.jpg" },
              { title: "Another dope article from quench", snippet: "Another dope article from quench", image: "/culture2.jpg" },
              { title: "Another banger", snippet: "Another banger", image: "/culture3.jpg" },
              { title: "Boom.", snippet: "Boom.", image: "/culture4.jpg" },
              { title: "Journalism", snippet: "Journalism", image: "/culture5.jpg" },
              { title: "How Quench is keeping student publishing alive.", snippet: "Read all about it", image: "/culture6.jpg" },
            ].map((article, index) => (
              <div key={index} className="bg-white/10 rounded-xl overflow-hidden backdrop-blur-md hover:scale-[1.02] transition-transform shadow-md">
                <Image src={article.image} alt={article.title} width={500} height={300} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-1">{article.title}</h3>
                  <p className="text-sm text-white/70 mb-3">{article.snippet}</p>
                  <Button className="bg-white text-black hover:bg-pink-400 text-sm">Read More</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TikTok Feed */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-6">What’s happening on TikTok</h2>
        <div className="flex justify-center">
          <iframe
            src="https://www.tiktok.com/embed/feed/@xpressradio"
            allow="autoplay; encrypted-media"
            className="w-full max-w-4xl h-[600px] border-none rounded-lg"
          ></iframe>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2b0a59] text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
          <div className="space-y-4">
            <h4 className="uppercase font-bold text-white/90 tracking-wide">Find Out More</h4>
            <div className="space-y-1 underline underline-offset-2 text-white/80">
              <Link href="#" className="block hover:text-pink-400">Advertise with Us</Link>
              <Link href="https://www.cardiffstudents.com/activities/society/xpress/" className="block hover:text-pink-400">Become a member</Link>
            </div>
            <h4 className="uppercase font-bold text-white/90 tracking-wide">Designed and built by Samir Ait-Kaci</h4>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <Image src="/sra-logo.png" alt="Student Radio Association" width={100} height={100} />
            <Image src="/cardiff-su-logo.png" alt="Cardiff SU" width={80} height={80} />
            <Image src="/quench-logo.png" alt="Quench Magazine" width={100} height={100} />
            <Image src="/gair-rhydd-logo.png" alt="Gair Rhydd" width={100} height={100} />
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <Image src="/cardiff-uni-logo.png" alt="Cardiff University" width={140} height={60} />
          </div>
        </div>
      </footer>

      {/* Floating Live Player */}
      <div className="fixed bottom-0 left-0 w-full z-[1000] bg-black shadow-lg">
        <iframe
          src="https://player.broadcast.radio/xpress?mode=embed&autoplay=1"
          allow="autoplay"
          className="w-full h-[80px] border-none"
          title="Xpress Radio Live Player"
        ></iframe>
      </div>
    </main>
  );
}
