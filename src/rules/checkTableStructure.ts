import * as vscode from "vscode";

const tableRegex = /<table\b[^>]*>/g;

export function checkTableStructure(
  text: string,
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];

  for (const match of text.matchAll(tableRegex)) {
    const index = match.index ?? 0;
    const tableStart = document.positionAt(index);

    const tableEndIndex = text.indexOf("</table>", index);
    if (tableEndIndex === -1) {
      continue;
    }

    const tableEnd = document.positionAt(tableEndIndex + "</table>".length);
    const range = new vscode.Range(tableStart, tableEnd);

    const tableContent = text.slice(index, tableEndIndex + "</table>".length);
    const hasCaption = /<caption>/.test(tableContent);
    const hasTh = /<th\b[^>]*>/.test(tableContent);
    const hasScope = /<th\b[^>]*\bscope=["'](row|col)["']/.test(tableContent);

    if (!hasCaption || !hasTh || !hasScope) {
      diagnostics.push(
        new vscode.Diagnostic(
          range,
          `Acessibilidade: Tabela sem elementos acessíveis. Esperado: <caption>, <th> com scope.`,
          vscode.DiagnosticSeverity.Warning
        )
      );
    }
  }

  return diagnostics;
}
