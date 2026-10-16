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
