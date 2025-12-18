## downloadCSV

Triggers a download of the provided data as a CSV (Comma Separated Values) file
directly in the user's browser. This function is designed for client-side use,
allowing web applications to generate and offer data exports without requiring
server-side processing.

The function takes an array of JavaScript objects, converts them into a CSV
string using `d3-dsv`, creates a Blob, and then simulates a click on a hidden
anchor tag to prompt the browser to download the file. This is a common and
effective method for initiating file downloads from the browser.

### Signature

```typescript
function downloadCSV(data: Record<string, unknown>[], filename: string): void;
```

### Parameters

- **`data`**: - An array of JavaScript objects to be converted into CSV format.
  Each object represents a row, and its keys will become the CSV headers.
- **`filename`**: - The desired name for the downloaded CSV file (e.g.,
  `"my_data_export.csv"`, `"report.csv"`). It's recommended to include the
  `.csv` extension.

### Returns

`void`

### Examples

```ts
// Download a simple array of objects as a CSV file.

const data = [
  { name: "Alice", age: 30, city: "New York" },
  { name: "Bob", age: 25, city: "Los Angeles" },
];
downloadCSV(data, "data.csv");
console.log("CSV download initiated.");
```

## zipToUrls

Fetches a ZIP archive from a given URL, extracts all its contained files, and
returns an array of object URLs for each extracted file.

Each file within the ZIP archive is converted into a Blob object, and then a
corresponding object URL is created.

### Signature

```typescript
async function zipToUrls(url: string): Promise<string[]>;
```

### Parameters

- **`url`**: - The URL of the ZIP file to download and extract. This URL must be
  accessible from the client-side environment where the function is executed.

### Returns

A Promise that resolves to an array of strings, where each string is an object
URL for an extracted file.

### Examples

```ts
// Fetch a ZIP archive from a URL, extract its contents, and get object URLs for each file.
const urls = await zipToUrls("https://example.com/files.zip");
console.log(urls);

// You can use the URLs as image sources, download links, etc.
const img = document.createElement("img");
img.src = urls[0];
document.body.appendChild(img);
```
