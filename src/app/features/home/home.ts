import { Component } from '@angular/core';
import { Main } from "./main/main";
import { About } from "./about/about";
import { Projects } from "./projects/projects";
import { Journey } from "./journey/journey";
import { Contact } from "./contact/contact";

@Component({
  selector: 'app-home',
  imports: [Main, About, Projects, Journey, Contact],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {

}
