import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection("a11y");

  const runAccessibilityCheck = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const text = editor.document.getText();
    const diagnostics: vscode.Diagnostic[] = [];

    const imgRegex = /<img\s+([^>]*?)>/g;
    let match;
    while ((match = imgRegex.exec(text)) !== null) {
      const imgTag = match[0];
      const hasAlt = /alt\s*=/.test(imgTag);

      if (!hasAlt) {
        const startPos = editor.document.positionAt(match.index);
        const endPos = editor.document.positionAt(match.index + imgTag.length);
        const range = new vscode.Range(startPos, endPos);

        const diagnostic = new vscode.Diagnostic(
          range,
          "Acessibilidade: a tag <img> está sem o atributo alt.",
          vscode.DiagnosticSeverity.Warning
        );

        diagnostics.push(diagnostic);
      }
    }

    diagnosticCollection.set(editor.document.uri, diagnostics);
    vscode.window.showInformationMessage(
      "Verificação de acessibilidade concluída!"
    );
  };

  const disposable = vscode.commands.registerCommand(
    "a11y-codelens.checkAccessibility",
    runAccessibilityCheck
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
