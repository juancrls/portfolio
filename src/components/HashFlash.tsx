"use client";

import { useEffect } from "react";

export function HashFlash() {
  useEffect(() => {
    let frame = 0;

    const flash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      target.classList.remove("flash");
      // Force a reflow so a second click on the same link replays the animation.
      void target.offsetWidth;
      target.classList.add("flash");
    };

    const onHashChange = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(flash);
    };

    // Same-hash clicks fire no hashchange, so listen for the click as well.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      const href = anchor?.getAttribute("href");
      if (!href?.includes("#")) return;
      window.setTimeout(onHashChange, 120);
    };

    onHashChange();
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
