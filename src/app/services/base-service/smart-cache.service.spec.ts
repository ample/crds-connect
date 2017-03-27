import { TestBed, async, inject } from '@angular/core/testing';
import { SmartCacheableService, CacheLevel } from './cacheable.service';

describe('Service: SmartCachableService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SmartCacheableService,
            ]
        })
    });

    it('should create an instance', inject([SmartCacheableService], (service: SmartCacheableService<null, null>) => {
        expect(service).toBeTruthy();
    }));

    it('should clearCache', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
        service['lastParams'] = 987;
        service['cache'] = 123;
        service['cacheLevel'] = CacheLevel.Full;

        service['clearCache']();

        expect(service['lastParams']).toBe(null);
        expect(service['cache']).toBe(null);
        expect(service['cacheLevel']).toBe(CacheLevel.None);
    }));

    it('should setCache', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
        let cache = 123;
        let cacheLevel = CacheLevel.Full;

        service['setCache'](cache, cacheLevel);

        expect(service['lastParams']).toBe(null);
        expect(service['cache']).toBe(cache);
        expect(service['cacheLevel']).toBe(cacheLevel);

    }));

    it('should setSmartCache', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
        let lastParams = 987;
        let cache = 123;
        let cacheLevel = CacheLevel.Full;

        service['setSmartCache'](cache, cacheLevel, lastParams);

        expect(service['lastParams']).toBe(lastParams);
        expect(service['cache']).toBe(cache);
        expect(service['cacheLevel']).toBe(cacheLevel);
    }));

    describe('Object Equality', () => {
        describe('Arrays', () => {
            describe('Are Equal', () => {
                it('should checkObjsForEquality and return true, both empty', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let obj1: Object, obj2: Object, result: boolean;
                    obj1 = {};
                    obj2 = {};

                    result = service['checkObjsForEquality'](obj1, obj2);

                    expect(result).toBe(true);
                }));


                it('should checkObjsForEquality and return true, both null', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let obj1: Object, obj2: Object, result: boolean;
                    obj1 = null;
                    obj2 = null;

                    result = service['checkObjsForEquality'](obj1, obj2);

                    expect(result).toBe(true);
                }));

                it('should checkObjsForEquality and return true, both undefined', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let obj1: Object, obj2: Object, result: boolean;
                    obj1 = undefined;
                    obj2 = undefined;

                    result = service['checkObjsForEquality'](obj1, obj2);

                    expect(result).toBe(true);
                }));

                it('should checkObjsForEquality and return true, only Objects and simple types, no nulls', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let obj1: Object, obj2: Object, result: boolean;
                    obj1 = { a: '123', b: { aa: 'asd', ab: 2242 }, c: 123 };
                    obj2 = { a: '123', b: { aa: 'asd', ab: 2242 }, c: 123 };

                    result = service['checkObjsForEquality'](obj1, obj2);

                    expect(result).toBe(true);
                }));

                it('should checkObjsForEquality and return true, only arrays and simple types, with nulls/undefined', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let obj1: Object, obj2: Object, result: boolean;
                    obj1 = { a: '123', b: { aa: null, ab: 2242 }, c: 123, d: {}, e: undefined };
                    obj2 = { a: '123', b: { aa: null, ab: 2242 }, c: 123, d: {}, e: undefined };

                    result = service['checkObjsForEquality'](obj1, obj2);

                    expect(result).toBe(true);
                }));

                it('should checkObjsForEquality and return true, arrays and Objects and simple types', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let obj1: Object, obj2: Object, result: boolean;
                    obj1 = { a: '123', b: { aa: null, ab: 2242 }, c: 123, d: {}, e: undefined, f: [], g: [1, 2, { a: 'a', b: 'b', c: {} }] };
                    obj2 = { a: '123', b: { aa: null, ab: 2242 }, c: 123, d: {}, e: undefined, f: [], g: [1, 2, { a: 'a', b: 'b', c: {} }] };

                    result = service['checkObjsForEquality'](obj1, obj2);

                    expect(result).toBe(true);
                }));
            });

            describe('Are Not Equal', () => {
                it('should checkObjsForEquality and return false, one null one empty', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let obj1: Object, obj2: Object, result: boolean;
                    obj1 = null;
                    obj2 = undefined;

                    result = service['checkObjsForEquality'](obj1, obj2);

                    expect(result).toBe(false);
                }));

                it('should checkObjsForEquality and return false, one null one not', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let obj1: Object, obj2: Object, result: boolean;
                    obj1 = null;
                    obj2 = {a: '123', b: 123};

                    result = service['checkObjsForEquality'](obj1, obj2);

                    expect(result).toBe(false);
                }));

                it('should checkObjsForEquality and return false, only arrays and simple types, with nulls/undefined', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let obj1: Object, obj2: Object, result: boolean;
                    obj1 = { a: '123', b: { aa: undefined, ab: 2242 }, c: 123, d: {}, e: undefined, f: [], g: [1, 2, { a: 'a', b: 'b', c: {} }] };
                    obj2 = { a: '123', b: { aa: null, ab: 2242 }, c: 123, d: {}, e: undefined, f: [], g: [1, 2, { a: 'a', b: 'b', c: {} }] };

                    result = service['checkObjsForEquality'](obj1, obj2);
                }));

                it('should checkObjsForEquality and return false, only arrays and simple types, with nulls/undefined', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let obj1: Object, obj2: Object, result: boolean;
                    obj1 = { a: '123', b: { aa: 'abc', ab: 2242 }, c: 123, d: {}, e: undefined, f: [], g: [1, 2, { a: 'a', b: 'b', c: {} }] };
                    obj2 = { a: '123', b: { aa: null, ab: 2242 }, c: 123, d: {}, e: undefined, f: [], g: [1, 2, { a: 'a', b: 'b', c: {} }] };

                    result = service['checkObjsForEquality'](obj1, obj2);
                    expect(result).toBe(false);
                }));

                it('should checkObjsForEquality and return false, arrays and Objects and simple types', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let obj1: Object, obj2: Object, result: boolean;
                    obj1 = { a: '123', b: { aa: null, ab: 2242 }, c: 123, d: {}, e: undefined, f: [], g: [1, 2, { a: 'a', b: 'b', c: {} }] };
                    obj2 = { a: '123', b: { aa: null, ab: '2242' }, c: 123, d: {}, e: undefined, f: [], g: [1, 2, { a: 'a', b: 'b', c: {} }] };

                    result = service['checkObjsForEquality'](obj1, obj2);

                    expect(result).toBe(false);
                }));

                it('should checkObjsForEquality and return false, arrays and Objects and simple types', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let obj1: Object, obj2: Object, result: boolean;
                    obj1 = { a: '123', b: { aa: null, ab: 2242 }, c: 123, d: [], e: undefined, f: [], g: [1, 2, { a: 'a', b: 'b', c: {} }] };
                    obj2 = { a: '123', b: { aa: null, ab: 2242 }, c: 123, d: {}, e: undefined, f: [], g: [1, 2, { a: 'a', b: 'b', c: {} }] };

                    result = service['checkObjsForEquality'](obj1, obj2);

                    expect(result).toBe(false);
                }));
            });
        });

        describe('Objects', () => {
            describe('Are Equal', () => {
                it('should checkArraysForEquality and return true, both empty', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let arr1: Array<any>, arr2: Array<any>, result: boolean;
                    arr1 = [];
                    arr2 = [];

                    result = service['checkArraysForEquality'](arr1, arr2);

                    expect(result).toBe(true);
                }));


                it('should checkArraysForEquality and return true, both null', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let arr1: Array<any>, arr2: Array<any>, result: boolean;
                    arr1 = null;
                    arr2 = null;

                    result = service['checkArraysForEquality'](arr1, arr2);

                    expect(result).toBe(true);
                }));

                it('should checkArraysForEquality and return true, both undefined', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let arr1: Array<any>, arr2: Array<any>, result: boolean;
                    arr1 = undefined;
                    arr2 = undefined;

                    result = service['checkArraysForEquality'](arr1, arr2);

                    expect(result).toBe(true);
                }));

                it('should checkArraysForEquality and return true, only arrays and simple types, no nulls', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let arr1: Array<any>, arr2: Array<any>, result: boolean;
                    arr1 = [1, 3, ['a', 'c', [12, 42]]];
                    arr2 = [1, 3, ['a', 'c', [12, 42]]];

                    result = service['checkArraysForEquality'](arr1, arr2);

                    expect(result).toBe(true);
                }));

                it('should checkArraysForEquality and return true, only arrays and simple types, with nulls/undefined', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let arr1: Array<any>, arr2: Array<any>, result: boolean;
                    arr1 = [1, null, ['a', undefined, [], [null, 42]]];
                    arr2 = [1, null, ['a', undefined, [], [null, 42]]];

                    result = service['checkArraysForEquality'](arr1, arr2);

                    expect(result).toBe(true);
                }));

                it('should checkArraysForEquality and return true, arrays and Objects and simple types', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let arr1: Array<any>, arr2: Array<any>, result: boolean;
                    arr1 = [1, {}, { b: 123, s: [], h: [1, 2, 3, 's'], u: undefined, g: null, r: [] }, { someArr: ['a', undefined, [], [null, 42]] }];
                    arr2 = [1, {}, { b: 123, s: [], h: [1, 2, 3, 's'], u: undefined, g: null, r: [] }, { someArr: ['a', undefined, [], [null, 42]] }];

                    result = service['checkArraysForEquality'](arr1, arr2);

                    expect(result).toBe(true);
                }));
            });

            describe('Are Not Equal', () => {
                it('should checkArraysForEquality and return false, one null one empty', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let arr1: Array<any>, arr2: Array<any>, result: boolean;
                    arr1 = null;
                    arr2 = [];

                    result = service['checkArraysForEquality'](arr1, arr2);

                    expect(result).toBe(false);
                }));

                it('should checkArraysForEquality and return false, one null one not', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let arr1: Array<any>, arr2: Array<any>, result: boolean;
                    arr1 = null;
                    arr2 = [1, 2, 3];

                    result = service['checkArraysForEquality'](arr1, arr2);

                    expect(result).toBe(false);
                }));

                it('should checkArraysForEquality and return false, only arrays and simple types, with nulls/undefined', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let arr1: Array<any>, arr2: Array<any>, result: boolean;
                    arr1 = [1, null, ['a', undefined, [], [null, 42]]];
                    arr2 = [1, null, ['a', '334', [], [null, 42]]];

                    result = service['checkArraysForEquality'](arr1, arr2);

                    expect(result).toBe(false);
                }));

                it('should checkArraysForEquality and return false, only arrays and simple types, with nulls/undefined', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let arr1: Array<any>, arr2: Array<any>, result: boolean;
                    arr1 = [1, null, ['a', '334', [], [null, 42]]];
                    arr2 = [1, undefined, ['a', '334', [], [null, 42]]];

                    result = service['checkArraysForEquality'](arr1, arr2);

                    expect(result).toBe(false);
                }));

                it('should checkArraysForEquality and return false, arrays and Objects and simple types', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let arr1: Array<any>, arr2: Array<any>, result: boolean;
                    arr1 = [1, {}, { b: 123, s: [], h: [1, 2, 3, 's'], u: undefined, g: null, r: [] }, { someArr: ['a', undefined, [], [null, 42]] }];
                    arr2 = [1, [], { b: 123, s: [], h: [1, 2, 3, 's'], u: undefined, g: null, r: [] }, { someArr: ['a', undefined, [], [null, 42]] }];

                    result = service['checkArraysForEquality'](arr1, arr2);

                    expect(result).toBe(false);
                }));

                it('should checkArraysForEquality and return false, arrays and Objects and simple types', inject([SmartCacheableService], (service: SmartCacheableService<number, number>) => {
                    let arr1: Array<any>, arr2: Array<any>, result: boolean;
                    arr1 = [1, {}, { b: '123', s: [], h: [1, 2, 3, 's'], u: undefined, g: null, r: [] }, { someArr: ['a', undefined, [], [null, 42]] }];
                    arr2 = [1, [], { b: 123, s: [], h: [1, 2, 3, 's'], u: undefined, g: null, r: [] }, { someArr: ['a', undefined, [], [null, 42]] }];

                    result = service['checkArraysForEquality'](arr1, arr2);

                    expect(result).toBe(false);
                }));
            });
        });
    });
    
    describe('CacheIsReadyAndValid', () => {
        it('isNoCache for cacheIsReadyAndValid', inject([SmartCacheableService], (service: SmartCacheableService<number,number>) => {
            let newParam: number       = 4;
            let minCache: CacheLevel   = CacheLevel.Full;
            let cache: number          = null;
            let cacheLevel: CacheLevel = CacheLevel.None;
            let lastParams: number     = null;
            let lastUserIdentifier     = null;
            let userIdentifier         = 3;
            let result: boolean;

            service['cache'] = cache;
            service['cacheLevel'] = cacheLevel;
            service['lastParams'] = lastParams;
            service['userIdentifier'] = lastUserIdentifier;
            result = service['cacheIsReadyAndValid'](newParam, minCache, userIdentifier);

            expect(result).toBe(false);
        }));

        it('not cachedForUser for cacheIsReadyAndValid', inject([SmartCacheableService], (service: SmartCacheableService<number,number>) => {
            let newParam: number       = 123;
            let minCache: CacheLevel   = CacheLevel.Full;
            let cache: number          = 123456789;
            let cacheLevel: CacheLevel = CacheLevel.Partial;
            let lastParams: number     = 123;
            let lastUserIdentifier     = 2;
            let userIdentifier         = 3;
            let result: boolean;

            service['cache'] = cache;
            service['cacheLevel'] = cacheLevel;
            service['lastParams'] = lastParams;
            service['userIdentifier'] = lastUserIdentifier;
            result = service['cacheIsReadyAndValid'](newParam, minCache, userIdentifier);

            expect(result).toBe(false);
            expect(service['cache']).toBe(null);
            expect(service['lastParams']).toBe(null);
            expect(service['userIdentifier']).toBe(null);
            expect(service['cacheLevel']).toBe(CacheLevel.None);
        }));

        it('< minimumCacheThreshold for cacheIsReadyAndValid', inject([SmartCacheableService], (service: SmartCacheableService<number,number>) => {
            let newParam: number       = 123;
            let minCache: CacheLevel   = CacheLevel.Full;
            let cache: number          = 123456789;
            let cacheLevel: CacheLevel = CacheLevel.Partial;
            let lastParams: number     = 123;
            let lastUserIdentifier     = 3;
            let userIdentifier         = 3;
            let result: boolean;

            service['cache'] = cache;
            service['cacheLevel'] = cacheLevel;
            service['lastParams'] = lastParams;
            service['userIdentifier'] = lastUserIdentifier;
            result = service['cacheIsReadyAndValid'](newParam, minCache, userIdentifier);

            expect(result).toBe(false);
            expect(service['cache']).toBe(null);
            expect(service['lastParams']).toBe(null);
            expect(service['userIdentifier']).toBe(null);
            expect(service['cacheLevel']).toBe(CacheLevel.None);
        }));

        it('new and old null for cacheIsReadyAndValid', inject([SmartCacheableService], (service: SmartCacheableService<number,number>) => {
            let newParam: number       = 123;
            let minCache: CacheLevel   = CacheLevel.Full;
            let cache: number          = 123456789;
            let cacheLevel: CacheLevel = CacheLevel.Full;
            let lastParams: number     = 123;
            let lastUserIdentifier     = 3;
            let userIdentifier         = 3;
            let result: boolean;

            service['cache'] = cache;
            service['cacheLevel'] = cacheLevel;
            service['lastParams'] = lastParams;
            service['userIdentifier'] = lastUserIdentifier;
            result = service['cacheIsReadyAndValid'](newParam, minCache, userIdentifier);

            expect(service['cache']).toBe(cache);
            expect(service['lastParams']).toBe(lastParams);
            expect(service['cacheLevel']).toBe(cacheLevel);
            expect(service['userIdentifier']).toBe(userIdentifier);
            expect(result).toBe(true);
        }));

        it('new is null and old is not null for cacheIsReadyAndValid', inject([SmartCacheableService], (service: SmartCacheableService<number,number>) => {
            let newParam: number       = null;
            let minCache: CacheLevel   = CacheLevel.Full;
            let cache: number          = 123456789;
            let cacheLevel: CacheLevel = CacheLevel.Full;
            let lastParams: number     = 123;
            let result: boolean;

            service['cache'] = cache;
            service['cacheLevel'] = cacheLevel;
            service['lastParams'] = lastParams;
            result = service['cacheIsReadyAndValid'](newParam, minCache);

            expect(result).toBe(false);
            expect(service['cache']).toBe(null);
            expect(service['lastParams']).toBe(null);
            expect(service['cacheLevel']).toBe(CacheLevel.None);
        }));

        it('old is null and new is not null for cacheIsReadyAndValid', inject([SmartCacheableService], (service: SmartCacheableService<number,number>) => {
            let newParam: number       = 123;
            let minCache: CacheLevel   = CacheLevel.Full;
            let cache: number          = 123456789;
            let cacheLevel: CacheLevel = CacheLevel.Full;
            let lastParams: number     = null;
            let result: boolean;

            service['cache'] = cache;
            service['cacheLevel'] = cacheLevel;
            service['lastParams'] = lastParams;
            result = service['cacheIsReadyAndValid'](newParam, minCache);

            expect(result).toBe(false);
            expect(service['cache']).toBe(null);
            expect(service['lastParams']).toBe(null);
            expect(service['cacheLevel']).toBe(CacheLevel.None);
        }));

        it('old is object and new is object, same, for cacheIsReadyAndValid', inject([SmartCacheableService], (service: SmartCacheableService<number,Object>) => {
            let newParam: Object       = {a: 123, b: [9,7,5, {y: 'yes please'}]};
            let minCache: CacheLevel   = CacheLevel.Full;
            let cache: number          = 123456789;
            let cacheLevel: CacheLevel = CacheLevel.Full;
            let lastParams: Object     = {a: 123, b: [9,7,5, {y: 'yes please'}]};
            let result: boolean;

            service['cache'] = cache;
            service['cacheLevel'] = cacheLevel;
            service['lastParams'] = lastParams;
            result = service['cacheIsReadyAndValid'](newParam, minCache);

            expect(result).toBe(true);
            expect(service['cache']).toBe(cache);
            expect(service['lastParams']).toBe(lastParams);
            expect(service['cacheLevel']).toBe(cacheLevel);
        }));

        it('old is object and new is object, different, for cacheIsReadyAndValid', inject([SmartCacheableService], (service: SmartCacheableService<number,Object>) => {
            let newParam: Object       = {a: 123, b: [9,7,5, {y: 'yes please'}]};
            let minCache: CacheLevel   = CacheLevel.Full;
            let cache: number          = 123456789;
            let cacheLevel: CacheLevel = CacheLevel.Full;
            let lastParams: Object     = {a: 'cdc', b: [9,7,5, {y: 'yes please'}]};
            let result: boolean;

            service['cache'] = cache;
            service['cacheLevel'] = cacheLevel;
            service['lastParams'] = lastParams;
            result = service['cacheIsReadyAndValid'](newParam, minCache);

            expect(result).toBe(false);
            expect(service['cache']).toBe(null);
            expect(service['lastParams']).toBe(null);
            expect(service['cacheLevel']).toBe(CacheLevel.None);
        }));

        it('old is array and new is array, same, for cacheIsReadyAndValid', inject([SmartCacheableService], (service: SmartCacheableService<number,Array<any>>) => {
            let newParam: Array<any>   = [{a: 123, b: [9,7,5, {y: 'yes please'}]}];
            let minCache: CacheLevel   = CacheLevel.Full;
            let cache: number          = 123456789;
            let cacheLevel: CacheLevel = CacheLevel.Full;
            let lastParams: Array<any> = [{a: 123, b: [9,7,5, {y: 'yes please'}]}];
            let result: boolean;

            service['cache'] = cache;
            service['cacheLevel'] = cacheLevel;
            service['lastParams'] = lastParams;
            result = service['cacheIsReadyAndValid'](newParam, minCache);

            expect(result).toBe(true);
            expect(service['cache']).toBe(cache);
            expect(service['lastParams']).toBe(lastParams);
            expect(service['cacheLevel']).toBe(cacheLevel);
        }));

        it('old is array and new is array, different, for cacheIsReadyAndValid', inject([SmartCacheableService], (service: SmartCacheableService<number,Array<any>>) => {
            let newParam: Array<any>   = [{a: 123, b: [9,7,5, {y: 'yes please'}]}];
            let minCache: CacheLevel   = CacheLevel.Full;
            let cache: number          = 123456789;
            let cacheLevel: CacheLevel = CacheLevel.Full;
            let lastParams: Array<any> = [{a: 'cdc', b: [9,7,5, {y: 'yes please'}]}];
            let result: boolean;

            service['cache'] = cache;
            service['cacheLevel'] = cacheLevel;
            service['lastParams'] = lastParams;
            result = service['cacheIsReadyAndValid'](newParam, minCache);

            expect(result).toBe(false);
            expect(service['cache']).toBe(null);
            expect(service['lastParams']).toBe(null);
            expect(service['cacheLevel']).toBe(CacheLevel.None);
        }));

        it('old is object and new is array, for cacheIsReadyAndValid', inject([SmartCacheableService], (service: SmartCacheableService<number,Object>) => {
            let newParam: Array<any>   = [{a: 123, b: [9,7,5, {y: 'yes please'}]}];
            let minCache: CacheLevel   = CacheLevel.Full;
            let cache: number          = 123456789;
            let cacheLevel: CacheLevel = CacheLevel.Full;
            let lastParams: Object     = {a: 'cdc', b: [9,7,5, {y: 'yes please'}]};
            let result: boolean;

            service['cache'] = cache;
            service['cacheLevel'] = cacheLevel;
            service['lastParams'] = lastParams;
            result = service['cacheIsReadyAndValid'](newParam, minCache);

            expect(result).toBe(false);
            expect(service['cache']).toBe(null);
            expect(service['lastParams']).toBe(null);
            expect(service['cacheLevel']).toBe(CacheLevel.None);
        }));

        it('primitive types, same, for cacheIsReadyAndValid', inject([SmartCacheableService], (service: SmartCacheableService<number,number>) => {
            let newParam: number       = 23;
            let minCache: CacheLevel   = CacheLevel.Full;
            let cache: number          = 123456789;
            let cacheLevel: CacheLevel = CacheLevel.Full;
            let lastParams: number     = 23;
            let result: boolean;

            service['cache'] = cache;
            service['cacheLevel'] = cacheLevel;
            service['lastParams'] = lastParams;
            result = service['cacheIsReadyAndValid'](newParam, minCache);

            expect(result).toBe(true);
            expect(service['cache']).toBe(cache);
            expect(service['lastParams']).toBe(lastParams);
            expect(service['cacheLevel']).toBe(cacheLevel);
        }));

        it('primitive types, different, for cacheIsReadyAndValid', inject([SmartCacheableService], (service: SmartCacheableService<number,number>) => {
            let newParam: number       = 99;
            let minCache: CacheLevel   = CacheLevel.Full;
            let cache: number          = 123456789;
            let cacheLevel: CacheLevel = CacheLevel.Full;
            let lastParams: number     = 23;
            let result: boolean;

            service['cache'] = cache;
            service['cacheLevel'] = cacheLevel;
            service['lastParams'] = lastParams;
            result = service['cacheIsReadyAndValid'](newParam, minCache);

            expect(result).toBe(false);
            expect(service['cache']).toBe(null);
            expect(service['lastParams']).toBe(null);
            expect(service['cacheLevel']).toBe(CacheLevel.None);
        }));
    });
    

});