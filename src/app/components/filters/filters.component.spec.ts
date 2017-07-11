import { DebugElement } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule,  FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { FilterService } from '../../services/filter.service';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';
import { FiltersComponent } from './filters.component';
import { KidsWelcomeComponent } from './kids-welcome/kids-welcome.component';
import { AgeGroupsComponent } from './age-groups/age-groups.component';
import { SearchOptions } from '../../models';

describe('FiltersComponent', () => {
    let fixture: ComponentFixture<FiltersComponent>;
    let comp: FiltersComponent;
    let mockFilterService, mockPinService, mockStateService, mockRouter;

    beforeEach(() => {
        mockFilterService = jasmine.createSpyObj<FilterService>('filterService', ['buildFilters', 'resetFilterString']);
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['emitPinSearchRequest']);
        mockStateService = jasmine.createSpyObj<StateService>('stateService',
          ['emitPinSearchRequest', 'setMyViewOrWorldView', 'setIsFilterDialogOpen']);
        mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [
                FiltersComponent
            ],
            providers: [
                { provide: FilterService, useValue: mockFilterService },
                { provide: PinService, useValue: mockPinService },
                { provide: StateService, useValue: mockStateService },
                { provide: Router, useValue: mockRouter }
            ],
            schemas: [ NO_ERRORS_SCHEMA ],
            imports: [ ReactiveFormsModule, FormsModule ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            this.fixture = TestBed.createComponent(FiltersComponent);
            this.comp = this.fixture.componentInstance;
            this.comp.locationFormGroup = new FormGroup({});
        });
    }));

    it('should create an instance', () => {
        expect(this.comp).toBeTruthy();
    });

    it('should init', () => {
        this.comp.ngOnInit();
        expect(this.comp.locationFormGroup).not.toBeUndefined();
    });

    it('should apply filters', () => {
        this.comp.searchKeywordString = 'my keywords';
        this.comp['locationFormGroup'].controls['location'] = '90210';
        this.comp['state'].lastSearch = new SearchOptions('words', 11, 11, 'filter me');
        this.comp.onSubmit();
        expect(mockStateService.setMyViewOrWorldView).toHaveBeenCalledWith('world');
        expect(mockStateService.setIsFilterDialogOpen).toHaveBeenCalledWith(false);
        expect(mockFilterService.buildFilters).toHaveBeenCalled();
        expect(this.comp['state'].lastSearch.search).toBe('my keywords');
    });

    it('should reset filters', () => {
        this.comp.childKidsWelcomeComponent = jasmine.createSpyObj<KidsWelcomeComponent>('kidsWelcome', ['reset']);
        this.comp.childAgeGroupsComponent = jasmine.createSpyObj<AgeGroupsComponent>('ageGroups', ['reset']);
        this.comp['childKidsWelcomeComponent'].selected = true;
        this.comp.resetFilters();
        expect(this.comp.childKidsWelcomeComponent.reset).toHaveBeenCalled();
        expect(this.comp.childAgeGroupsComponent.reset).toHaveBeenCalled();
        expect(this.comp.state.setIsFilterDialogOpen).toHaveBeenCalledWith(false);
    });

    fit('should call filter service reset', () => {
        this.comp.childKidsWelcomeComponent = jasmine.createSpyObj<KidsWelcomeComponent>('kidsWelcome', ['reset']);
        this.comp.childAgeGroupsComponent = jasmine.createSpyObj<AgeGroupsComponent>('ageGroups', ['reset']);
        this.comp['childKidsWelcomeComponent'].selected = true;
        this.comp.resetFilters();
        expect(mockFilterService.resetFilterString).toHaveBeenCalled();
    });
});
