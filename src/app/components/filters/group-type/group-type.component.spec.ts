import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { FilterService } from '../filter.service';
import { LookupService } from '../../../services/lookup.service';
import { MockTestData } from '../../../shared/MockTestData';
import { GroupTypeComponent } from './group-type.component';
import { AttributeType, Attribute, GroupType } from '../../../models';

describe('GroupTypeComponent', () => {
  let fixture: ComponentFixture<GroupTypeComponent>;
  let comp: GroupTypeComponent;
  let el;
  let mockFilterService, mockLookupService;
  let genderMixTypes: AttributeType;

  beforeEach(() => {
    mockFilterService = jasmine.createSpyObj<FilterService>('filterService', ['getSelectedGenderMixes']);
    mockLookupService = jasmine.createSpyObj<LookupService>('lookupService', ['getGroupGenderMixTypes']);
    genderMixTypes = MockTestData.getGroupGenderMixAttributeTypeWithAttributes();

    TestBed.configureTestingModule({
      declarations: [
        GroupTypeComponent
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
      fixture = TestBed.createComponent(GroupTypeComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should create an instance', () => {
    spyOn(comp, 'getGroupTypesFromMpAndInit');
    expect(comp).toBeTruthy();
  });

  it('should init', () => {
    spyOn(comp, 'getGroupTypesFromMpAndInit');
    comp.ngOnInit();
    expect(comp['getGroupTypesFromMpAndInit']).toHaveBeenCalledTimes(1);
  });

  it('should call setSelection', () => {
    spyOn(comp, 'setGroupTypeSelection');
    spyOn(comp, 'setFilterStringInFilterService');
    comp.onGroupTypeClicked('123');
    expect(comp['setGroupTypeSelection']).toHaveBeenCalledTimes(1);
    expect(comp['setFilterStringInFilterService']).toHaveBeenCalledTimes(1);
  });

  it('should reset', () => {
    let attr = new Attribute(1, 'attr', 'desc', 'cat', 2, 'catdesc', 3, null, null, null);
    let a1 = new GroupType(attr);
    a1.selected = true;
    let a2 = new GroupType(attr);
    a2.selected = true;

    comp['groupTypes'] = [a1, a2];
    comp.reset();

    expect(comp['groupTypes'][0].selected).toBe(false);
    expect(comp['groupTypes'][1].selected).toBe(false);
  });

  it('should getGroupTypesFromMpAndInit', () => {
    mockLookupService.getGroupGenderMixTypes.and.returnValue(Observable.of(genderMixTypes));
    spyOn(comp, 'setSelectedGroupTypes');
    comp['getGroupTypesFromMpAndInit']();
    expect(comp['setSelectedGroupTypes']).toHaveBeenCalledTimes(1);
    expect(comp['groupTypes'].length).toBe(3);
  });

  it('should not select anything if filterService has no group gender mix filters', () => {
    mockLookupService.getGroupGenderMixTypes.and.returnValue(Observable.of(genderMixTypes));
    comp.ngOnInit();
    const selectedGenderMixes = comp['groupTypes'].filter(i => i.selected);
    expect(selectedGenderMixes.length).toBe(0);
  });

  it('should set selected gender mix types if filterService has filter string', () => {
    mockLookupService.getGroupGenderMixTypes.and.returnValue(Observable.of(genderMixTypes));
    mockFilterService.getSelectedGenderMixes.and.returnValue(genderMixTypes.attributes[0].name);
    comp['getGroupTypesFromMpAndInit']();
    const selectedGenderMixes = comp['groupTypes'].filter(i => i.selected);
    expect(selectedGenderMixes.length).toBe(1);
  });
});
