"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAnalyzer = void 0;
const vscode = require("vscode");
const openai_1 = require("openai");
class FileAnalyzer {
    constructor(config, cache) {
        this.config = config;
        this.cache = cache;
        this.openai = new openai_1.default({
            apiKey: this.config.getApiKey()
        });
    }
    async analyzeFile(uri) {
        const cachedAnalysis = this.cache.get(uri.fsPath);
        if (cachedAnalysis) {
            return cachedAnalysis;
        }
        const content = await this.readFile(uri);
        const analysis = await this.analyzewithGPT(content);
        this.cache.set(uri.fsPath, analysis);
        return analysis;
    }
    async readFile(uri) {
        const maxSize = this.config.getMaxFileSize();
        const stat = await vscode.workspace.fs.stat(uri);
        if (stat.size > maxSize) {
            throw new Error(`File too large (max size: ${maxSize} bytes)`);
        }
        const buffer = await vscode.workspace.fs.readFile(uri);
        return buffer.toString();
    }
    async analyzewithGPT(content) {
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
exports.FileAnalyzer = FileAnalyzer;
//# sourceMappingURL=fileAnalyzer.js.map