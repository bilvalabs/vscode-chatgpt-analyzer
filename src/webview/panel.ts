import * as vscode from 'vscode';
import { getWebviewContent } from './template';
import { FileAnalyzer } from '../fileAnalyzer';

export class ChatGPTPanel {
    public static currentPanel: ChatGPTPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    constructor(
        extensionUri: vscode.Uri,
        private readonly fileAnalyzer: FileAnalyzer,
        initialContent?: string
    ) {
        this._extensionUri = extensionUri;
        this._panel = vscode.window.createWebviewPanel(
            'chatgptAnalyzer',
            'ChatGPT Project Analyzer',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [extensionUri]
            }
        );

        this._panel.webview.html = getWebviewContent(this._panel.webview, this._extensionUri, initialContent);
        this._setWebviewMessageListener(this._panel.webview);
    }

    public reveal() {
        this._panel.reveal();
    }

    public updateContent(content: string) {
        this._panel.webview.postMessage({ type: 'update', content });
    }

    private _setWebviewMessageListener(webview: vscode.Webview) {
        webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case 'analyze':
                        try {
                            const analysis = await this.fileAnalyzer.analyzeFile(vscode.Uri.parse(message.uri));
                            webview.postMessage({ type: 'update', content: analysis });
                        } catch (error) {
                            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                        }
                        break;
                }
            },
            undefined,
            this._disposables
        );
    }
}
