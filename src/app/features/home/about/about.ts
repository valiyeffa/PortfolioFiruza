import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollScrub } from '../../../core/scroll-performance';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrls: ['./about.scss'],
})
export class About implements AfterViewInit, OnDestroy {

  @ViewChild('sect', { static: true })
  sect!: ElementRef<HTMLDivElement>;

  private mm?: gsap.MatchMedia;

  ngAfterViewInit(): void {
    const aboutSect = this.sect.nativeElement;
    const scndBox = aboutSect.querySelector('.scnd-box') as HTMLElement;
    const thridBox = aboutSect.querySelector('.thrid-box') as HTMLElement;

    this.mm = gsap.matchMedia();

    const setupTimeline = (end: string) => {
      gsap.set(scndBox, { xPercent: 100, force3D: true });
      gsap.set(thridBox, { yPercent: -100, force3D: true });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSect,
          start: 'top top',
          end,
          scrub: scrollScrub,
          pin: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(scndBox, { xPercent: 0, duration: 1, force3D: true })
        .to(thridBox, { yPercent: 0, duration: 1, force3D: true });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set([scndBox, thridBox], { clearProps: 'transform' });
      };
    };

    this.mm.add('(min-width: 769px)', () => setupTimeline('+=3000'));
    this.mm.add('(max-width: 768px)', () => setupTimeline('+=2000'));
  }

  ngOnDestroy(): void {
    this.mm?.revert();
  }
}
