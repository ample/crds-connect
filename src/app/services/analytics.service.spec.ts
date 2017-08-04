import { Angulartics2 } from 'angulartics2';
import { TestBed, async, inject } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';


describe('Service: AnalyticsService', () => {
    let service;
    class Angulartics2Stub {
     eventTrack = {
       next: jasmine.createSpy('next')
     };
   };

   let mockAngulartics;

    beforeEach(() => {
        mockAngulartics = new Angulartics2Stub();
        TestBed.configureTestingModule({
            providers: [
                AnalyticsService,
                { provide: Angulartics2, useValue: mockAngulartics }
            ]
        });
    });

    it('should create an instance',
        inject([AnalyticsService], (s: AnalyticsService) => {
            expect(s).toBeTruthy();
        })
    );

    it('should track say hi call',
        inject([AnalyticsService], (s: AnalyticsService) => {
            s.sayHiButtonPressed('this-is-the-action', 'this-is-the-category');
            expect(mockAngulartics.eventTrack.next).toHaveBeenCalledWith({
                action: 'this-is-the-action',
                properties: { category: 'this-is-the-category' }});
        })
    );

    it('should track JoinGathering',
        inject([AnalyticsService], (s: AnalyticsService) => {
            s.joinGathering();
            expect(mockAngulartics.eventTrack.next).toHaveBeenCalledWith({
                action: 'Join Gathering Button Click',
                properties: { category: 'Connect' }});
        })
    );

    it('should track JoinGroup',
        inject([AnalyticsService], (s: AnalyticsService) => {
            s.joinGroup();
            expect(mockAngulartics.eventTrack.next).toHaveBeenCalledWith({
                action: 'Join Group Button Click',
                properties: { category: 'Groups' }});
        })
    );

    it('should track My Connections clicked',
        inject([AnalyticsService], (s: AnalyticsService) => {
            s.myConnections();
            expect(mockAngulartics.eventTrack.next).toHaveBeenCalledWith({
                action: 'My Connections Button Click',
                properties: { category: 'Connect' }});
        })
    );

    it('should track My Groups button click',
        inject([AnalyticsService], (s: AnalyticsService) => {
            s.myGroups();
            expect(mockAngulartics.eventTrack.next).toHaveBeenCalledWith({
                action: 'My Groups Button Click',
                properties: { category: 'Groups' }});
        })
    );
});
