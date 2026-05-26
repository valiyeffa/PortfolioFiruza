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

    const cards = section.querySelectorAll('.card');
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

    gsap.from(cards, {
      opacity: 0,
      y: 80,
      scale: 0.9,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.3,

      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }
}