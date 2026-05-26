import { Component } from '@angular/core';
import { Main } from "./main/main";
import { About } from "./about/about";
import { Projects } from "./projects/projects";

@Component({
  selector: 'app-home',
  imports: [Main, About, Projects],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {

}
