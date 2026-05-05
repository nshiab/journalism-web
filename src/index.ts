/**
 * @module
 *
 * The Journalism library (web functions)
 *
 * To install the library with Deno, use:
 * ```bash
 * deno add jsr:@nshiab/journalism-web
 * ```
 *
 * To install the library with Node.js, use:
 * ```bash
 * npm i @nshiab/journalism-web
 * ```
 *
 * To import a function, use:
 * ```ts
 * import { functionName } from "@nshiab/journalism-web";
 * ```
 */

import downloadCSV from "./web/downloadCsv.ts";
import zipToUrls from "./web/zipToUrls.ts";

export { downloadCSV, zipToUrls };
