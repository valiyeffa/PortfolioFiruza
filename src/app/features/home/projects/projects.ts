import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isTouchDevice, scrollScrub } from '../../../core/scroll-performance';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss'],
})
export class Projects implements AfterViewInit, OnDestroy {
  projects = [
    {
      id: '01',
      name: 'Coppola',
      link: 'https://youtu.be/XACglvsG7g4',
      img: 'coppola.webp',
      fallback: 'coppola.png',
    },
    {
      id: '02',
      name: 'ERP BrendMoto',
      link: 'https://youtu.be/MbXyjdzMp3U',
      img: 'erp.webp',
      fallback: 'erp.png',
    },
    {
      id: '03',
      name: 'BrendMoto Ecommerce',
      link: 'https://youtu.be/Gxqj3aoaNTE',
      img: 'brendEcom.webp',
      fallback: 'brendEcom.png',
    },
    {
      id: '04',
      name: 'BrendMoto Dashboard',
      link: 'https://youtu.be/Gxqj3aoaNTE',
      img: 'brendDash.webp',
      fallback: 'brendDash.png',
    },
    {
      id: '05',
      name: 'Medhis Statistic Dashboard',
      link: 'https://youtu.be/-COh-aqqRnY',
      img: 'medhis.webp',
      fallback: 'medhis.png',
    },
    {
      id: '06',
      name: 'Eurosia Training Angular 21',
      link: 'https://youtu.be/4K4CvJuvciE',
      img: 'euro.webp',
      fallback: 'euro.png',
    },
    {
      id: '07',
      name: 'Port Angular 21',
      link: 'https://youtu.be/zXpmFih2b4w',
      img: 'port.webp',
      fallback: 'port.png',
    },
    {
      id: '08',
      name: "Firuza's Portfolio",
      link: 'https://portfolio-firuza.vercel.app/',
      img: 'portf.webp',
      fallback: 'portf.png',
    },
  ];

  @ViewChild('sect', { static: true })
  sect!: ElementRef<HTMLDivElement>;

  private scrollTween?: gsap.core.Tween;
  private refreshTimer?: ReturnType<typeof setTimeout>;
  private resizeTimer?: ReturnType<typeof setTimeout>;

  ngAfterViewInit(): void {
    const section = this.sect.nativeElement;
    const wrapper = section.querySelector('.cards-wrapper') as HTMLElement;

    gsap.set(wrapper, { force3D: true });

    this.createHorizontalScroll(section, wrapper);
    this.bindImageLoadRefresh(section, wrapper);
    window.addEventListener('resize', this.onResize, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    clearTimeout(this.refreshTimer);
    clearTimeout(this.resizeTimer);
    this.scrollTween?.scrollTrigger?.kill();
    this.scrollTween?.kill();
  }

  private readonly onResize = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      const section = this.sect.nativeElement;
      const wrapper = section.querySelector('.cards-wrapper') as HTMLElement;
      this.createHorizontalScroll(section, wrapper);
    }, 200);
  };

  private createHorizontalScroll(section: HTMLElement, wrapper: HTMLElement): void {
    this.scrollTween?.scrollTrigger?.kill();
    this.scrollTween?.kill();

    const totalScroll = Math.max(0, wrapper.scrollWidth - window.innerWidth);

    this.scrollTween = gsap.to(wrapper, {
      x: -totalScroll,
      ease: 'none',
      force3D: true,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + totalScroll,
        scrub: scrollScrub,
        pin: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
      },
    });
  }

  private scheduleRefresh(section: HTMLElement, wrapper: HTMLElement, recalc = false): void {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      if (recalc) {
        this.createHorizontalScroll(section, wrapper);
      }
    }, isTouchDevice ? 250 : 120);
  }

  private bindImageLoadRefresh(section: HTMLElement, wrapper: HTMLElement): void {
    const images = Array.from(wrapper.querySelectorAll<HTMLImageElement>('.card img'));
    let pending = 0;

    const onImageSettled = () => {
      pending--;
      this.scheduleRefresh(section, wrapper, pending <= 0);
    };

    for (const img of images) {
      if (img.complete) continue;
      pending++;
      img.addEventListener('load', onImageSettled, { once: true });
      img.addEventListener('error', onImageSettled, { once: true });
    }

    if (pending === 0) {
      this.scheduleRefresh(section, wrapper, false);
    }
  }
}
