"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const fileAnalyzer_1 = require("./fileAnalyzer");
const panel_1 = require("./webview/panel");
const config_1 = require("./utils/config");
const cache_1 = require("./utils/cache");
function activate(context) {
    const configManager = new config_1.ConfigManager();
    const cacheManager = new cache_1.CacheManager(context);
    const fileAnalyzer = new fileAnalyzer_1.FileAnalyzer(configManager, cacheManager);
    let currentPanel = undefined;
    let analyzeCommand = vscode.commands.registerCommand('chatgpt-analyzer.analyze', async () => {
        try {
            if (currentPanel) {
                currentPanel.reveal();
            }
            else {
                currentPanel = new panel_1.ChatGPTPanel(context.extensionUri, fileAnalyzer);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });
    let analyzeFileCommand = vscode.commands.registerCommand('chatgpt-analyzer.analyzeFile', async (uri) => {
        try {
            if (!uri) {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    throw new Error('No file selected');
                }
                uri = editor.document.uri;
            }
            const analysis = await fileAnalyzer.analyzeFile(uri);
            if (currentPanel) {
                currentPanel.reveal();
                currentPanel.updateContent(analysis);
            }
            else {
                currentPanel = new panel_1.ChatGPTPanel(context.extensionUri, fileAnalyzer, analysis);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });
    context.subscriptions.push(analyzeCommand, analyzeFileCommand);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map