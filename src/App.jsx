import { useEffect, useRef } from "react";
import Calendar from "./components/Calendar";

const baseCompanies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "NVIDIA",
  "Netflix",
  "Adobe",
  "Oracle",
  "OpenAI",
  "Tesla",
  "Samsung",
];

const floatingCompanies = Array.from({ length: 30 }, (_, index) => {
  const label = baseCompanies[index % baseCompanies.length];
  return { id: `${label}-${index}`, label };
});

const tones = [
  "rgba(251, 146, 60, 0.18)",
  "rgba(255, 255, 255, 0.13)",
  "rgba(254, 215, 170, 0.18)",
];

const randomBetween = (min, max) => Math.random() * (max - min) + min;

function App() {
  const zoneRef = useRef(null);
  const itemRefs = useRef([]);
  const objectsRef = useRef([]);
  const cursorRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, active: false });
  const animationFrameRef = useRef(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerRange = 320;
    const minSeparation = 74;

    const getCenterZone = (width, height) => ({
      cx: width * 0.5,
      cy: height * 0.57,
      rx: width * 0.3,
      ry: height * 0.23,
    });

    const isInsideCenterZone = (x, y, padding, width, height) => {
      const zone = getCenterZone(width, height);
      const nx = (x - zone.cx) / (zone.rx + padding);
      const ny = (y - zone.cy) / (zone.ry + padding);
      return nx * nx + ny * ny < 1;
    };

    const pushOutOfCenter = (obj, width, height, boost = 0.18) => {
      const zone = getCenterZone(width, height);
      const dx = obj.x - zone.cx;
      const dy = obj.y - zone.cy;
      const distance = Math.hypot(dx, dy) || 1;
      const nx = dx / distance;
      const ny = dy / distance;
      const edgePadding = Math.max(18, obj.size * 0.55);

      obj.vx += nx * boost;
      obj.vy += ny * boost;

      if (isInsideCenterZone(obj.x, obj.y, edgePadding, width, height)) {
        obj.x += nx * (edgePadding * 0.9);
        obj.y += ny * (edgePadding * 0.9);
      }
    };

    const applyObjectTransform = (obj, element) => {
      if (!element) return;
      const rotX = Math.sin(obj.wobblePhase) * obj.wobbleX;
      const rotY = Math.cos(obj.wobblePhase * 0.86) * obj.wobbleY;
      const rotZ = obj.rotZBase + Math.sin(obj.rotZPhase) * obj.rotZAmp;
      element.style.transform = `translate3d(${obj.x}px, ${obj.y}px, 0) translate(-50%, -50%) scale(${obj.scale}) perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
    };

    const setupObjects = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const marginX = Math.max(18, width * 0.03);
      const marginY = Math.max(18, height * 0.03);

      objectsRef.current = floatingCompanies.map((company) => {
        const speedX = randomBetween(-0.65, 0.65) || 0.34;
        const speedY = randomBetween(-0.55, 0.55) || -0.3;
        const size = 24 + company.label.length * 2.4;
        let x = randomBetween(marginX, Math.max(marginX + 1, width - marginX));
        let y = randomBetween(marginY, Math.max(marginY + 1, height - marginY));

        for (let attempt = 0; attempt < 18; attempt += 1) {
          if (!isInsideCenterZone(x, y, size, width, height)) break;
          x = randomBetween(marginX, Math.max(marginX + 1, width - marginX));
          y = randomBetween(marginY, Math.max(marginY + 1, height - marginY));
        }

        return {
          x,
          y,
          vx: speedX,
          vy: speedY,
          scale: randomBetween(0.88, 1.14),
          rotZBase: randomBetween(-6, 6),
          rotZPhase: randomBetween(0, Math.PI * 2),
          rotZSpeed: randomBetween(0.006, 0.02),
          rotZAmp: randomBetween(0.8, 3.2),
          wobblePhase: randomBetween(0, Math.PI * 2),
          wobbleSpeed: randomBetween(0.008, 0.023),
          wobbleX: randomBetween(0.4, 1.6),
          wobbleY: randomBetween(0.5, 1.9),
          size,
        };
      });
    };

    const clampSpeed = (obj) => {
      const speed = Math.hypot(obj.vx, obj.vy);
      if (speed < 0.12) {
        obj.vx += randomBetween(-0.25, 0.25);
        obj.vy += randomBetween(-0.25, 0.25);
      }
      if (speed > 1.5) {
        obj.vx *= 0.92;
        obj.vy *= 0.92;
      }
    };

    const animate = () => {
      if (reducedMotionRef.current) {
        animationFrameRef.current = null;
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      const objs = objectsRef.current;

      // Keep bubbles from colliding by applying pairwise separation impulses.
      for (let i = 0; i < objs.length; i += 1) {
        for (let j = i + 1; j < objs.length; j += 1) {
          const a = objs[i];
          const b = objs[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance >= minSeparation) continue;

          const nx = dx / distance;
          const ny = dy / distance;
          const overlap = minSeparation - distance;
          const force = overlap * 0.016;

          a.vx += nx * force;
          a.vy += ny * force;
          b.vx -= nx * force;
          b.vy -= ny * force;

          // Positional correction to avoid stacking.
          const correction = overlap * 0.42;
          a.x += nx * correction;
          a.y += ny * correction;
          b.x -= nx * correction;
          b.y -= ny * correction;
        }
      }

      objs.forEach((obj, index) => {
        const cursor = cursorRef.current;

        if (cursor.active) {
          const futureCursorX = cursor.x + cursor.vx * 9;
          const futureCursorY = cursor.y + cursor.vy * 9;
          const dx = obj.x - futureCursorX;
          const dy = obj.y - futureCursorY;
          const distance = Math.hypot(dx, dy) || 1;

          if (distance < pointerRange) {
            const proximity = (pointerRange - distance) / pointerRange;
            const repelStrength = proximity * proximity * 1.9;
            obj.vx += (dx / distance) * repelStrength;
            obj.vy += (dy / distance) * repelStrength;

            // Instant escape impulse when cursor gets very close.
            if (distance < 130) {
              const panicBoost = (130 - distance) / 130;
              obj.vx += (dx / distance) * (0.8 + panicBoost * 1.6);
              obj.vy += (dy / distance) * (0.8 + panicBoost * 1.6);
            }

            // Hard snap-away safeguard if cursor gets on top of a bubble.
            if (distance < 56) {
              obj.x += (dx / distance) * 22;
              obj.y += (dy / distance) * 22;
            }
          }
        }

        obj.vx += randomBetween(-0.008, 0.008);
        obj.vy += randomBetween(-0.008, 0.008);
        obj.vx *= 0.996;
        obj.vy *= 0.996;

        clampSpeed(obj);

        obj.x += obj.vx;
        obj.y += obj.vy;
        obj.rotZPhase += obj.rotZSpeed;
        obj.wobblePhase += obj.wobbleSpeed;

        if (isInsideCenterZone(obj.x, obj.y, obj.size, width, height)) {
          pushOutOfCenter(obj, width, height, 0.22);
        }

        const edgePadding = Math.max(18, obj.size * 0.55);

        if (obj.x < edgePadding) {
          obj.x = edgePadding;
          obj.vx = Math.abs(obj.vx);
        }
        if (obj.x > width - edgePadding) {
          obj.x = width - edgePadding;
          obj.vx = -Math.abs(obj.vx);
        }
        if (obj.y < edgePadding) {
          obj.y = edgePadding;
          obj.vy = Math.abs(obj.vy);
        }
        if (obj.y > height - edgePadding) {
          obj.y = height - edgePadding;
          obj.vy = -Math.abs(obj.vy);
        }

        const el = itemRefs.current[index];
        applyObjectTransform(obj, el);
      });

      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    const handleMouseMove = (event) => {
      const prev = cursorRef.current;
      cursorRef.current = {
        x: event.clientX,
        y: event.clientY,
        vx: event.clientX - prev.x,
        vy: event.clientY - prev.y,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      cursorRef.current.active = false;
      cursorRef.current.vx = 0;
      cursorRef.current.vy = 0;
    };

    const handleTouchMove = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      const prev = cursorRef.current;
      cursorRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        vx: touch.clientX - prev.x,
        vy: touch.clientY - prev.y,
        active: true,
      };
    };

    const handleTouchEnd = () => {
      cursorRef.current.active = false;
      cursorRef.current.vx = 0;
      cursorRef.current.vy = 0;
    };

    const handleResize = () => {
      setupObjects();
      objectsRef.current.forEach((obj, index) => {
        const el = itemRefs.current[index];
        applyObjectTransform(obj, el);
      });

      if (!reducedMotionRef.current && !animationFrameRef.current) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const handleMotionPreference = (event) => {
      reducedMotionRef.current = event.matches;
      if (reducedMotionRef.current && animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (!reducedMotionRef.current && !animationFrameRef.current) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    reducedMotionRef.current = mediaQuery.matches;
    setupObjects();

    objectsRef.current.forEach((obj, index) => {
      const el = itemRefs.current[index];
      applyObjectTransform(obj, el);
    });

    if (!reducedMotionRef.current) {
      animationFrameRef.current = window.requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMotionPreference);
    } else {
      mediaQuery.addListener(handleMotionPreference);
    }

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);

      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMotionPreference);
      } else {
        mediaQuery.removeListener(handleMotionPreference);
      }
    };
  }, []);

  return (
    <>
      <div className="company-float-zone" aria-hidden="true" ref={zoneRef}>
        {floatingCompanies.map((company, index) => (
          <span
            key={company.id}
            className="company-float-item"
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            style={{ "--tone": tones[index % tones.length] }}
          >
            {company.label}
          </span>
        ))}
      </div>

      <div className="app-shell">
        <h1 className="app-title">Take U Forward Calendar</h1>
        <Calendar />
      </div>
    </>
  );
}

export default App;