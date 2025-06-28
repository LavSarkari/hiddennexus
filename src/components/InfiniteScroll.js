import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);

export default function InfiniteScroll({
  width = "30rem",
  maxHeight = "100%",
  items = [],
  isTilted = false,
  tiltDirection = "left",
  autoplay = false,
  autoplaySpeed = 0.5,
  autoplayDirection = "down",
  pauseOnHover = false,
}) {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const getTiltTransform = () => {
    if (!isTilted) return "none";
    return tiltDirection === "left"
      ? "rotateX(20deg) rotateZ(-20deg) skewX(20deg)"
      : "rotateX(20deg) rotateZ(20deg) skewX(-20deg)";
  };

  // Helper to recalculate y-positions for all items
  const recalcYPositions = () => {
    const container = containerRef.current;
    if (!container) return;
    const divItems = gsap.utils.toArray(container.children);
    if (!divItems.length) return;
    const itemHeights = divItems.map(child => child.offsetHeight);
    const itemMarginTops = divItems.map(child => parseFloat(getComputedStyle(child).marginTop) || 0);
    const totalItemHeights = itemHeights.map((h, i) => h + itemMarginTops[i]);
    let y = 0;
    divItems.forEach((child, i) => {
      gsap.set(child, { y });
      y += totalItemHeights[i];
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (items.length === 0) return;

    const divItems = gsap.utils.toArray(container.children);
    if (!divItems.length) return;

    // Initial y-positioning
    recalcYPositions();

    // Setup ResizeObserver to recalc on any item resize
    if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    resizeObserverRef.current = new window.ResizeObserver(() => {
      recalcYPositions();
    });
    divItems.forEach((el) => resizeObserverRef.current.observe(el));

    // Calculate total height for infinite wrap
    const itemHeights = divItems.map(child => child.offsetHeight);
    const itemMarginTops = divItems.map(child => parseFloat(getComputedStyle(child).marginTop) || 0);
    const totalItemHeights = itemHeights.map((h, i) => h + itemMarginTops[i]);
    const totalHeight = totalItemHeights.reduce((a, b) => a + b, 0);
    const wrapFn = gsap.utils.wrap(-totalHeight, totalHeight);

    const observer = Observer.create({
      target: container,
      type: "wheel,touch,pointer",
      preventDefault: true,
      onPress: ({ target }) => {
        target.style.cursor = "grabbing";
      },
      onRelease: ({ target }) => {
        target.style.cursor = "grab";
      },
      onChange: ({ deltaY, isDragging, event }) => {
        const d = event.type === "wheel" ? -deltaY : deltaY;
        const distance = isDragging ? d * 5 : d * 10;
        divItems.forEach((child) => {
          gsap.to(child, {
            duration: 0.5,
            ease: "expo.out",
            y: `+=${distance}`,
            modifiers: {
              y: gsap.utils.unitize(wrapFn),
            },
          });
        });
      },
    });

    let rafId;
    if (autoplay) {
      const directionFactor = autoplayDirection === "down" ? 1 : -1;
      const speedPerFrame = autoplaySpeed * directionFactor;

      const tick = () => {
        divItems.forEach((child) => {
          gsap.set(child, {
            y: `+=${speedPerFrame}`,
            modifiers: {
              y: gsap.utils.unitize(wrapFn),
            },
          });
        });
        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);

      if (pauseOnHover) {
        const stopTicker = () => rafId && cancelAnimationFrame(rafId);
        const startTicker = () => (rafId = requestAnimationFrame(tick));

        container.addEventListener("mouseenter", stopTicker);
        container.addEventListener("mouseleave", startTicker);

        return () => {
          observer.kill();
          stopTicker();
          container.removeEventListener("mouseenter", stopTicker);
          container.removeEventListener("mouseleave", startTicker);
          if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
        };
      } else {
        return () => {
          observer.kill();
          rafId && cancelAnimationFrame(rafId);
          if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
        };
      }
    }

    return () => {
      observer.kill();
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    };
  }, [
    items,
    autoplay,
    autoplaySpeed,
    autoplayDirection,
    pauseOnHover,
    isTilted,
    tiltDirection,
  ]);

  return (
    <div
      className="relative flex items-center justify-center w-full overflow-hidden bg-transparent"
      ref={wrapperRef}
      style={{ maxHeight }}
    >
      <div
        className="flex flex-col overscroll-contain px-0 cursor-grab origin-center w-full gap-y-8"
        ref={containerRef}
        style={{
          width,
          transform: getTiltTransform(),
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              background: 'none',
              border: 'none',
              boxShadow: 'none',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
} 