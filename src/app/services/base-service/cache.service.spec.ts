/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CacheableService, CacheLevel } from './cacheable.service';

describe('Service: CachableService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CacheableService,
            ]
        })
    });

    it('should create an instance', inject([CacheableService], (service: CacheableService<null>) => {
        expect(service).toBeTruthy();
    }));

    it('should return cacheLevel', inject([CacheableService], (service: CacheableService<null>) => {
        let cacheLevel = CacheLevel.Full
        service['cacheLevel'] = cacheLevel;
        expect(service['getCacheLevel']()).toBe(cacheLevel);
    }));

    it('isNoCache should return correctly', inject([CacheableService], (service: CacheableService<null>) => {
        let none: Boolean, full: Boolean;

        service['cacheLevel'] = CacheLevel.None;
        none = service['isNoCache']();
        service['cacheLevel'] = CacheLevel.Full;
        full = service['isNoCache']();

        expect(none).toBe(true);
        expect(full).toBe(false);
    }));

    it('isAtLeastPartialCache should return correctly', inject([CacheableService], (service: CacheableService<null>) => {
        let partial: Boolean, full: Boolean, none: Boolean;

        service['cacheLevel'] = CacheLevel.None;
        none = service['isAtLeastPartialCache']();
        service['cacheLevel'] = CacheLevel.Partial;
        partial = service['isAtLeastPartialCache']();
        service['cacheLevel'] = CacheLevel.Full;
        full = service['isAtLeastPartialCache']();
        
        expect(none).toBe(false);
        expect(partial).toBe(true);
        expect(full).toBe(true);
    }));

    it('isFullCache should return correctly', inject([CacheableService], (service: CacheableService<null>) => {
        let partial: Boolean, full: Boolean, none: Boolean;
        
        service['cacheLevel'] = CacheLevel.Partial;
        partial = service['isFullCache']();
        service['cacheLevel'] = CacheLevel.None;
        none = service['isFullCache']();
        service['cacheLevel'] = CacheLevel.Full;
        full = service['isFullCache']();
        
        expect(none).toBe(false);
        expect(partial).toBe(false);
        expect(full).toBe(true);
    }));
    
    it('should clearCache', inject([CacheableService], (service: CacheableService<number>) => {
        service['cache'] = 123;
        service['cacheLevel'] = CacheLevel.Full;

        service['clearCache']();

        expect(service['cache']).toBeNull();
        expect(service['cacheLevel']).toBe(CacheLevel.None);
    }));
    
    it('should setCache', inject([CacheableService], (service: CacheableService<number>) => {
        let newCache: number = 123;
        let cacheLevel: CacheLevel.Full;
        service['cache'] = null;
        service['cacheLevel'] = CacheLevel.None;

        service['setCache'](newCache, cacheLevel);

        expect(service['cache']).toBe(newCache);
        expect(service['cacheLevel']).toBe(cacheLevel);
    }));
    
    it('should getCache', inject([CacheableService], (service: CacheableService<number>) => {
        let cache: number = 123;
        let cacheResult: number;
        service['cache'] = cache;

        cacheResult = service['getCache']();

        expect(cacheResult).toBe(cache);
    }));
});