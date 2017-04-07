/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ListEntryComponent } from './list-entry.component';
import { StateService } from '../../services/state.service';
import { MockComponent } from '../../shared/mock.component';

describe('ListEntryComponent', () => {
    let fixture: ComponentFixture<ListEntryComponent>;
    let comp: ListEntryComponent;
    let router: Router;
    let el;

    beforeEach(() => {
        class RouterStub {
            navigate(url: string) { return url; }
        }

        TestBed.configureTestingModule({
            declarations: [
                ListEntryComponent,
                MockComponent({selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass']})
            ],
            providers: [
                StateService,
                { provide: Router, useClass: RouterStub }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ListEntryComponent);
            comp = fixture.componentInstance;

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should return proper name format', () => {
        fixture.detectChanges();
        comp.firstName = 'Bob';
        comp.lastName = 'Johnson'
        expect(comp.name()).toBe('BOB J.');
    });

    it('should return proper count string', () => {
        fixture.detectChanges();
        comp.participantCount = 10;
        expect(comp.count()).toBe('10 OTHERS');
    });
});
