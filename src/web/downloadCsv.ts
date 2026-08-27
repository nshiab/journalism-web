/**
 * Triggers a download of the provided data as a CSV (Comma Separated Values) file directly in the user's browser. This function is designed for client-side use, allowing web applications to generate and offer data exports without requiring server-side processing.
 *
 * The function takes an array of JavaScript objects, converts them into a CSV string, creates a Blob, and then simulates a click on a hidden anchor tag to prompt the browser to download the file. This is a common and effective method for initiating file downloads from the browser.
 *
 * @param data - An array of JavaScript objects to be converted into CSV format. Each object represents a row, and its keys will become the CSV headers.
 * @param filename - The desired name for the downloaded CSV file (e.g., `"my_data_export.csv"`, `"report.csv"`). It's recommended to include the `.csv` extension.
 * @returns `void`
 *
 * @example
 * ```ts
 * // Download a simple array of objects as a CSV file.
 *
 * const data = [
 *   { name: "Alice", age: 30, city: "New York" },
 *   { name: "Bob", age: 25, city: "Los Angeles" }
 * ];
 * downloadCSV(data, "data.csv");
 * console.log("CSV download initiated.");
 * ```
 *
 * @category Web
 */
export default function downloadCSV(
  data: { [key: string]: unknown }[],
  filename: string,
): void {
  const csvContent = csvFormat(data);
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function csvFormat(data: { [key: string]: unknown }[]): string {
  const columns: string[] = [];
  const discoveredColumns = new Set<string>();

  for (const row of data) {
    for (const column of Object.keys(row)) {
      if (!discoveredColumns.has(column)) {
        discoveredColumns.add(column);
        columns.push(column);
      }
    }
  }

  if (columns.length === 0 && data.length === 0) return "";

  const rows = [columns.map(formatCsvValue).join(",")];
  for (const row of data) {
    rows.push(columns.map((column) => formatCsvValue(row[column])).join(","));
  }
  return rows.join("\n");
}

function formatCsvValue(value: unknown): string {
  if (value == null) return "";

  const stringValue = value instanceof Date ? formatDate(value) : String(value);

  return /[",\r\n]/.test(stringValue)
    ? `"${stringValue.replaceAll('"', '""')}"`
    : stringValue;
}

function formatDate(date: Date): string {
  if (Number.isNaN(date.valueOf())) return "Invalid Date";

  const iso = date.toISOString();
  if (date.getUTCMilliseconds()) return iso;
  if (date.getUTCSeconds()) return `${iso.slice(0, -5)}Z`;
  if (date.getUTCMinutes() || date.getUTCHours()) {
    return `${iso.slice(0, -8)}Z`;
  }
  return iso.slice(0, -14);
}
