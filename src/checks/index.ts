import * as vscode from "vscode";
import { checkImageAlt } from "../rules/checkImageAlt";
import { checkInputLabel } from "../rules/checkInputLabel";
import { checkButtonLabel } from "../rules/checkButtonLabel";
import { checkHeadingStructure } from "../rules/checkHeadingStructure";
import { checkLinks } from "../rules/checkLinks";
import { checkTableStructure } from "../rules/checkTableStructure";

export function runAllChecks(
  text: string,
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  return [
    ...checkImageAlt(text, document),
    ...checkInputLabel(text, document),
    ...checkButtonLabel(text, document),
    ...checkHeadingStructure(text, document),
    ...checkLinks(text, document),
    ...checkTableStructure(text, document),
  ];
}
