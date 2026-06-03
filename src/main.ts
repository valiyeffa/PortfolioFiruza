import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initScrollPerformance } from './app/core/scroll-performance';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

initScrollPerformance();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
