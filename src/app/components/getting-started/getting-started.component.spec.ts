import { TestBed } from '@angular/core/testing';
import { ElementRef, Renderer } from '@angular/core';
import { GettingStartedComponent } from './getting-started.component';

describe('Component: GettingStarted', () => {
  it('should create an instance', () => {
    let component = new GettingStartedComponent(null, null);
    expect(component).toBeTruthy();
  });
});
