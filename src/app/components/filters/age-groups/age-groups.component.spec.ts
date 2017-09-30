import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { FilterService } from '../filter.service';
import { LookupService } from '../../../services/lookup.service';
import { MockTestData } from '../../../shared/MockTestData';
import { AgeGroupsComponent } from './age-groups.component';
import { AgeGroup, Attribute } from '../../../models';

describe('AgeGroupsComponent', () => {
  let fixture: ComponentFixture<AgeGroupsComponent>;
  let comp: AgeGroupsComponent;
  let el;
  let mockFilterService, mockLookupService;


  beforeEach(() => {
    mockFilterService = jasmine.createSpyObj<FilterService>('filterService', ['getSelectedAgeGroups']);
    mockLookupService = jasmine.createSpyObj<LookupService>('lookupService', ['getAgeRanges']);

    TestBed.configureTestingModule({
      declarations: [
        AgeGroupsComponent
      ],
      providers: [
        { provide: FilterService, useValue: mockFilterService },
        { provide: LookupService, useValue: mockLookupService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(AgeGroupsComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should create an instance', () => {
    spyOn(comp, 'initializeAgeGroups');
    expect(comp).toBeTruthy();
  });

  it('should init', () => {
    spyOn(comp, 'initializeAgeGroups');
    comp.ngOnInit();
    expect(comp['initializeAgeGroups']).toHaveBeenCalledTimes(1);
  });

  it('should call setSelection', () => {
    spyOn(comp, 'setSelection');
    spyOn(comp, 'setFilterString');
    comp.clickToSelect('123');
    expect(comp['setSelection']).toHaveBeenCalledTimes(1);
    expect(comp['setFilterString']).toHaveBeenCalledTimes(1);
  });

  it('should reset', () => {
    let attr = new Attribute(1, 'attr', 'desc', 'cat', 2, 'catdesc', 3, 1, null, null);
    let a1 = new AgeGroup(attr);
    a1.selected = true;
    let a2 = new AgeGroup(attr);
    a2.selected = true;

    comp['ageGroups'] = [a1, a2];
    comp.reset();

    expect(comp['ageGroups'][0].selected).toBe(false);
    expect(comp['ageGroups'][1].selected).toBe(false);
  });

  it('should initialize age groups', () => {
    const ages = MockTestData.getAgeRangeAttributeTypeWithAttributes();
    mockLookupService.getAgeRanges.and.returnValue(Observable.of(ages));
    spyOn(comp, 'setSelectedAgeGroups');
    comp.ngOnInit();
    expect(comp['ageGroups'].length).toBe(4);
    expect(comp['setSelectedAgeGroups']).toHaveBeenCalledTimes(1);
  });

  it('should not select anything if filterService has no age group filters', () => {
    const ages = MockTestData.getAgeRangeAttributeTypeWithAttributes();
    mockLookupService.getAgeRanges.and.returnValue(Observable.of(ages));
    comp.ngOnInit();
    const selectedAges = comp['ageGroups'].filter(i => i.selected);
    expect(selectedAges.length).toBe(0);
  });

  it('should set selected age ranges if filterService has a string that matches', () => {
    const ages = MockTestData.getAgeRangeAttributeTypeWithAttributes();
    mockLookupService.getAgeRanges.and.returnValue(Observable.of(ages));
    mockFilterService.getSelectedAgeGroups.and.returnValue([ages.attributes[0].name, ages.attributes[2].name]);
    comp['initializeAgeGroups']();
    const selectedAges = comp['ageGroups'].filter(i => i.selected);
    expect(selectedAges.length).toBe(2);
  });
});
