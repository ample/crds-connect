/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProfilePictureComponent } from './profile-picture.component';

describe('ProfilePictureComponent', () => {
    let fixture: ComponentFixture<ProfilePictureComponent>;
    let comp: ProfilePictureComponent;
    let el;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProfilePictureComponent
            ],
            providers: [],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ProfilePictureComponent);
            comp = fixture.componentInstance;
            comp.contactId = 12345;
            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('should instantiate', () => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
        expect(comp['path']).toContain('/12345');
    });
});
