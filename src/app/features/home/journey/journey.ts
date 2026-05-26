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

export interface JourneyStep {
  id: string;
  year: string;
  title: string;
  description: string;
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
      year: '2022',
      title: 'Start learning web development',
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellendus itaque maiores natus doloremque quo dignissimos mollitia deleniti tenetur illo? Eligendi sit vel cum iure dolorum autem quo, quibusdam harum quisquam!',
    },
    {
      id: 'step-2',
      year: '2023',
      title: 'Built first real projects with Angular',
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellendus itaque maiores natus doloremque quo dignissimos mollitia deleniti tenetur illo? Eligendi sit vel cum iure dolorum autem quo, quibusdam harum quisquam!',
    },
    {
      id: 'step-3',
      year: '2024',
      title: 'Worked on advanced frontend systems',
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellendus itaque maiores natus doloremque quo dignissimos mollitia deleniti tenetur illo? Eligendi sit vel cum iure dolorum autem quo, quibusdam harum quisquam!',
    },
    {
      id: 'step-4',
      year: '2025',
      title: 'Now building scalable UI/UX systems',
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellendus itaque maiores natus doloremque quo dignissimos mollitia deleniti tenetur illo? Eligendi sit vel cum iure dolorum autem quo, quibusdam harum quisquam!',
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
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private setupResizeObserver(): void {
    const content = this.journeyContent?.nativeElement;
    if (!content || typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(() => this.updateProgress());
    this.resizeObserver.observe(content);
  }

  private updateProgress(): void {
    this.updateActiveIndex();
    this.positionRail();
    this.updateLineFill();
  }

  private updateActiveIndex(): void {
    const sections = this.stepSections?.toArray() ?? [];
    if (!sections.length) return;

    const viewportCenter = window.innerHeight / 2;
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

    this.activeIndex.set(bestIndex);
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

    rail.style.top = `${firstCenter}px`;
    rail.style.height = `${Math.max(0, lastCenter - firstCenter)}px`;
  }

  private updateLineFill(): void {
    const markers = this.stepMarkers?.toArray() ?? [];
    const rail = this.stepsRail?.nativeElement;
    if (!markers.length || !rail) {
      this.lineFillPx.set(0);
      return;
    }

    const railRect = rail.getBoundingClientRect();
    const railTop = railRect.top;
    const railHeight = railRect.height;

    if (railHeight <= 0) {
      this.lineFillPx.set(0);
      return;
    }

    const viewportCenter = window.innerHeight / 2;
    const markerCenters = markers.map(
      (m) => m.nativeElement.getBoundingClientRect().top + m.nativeElement.offsetHeight / 2,
    );

    const firstCenter = markerCenters[0];
    const lastCenter = markerCenters[markerCenters.length - 1];
    const trackSpan = lastCenter - firstCenter;

    if (trackSpan <= 0) {
      this.lineFillPx.set(0);
      return;
    }

    const scrollProgress = (viewportCenter - firstCenter) / trackSpan;
    const clamped = Math.min(1, Math.max(0, scrollProgress));
    this.lineFillPx.set(clamped * railHeight);
  }
}
