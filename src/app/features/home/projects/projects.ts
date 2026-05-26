import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss'],
})
export class Projects implements AfterViewInit {

  @ViewChild('sect', { static: true })
  sect!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {

    const section = this.sect.nativeElement;
    const wrapper = section.querySelector('.cards-wrapper') as HTMLElement;

    const totalScroll = wrapper.scrollWidth - window.innerWidth;

    gsap.to(wrapper, {
      x: -totalScroll,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => "+=" + totalScroll,
        scrub: true,
        pin: true,
        snap: 1 / (wrapper.children.length - 1)
      }
    });
  }
}