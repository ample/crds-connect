// /*
//  * Testing a simple Angular 2 component
//  * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
//  */

// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { TestBed, async, ComponentFixture } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { DebugElement } from '@angular/core';

// import { SayHiComponent } from './say-hi.component';

// describe('SayHiComponent', () => {
//     let fixture: ComponentFixture<SayHiComponent>;
//     let comp: SayHiComponent;
//     let el;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 SayHiComponent
//             ],
//             providers: [],
//             schemas: [ NO_ERRORS_SCHEMA ]
//         });
//     });

//     beforeEach(async(() => {
//         TestBed.compileComponents().then(() => {
//             fixture = TestBed.createComponent(SayHiComponent);
//             comp = fixture.componentInstance;

//             // el = fixture.debugElement.query(By.css('h1'));
//         });
//     }));

//     it('should enter the assertion', () => {
//         fixture.detectChanges();
//         expect(true).toBe(true);

//         // other examples
//         // expect(el.nativeElement.textContent).toContain('Test Title');
//         // fixture.whenStable().then(() => {
//         //     fixture.detectChanges();
//         //     expect((fixture.debugElement.classes as any).className).toBe(true);
//         // });
//     });
// });
