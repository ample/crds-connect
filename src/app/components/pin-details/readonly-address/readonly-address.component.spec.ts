import { Address } from '../../../models';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { ReadonlyAddressComponent } from './readonly-address.component';

describe('ReadonlyAddressComponent', () => {
    let fixture: ComponentFixture<ReadonlyAddressComponent>;
    let comp: ReadonlyAddressComponent;
    let el;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ReadonlyAddressComponent
            ],
            providers: [],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ReadonlyAddressComponent);
            comp = fixture.componentInstance;

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

   it('should init the component', () => {
        expect(comp).toBeTruthy();
    });


    it('init should set showFullAddress to true 1', () => {
        comp.isGathering = true;
        comp.isInGathering = true;
        comp.isPinOwner = false;

        comp.ngOnInit();
        expect(comp.showFullAddress).toBe(true);
    });

    it('init should set showFullAddress to true 2', () => {

        comp.isGathering = false;
        comp.isInGathering = false;
        comp.isPinOwner = true;

        comp.ngOnInit();

        expect(comp.showFullAddress).toBe(true);
    });

    it('init should set showFullAddress to false', () => {
        comp.isGathering = false;
        comp.isInGathering = true;
        comp.isPinOwner = false;
        comp.ngOnInit();

        expect(comp.showFullAddress).toBe(false);
    });

    it('init should set distString', () => {
        comp.distance = 23.44513526;

        comp.ngOnInit();

        expect(comp.distString).toEqual('(23.45 mi)');
    });

    it('init should not set distString if address is null', () => {
        comp.distance = null;

        comp.ngOnInit();

        expect(comp.distString).toBe('');
    });

    it('init should set distString to Online Group if addressId is 0 (zero)', () => {
        comp.address = new Address(0, null, null, null, null, null, null, null, null, null);
        comp.ngOnInit();
        expect(comp.distString).toBe('Online Group');
    });

});
