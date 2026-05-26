import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrls: ['./about.scss'],
})
export class About implements AfterViewInit {

  @ViewChild('sect', { static: true })
  sect!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {

    const aboutSect = this.sect.nativeElement;
    const scndBox = aboutSect.querySelector('.scnd-box') as HTMLElement;
    const thridBox = aboutSect.querySelector('.thrid-box') as HTMLElement;

    gsap.set(scndBox, {
      xPercent: 100,
    });

    gsap.set(thridBox, {
      yPercent: -100,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSect,
        start: 'top top',
        end: '+=3000',
        scrub: true,
        pin: true,
        anticipatePin: 1,
      }
    });

    tl.to(scndBox, {
      xPercent: 0,
      duration: 1,
    })
      .to(thridBox, {
        yPercent: 0,
        duration: 1,
      });
  }
}