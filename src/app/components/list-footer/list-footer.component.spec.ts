import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlandPageService } from '../../services/bland-page.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ListFooterComponent } from './list-footer.component';
import { ListHelperService } from '../../services/list-helper.service';
import { MockComponent } from '../../shared/mock.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';

describe('ListFooterComponent', () => {
    let fixture: ComponentFixture<ListFooterComponent>;
    let comp: ListFooterComponent;
    let el;
    let mockListHelperService, mockLoginRedirectService, mockStateService, mockSessionService, mockBlandPageService;

    beforeEach(() => {
        mockListHelperService = { getUserMapState: jest.fn() };
        mockSessionService = { getContactId: jest.fn() };
        mockStateService = { setCurrentView: jest.fn(), getCurrentView: jest.fn() };
        mockBlandPageService = { goToWhatsAHost: jest.fn() };
        TestBed.configureTestingModule({
            declarations: [
                ListFooterComponent,
                MockComponent({ selector: 'crds-content-block', inputs: ['id'] })
            ],
            imports: [
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                { provide: ListHelperService, useValue: mockListHelperService },
                { provide: SessionService, useValue: mockSessionService },
                { provide: StateService, useValue: mockStateService },
                { provide: BlandPageService, useValue: mockBlandPageService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ListFooterComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });
});
