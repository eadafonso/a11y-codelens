import * as vscode from "vscode";

export function checkImageAlt(
  text: string,
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  const imgRegex = /<img\s+([^>]*?)>/g;

  let match;
  while ((match = imgRegex.exec(text)) !== null) {
    const imgTag = match[0];
    const hasAlt = /alt\s*=/.test(imgTag);

    if (!hasAlt) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + imgTag.length);
      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(startPos, endPos),
          "Acessibilidade: a tag <img> está sem o atributo alt.",
          vscode.DiagnosticSeverity.Warning
        )
      );
    }
  }

  return diagnostics;
}
