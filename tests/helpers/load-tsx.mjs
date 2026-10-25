import { readFileSync, existsSync } from "node:fs";
import ts from "typescript";

// 使用 Node 22.13 支援的 loader，直接執行正式 TSX 元件。
export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && context.parentURL) {
    const url = new URL(specifier, context.parentURL);
    for (const extension of [".ts", ".tsx"]) {
      if (existsSync(new URL(url.href + extension))) {
        return nextResolve(url.href + extension, context);
      }
    }
  }
  return nextResolve(specifier, context);
}

export function load(url, context, nextLoad) {
  if (/\.tsx?$/.test(url) && !url.includes("/node_modules/")) {
    return {
      format: "module", shortCircuit: true,
      source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
        compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
      }).outputText,
    };
  }
  return nextLoad(url, context);
}
