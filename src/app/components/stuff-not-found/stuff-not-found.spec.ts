import { MockComponent } from '../../shared/mock.component';
import { StateService } from '../../services/state.service';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { StuffNotFoundComponent } from './stuff-not-found.component';
import { AppSettingsService } from '../../services/app-settings.service';
import { GroupService } from '../../services/group.service';
import { GroupResourcesUrl, GroupLeaderApplicationStatus } from '../../shared/constants';

describe('StuffNotFoundComponent', () => {
    let fixture: ComponentFixture<StuffNotFoundComponent>;
    let comp: StuffNotFoundComponent;
    let mockStateService;
    let mockAppSettingsService;
    let mockGroupService;

    beforeEach(() => {
        mockStateService = jasmine.createSpyObj('state', ['setLoading', 'setPageHeader']);
        mockAppSettingsService = jasmine.createSpyObj('appSettings', ['myStuffName']);
        mockGroupService = jasmine.createSpyObj<GroupService>('groupService', ['getLeaderStatus']);

        TestBed.configureTestingModule({
            declarations: [
                StuffNotFoundComponent,
                MockComponent({selector: 'crds-content-block', inputs: ['id']})
            ],
            providers: [
                { provide: StateService, useValue: mockStateService },
                { provide: AppSettingsService, useValue: mockAppSettingsService },
                { provide: GroupService, useValue: mockGroupService }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(StuffNotFoundComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });
});
