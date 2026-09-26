import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Music2,
  Navigation,
  Pause,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import g1 from "@/assets/g1.jpeg";
import g2 from "@/assets/g2.jpeg";
import g3 from "@/assets/g3.jpeg";
import g4 from "@/assets/g4.jpeg";
import laughImage from "@/assets/memory-laugh.png";
import startAnimeVideo from "@/assets/start-anime.mp4";
import weddingAnimation from "@/assets/wedding-animation.mp4";
import invLetterBg from "@/assets/inv-letter.png";
import engagementImage from "@/assets/engagement.png";
import weddingImage from "@/assets/wedding.png";
import receptionImage from "@/assets/reception.png";
import dayImg from "@/assets/day.png";
import monthImg from "@/assets/month.png";
import yearImg from "@/assets/year.png";
import scratchBg from "@/assets/scratch-bg.png";

import letterClosedImage from "@/assets/letter.png";
import letterOpenImage from "@/assets/letter-open.png";
import musicFile from "@/assets/music.mp3";

import slide1 from "@/assets/slide1.png";
import slide2 from "@/assets/slide2.png";
import slide3 from "@/assets/slide3.png";
import slide4 from "@/assets/slide4.png";
import slide5 from "@/assets/slide5.png";
import slide6 from "@/assets/slide6.png";
import slide7 from "@/assets/slide7.jpeg";

const weddingDate = new Date("2026-10-07T11:00:00+05:30");
const gallery = [
  { src: slide5, alt: "A love we imagine 1", ratio: "portrait" },
  { src: slide3, alt: "A love we imagine 2", ratio: "portrait" },
  { src: slide4, alt: "A love we imagine 3", ratio: "portrait" },
  { src: slide1, alt: "A love we imagine 4", ratio: "portrait" },
];

const slideshowImages = [
  { src: slide1, alt: "Beautiful memory 1" },
  { src: slide2, alt: "Beautiful memory 2" },
  { src: slide3, alt: "Beautiful memory 3" },
  { src: slide4, alt: "Beautiful memory 4" },
  { src: slide5, alt: "Beautiful memory 5" },
  { src: slide6, alt: "Beautiful memory 6" },
  { src: slide7, alt: "Beautiful memory 7" },
];

function useCountdown() {
  const calculate = () => {
    const distance = Math.max(0, weddingDate.getTime() - Date.now());
    return {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance / 3600000) % 24),
      minutes: Math.floor((distance / 60000) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    };
  };
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const initialTimer = window.setTimeout(() => setTime(calculate()), 500);
    const timer = window.setInterval(() => setTime(calculate()), 1000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, []);
  return time;
}

function ScratchBox({ label, value, coverImage, onReveal }: { label: string; value: string; coverImage?: string; onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasRevealed = useRef(false);
  const hasUserScratched = useRef(false);

  useEffect(() => {
    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      canvas.width = Math.floor(rect.width * ratio);
      canvas.height = Math.floor(rect.height * ratio);
      ctx.scale(ratio, ratio);

      // ALWAYS render the rich olive green gradient shade immediately
      // This guarantees the real values are 100% hidden even before images finish loading
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#233d25");
      gradient.addColorStop(0.5, "#172b18");
      gradient.addColorStop(1, "#0d1b0f");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Subtle gold inner border
      ctx.strokeStyle = "rgba(226, 211, 180, 0.4)";
      ctx.lineWidth = 1;
      ctx.strokeRect(6, 6, rect.width - 12, rect.height - 12);

      // Decorative sparkle
      ctx.fillStyle = "#dfc89f";
      ctx.font = "14px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✦", rect.width / 2, rect.height / 2 - 16);

      // Cover title in elegant font
      ctx.fillStyle = "#fdfbf7";
      ctx.font = "500 15px 'Italiana', 'Cormorant Garamond', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const text = label.toUpperCase();
      if (typeof (ctx as any).letterSpacing !== "undefined") {
        (ctx as any).letterSpacing = "3px";
        ctx.fillText(text, rect.width / 2, rect.height / 2 + 7);
      } else {
        ctx.fillText(text, rect.width / 2, rect.height / 2 + 7);
      }

      // If coverImage is provided, draw it once loaded (or immediately if already cached)
      if (coverImage) {
        const img = new Image();
        const drawCover = () => {
          // If the user already started scratching, do NOT overwrite their scratch marks
          if (hasUserScratched.current) return;

          const imgRatio = img.width / img.height;
          const canvasRatio = rect.width / rect.height;
          let drawWidth: number;
          let drawHeight: number;

          if (imgRatio > canvasRatio) {
            drawHeight = rect.height;
            drawWidth = rect.height * imgRatio;
          } else {
            drawWidth = rect.width;
            drawHeight = rect.width / imgRatio;
          }

          const offsetX = (rect.width - drawWidth) / 2;
          const offsetY = (rect.height - drawHeight) / 2;

          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        img.onload = drawCover;
        img.src = coverImage;
        if (img.complete && img.naturalWidth > 0) {
          drawCover();
        }
      }
    };

    initCanvas();
    window.addEventListener("resize", initCanvas);
    return () => window.removeEventListener("resize", initCanvas);
  }, [label, coverImage]);

  const scratch = (clientX: number, clientY: number) => {
    hasUserScratched.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    ctx.save();
    ctx.scale(ratio, ratio);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(clientX - rect.left, clientY - rect.top, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (!hasRevealed.current) {
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      const totalCheck = pixels.length / 32;
      for (let i = 3; i < pixels.length; i += 32) {
        if (pixels[i] === 0) clear++;
      }
      if (clear / totalCheck > 0.40) {
        hasRevealed.current = true;
        onReveal();
      }
    }
  };

  return (
    <div className="scratch-item">
      {/* Revealed content underneath */}
      <div className="revealed-content">
        <span className="revealed-label">{label}</span>
        <strong className="revealed-value">{value}</strong>
      </div>
      <canvas
        ref={canvasRef}
        aria-label={`Scratch to reveal ${label}`}
        onPointerDown={(event) => {
          event.preventDefault();
          try {
            event.currentTarget.setPointerCapture(event.pointerId);
          } catch { }
          scratch(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1 || event.pointerType === "touch") {
            event.preventDefault();
            scratch(event.clientX, event.clientY);
          }
        }}
        onPointerUp={(event) => {
          try {
            event.currentTarget.releasePointerCapture(event.pointerId);
          } catch { }
        }}
        style={{ touchAction: "none" }}
      />
    </div>
  );
}

function LeafSprigLeft() {
  return (
    <svg className="botanical-leaf-svg left-leaf" width="36" height="54" viewBox="0 0 36 54" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18 52C18 52 14 38 6 28C1 21.5 2 12 10 14C12.5 14.6 15 17 18 20" stroke="#12381e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 42C18 42 24 32 30 24C34 18.5 32 10 24 12C21.5 12.6 19.5 15 18 18" stroke="#12381e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 28C18 28 12 18 8 10C5.5 5 9 1.5 14 3.5C16 4.3 17 6.5 18 9" stroke="#12381e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 20C18 20 22 12 26 6C28.5 2.2 25.5-0.5 21 1C19.5 1.5 18.5 3.5 18 5.5" stroke="#12381e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 52V2" stroke="#12381e" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function LeafSprigRight() {
  return (
    <svg className="botanical-leaf-svg right-leaf" width="36" height="54" viewBox="0 0 36 54" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ transform: "scaleX(-1)" }}>
      <path d="M18 52C18 52 14 38 6 28C1 21.5 2 12 10 14C12.5 14.6 15 17 18 20" stroke="#12381e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 42C18 42 24 32 30 24C34 18.5 32 10 24 12C21.5 12.6 19.5 15 18 18" stroke="#12381e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 28C18 28 12 18 8 10C5.5 5 9 1.5 14 3.5C16 4.3 17 6.5 18 9" stroke="#12381e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 20C18 20 22 12 26 6C28.5 2.2 25.5-0.5 21 1C19.5 1.5 18.5 3.5 18 5.5" stroke="#12381e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 52V2" stroke="#12381e" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function TornEdgeTop({ color = "#12381e" }: { color?: string }) {
  return (
    <svg className="torn-edge torn-edge-top" width="1200" height="120" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 0h1200v40c-55 12-115 45-180 15-65-30-125 15-190 25-65 10-135-25-190-10-55 15-110 35-180 5-70-30-130 15-190 20-60 5-115-30-170-15C45 95 20 65 0 75Z" fill={color} />
    </svg>
  );
}

function TornEdgeBottom({ color = "#12381e" }: { color?: string }) {
  return (
    <svg className="torn-edge torn-edge-bottom" width="1200" height="120" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true" style={{ transform: "rotate(180deg)" }}>
      <path d="M0 0h1200v40c-55 12-115 45-180 15-65-30-125 15-190 25-65 10-135-25-190-10-55 15-110 35-180 5-70-30-130 15-190 20-60 5-115-30-170-15C45 95 20 65 0 75Z" fill={color} />
    </svg>
  );
}

function FloralMark() {
  return (
    <div className="floral-mark" aria-hidden="true">
      <span />
      <Heart size={14} fill="#12381e" color="#12381e" />
      <span />
    </div>
  );
}

export function WeddingInvitation() {
  const countdown = useCountdown();
  const [mounted, setMounted] = useState(false);
  const [opened, setOpened] = useState(false);
  const [contentRevealed, setContentRevealed] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const [music, setMusic] = useState(false);
  const [progress, setProgress] = useState(0);
  const [revealedDates, setRevealedDates] = useState(0);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const swipeStart = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    [dayImg, monthImg, yearImg].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!contentRevealed) return;

    // Start music automatically right when 2nd video (weddingAnimation.mp4) entrance begins
    if (!audioRef.current) {
      audioRef.current = new Audio(musicFile);
      audioRef.current.loop = true;
    }
    audioRef.current.play().then(() => {
      setMusic(true);
    }).catch((err) => {
      console.log("Audio play error on 2nd video start:", err);
    });

    const revealElements = document.querySelectorAll<HTMLElement>("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            if (!target.classList.contains("hero-copy")) {
              target.dataset["visible"] = "true";
              observer.unobserve(target);
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 100px 0px" }
    );

    revealElements.forEach((el) => {
      if (!el.classList.contains("hero-copy")) {
        observer.observe(el);
      }
    });

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
      revealElements.forEach((element) => {
        if (element.classList.contains("hero-copy")) return;
        if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
          element.dataset["visible"] = "true";
        }
      });
      // End popup now triggered by button click
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // 1-second delay after 2nd video begins before smoothly displaying hero names
    const heroTimer = setTimeout(() => {
      const heroCopy = document.querySelector<HTMLElement>(".hero-copy");
      if (heroCopy) {
        heroCopy.dataset["visible"] = "true";
      }
    }, 1000);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      clearTimeout(heroTimer);
    };
  }, [contentRevealed]);

  // End popup now triggered by button click

  useEffect(() => {
    if (revealedDates === 3) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }
  }, [revealedDates]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide((value) => (value + 1) % slideshowImages.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [slide]);

  const slideTouchStart = useRef<{ x: number; y: number } | null>(null);

  const handleSlideTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    slideTouchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleSlideTouchEnd = (e: React.TouchEvent) => {
    if (!slideTouchStart.current) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const endX = touch.clientX;
    const endY = touch.clientY;
    const diffX = slideTouchStart.current.x - endX;
    const diffY = slideTouchStart.current.y - endY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        // Swiped left -> next slide
        setSlide((curr) => (curr + 1) % slideshowImages.length);
      } else {
        // Swiped right -> previous slide
        setSlide((curr) => (curr - 1 + slideshowImages.length) % slideshowImages.length);
      }
    }
    slideTouchStart.current = null;
  };

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(musicFile);
      audioRef.current.loop = true;
    }

    if (music) {
      audioRef.current.pause();
      setMusic(false);
    } else {
      audioRef.current.play().then(() => {
        setMusic(true);
      }).catch((err) => {
        console.log("Audio playback error:", err);
      });
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setMusic(false);
  };

  const handleOpen = () => {
    setOpened(true);
    // Pre-initialize audio instance on gesture so browser permissions allow playback when 2nd video starts
    if (!audioRef.current) {
      audioRef.current = new Audio(musicFile);
      audioRef.current.loop = true;
    }

    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85;
      videoRef.current.play().catch(() => {
        console.log("Video playback failed");
        setContentRevealed(true);
      });
    } else {
      setContentRevealed(true);
    }
  };

  const moveLightbox = (direction: number) => {
    setLightbox((current) => current === null ? 0 : (current + direction + gallery.length) % gallery.length);
  };

  return (
    <main className={`wedding-page ${!contentRevealed ? 'locked-scroll' : ''}`}>
      {contentRevealed && <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} />}

      {!contentRevealed && (
        <div className="glitter-container" aria-hidden="true">
          {Array.from({ length: 40 }, (_, index) => <i key={index} className="glitter-particle" style={{ "--i": index, "--x": Math.random(), "--y": Math.random() } as React.CSSProperties} />)}
        </div>
      )}

      {contentRevealed && (
        <div className="particles" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}
        </div>
      )}

      {contentRevealed && (
        <>
          <Button className="music-button" size="icon" variant="outline" onClick={toggleMusic} aria-label={music ? "Pause ambient music" : "Play ambient music"}>
            {music ? <Pause /> : <Music2 />}
          </Button>

          <nav className={navOpen ? "floating-nav is-open" : "floating-nav"} aria-label="Invitation sections">
            {["Invitation", "Story", "Memories", "Events", "Venue", "Notes"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setNavOpen(false)}>{item}</a>
            ))}
          </nav>
        </>
      )}

      {!contentRevealed && (
        <section id="invitation" className={opened ? "opening-screen is-open" : "opening-screen"}>
          <div className="opening-glow" />
          <button
            className="image-envelope-wrap"
            onClick={handleOpen}
            aria-label="Open the wedding invitation"
          >
            <video
              ref={videoRef}
              src={startAnimeVideo}
              muted
              playsInline
              className="envelope-img"
              onEnded={() => {
                const screen = document.getElementById("invitation");
                if (screen) {
                  screen.classList.add("fade-out");
                  setTimeout(() => setContentRevealed(true), 600);
                } else {
                  setContentRevealed(true);
                }
              }}
            />
          </button>
        </section>
      )}

      {contentRevealed && (
        <>
          <section id="welcome" className="hero-section">
            <video src={weddingAnimation} autoPlay loop muted playsInline className="hero-video-bg" />
            <div className="hero-shade" />
            <div className="hero-copy" data-reveal>
              <p className="hero-subheading">WE ARE GETTING MARRIED</p>
              <h1 className="hero-names">
                <span className="script-title">Sujin</span>
                <span className="hero-amp">&amp;</span>
                <span className="script-title">Jineesha</span>
              </h1>
              <div className="hero-gold-divider">
                <span className="divider-line" />
                <span className="divider-diamond">◇</span>
                <span className="divider-line" />
              </div>
              <p className="hero-action-text"></p>
              <div className="hero-scroll-indicator">
                <span>SCROLL TO DISCOVER</span>
                <div className="scroll-line" />
              </div>
            </div>
          </section>

          <section className="date-reveal-section" data-reveal style={{ backgroundImage: `url(${scratchBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
            <p className="eyebrow">Save our date</p>
            <h2>A perfect day awaits</h2>
            <p className="section-intro">Gently scratch each olive panel to reveal when our forever begins.</p>
            <div className="scratch-grid">
              <ScratchBox label="Day" value="07" coverImage={dayImg} onReveal={() => setRevealedDates((count) => count + 1)} />
              <ScratchBox label="Month" value="OCT" coverImage={monthImg} onReveal={() => setRevealedDates((count) => count + 1)} />
              <ScratchBox label="Year" value="2026" coverImage={yearImg} onReveal={() => setRevealedDates((count) => count + 1)} />
            </div>
            {revealedDates === 3 && (
              <div className="date-celebration" role="status">
                <div className="celebration-sparkles" aria-hidden="true">✦ ✧ ✦</div>
                <strong>Our forever begins</strong>
                <span className="celebration-date">07 October 2026</span>
              </div>
            )}
          </section>

          <section className="invitation-band" data-reveal style={{ backgroundImage: `url(${invLetterBg})` }}>
            <div className="formal-card">
              <p className="eyebrow">YOU ARE INVITED TO THE<br />WEDDING CEREMONY OF</p>

              <FloralMark />
              <h2 className="script-title card-person-name">Sujin (Samjin)</h2>

              <div className="parent-section">
                <span className="parent-label">SON OF</span>
                <strong className="parent-names">Mr.Soosadimai & Mrs. Veergin Mary
                </strong>
              </div>

              <p className="with-connector">With</p>

              <h2 className="script-title card-person-name">Jineesha James</h2>

              <div className="parent-section">
                <span className="parent-label">DAUGHTER OF</span>
                <strong className="parent-names">Mr.James & Mrs.Maryas Mary</strong>
              </div>

              <div className="card-custom-message">
                <h3 className="message-title">Dear Friends and Family</h3>
                <p className="message-body">
                  Join us for a celebration of love, laughter, and unforgettable memories as we begin our forever.
                </p>
              </div>

              <strong className="card-event-date">WEDNESDAY · 07 OCTOBER · 2026</strong>
              <span className="card-event-venue">St.John of the Cross Church</span>
            </div>
          </section>

          <section className="countdown-section paper-section torn-section" data-reveal>
            <TornEdgeTop color="#22442c" />
            <p className="eyebrow">TILL OUR BIG DAY</p>
            <h2>Countdown</h2>
            <div className="countdown-flanked-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', width: '100%' }}>
              <LeafSprigLeft />
              <div className="countdown">
                {Object.entries(countdown).map(([label, value]) => (
                  <div key={label}>
                    <strong>{mounted ? String(value).padStart(2, "0") : "00"}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <LeafSprigRight />
            </div>
            <TornEdgeBottom color="#22442c" />
          </section>
          <section
            id="memories"
            className="slideshow-section"
            onTouchStart={handleSlideTouchStart}
            onTouchEnd={handleSlideTouchEnd}
          >
            {slideshowImages.map((image, index) => (
              <img
                key={image.src}
                className={slide === index ? "active" : ""}
                src={image.src}
                alt={image.alt}
                width={1280}
                height={1536}
                loading={index === 0 ? "eager" : "lazy"}
              />
            ))}
            <div className="slideshow-shade" />
            <div className="slideshow-copy" data-reveal>
              <h2>In the Days We’ll Share</h2>
              <p>We look forward to capturing stolen glances, intertwined hands, quiet evenings, and all the love in between.</p>
            </div>
            <div
              className="slide-dots"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {slideshowImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={slide === index ? "active" : ""}
                  onClick={() => setSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </section>



          <section className="gallery-section paper-section torn-section">
            <TornEdgeTop color="#22442c" />
            <div data-reveal>
              <p className="eyebrow">Through our eyes</p>
              <h2>A Love We Imagine</h2>
              <p className="gallery-subtitle">The gestures, details, and fleeting moments that inspire the beginning of our forever.</p>
            </div>
            <div className="gallery-grid">
              {gallery.map((image, index) => (
                <button
                  key={image.src}
                  className={image.ratio}
                  onClick={() => setLightbox(index)}
                  aria-label={`View ${image.alt} fullscreen`}
                >
                  <img src={image.src} alt={image.alt} width={1024} height={1280} loading="lazy" />
                  <span>0{index + 1}</span>
                </button>
              ))}
            </div>
            <TornEdgeBottom color="#22442c" />
          </section>

          <section id="events" className="events-section paper-section torn-section">
            <TornEdgeTop color="#22442c" />
            <TornEdgeBottom color="#22442c" />
            <div data-reveal><p className="eyebrow">The celebrations</p><h2>Join us for</h2></div>
            <div className="event-list">
              {/* Engagement Card */}
              <article
                className="event-card event-engagement"
                data-reveal
                onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=Christ+the+King+Parish+Hall+Paruthiyoor+Pozhiyoor", "_blank", "noopener,noreferrer")}
              >
                <a
                  className="event-card-link"
                  href="https://www.google.com/maps/search/?api=1&query=Christ+the+King+Parish+Hall+Paruthiyoor+Pozhiyoor"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open Engagement venue on Google Maps"
                />

                {/* Full image — no crop, no letterbox */}
                <img
                  src={engagementImage}
                  alt="Engagement venue"
                  className="reception-full-img"
                  loading="lazy"
                />

                <div className="event-card-btn-wrapper">
                  <Button
                    asChild
                    variant="outline"
                    className="event-map-btn"
                  >
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Christ+the+King+Parish+Hall+Paruthiyoor+Pozhiyoor"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Navigation className="mr-2 h-4 w-4" /> View Route
                    </a>
                  </Button>
                </div>
              </article>

              {/* Wedding Card */}
              <article
                className="event-card event-wedding"
                data-reveal
                onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=St.+John+of+the+Cross+Church+Siluvaipuram", "_blank", "noopener,noreferrer")}
              >
                <a
                  className="event-card-link"
                  href="https://www.google.com/maps/search/?api=1&query=St.+John+of+the+Cross+Church+Siluvaipuram"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open Wedding venue on Google Maps"
                />

                {/* Full image — no crop, no letterbox */}
                <img
                  src={weddingImage}
                  alt="Wedding venue"
                  className="reception-full-img"
                  loading="lazy"
                />

                <div className="event-card-btn-wrapper">
                  <Button
                    asChild
                    variant="outline"
                    className="event-map-btn"
                  >
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=St.+John+of+the+Cross+Church+Siluvaipuram"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Navigation className="mr-2 h-4 w-4" /> View Route
                    </a>
                  </Button>
                </div>
              </article>

              {/* Reception Card */}
            </div>
          </section>

          <section className={`letter-section torn-section ${letterOpen ? "is-open" : ""}`}>
            <TornEdgeTop color="#22442c" />
            <TornEdgeBottom color="#22442c" />
            <div className="letter-header" data-reveal>
              <p className="eyebrow">A little note for you</p>
              <h2>Words From Our Hearts</h2>
            </div>

            <div className={`image-letter-wrapper ${letterOpen ? "is-open" : ""}`} data-reveal>
              {/* Closed envelope image */}
              <div className="letter-closed-img">
                <img src={letterClosedImage} alt="Sealed love letter envelope" width={1400} height={800} />
                {!letterOpen && (
                  <button
                    className="letter-img-seal"
                    onClick={() => setLetterOpen(true)}
                    aria-label="Open our love letter"
                    title="Click seal to open letter"
                  />
                )}
              </div>

              {/* Open envelope image */}
              <div className="letter-open-img" onClick={() => setLetterOpen(false)} title="Click to close letter">
                <img src={letterOpenImage} alt="Opened love letter with heartfelt message" width={1500} height={1500} />
              </div>
            </div>
          </section>

          <section className="final-section">
            <img src={laughImage} alt="Sujin and Jineesha James laughing together at dusk" width={1280} height={912} loading="lazy" />
            <div className="final-shade" />
            <div data-reveal>
              <Sparkles />
              <p className="eyebrow">With you, always</p>
              <h2>And So Our<br /><em>Forever Begins...</em></h2>
              <p>07 · 10 · 2026</p>
              <span className="final-names">Sujin &amp; Jineesha James</span>
              <div className="final-btn-wrap">
                <button className="end-popup-trigger" onClick={() => setShowEndPopup(true)}>
                  <Sparkles size={12} />
                  <span>Brother's Wedding <br/>Invitation</span>
                </button>
              </div>
            </div>

          </section>



          {/* ── End-of-page Popup ── */}

          {showEndPopup && (
            <div className="end-popup-backdrop" role="dialog" aria-modal="true" aria-label="Brother's Wedding Invitation" onClick={(e) => { if (e.target === e.currentTarget) setShowEndPopup(false); }}>
              <div className="end-popup">
                <button className="end-popup-close" onClick={() => setShowEndPopup(false)} aria-label="Close">
                  <X size={18} />
                </button>
                <div className="end-popup-icon" aria-hidden="true">✦</div>
                <p className="end-popup-eyebrow">A Special Celebration</p>
                <h2 className="end-popup-title">My Brother's Invitation</h2>
                <p className="end-popup-body">
                  We warmly invite you to explore and celebrate my brother's upcoming wedding celebration as well.
                </p>
                <a
                  href="https://velvet-stories26.github.io/Wedding-invitation2/"
                  target="_blank"
                  rel="noreferrer"
                  className="end-popup-btn"
                  onClick={() => {
                    stopMusic();
                    setShowEndPopup(false);
                  }}
                >
                  <Heart size={14} /> View Invitation
                </a>
                <button className="end-popup-skip" onClick={() => setShowEndPopup(false)}>Close</button>
              </div>
            </div>
          )}

          {lightbox !== null && (
            <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo gallery" onPointerDown={(event) => { swipeStart.current = event.clientX; }} onPointerUp={(event) => { const distance = event.clientX - swipeStart.current; if (Math.abs(distance) > 40) moveLightbox(distance > 0 ? -1 : 1); }}>
              <Button size="icon" variant="ghost" className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close gallery"><X /></Button>
              <Button size="icon" variant="ghost" className="lightbox-prev" onClick={() => moveLightbox(-1)} aria-label="Previous photo"><ChevronLeft /></Button>
              <img src={gallery[lightbox]?.src} alt={gallery[lightbox]?.alt ?? "Wedding memory"} />
              <Button size="icon" variant="ghost" className="lightbox-next" onClick={() => moveLightbox(1)} aria-label="Next photo"><ChevronRight /></Button>
              <span>{lightbox + 1} / {gallery.length}</span>
            </div>
          )}
        </>
      )}
    </main>
  );
}
