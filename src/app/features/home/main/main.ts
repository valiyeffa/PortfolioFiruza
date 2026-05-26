import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.html',
  styleUrl: `./main.scss`,
})
export class Main {
  @ViewChild('sect', { static: true }) sect!: ElementRef<HTMLDivElement>;

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const rect = this.sect.nativeElement.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.sect.nativeElement.style.setProperty('--x', `${x}px`);
    this.sect.nativeElement.style.setProperty('--y', `${y}px`);
  }

  private scrollY = 0;

  @HostListener('window:scroll')
  onScroll() {
    this.scrollY = window.scrollY;
    this.updateImage();
  }

  updateImage() {
    const img = this.sect.nativeElement.querySelector('.image img') as HTMLElement;

    if (!img) return;

    const move = this.scrollY * 0.3;

    img.style.transform = `translateY(${move}px)`;
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    const target = document.getElementById(sectionId);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
