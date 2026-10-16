**Journalism Web v1.0.14**

***

# The Journalism Library (web)

Useful TypeScript functions for journalism projects in the browser.
Part of the [journalism library](https://github.com/nshiab/journalism).

The library is maintained by [Nael Shiab](https://naelshiab.com/), computational
journalist and senior data producer for [CBC News](https://www.cbc.ca/news).

> [!TIP]
> To learn how to use this library and more, check out
> [Code Like a Journalist](https://www.code-like-a-journalist.com/), a free and
> open-source data analysis and data visualization course in TypeScript. You
> might also find
> [simple-data-analysis](https://github.com/nshiab/simple-data-analysis) useful.

## Installation

```sh
npm install @nshiab/journalism-web
```

Import the library in your browser application's JavaScript or TypeScript.
For example, connect a CSV download to a button in your page:

```ts
import { downloadCSV } from "@nshiab/journalism-web";

const button = document.createElement("button");
button.textContent = "Download data";
button.addEventListener("click", () => {
  downloadCSV([{ name: "Alice", age: 30 }], "data.csv");
});
document.body.appendChild(button);
```

These functions use browser APIs such as the DOM, `Blob`, and object URLs.
Node.js 24.21.0 or later is required for developing and building this package;
the functions run in the browser.

## Documentation

- [Documentation](https://nshiab.github.io/journalism-web/)
- [llms.txt — Documentation index for AI agents](https://nshiab.github.io/journalism-web/llms.txt)
- [llm.md — Complete Markdown reference](https://nshiab.github.io/journalism-web/llm.md),
  for AI assistants or offline reading
- [npm package](https://www.npmjs.com/package/@nshiab/journalism-web)

See
[CONTRIBUTING.md](https://github.com/nshiab/journalism-web/blob/main/CONTRIBUTING.md)
for development commands.

Browser utilities for journalism projects.

## Web

### downloadCSV()

> **downloadCSV**(`data`, `filename`): `void`

Triggers a download of the provided data as a CSV (Comma Separated Values) file directly in the user's browser. This function is designed for client-side use, allowing web applications to generate and offer data exports without requiring server-side processing.

The function takes an array of JavaScript objects, converts them into a CSV string, creates a Blob, and then simulates a click on a hidden anchor tag to prompt the browser to download the file. This is a common and effective method for initiating file downloads from the browser.

Object and array cell values are serialized as JSON. Dates use UTC formatting.

#### Parameters

##### data

`object`[]

An array of JavaScript objects to be converted into CSV format. Each object represents a row, and its keys will become the CSV headers.

##### filename

`string`

The desired name for the downloaded CSV file (e.g., `"my_data_export.csv"`, `"report.csv"`). It's recommended to include the `.csv` extension.

#### Returns

`void`

`void`

#### Example

```ts
import { downloadCSV } from "@nshiab/journalism-web";

// Download a simple array of objects as a CSV file.

const data = [
  { name: "Alice", age: 30, city: "New York" },
  { name: "Bob", age: 25, city: "Los Angeles" }
];
downloadCSV(data, "data.csv");
console.log("CSV download initiated.");
```

***

### zipToUrls()

> **zipToUrls**(`url`): `Promise`\<`string`[]\>

Fetches a ZIP archive from a given URL, extracts all its contained files, and returns an array of object URLs for each extracted file.

Each file within the ZIP archive is converted into a Blob object, and then a corresponding object URL is created.

#### Parameters

##### url

`string`

The URL of the ZIP file to download and extract. This URL must be accessible from the client-side environment where the function is executed.

#### Returns

`Promise`\<`string`[]\>

A Promise that resolves to an array of strings, where each string is an object URL for an extracted file.

#### Example

```ts
// Fetch a ZIP archive from a URL, extract its contents, and get object URLs for each file.
const urls = await zipToUrls('https://example.com/files.zip');
console.log(urls);

// You can use the URLs as image sources, download links, etc.
const img = document.createElement('img');
img.src = urls[0];
document.body.appendChild(img);
```
