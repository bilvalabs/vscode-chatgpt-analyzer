import * as vscode from 'vscode';

export class CacheManager {
    private cache: Map<string, { content: string; timestamp: number }>;
    private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour

    constructor(private context: vscode.ExtensionContext) {
        this.cache = new Map();
    }

    get(key: string): string | undefined {
        const cached = this.cache.get(key);
        if (!cached) return undefined;
        
        if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
            this.cache.delete(key);
            return undefined;
        }

        return cached.content;
    }

    set(key: string, content: string): void {
        this.cache.set(key, {
            content,
            timestamp: Date.now()
        });
    }

    clear(): void {
        this.cache.clear();
    }
}
