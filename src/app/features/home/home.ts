import { Component, HostListener, OnInit, signal } from '@angular/core';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Journey } from './journey/journey';
import { Main } from './main/main';
import { Projects } from './projects/projects';

@Component({
  selector: 'app-home',
  imports: [Main, About, Projects, Journey, Contact],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  readonly showScrollTop = signal(false);

  ngOnInit(): void {
    this.onWindowScroll();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollTop.set(window.scrollY > 320);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
