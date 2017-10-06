import { FilterService } from '../../../services/filter.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HostOnlyComponent } from './host-only.component';

describe('HostOnlyComponent', () => {
  let fixture: ComponentFixture<HostOnlyComponent>;
  let comp: HostOnlyComponent;
  let mockFilterService;

  beforeEach(() => {
    mockFilterService = jasmine.createSpyObj<FilterService>('fs', ['setFilterStringHostOnly', 'getIsHostOnlyFiltered']);
    TestBed.configureTestingModule({
      declarations: [
        HostOnlyComponent
      ],
      providers: [
        { provide: FilterService, useValue: mockFilterService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(HostOnlyComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  });

  it('should init', () => {
    mockFilterService.getIsHostOnlyFiltered.and.returnValue(true);
    comp.ngOnInit();
    expect(comp.onlyShowHosts).toBe(true);
    expect(mockFilterService.getIsHostOnlyFiltered).toHaveBeenCalledTimes(1);
  });

  it('should set onlyShowHosts to true', () => {
    comp.onClick(true);
    expect(mockFilterService.setFilterStringHostOnly).toHaveBeenCalledWith(true);
    expect(comp.onlyShowHosts).toBe(true);
  });

  it('should set onlyShowHosts to false', () => {
    comp.onClick(false);
    expect(mockFilterService.setFilterStringHostOnly).toHaveBeenCalledWith(false);
    expect(comp.onlyShowHosts).toBe(false);
  });

  it('should reset', () => {
    comp.reset();
    expect(comp.onlyShowHosts).toBeFalsy();
    expect(mockFilterService.setFilterStringHostOnly).toHaveBeenCalledWith(false);
  });
});
