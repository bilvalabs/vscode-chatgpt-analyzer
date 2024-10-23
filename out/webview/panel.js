"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGPTPanel = void 0;
const vscode = require("vscode");
const template_1 = require("./template");
class ChatGPTPanel {
    constructor(extensionUri, fileAnalyzer, initialContent) {
        this.fileAnalyzer = fileAnalyzer;
        this._disposables = [];
        this._extensionUri = extensionUri;
        this._panel = vscode.window.createWebviewPanel('chatgptAnalyzer', 'ChatGPT Project Analyzer', vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [extensionUri]
        });
        this._panel.webview.html = (0, template_1.getWebviewContent)(this._panel.webview, this._extensionUri, initialContent);
        this._setWebviewMessageListener(this._panel.webview);
    }
    reveal() {
        this._panel.reveal();
    }
    updateContent(content) {
        this._panel.webview.postMessage({ type: 'update', content });
    }
    _setWebviewMessageListener(webview) {
        webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'analyze':
                    try {
                        const analysis = await this.fileAnalyzer.analyzeFile(vscode.Uri.parse(message.uri));
                        webview.postMessage({ type: 'update', content: analysis });
                    }
                    catch (error) {
                        vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                    break;
            }
        }, undefined, this._disposables);
    }
}
exports.ChatGPTPanel = ChatGPTPanel;
//# sourceMappingURL=panel.js.map