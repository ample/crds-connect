import * as _ from 'lodash';

export enum CacheLevel {
  None = 0,
  Partial = 1,
  Full = 2
}

export class CacheableService<Type> {
  /**
     * The object storing the cached data
     */
  private cache: Type;

  /**
     * CacheLevel is used to determine what status
     * the cache is in.
     * None - there is no cache
     * Partial - there is some cache but it is not a full representation of the expected object.
     * Full - the cache can be used in every possible expectation
     */
  private cacheLevel: CacheLevel = CacheLevel.None;

  private userIdentifier: number = null;

  constructor() {}

  /**
     * Gets the current cacheLevel.
     */
  protected getCacheLevel(): CacheLevel {
    return this.cacheLevel;
  }

  /**
     * Returns a boolean describing if the 
     * cache is not set.
     */
  protected isNoCache(): boolean {
    return this.cacheLevel == CacheLevel.None;
  }

  /**
     * Returns a boolean describing if the 
     * cache is atleast partially set.
     */
  protected isAtLeastPartialCache(): boolean {
    return this.cacheLevel > CacheLevel.None;
  }

  /**
     * Returns a boolean describing if the 
     * cache is fully set.
     */
  protected isFullCache(): boolean {
    return this.cacheLevel == CacheLevel.Full;
  }

  /**
     * clears the cache
     * and sets cachelevel to none
     */
  protected clearCache(): void {
    this.cache = null;
    this.cacheLevel = CacheLevel.None;
    this.userIdentifier = null;
  }

  protected isCachedForUser(userIdentifier: number): boolean {
    return userIdentifier == this.userIdentifier && this.isAtLeastPartialCache();
  }

  /**
     * 
     * @param cache data to set for cache
     * @param cacheLevel level of cache being set
     */
  protected setCache(cache: Type, cacheLevel: CacheLevel, userIdentifier: number = null): void {
    this.cacheLevel = cacheLevel;
    this.cache = cache;
    this.userIdentifier = userIdentifier;
  }

  /**
     * returns the current cache
     */
  protected getCache(): Type {
    return _.cloneDeep(this.cache);
  }
}

export class SmartCacheableService<Type, ParamType> extends CacheableService<Type> {
  /**
     * The params used the last time the cache was generated.
     */
  private lastParams: ParamType;

  constructor() {
    super();
  }

  /**
     * clears the cache, last searched params
     * and sets cachelevel to none
     */
  protected clearCache(): void {
    super.clearCache();
    this.lastParams = null;
  }

  /**
     * 
     * @param cache data to set for cache
     * @param cacheLevel level of cache being set
     * @param params params used to generate cache
     */
  protected setSmartCache(cache: Type, cacheLevel: CacheLevel, params: ParamType, userIdentifier: number = null): void {
    super.setCache(cache, cacheLevel, userIdentifier);
    this.lastParams = params;
  }

  /**
    * 
    * @param cache data to set for cache
    * @param cacheLevel level of cache being set
    */
  protected setCache(cache: Type, cacheLevel: CacheLevel, userIdentifier: number = null): void {
    super.setCache(cache, cacheLevel, userIdentifier);
    this.lastParams = null;
  }

  /**
     * Used to determine if the cache is still considered valid
     * using the params used to generate the current cache
     * and the new params being sent.
     * @param newParams params used in current request
     */
  protected cacheIsReadyAndValid(
    newParams: ParamType,
    minimumCacheThreshold: CacheLevel,
    currentUserIdentifier: number = null
  ): boolean {
    if (this.isNoCache()) {
      console.log('this.isNoCache()');
      return false;
    } else if (!super.isCachedForUser(currentUserIdentifier)) {
      console.log('!this.isCachedForUser()');
      this.clearCache();
      return false;
    } else if (this.getCacheLevel() < minimumCacheThreshold) {
      console.log('this.getCacheLevel() < minimumCacheThreshold');
      console.log('CacheLevel: ' + this.getCacheLevel());
      console.log('minimumCacheThreshold: ' + minimumCacheThreshold);
      this.clearCache();
      return false;
    } else if (newParams == null && this.lastParams == null) {
      return true;
    } else if (newParams == null && this.lastParams != null) {
      console.log('newParams == null && this.lastParams != null');
      this.clearCache();
      return false;
    } else if (newParams != null && this.lastParams == null) {
      console.log('newParams != null && this.lastParams == null');
      this.clearCache();
      return false;
    } else {
      if (typeof newParams === 'object' && typeof this.lastParams === 'object') {
        let areEql = this.checkObjsForEquality(this.lastParams, newParams);
        if (!areEql) {
          this.clearCache();
        }
        return areEql;
      } else if (Array.isArray(newParams) && Array.isArray(this.lastParams)) {
        let areEql = this.checkArraysForEquality(newParams, this.lastParams);
        if (!areEql) {
          this.clearCache();
        }
        return areEql;
      } else {
        if (newParams === this.lastParams) {
          return true;
        } else {
          this.clearCache();
          return false;
        }
      }
    }
  }

  /**
     * Deep introspection of two objects to determine equality
     * @param obj1 Object
     * @param obj2 Object
     */
  private checkObjsForEquality(obj1: Object, obj2: Object): boolean {
    if (obj1 === undefined || obj2 === undefined || obj1 === null || obj2 === null || obj1 === NaN || obj2 === NaN) {
      return obj1 === obj2;
    }
    let a = Object.getOwnPropertyNames(obj1);
    let b = Object.getOwnPropertyNames(obj2);

    if (a.length != b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      var propName = a[i];

      if (typeof obj1[propName] === 'object' && typeof obj2[propName] === 'object') {
        let objsAreEql = this.checkObjsForEquality(obj1[propName], obj2[propName]);
        if (!objsAreEql) {
          console.log('!objsAreEql');
          return false;
        }
      } else if (Array.isArray(obj1[1]) && Array.isArray(obj2[i])) {
        let arrsAreEql = this.checkArraysForEquality(obj1[i], obj2[i]);
        if (!arrsAreEql) {
          return false;
        }
      } else {
        if (obj1[propName] !== obj2[propName]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
     * Deep introspection of two objects to determine equality
     * @param arr1 Array
     * @param arr2 Array
     */
  private checkArraysForEquality(arr1: Array<any>, arr2: Array<any>): boolean {
    if (arr1 === undefined || arr2 === undefined || arr1 === null || arr2 === null) {
      return arr1 === arr2;
    }

    if (arr1.length != arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (typeof arr1[i] === 'object' && typeof arr2[i] === 'object') {
        let objsAreEql = this.checkObjsForEquality(arr1[i], arr2[i]);
        if (!objsAreEql) {
          return false;
        }
      } else if (Array.isArray(arr1[1]) && Array.isArray(arr2[i])) {
        let arrsAreEql = this.checkArraysForEquality(arr1[i], arr2[i]);
        if (!arrsAreEql) {
          console.log('!arrsAreEql');
          return false;
        }
      } else {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }
    }

    return true;
  }
}
