"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
class CacheManager {
    constructor(context) {
        this.context = context;
        this.CACHE_DURATION = 1000 * 60 * 60; // 1 hour
        this.cache = new Map();
    }
    get(key) {
        const cached = this.cache.get(key);
        if (!cached)
            return undefined;
        if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
            this.cache.delete(key);
            return undefined;
        }
        return cached.content;
    }
    set(key, content) {
        this.cache.set(key, {
            content,
            timestamp: Date.now()
        });
    }
    clear() {
        this.cache.clear();
    }
}
exports.CacheManager = CacheManager;
//# sourceMappingURL=cache.js.map