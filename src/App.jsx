import { useEffect, useRef, useState } from 'react';
import { playlist, profileData } from './data';

function CursorTrail() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reducedMotion || !finePointer) return undefined;

    let targetX = 0;
    let targetY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let animationFrame = 0;
    let hasPosition = false;
    let lastFrameTime = 0;

    function animateCursor(timestamp) {
      animationFrame = 0;
      const deltaTime = lastFrameTime ? Math.min(timestamp - lastFrameTime, 64) : 16;
      lastFrameTime = timestamp;
      const smoothing = 1 - Math.exp(-deltaTime / 90);
      const nextX = cursorX + (targetX - cursorX) * smoothing;
      const nextY = cursorY + (targetY - cursorY) * smoothing;
      const moveX = nextX - cursorX;
      const moveY = nextY - cursorY;
      cursorX = nextX;
      cursorY = nextY;

      const cursor = cursorRef.current;
      if (!cursor) return;

      if (Math.hypot(moveX, moveY) > 0.15) {
        cursor.style.setProperty(
          '--cursor-angle',
          `${Math.atan2(moveY, moveX) * (180 / Math.PI)}deg`,
        );
      }
      cursor.style.setProperty('--cursor-x', `${cursorX}px`);
      cursor.style.setProperty('--cursor-y', `${cursorY}px`);

      if (Math.hypot(targetX - cursorX, targetY - cursorY) > 0.2) {
        animationFrame = window.requestAnimationFrame(animateCursor);
      }
    }

    function handlePointerMove(event) {
      if (event.pointerType !== 'mouse') return;

      targetX = event.clientX;
      targetY = event.clientY;
      const cursor = cursorRef.current;
      if (!cursor) return;

      if (!hasPosition) {
        hasPosition = true;
        cursorX = targetX;
        cursorY = targetY;
        lastFrameTime = 0;
        cursor.style.setProperty('--cursor-x', `${cursorX}px`);
        cursor.style.setProperty('--cursor-y', `${cursorY}px`);
        cursor.classList.add('is-visible');
      }

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animateCursor);
      }
    }

    function hideCursor() {
      cursorRef.current?.classList.remove('is-visible');
      hasPosition = false;
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', hideCursor);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', hideCursor);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <span ref={cursorRef} className="shooting-cursor" aria-hidden="true" />
  );
}

function RotatingBio() {
  const [bioIndex, setBioIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setBioIndex((index) => (index + 1) % profileData.bios.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <p
      key={bioIndex}
      className="bio-celestial text-bio-gold text-xs tracking-widest font-serif text-center"
    >
      {profileData.bios[bioIndex]}
    </p>
  );
}

function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = playlist[currentTrackIndex];

  function changeTrack(direction) {
    setCurrentTrackIndex((index) => (index + direction + playlist.length) % playlist.length);
  }

  return (
    <div className="shooting-cursor-enabled min-h-screen bg-cosmic-bg text-slate-100 flex flex-col items-center justify-between p-6 relative overflow-hidden font-serif select-none">
      <CursorTrail />
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-nebula/15 blur-[140px] rounded-full animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] bg-nebula/20 blur-[130px] rounded-full animate-pulse duration-[10000ms]" />
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-nebula/10 blur-[120px] rounded-full animate-pulse duration-[6000ms]" />

        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(var(--color-grid-gold) 1px, transparent 1px), linear-gradient(to right, var(--color-grid-white) 1px, transparent 1px), linear-gradient(to bottom, var(--color-grid-white) 1px, transparent 1px)`,
            backgroundSize: '40px 40px, 80px 80px, 80px 80px'
          }}
        />

        <div className="absolute top-[12%] left-[15%] text-amber-300/40 text-xs animate-ping duration-[3000ms]">✦</div>
        <div className="absolute top-[25%] right-[20%] text-amber-200/50 text-sm animate-pulse duration-[4000ms]">★</div>
        <div className="absolute top-[45%] left-[8%] text-amber-400/30 text-xs animate-pulse duration-[2500ms]">✦</div>
        <div className="absolute top-[65%] right-[12%] text-amber-300/40 text-base animate-ping duration-[5000ms]">✦</div>
        <div className="absolute top-[80%] left-[22%] text-amber-200/30 text-xs animate-pulse duration-[3500ms]">★</div>
        <div className="absolute top-[30%] left-[80%] text-amber-400/20 text-xs animate-pulse duration-[1500ms]">⚫︎</div>
        <div className="absolute top-[88%] right-[30%] text-amber-300/30 text-sm animate-ping duration-[6000ms]">⚫︎</div>

        <div className="absolute top-[18%] left-[45%] w-1 h-1 bg-amber-200/50 rounded-full animate-pulse" />
        <div className="absolute top-[52%] left-[85%] w-1 h-1 bg-amber-300/60 rounded-full animate-pulse duration-[3000ms]" />
        <div className="absolute top-[75%] left-[10%] w-1.5 h-1.5 bg-amber-400/40 rounded-full animate-pulse duration-[2000ms]" />
        <div className="absolute top-[38%] left-[28%] w-1 h-1 bg-amber-100/40 rounded-full animate-pulse duration-[4000ms]" />

        <div className="absolute top-[-10%] right-[10%] w-[150px] h-[1px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent rotate-[135deg] animate-[shooting_6s_infinite_ease-in-out]" />
        <div className="absolute top-[30%] right-[-10%] w-[200px] h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent rotate-[135deg] animate-[shooting_9s_infinite_ease-in-out_2s]" />

      </div>
      {/* ------------------------------------------------------------------- */}

      <main className="w-full max-w-sm flex flex-col items-center my-auto z-10 py-8">
        
        <div className="relative mb-6">
          <div className="absolute -inset-3 rounded-full border border-amber-500/20 border-dashed" />
          <div className="absolute -inset-3 rounded-full animate-orbit pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-300 text-sm drop-shadow-[0_0_8px_var(--color-gold-orbit-glow)]">
              ⚫︎
            </div>
          </div>
          <div className="relative w-28 h-28 rounded-full p-1 border-2 border-amber-500/60 bg-avatar-bg shadow-[0_0_30px_var(--color-gold-glow)]">
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="w-full h-full rounded-full object-cover border border-amber-400/40"
            />
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative pb-1">
            <h1 className="text-2xl font-medium tracking-[0.25em] text-gold-accent uppercase font-serif">
              {profileData.name}
            </h1>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-amber-400/60 shadow-[0_0_8px_var(--color-gold-line-glow)]" />
          </div>

          <div className="text-amber-500/80 text-[10px] tracking-[0.3em] font-mono my-2 flex items-center gap-1.5">
            <span>/</span>
            <span>LINKS</span>
            <span>/</span>
          </div>

          <RotatingBio />
        </div>

        <div className="w-full flex flex-col gap-3 font-sans">
          {profileData.links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-[1px] rounded-2xl bg-gradient-to-r from-amber-500/20 via-white/10 to-amber-500/20 hover:from-amber-400 hover:via-amber-200 hover:to-amber-500 focus-visible:from-amber-400 focus-visible:via-amber-200 focus-visible:to-amber-500 focus-visible:outline-none transition-all duration-500 shadow-lg hover:shadow-[0_0_20px_var(--color-gold-hover-glow)] focus-visible:shadow-[0_0_20px_var(--color-gold-hover-glow)]"
              >
                <div className="flex items-center justify-between w-full p-3.5 bg-dark-bg/70 backdrop-blur-xl rounded-[15px] transition-all group-hover:bg-dark-bg/90 group-focus-visible:bg-dark-bg/90">
                  <div className="flex items-center gap-3.5">
                    <div className="text-amber-400 group-hover:scale-110 group-focus-visible:scale-110 transition-transform">
                      {Icon && <Icon className="text-base" />}
                    </div>
                    <span className="text-xs font-normal tracking-widest text-slate-200 group-hover:text-amber-200 group-focus-visible:text-amber-200 transition-colors uppercase">
                      {link.title}
                    </span>
                  </div>

                  <span className="text-xs text-amber-400/60 group-hover:text-amber-300 group-focus-visible:text-amber-300 font-mono transition-transform duration-300 group-hover:rotate-45 group-focus-visible:rotate-45">
                    🌟
                  </span>
                </div>
              </a>
            );
          })}
        </div>

      </main>

      <section
        aria-label="Now playing"
        className="z-10 w-full max-w-sm mb-6 rounded-2xl border border-amber-500/20 bg-dark-bg/70 p-4 shadow-[0_0_24px_var(--color-gold-glow-soft)] backdrop-blur-xl"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.25em] text-track-gold font-mono uppercase">
              What I Vibin' RN
            </p>
            <p className="mt-1 text-xs text-slate-300 font-sans">
              {currentTrack.title} <span className="text-track-purple">·<span className="text-track-artist"> {currentTrack.artist}</span></span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => changeTrack(-1)}
              aria-label="Previous song"
              className="rounded-full border border-amber-500/30 px-3 py-2 text-[10px] font-mono tracking-widest text-amber-300 transition-colors hover:border-amber-300 hover:bg-amber-400/10 focus-visible:outline focus-visible:outline-amber-300"
            >
              PREV
            </button>
            <span className="text-[10px] font-mono text-slate-500">
              {currentTrackIndex + 1}/{playlist.length}
            </span>
            <button
              type="button"
              onClick={() => changeTrack(1)}
              aria-label="Next song"
              className="rounded-full border border-amber-500/30 px-3 py-2 text-[10px] font-mono tracking-widest text-amber-300 transition-colors hover:border-amber-300 hover:bg-amber-400/10 focus-visible:outline focus-visible:outline-amber-300"
            >
              NEXT
            </button>
          </div>
        </div>

        <iframe
          key={currentTrack.id}
          title={`${currentTrack.title} by ${currentTrack.artist} on Spotify`}
          src={`https://open.spotify.com/embed/track/${currentTrack.id}?utm_source=generator&theme=0`}
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="block rounded-xl"
        />
      </section>

      <footer className="z-10 text-[10px] text-slate-500 tracking-[0.3em] font-mono uppercase">
        {profileData.name} | MMXXVI
      </footer>

    </div>
  );
}

export default App;