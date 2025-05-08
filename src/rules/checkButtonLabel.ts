import * as vscode from "vscode";

export function checkButtonLabel(
  text: string,
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  const buttonRegex = /<button\s*([^>]*)>(.*?)<\/button>/g;

  let match;
  while ((match = buttonRegex.exec(text)) !== null) {
    const attrs = match[1];
    const content = match[2].trim();

    const start = document.positionAt(match.index);
    const end = document.positionAt(match.index + match[0].length);
    const range = new vscode.Range(start, end);

    const hasText = content.length > 0;
    const hasAriaLabel = /aria-label\s*=\s*["'].*?["']/.test(attrs);

    if (!hasText) {
      diagnostics.push(
        new vscode.Diagnostic(
          range,
          "Acessibilidade: botão sem texto visível.",
          vscode.DiagnosticSeverity.Warning
        )
      );
    }

    if (!hasAriaLabel) {
      diagnostics.push(
        new vscode.Diagnostic(
          range,
          "Acessibilidade: botão sem atributo aria-label.",
          vscode.DiagnosticSeverity.Warning
        )
      );
    }
  }

  return diagnostics;
}
