import { ActivatedRoute, Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ToastsManager } from 'ng2-toastr';

import { ParticipantRemoveComponent } from './participant-remove.component';

import { BlandPageService } from '../../../../services/bland-page.service';
import { ContentService } from 'crds-ng2-content-block';
import { ParticipantService } from '../../../../services/participant.service';
import { MockTestData } from '../../../../shared/MockTestData';
import { StateService } from '../../../../services/state.service';

class ActivatedRouteStub {
  public params = Observable.of({ groupId: 1234, groupParticipantId: 1 });

  set testParams(params: any) {
    this.params = Observable.of(params);
  }
}

class RouterStub {
  navigate = jasmine.createSpy('navigate');

  public url = '/small-group/1234/participant/1';

  set TestUrl(url: string) {
    this.url = url;
  }
}

describe('ParticipantRemoveComponent', () => {
  let fixture: ComponentFixture<ParticipantRemoveComponent>;
  let comp: ParticipantRemoveComponent;
  let el;
  let mockParticipantService, mockActivatedRoute, mockStateService,
  mockLocationService, mockRouter, mockToastsManager, mockBlandPageService,
  mockContentService;

  beforeEach(() => {
    mockParticipantService = jasmine.createSpyObj<ParticipantService>('participantService', ['getGroupParticipant', 'removeParticipant', 'removeSelfAsParticipant']);
    mockActivatedRoute = new ActivatedRouteStub();
    mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);
    mockLocationService = jasmine.createSpyObj<Location>('location', ['back']);
    mockRouter = new RouterStub();
    mockToastsManager = jasmine.createSpyObj<ToastsManager>('toast', ['info', 'error', 'success']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('bps', ['goToDefaultError']);
    mockContentService = jasmine.createSpyObj<ContentService>('contentService', ['getContent']);
    TestBed.configureTestingModule({
      declarations: [
        ParticipantRemoveComponent
      ],
      providers: [
        { provide: ParticipantService, useValue: mockParticipantService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: StateService, useValue: mockStateService },
        { provide: Location, useValue: mockLocationService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastsManager, useValue: mockToastsManager },
        { provide: ContentService, useValue: mockContentService },
        { provide: BlandPageService, useValue: mockBlandPageService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ParticipantRemoveComponent);
      comp = fixture.componentInstance;

      // el = fixture.debugElement.query(By.css('h1'));
    });
  }));

  it('should init happy path', () => {
    (mockParticipantService.getGroupParticipant).and.returnValue(Observable.of(MockTestData.getAParticipantsArray()[1]));
    fixture.detectChanges();
    expect(comp).toBeTruthy();
    expect(mockParticipantService.getGroupParticipant).toHaveBeenCalledWith(1234, 1);
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
    expect(comp['redirectUrl']).toBe('/small-group/1234');
  });

  it('should handle participant not found in group on init', () => {
    (mockParticipantService.getGroupParticipant).and.returnValue(Observable.throw({error: 'nooo'}));
    spyOn(comp, 'handleError');
    fixture.detectChanges();

    expect(mockParticipantService.getGroupParticipant).toHaveBeenCalledTimes(1);
    expect(comp['handleError']).toHaveBeenCalledTimes(1);
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
  });

  it('closeClick should take you back', () => {
    comp.closeClick();
    expect(mockLocationService.back).toHaveBeenCalledTimes(1);
  });

  describe('test onSubmit', () => {
    it('should remove a participant correctly', () => {
      comp['groupId'] = 42;
      comp['groupParticipantId'] = 99;
      comp['redirectUrl'] = 'test';
      comp['message'] = 'The best message';
      mockParticipantService.removeParticipant.and.returnValue(Observable.of({}));
      mockContentService.getContent.and.returnValue(Observable.of({content: 'success!'}));
      comp.onSubmit(new FormGroup({}));
      expect(mockParticipantService.removeParticipant).toHaveBeenCalledWith(42, 99, 'The best message');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['test']);
      expect(mockContentService.getContent).toHaveBeenCalledWith('groupToolRemoveParticipantSuccess');
      expect(mockToastsManager.success).toHaveBeenCalledWith('success!');
      expect(comp['isFormSubmitted']).toBeTruthy();
      expect(comp['submitting']).toBeFalsy();
    });

    it('should remove self correctly', () => {
      comp['groupId'] = 42;
      comp['groupParticipantId'] = 99;
      comp['redirectUrl'] = 'test';
      comp['isRemovingSelf'] = true;
      mockParticipantService.removeSelfAsParticipant.and.returnValue(Observable.of({}));
      mockContentService.getContent.and.returnValue(Observable.of({content: 'removed yoself'}));
      comp.onSubmit(new FormGroup({}));
      expect(mockParticipantService.removeSelfAsParticipant).toHaveBeenCalledWith(42, 99);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['test']);
      expect(mockContentService.getContent).toHaveBeenCalledWith('groupToolRemoveMyselfSuccess');
      expect(mockToastsManager.success).toHaveBeenCalledWith('removed yoself');
      expect(comp['isFormSubmitted']).toBeTruthy();
      expect(comp['submitting']).toBeFalsy();
    });

    it('onSubmit failure should toast', () => {
      comp['groupId'] = 42;
      comp['groupParticipantId'] = 99;
      comp['redirectUrl'] = 'test';
      comp['message'] = 'The best message';
      (mockParticipantService.removeParticipant).and.returnValue(Observable.throw({error: 'crap'}));
      (mockContentService.getContent).and.returnValue(Observable.of({content: 'Something error happens'}));
      comp.onSubmit(new FormGroup({}));
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(mockContentService.getContent).toHaveBeenCalledWith('groupToolRemoveParticipantFailure');
      expect(mockToastsManager.error).toHaveBeenCalledWith('Something error happens');
      expect(comp['isFormSubmitted']).toBeTruthy();
      expect(comp['submitting']).toBeFalsy();
    });

    it('shouldnt submit if the form is not valid', () => {
      const value = null;
      const formGroup = new FormGroup({formyElement: new FormControl(value, [Validators.required])});
      comp.onSubmit(formGroup);
      expect(comp['isFormSubmitted']).toBeTruthy();
      expect(mockParticipantService.removeParticipant).not.toHaveBeenCalled();
    });
  });

  it('handle error should go to default bland page error', () => {
    comp['redirectUrl'] = 'stuff';
    comp['handleError']();
    expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('stuff');
  });

});
