import * as vscode from "vscode";

export function checkHeadingStructure(
  text: string,
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  const headingRegex = /<(h[1-6])>(.*?)<\/\1>/g;
  const foundHeadings: { level: number; index: number }[] = [];

  let match;
  while ((match = headingRegex.exec(text)) !== null) {
    const level = parseInt(match[1][1]);
    foundHeadings.push({ level, index: match.index });
  }

  if (foundHeadings.length > 0 && foundHeadings[0].level !== 1) {
    const start = document.positionAt(foundHeadings[0].index);
    const end = document.positionAt(foundHeadings[0].index + 4);
    diagnostics.push(
      new vscode.Diagnostic(
        new vscode.Range(start, end),
        "Acessibilidade: O primeiro título deve ser um <h1>.",
        vscode.DiagnosticSeverity.Warning
      )
    );
  }

  for (let i = 1; i < foundHeadings.length; i++) {
    const prev = foundHeadings[i - 1].level;
    const curr = foundHeadings[i].level;
    if (curr > prev + 1) {
      const start = document.positionAt(foundHeadings[i].index);
      const end = document.positionAt(foundHeadings[i].index + 4);
      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(start, end),
          `Acessibilidade: salto de heading de <h${prev}> para <h${curr}>.`,
          vscode.DiagnosticSeverity.Warning
        )
      );
    }
  }

  return diagnostics;
}
