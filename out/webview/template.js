"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebviewContent = void 0;
const vscode = require("vscode");
function getWebviewContent(webview, extensionUri, initialContent) {
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'main.css'));
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleUri}" rel="stylesheet">
        <title>ChatGPT Project Analyzer</title>
    </head>
    <body>
        <div class="container">
            <div class="analysis-content">${initialContent || 'Select a file to analyze'}</div>
            <div class="input-container">
                <input type="text" id="queryInput" placeholder="Ask a question about the code...">
                <button id="submitButton">Ask ChatGPT</button>
            </div>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            const submitButton = document.getElementById('submitButton');
            const queryInput = document.getElementById('queryInput');

            submitButton.addEventListener('click', () => {
                const query = queryInput.value;
                vscode.postMessage({
                    command: 'analyze',
                    query: query
                });
            });

            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.type) {
                    case 'update':
                        document.querySelector('.analysis-content').innerHTML = message.content;
                        break;
                }
            });
        </script>
    </body>
    </html>`;
}
exports.getWebviewContent = getWebviewContent;
//# sourceMappingURL=template.js.map