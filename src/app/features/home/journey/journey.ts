import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  signal,
} from '@angular/core';
import { isTouchDevice } from '../../../core/scroll-performance';

export interface JourneyStep {
  id: string;
  year: string;
  title: string;
  description: string;
  img: string;
  clr: string;
}

@Component({
  selector: 'app-journey',
  imports: [],
  templateUrl: './journey.html',
  styleUrl: './journey.scss',
})
export class Journey implements AfterViewInit, OnDestroy {
  readonly steps: JourneyStep[] = [
    {
      id: 'step-1',
      year: '2022 Sep',
      title: 'Started Computer Science Journey',
      img: '/logo/beu.png',
      clr: 'light',
      description:
        'Began my Computer Science degree at Baku Engineering University (BEU). During this period, I explored different areas of software development, learned programming fundamentals, and decided to specialize in Frontend Development.',
    },
    {
      id: 'step-2',
      year: '2024 Jun',
      title: 'Frontend Education at Matrix Academy',
      img: '/logo/matrix.png',
      clr: 'light',
      description:
        'Joined Matrix Academy to deepen my frontend development skills. Studied modern web technologies, frameworks, and best practices while working on practical projects. Successfully graduated with an Honour Degree.',
    },
    {
      id: 'step-3',
      year: '2025 Jan',
      title: 'Frontend Developer at Webluna Software',
      img: '/logo/webluna.png',
      clr: 'dark',
      description:
        'Started working remotely as a Frontend Developer. Contributed to ERP systems and e-commerce platforms, gaining hands-on experience in building scalable business applications and collaborating in a professional development environment.',
    },
    {
      id: 'step-4',
      year: '2025 Aug',
      title: 'Frontend Intern at Togetech',
      img: '/logo/togetech.webp',
      clr: 'light',
      description:
        'Joined Togetech as a Frontend Intern, where I expanded my expertise in Angular and Ionic, developing cross-platform applications and improving my understanding of modern frontend architecture.',
    },
    {
      id: 'step-5',
      year: '2025 Aug',
      title: 'Freelance Developer at Medhis LLC',
      img: '/logo/medhis.png',
      clr: 'light',
      description:
        'Worked as a freelance Frontend Developer, building statistical dashboards and integrating APIs into existing applications. Focused on data visualization, performance, and seamless user experiences.',
    },
    {
      id: 'step-6',
      year: '2026 Feb',
      title: 'Frontend Intern at Uniser MMC',
      img: '/logo/uniser.svg',
      clr: 'light',
      description:
        'Began working full-time as an Angular Developer at Uniser MMC. Contributed to enterprise-level applications, implemented scalable frontend solutions, and continued strengthening my expertise in Angular development.',
    },
  ];

  readonly activeIndex = signal(0);
  readonly lineFillPx = signal(0);

  @ViewChildren('stepSection') stepSections!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('stepMarker') stepMarkers!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('journeyContent') journeyContent!: ElementRef<HTMLElement>;
  @ViewChild('stepsRail') stepsRail!: ElementRef<HTMLElement>;

  private resizeObserver?: ResizeObserver;
  private rafId = 0;
  private lastActiveIndex = -1;
  private lastLineFillPx = -1;
  private lastRailTop = '';
  private lastRailHeight = '';

  private readonly onScroll = () => {
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => this.updateProgress());
  };

  ngAfterViewInit(): void {
    this.setupResizeObserver();
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onScroll, { passive: true });
    this.updateProgress();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  }

  scrollToStep(index: number): void {
    const el = this.stepSections.get(index)?.nativeElement;
    el?.scrollIntoView({ behavior: isTouchDevice ? 'auto' : 'smooth', block: 'center' });
  }

  private setupResizeObserver(): void {
    const content = this.journeyContent?.nativeElement;
    if (!content || typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(() => this.scheduleUpdate());
    this.resizeObserver.observe(content);
  }

  private scheduleUpdate(): void {
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => this.updateProgress());
  }

  private updateProgress(): void {
    const container = this.journeyContent?.nativeElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    if (containerRect.bottom < 0 || containerRect.top > window.innerHeight) return;

    this.updateActiveIndex();
    this.positionRail();
    this.updateLineFill();
  }

  private updateActiveIndex(): void {
    const sections = this.stepSections?.toArray() ?? [];
    if (!sections.length) return;

    const viewportCenter = window.innerHeight * (isTouchDevice ? 0.42 : 0.5);
    let bestIndex = 0;
    let closestDistance = Infinity;

    sections.forEach((section, index) => {
      const rect = section.nativeElement.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        bestIndex = index;
      }
    });

    if (bestIndex !== this.lastActiveIndex) {
      this.lastActiveIndex = bestIndex;
      this.activeIndex.set(bestIndex);
    }
  }

  private positionRail(): void {
    const markers = this.stepMarkers?.toArray() ?? [];
    const rail = this.stepsRail?.nativeElement;
    const container = this.journeyContent?.nativeElement;
    if (!markers.length || !rail || !container) return;

    const containerRect = container.getBoundingClientRect();
    const first = markers[0].nativeElement.getBoundingClientRect();
    const last = markers[markers.length - 1].nativeElement.getBoundingClientRect();

    const firstCenter = first.top + first.height / 2 - containerRect.top;
    const lastCenter = last.top + last.height / 2 - containerRect.top;
    const top = `${firstCenter}px`;
    const height = `${Math.max(0, lastCenter - firstCenter)}px`;

    if (top !== this.lastRailTop) {
      this.lastRailTop = top;
      rail.style.top = top;
    }

    if (height !== this.lastRailHeight) {
      this.lastRailHeight = height;
      rail.style.height = height;
    }
  }

  private updateLineFill(): void {
    const markers = this.stepMarkers?.toArray() ?? [];
    const rail = this.stepsRail?.nativeElement;
    if (!markers.length || !rail) {
      if (this.lastLineFillPx !== 0) {
        this.lastLineFillPx = 0;
        this.lineFillPx.set(0);
      }
      return;
    }

    const railRect = rail.getBoundingClientRect();
    const railHeight = railRect.height;

    if (railHeight <= 0) {
      if (this.lastLineFillPx !== 0) {
        this.lastLineFillPx = 0;
        this.lineFillPx.set(0);
      }
      return;
    }

    const viewportCenter = window.innerHeight * (isTouchDevice ? 0.42 : 0.5);
    const markerCenters = markers.map(
      (m) => m.nativeElement.getBoundingClientRect().top + m.nativeElement.offsetHeight / 2,
    );

    const firstCenter = markerCenters[0];
    const lastCenter = markerCenters[markerCenters.length - 1];
    const trackSpan = lastCenter - firstCenter;

    if (trackSpan <= 0) {
      if (this.lastLineFillPx !== 0) {
        this.lastLineFillPx = 0;
        this.lineFillPx.set(0);
      }
      return;
    }

    const scrollProgress = (viewportCenter - firstCenter) / trackSpan;
    const clamped = Math.min(1, Math.max(0, scrollProgress));
    const fillPx = Math.round(clamped * railHeight);

    if (Math.abs(fillPx - this.lastLineFillPx) >= (isTouchDevice ? 2 : 1)) {
      this.lastLineFillPx = fillPx;
      this.lineFillPx.set(fillPx);
    }
  }
}
