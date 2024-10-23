import * as vscode from 'vscode';
import OpenAI from 'openai';
import { ConfigManager } from './utils/config';
import { CacheManager } from './utils/cache';

export class FileAnalyzer {
    private openai: OpenAI;
    private config: ConfigManager;
    private cache: CacheManager;

    constructor(config: ConfigManager, cache: CacheManager) {
        this.config = config;
        this.cache = cache;
        this.openai = new OpenAI({
            apiKey: this.config.getApiKey()
        });
    }

    async analyzeFile(uri: vscode.Uri): Promise<string> {
        const cachedAnalysis = this.cache.get(uri.fsPath);
        if (cachedAnalysis) {
            return cachedAnalysis;
        }

        const content = await this.readFile(uri);
        const analysis = await this.analyzewithGPT(content);
        this.cache.set(uri.fsPath, analysis);
        return analysis;
    }

    private async readFile(uri: vscode.Uri): Promise<string> {
        const maxSize = this.config.getMaxFileSize();
        const stat = await vscode.workspace.fs.stat(uri);
        
        if (stat.size > maxSize) {
            throw new Error(`File too large (max size: ${maxSize} bytes)`);
        }

        const buffer = await vscode.workspace.fs.readFile(uri);
        return buffer.toString();
    }

    private async analyzewithGPT(content: string): Promise<string> {
        const response = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a code analysis assistant. Analyze the following code and provide insights about its structure, purpose, and potential improvements."
                },
                {
                    role: "user",
                    content: content
                }
            ]
        });

        return response.choices[0].message.content || 'No analysis available';
    }
}
