import './polyfills.ts';

import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { AppModuleNgFactory } from '../aot/src/app/app.module.ngfactory';

// import zone.js last, otherwise it will throw error "ZoneAware promise has been overriden" during bootstrapping
import 'zone.js/dist/zone';
import 'reflect-metadata';

if (process.env.ENV === 'production') {
  enableProdMode();
}

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
