import * as vscode from 'vscode';

export class ConfigManager {
    private readonly CONFIG_SECTION = 'chatgptAnalyzer';

    getApiKey(): string {
        const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
        const apiKey = config.get<string>('apiKey');
        if (!apiKey) {
            throw new Error('OpenAI API key not configured');
        }
        return apiKey;
    }

    getMaxFileSize(): number {
        const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
        return config.get<number>('maxFileSize') || 100000;
    }
}
