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
}
