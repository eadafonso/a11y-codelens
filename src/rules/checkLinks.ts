import * as vscode from "vscode";

const linkRegex = /<a\b[^>]*>/g;

export function checkLinks(
  text: string,
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];

  for (const match of text.matchAll(linkRegex)) {
    const tag = match[0];
    const index = match.index ?? 0;

    if (!/href\s*=\s*["'](?!#|javascript:)[^"']+["']/.test(tag)) {
      const startPos = document.positionAt(index);
      const endPos = document.positionAt(index + tag.length);

      const range = new vscode.Range(startPos, endPos);

      diagnostics.push(
        new vscode.Diagnostic(
          range,
          `Acessibilidade: Link <a> precisa de um href válido (não usar "#" ou "javascript:").`,
          vscode.DiagnosticSeverity.Warning
        )
      );
    }
  }

  return diagnostics;
}
