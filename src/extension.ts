import * as vscode from 'vscode';
import { FileAnalyzer } from './fileAnalyzer';
import { ChatGPTPanel } from './webview/panel';
import { ConfigManager } from './utils/config';
import { CacheManager } from './utils/cache';

export function activate(context: vscode.ExtensionContext) {
    const configManager = new ConfigManager();
    const cacheManager = new CacheManager(context);
    const fileAnalyzer = new FileAnalyzer(configManager, cacheManager);
    let currentPanel: ChatGPTPanel | undefined = undefined;

    let analyzeCommand = vscode.commands.registerCommand('chatgpt-analyzer.analyze', async () => {
        try {
            if (currentPanel) {
                currentPanel.reveal();
            } else {
                currentPanel = new ChatGPTPanel(context.extensionUri, fileAnalyzer);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });

    let analyzeFileCommand = vscode.commands.registerCommand('chatgpt-analyzer.analyzeFile', async (uri: vscode.Uri) => {
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
            } else {
                currentPanel = new ChatGPTPanel(context.extensionUri, fileAnalyzer, analysis);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });

    context.subscriptions.push(analyzeCommand, analyzeFileCommand);
}
