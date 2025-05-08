import * as vscode from "vscode";

export function checkInputLabel(
  text: string,
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  const inputRegex = /<input\s+([^>]*)>/g;

  let match;
  while ((match = inputRegex.exec(text)) !== null) {
    const attrs = match[1];
    const hasLabel = /aria-label\s*=|id\s*=/.test(attrs);

    if (!hasLabel) {
      const start = document.positionAt(match.index);
      const end = document.positionAt(match.index + match[0].length);
      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(start, end),
          "Acessibilidade: input sem label, id ou aria-label.",
          vscode.DiagnosticSeverity.Warning
        )
      );
    }
  }

  return diagnostics;
}
