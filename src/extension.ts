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

      const diagnostics = runAllChecks(text, document);

      // Atualiza os diagnósticos do documento atual
      diagnosticCollection.set(document.uri, diagnostics);

      vscode.window.showInformationMessage(
        "Verificação de acessibilidade concluída."
      );
    }
  );

  // Atualiza os diagnósticos automaticamente quando o documento muda
  const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
    const document = event.document;

    // Verifica apenas arquivos de HTML, JSX, TSX
    if (
      !["html", "javascriptreact", "typescriptreact"].includes(
        document.languageId
      )
    ) {
      return;
    }

    const text = document.getText();
    const diagnostics = runAllChecks(text, document);

    diagnosticCollection.set(document.uri, diagnostics);
  });

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
  context.subscriptions.push(changeListener);
  context.subscriptions.push(diagnosticCollection);
}

export function deactivate() {
  diagnosticCollection.clear();
  diagnosticCollection.dispose();
}
