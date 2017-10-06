import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostOnlyComponent } from './host-only.component';

describe('HostOnlyComponent', () => {
  let component: HostOnlyComponent;
  let fixture: ComponentFixture<HostOnlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostOnlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
