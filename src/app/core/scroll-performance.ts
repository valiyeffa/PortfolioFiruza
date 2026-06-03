import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Shared GSAP scroll tuning — call once before any ScrollTrigger is created. */
export function initScrollPerformance(): void {
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
  });
}

/** Smoother scrub on touch; boolean scrub on desktop. */
export const scrollScrub = ScrollTrigger.isTouch === 1 ? 0.35 : true;

export const isTouchDevice = ScrollTrigger.isTouch === 1;
