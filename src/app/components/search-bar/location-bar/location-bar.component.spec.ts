import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationBarComponent } from './location-bar.component';

describe('SearchLocationComponent', () => {
  let component: LocationBarComponent;
  let fixture: ComponentFixture<LocationBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
