import * as vscode from "vscode";
import { runAllChecks } from "./checks";

const diagnosticCollection =
  vscode.languages.createDiagnosticCollection("a11y");

export function activate(context: vscode.ExtensionContext) {
  console.log('Extensão "a11y-codelens" ativa!');

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

      diagnosticCollection.set(document.uri, diagnostics);

      vscode.window.showInformationMessage(
        "Verificação de acessibilidade concluída."
      );
    }
  );

  let changeTimeout: NodeJS.Timeout | undefined;

  const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
    const document = event.document;

    if (
      !["html", "javascriptreact", "typescriptreact"].includes(
        document.languageId
      )
    ) {
      return;
    }

    if (changeTimeout) {
      clearTimeout(changeTimeout);
    }

    changeTimeout = setTimeout(() => {
      const text = document.getText();
      const diagnostics = runAllChecks(text, document);
      diagnosticCollection.set(document.uri, diagnostics);
    }, 500);
  });

  const openListener = vscode.workspace.onDidOpenTextDocument((document) => {
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

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1
  );
  statusBarItem.command = "a11y-codelens.checkAccessibility";
  statusBarItem.text = "Verificar A11y";
  statusBarItem.tooltip = "Executar verificação de acessibilidade";
  statusBarItem.show();

  context.subscriptions.push(disposable);
  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(changeListener);
  context.subscriptions.push(openListener);
  context.subscriptions.push(diagnosticCollection);
}

export function deactivate() {
  diagnosticCollection.clear();
  diagnosticCollection.dispose();
}
