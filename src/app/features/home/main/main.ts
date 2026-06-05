import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { isTouchDevice } from '../../../core/scroll-performance';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.html',
  styleUrl: `./main.scss`,
})
export class Main implements AfterViewInit, OnDestroy {
  @ViewChild('sect', { static: true }) sect!: ElementRef<HTMLDivElement>;

  private scrollY = 0;
  private rafId = 0;
  private readonly parallaxEnabled = !isTouchDevice;
  private readonly onOrientationChange = () => this.lockMobileHeroHeight();

  ngAfterViewInit(): void {
    this.lockMobileHeroHeight();

    if (isTouchDevice) {
      window.addEventListener('orientationchange', this.onOrientationChange);
    }
  }

  /** Lock hero height on mobile — avoids 100vh jump when the address bar hides on scroll. */
  private lockMobileHeroHeight(): void {
    if (!isTouchDevice || typeof CSS !== 'undefined' && CSS.supports('height', '100svh')) {
      return;
    }

    const section = this.sect.nativeElement;
    const height = `${window.innerHeight}px`;
    section.style.height = height;
    section.style.minHeight = height;
  }
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const rect = this.sect.nativeElement.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.sect.nativeElement.style.setProperty('--x', `${x}px`);
    this.sect.nativeElement.style.setProperty('--y', `${y}px`);
  }

  @HostListener('window:scroll')
  onScroll() {
    if (!this.parallaxEnabled) return;

    this.scrollY = window.scrollY;
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => this.updateImage());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('orientationchange', this.onOrientationChange);
  }
  updateImage() {
    const section = this.sect.nativeElement;
    const rect = section.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const img = section.querySelector('.image img') as HTMLElement | null;
    if (!img) return;

    const move = this.scrollY * 0.3;
    img.style.transform = `translate3d(0, ${move}px, 0)`;
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    const target = document.getElementById(sectionId);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
