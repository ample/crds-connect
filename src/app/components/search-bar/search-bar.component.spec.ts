/* tslint:disable:no-unused-variable */
import { Component, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule }   from '@angular/forms';
import { SearchBarComponent } from './search-bar.component';


describe('Component: Search Bar', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchBarComponent
      ],
      imports: [
        FormsModule
      ],
      providers: []
    });
    this.fixture = TestBed.createComponent(SearchBarComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should toggle view', () => {
    expect(this.component.buttontext).toBe(undefined);
    this.component.toggleView();
    expect(this.component.buttontext).toBe('Map');
  });

  it('should emit search event', (done) => {
    this.component.search.subscribe( g => {
      expect(g).toEqual('Phil Is Cool!');
      done();
    });
    this.component.onSearch('Phil Is Cool!');
  });

});

