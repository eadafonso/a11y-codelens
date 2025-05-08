// import * as vscode from "vscode";
// import { runAllChecks } from "./checks";

// // Crie o DiagnosticCollection fora do comando
// const diagnosticCollection =
//   vscode.languages.createDiagnosticCollection("a11y");

// export function activate(context: vscode.ExtensionContext) {
//   console.log('Extensão "a11y-codelens" ativa!');

//   // Comando principal: Verificar Acessibilidade
//   const disposable = vscode.commands.registerCommand(
//     "a11y-codelens.checkAccessibility",
//     () => {
//       const editor = vscode.window.activeTextEditor;

//       if (!editor) {
//         vscode.window.showInformationMessage("Nenhum editor ativo.");
//         return;
//       }

//       const document = editor.document;
//       const text = document.getText();

//       const diagnostics = runAllChecks(text, document);

//       // Atualiza os diagnósticos do documento atual
//       diagnosticCollection.set(document.uri, diagnostics);

//       vscode.window.showInformationMessage(
//         "Verificação de acessibilidade concluída."
//       );
//     }
//   );

//   // Botão na status bar (canto inferior direito)
//   const statusBarItem = vscode.window.createStatusBarItem(
//     vscode.StatusBarAlignment.Right,
//     1
//   );
//   statusBarItem.command = "a11y-codelens.checkAccessibility";
//   statusBarItem.text = "Verificar A11y";
//   statusBarItem.tooltip = "Executar verificação de acessibilidade";
//   statusBarItem.show();

//   // Registrar no contexto
//   context.subscriptions.push(disposable);
//   context.subscriptions.push(statusBarItem);
//   context.subscriptions.push(diagnosticCollection);
// }

// export function deactivate() {
//   diagnosticCollection.clear();
//   diagnosticCollection.dispose();
// }

import * as vscode from "vscode";
import { runAllChecks } from "./checks";

// Crie o DiagnosticCollection fora do comando
const diagnosticCollection =
  vscode.languages.createDiagnosticCollection("a11y");

export function activate(context: vscode.ExtensionContext) {
  console.log('Extensão "a11y-codelens" ativa!');

  // Comando principal: Verificar Acessibilidade
  const disposable = vscode.commands.registerCommand(
    "a11y-codelens.checkAccessibility",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showInformationMessage("Nenhum editor ativo.");
        return;
      }

      const document = editor.document;
      const text = document.getText();

      // Executa as verificações e obtém os diagnósticos
      const diagnostics = runAllChecks(text, document);

      // Atualiza os diagnósticos do documento atual
      diagnosticCollection.set(document.uri, diagnostics);

      // Envia os dados para o painel (WebView ou outro) - Aqui você precisa adicionar a lógica
      updateWebviewWithDiagnostics(diagnostics);

      vscode.window.showInformationMessage(
        "Verificação de acessibilidade concluída."
      );
    }
  );

  // Botão na status bar (canto inferior direito)
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1
  );
  statusBarItem.command = "a11y-codelens.checkAccessibility";
  statusBarItem.text = "Verificar A11y";
  statusBarItem.tooltip = "Executar verificação de acessibilidade";
  statusBarItem.show();

  // Registrar no contexto
  context.subscriptions.push(disposable);
  context.subscriptions.push(statusBarItem);
  // Não é necessário registrar o diagnosticCollection aqui
}

export function deactivate() {
  // Limpa todos os diagnósticos
  diagnosticCollection.clear();
  diagnosticCollection.dispose();
}

// Função para enviar os diagnósticos para o WebView ou painel
function updateWebviewWithDiagnostics(diagnostics: vscode.Diagnostic[]) {
  const totalErrors = diagnostics.length;
  const errorList = diagnostics
    .map((diagnostic) => {
      return `<div class="error-item">${diagnostic.message} (Linha ${
        diagnostic.range.start.line + 1
      })</div>`;
    })
    .join("");

  const suggestions = `
    <li>Verifique se as imagens possuem um <code>alt</code> adequado.</li>
    <li>Adicione atributos <code>aria-label</code> nos inputs sem rótulo.</li>
    <li>Garanta que os links tenham um <code>href</code> válido.</li>
  `;

  // Aqui você deve enviar para o WebView (defina a lógica da WebView conforme necessário)
  const panel = vscode.window.activeTextEditor
    ? vscode.window.createWebviewPanel(
        "a11ySummary",
        "Resumo de Acessibilidade",
        vscode.ViewColumn.One,
        { enableScripts: true }
      )
    : null;

  if (panel) {
    panel.webview.html = getWebviewContent(totalErrors, errorList, suggestions);
    panel.webview.postMessage({
      command: "updateSummary",
      totalErrors,
      errorList,
      suggestions,
    });
  }
}

// Função que gera o conteúdo HTML da WebView
function getWebviewContent(
  totalErrors: number,
  errorList: string,
  suggestions: string
) {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 10px; }
          h1 { color: #0066cc; }
          .error-summary { margin-top: 20px; }
          .error-item { margin: 10px 0; }
          .suggestions { color: #ff6600; }
        </style>
      </head>
      <body>
        <h1>Resumo de Acessibilidade</h1>
        <div class="error-summary">
          <h2>Total de Erros: <span id="totalErrors">${totalErrors}</span></h2>
          <div id="errorList">${errorList}</div>
        </div>
        <div class="suggestions">
          <h3>Sugestões</h3>
          <ul id="suggestionsList">${suggestions}</ul>
        </div>
      </body>
      <script>
        const vscode = acquireVsCodeApi();
        window.addEventListener('message', (event) => {
          const message = event.data;
          if (message.command === 'updateSummary') {
            document.getElementById('totalErrors').innerText = message.totalErrors;
            document.getElementById('errorList').innerHTML = message.errorList;
            document.getElementById('suggestionsList').innerHTML = message.suggestions;
          }
        });
      </script>
    </html>
  `;
}
