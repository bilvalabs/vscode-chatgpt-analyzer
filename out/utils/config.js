"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const vscode = require("vscode");
class ConfigManager {
    constructor() {
        this.CONFIG_SECTION = 'chatgptAnalyzer';
    }
    getApiKey() {
        const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
        const apiKey = config.get('apiKey');
        if (!apiKey) {
            throw new Error('OpenAI API key not configured');
        }
        return apiKey;
    }
    getMaxFileSize() {
        const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
        return config.get('maxFileSize') || 100000;
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=config.js.map