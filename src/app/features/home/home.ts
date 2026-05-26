import { Component } from '@angular/core';
import { Main } from "./main/main";
import { About } from "./about/about";
import { Projects } from "./projects/projects";
import { Journey } from "./journey/journey";

@Component({
  selector: 'app-home',
  imports: [Main, About, Projects, Journey],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {

}
