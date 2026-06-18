import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Position of mouse
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Add drift-like spring physics to the cursor movement
  const springConfig = { damping: 25, stiffness: 220, mass: 0.45 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device is touch-only or mobile-sized to avoid custom cursors on touchscreen
    const checkMobile = () => {
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth < 768;
      setIsMobile(isTouch);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if mouse is over interactive element (buttons or booking items)
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') ||
        target.getAttribute('type') === 'checkbox';

      if (isInteractive) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') ||
        target.getAttribute('type') === 'checkbox';

      if (isInteractive) {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isMobile || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Global CSS style override to hide the standard pointer cursor on desktop devices */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (hover: hover) and (pointer: fine) {
          body, button, a, select, input, textarea, [role="button"], .cursor-pointer {
            cursor: none !important;
          }
        }
      `}} />

      {/* Custom lagging/drifting cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {isHovered ? (
          // Interactive Hover state: rotating racing steering / dial lock wheel
          <motion.div 
            initial={{ scale: 0.8, rotate: 0 }}
            animate={{ scale: 1.25, rotate: 360 }}
            transition={{
              rotate: { repeat: Infinity, duration: 1.8, ease: "linear" },
              scale: { type: "spring", stiffness: 450, damping: 18 }
            }}
            className="relative flex items-center justify-center w-12 h-12"
          >
            {/* Outer steering wheel with section notches */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-red-500/90 shadow-[0_0_12px_rgba(239,68,68,0.25)]"></div>
            {/* Crossed grid beams */}
            <div className="absolute w-9 h-0.5 bg-red-500/50"></div>
            <div className="absolute h-9 w-0.5 bg-red-500/50"></div>
            {/* Center core target lock core indicator */}
            <div className="absolute w-3 h-3 rounded-full bg-yellow-400 border border-black shadow-[0_0_6px_rgba(234,179,8,0.8)]"></div>
          </motion.div>
        ) : (
          // Neutral crosshair circle state
          <div className="relative flex items-center justify-center w-7 h-7">
            {/* Outer coordinate scope ring */}
            <div className="absolute inset-0 rounded-full border border-white/60 shadow-[0_0_8px_rgba(255,255,255,0.15)] ring-2 ring-black/30"></div>
            {/* Vertical/horizontal crosshair markers */}
            <div className="absolute top-0 w-0.5 h-1 bg-red-500/90"></div>
            <div className="absolute bottom-0 w-0.5 h-1 bg-red-500/90"></div>
            <div className="absolute left-0 h-0.5 w-1 bg-red-500/90"></div>
            <div className="absolute right-0 h-0.5 w-1 bg-red-500/90"></div>
            {/* Tiny central driver position dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 border border-white/80"></div>
          </div>
        )}
      </motion.div>
    </>
  );
}
