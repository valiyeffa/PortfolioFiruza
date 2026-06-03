import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
      img: 'coppola.png'
    },
    {
      id: '02',
      name: 'ERP BrendMoto',
      link: 'https://youtu.be/MbXyjdzMp3U',
      img: 'erp.png'
    },
    {
      id: '03',
      name: 'BrendMoto Ecommerce',
      link: 'https://youtu.be/Gxqj3aoaNTE',
      img: 'brendEcom.png'
    },
    {
      id: '04',
      name: 'BrendMoto Dashboard',
      link: 'https://youtu.be/Gxqj3aoaNTE',
      img: 'brendDash.png'
    },
    {
      id: '05',
      name: 'Medhis Statistic Dashboard',
      link: 'https://youtu.be/-COh-aqqRnY',
      img: 'medhis.png'
    },
    {
      id: '06',
      name: 'Eurosia Training Angular 21',
      link: 'https://youtu.be/4K4CvJuvciE',
      img: 'euro.png'
    },
    {
      id: '07',
      name: 'Port Angular 21',
      link: 'https://youtu.be/zXpmFih2b4w',
      img: 'port.png'
    },
    {
      id: '08',
      name: "Firuza's Portfolio",
      link: 'https://portfolio-firuza.vercel.app/',
      img: 'portf.png'
    }   
  ]

  @ViewChild('sect', { static: true })
  sect!: ElementRef<HTMLDivElement>;

  private scrollTween?: gsap.core.Tween;

  private readonly onResize = () => ScrollTrigger.refresh();

  ngAfterViewInit(): void {
    const section = this.sect.nativeElement;
    const wrapper = section.querySelector('.cards-wrapper') as HTMLElement;

    this.createHorizontalScroll(section, wrapper);
    this.bindImageLoadRefresh(section, wrapper);
    window.addEventListener('resize', this.onResize, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    this.scrollTween?.scrollTrigger?.kill();
    this.scrollTween?.kill();
  }

  private createHorizontalScroll(section: HTMLElement, wrapper: HTMLElement): void {
    this.scrollTween?.scrollTrigger?.kill();
    this.scrollTween?.kill();

    const totalScroll = Math.max(0, wrapper.scrollWidth - window.innerWidth);

    this.scrollTween = gsap.to(wrapper, {
      x: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + totalScroll,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
  }

  private bindImageLoadRefresh(section: HTMLElement, wrapper: HTMLElement): void {
    const images = Array.from(wrapper.querySelectorAll<HTMLImageElement>('.card img'));
    let pending = 0;

    const onImageSettled = () => {
      ScrollTrigger.refresh();
      pending--;
      if (pending <= 0) {
        this.createHorizontalScroll(section, wrapper);
      }
    };

    for (const img of images) {
      if (img.complete) continue;
      pending++;
      img.addEventListener('load', onImageSettled, { once: true });
      img.addEventListener('error', onImageSettled, { once: true });
    }

    if (pending === 0) {
      ScrollTrigger.refresh();
    }
  }
}