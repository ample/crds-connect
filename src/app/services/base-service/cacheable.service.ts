export enum CacheLevel {None = 0, Partial = 1, Full = 2 };

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

    constructor() { }

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
    protected isNoCache(): Boolean {
        return this.cacheLevel == CacheLevel.None;
    }

    /**
     * Returns a boolean describing if the 
     * cache is atleast partially set.
     */
    protected isAtLeastPartialCache(): Boolean {
        return this.cacheLevel > CacheLevel.None;
    }

    /**
     * Returns a boolean describing if the 
     * cache is fully set.
     */
    protected isFullCache(): Boolean {
        return this.cacheLevel == CacheLevel.Full;
    }

    /**
     * clears the cache
     * and sets cachelevel to none
     */
    protected clearCache(): void {
        this.cache = null;
        this.cacheLevel = CacheLevel.None;
    }

    /**
     * 
     * @param cache data to set for cache
     * @param cacheLevel level of cache being set
     */
    protected setCache(cache: Type, cacheLevel: CacheLevel): void {
        this.cacheLevel = cacheLevel;
        this.cache = cache;
    }

    /**
     * returns the current cache
     */
    protected getCache(): Type {
        return this.cache;
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
    protected setSmartCache(cache: Type, cacheLevel: CacheLevel, params: ParamType): void {
        super.setCache(cache, cacheLevel);
        this.lastParams = params;
    }

    /**
    * 
    * @param cache data to set for cache
    * @param cacheLevel level of cache being set
    */
    protected setCache(cache: Type, cacheLevel: CacheLevel): void {
        super.setCache(cache, cacheLevel);
        this.lastParams = null;
    }

    /**
     * Used to determine if the cache is still considered valid
     * using the params used to generate the current cache
     * and the new params being sent.
     * @param newParams params used in current request
     */
    protected cacheIsValid(newParams: ParamType): Boolean {
        if (newParams == null && this.lastParams == null) {
            return true;
        } else if (newParams == null && this.lastParams != null) {
            return false;
        } else if (newParams != null && this.lastParams == null) {
            return false;
        } else {
            if (typeof newParams === 'object' && typeof this.lastParams === 'object') {
                return this.checkObjsForEquality(this.lastParams, newParams)
            } else {
                return false;
            }
        }
    }

    /**
     * Deep introspection of two object to determine equality
     * @param origP original parameter object used
     * @param newP new paremeter object used
     */
    private checkObjsForEquality(origP: Object, newP: Object): Boolean {
        let a = Object.getOwnPropertyNames(origP);
        let b = Object.getOwnPropertyNames(newP);

        if (a.length != b.length) {
            return false;
        }

        for (var i = 0; i < a.length; i++) {
            var propName = a[i];

            if (typeof origP[propName] === 'object') {
                let objsAreEql = this.checkObjsForEquality(origP[propName], newP[propName])
                if (!objsAreEql) {
                    return false;
                }
            } else {
                if (origP[propName] !== newP[propName]) {
                    return false;
                }
            }
        }

        return true;
    }


}
