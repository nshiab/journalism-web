import { strict as assert } from "node:assert";
import { strToU8, zipSync } from "fflate";
import zipToUrls from "../../src/web/zipToUrls.ts";

async function unzipThroughBrowserBoundary(
  zip: Uint8Array,
): Promise<{ contents: string[]; urls: string[] }> {
  const blobs: Blob[] = [];
  const fetchDescriptor = Object.getOwnPropertyDescriptor(globalThis, "fetch");
  const createObjectUrlDescriptor = Object.getOwnPropertyDescriptor(
    URL,
    "createObjectURL",
  );

  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    value: () =>
      Promise.resolve(
        new Response(
          zip.buffer.slice(
            zip.byteOffset,
            zip.byteOffset + zip.byteLength,
          ) as ArrayBuffer,
        ),
      ),
  });
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: (blob: Blob) => {
      blobs.push(blob);
      return `blob:file-${blobs.length}`;
    },
  });

  try {
    const urls = await zipToUrls("https://example.com/archive.zip");
    return {
      contents: await Promise.all(blobs.map((blob) => blob.text())),
      urls,
    };
  } finally {
    restoreProperty(globalThis, "fetch", fetchDescriptor);
    restoreProperty(URL, "createObjectURL", createObjectUrlDescriptor);
  }
}

function restoreProperty(
  target: object,
  property: PropertyKey,
  descriptor: PropertyDescriptor | undefined,
): void {
  if (descriptor) {
    Object.defineProperty(target, property, descriptor);
  } else {
    Reflect.deleteProperty(target, property);
  }
}

Deno.test("zipToUrls extracts a stored entry", async () => {
  const result = await unzipThroughBrowserBoundary(
    zipSync({ "stored.txt": strToU8("stored content") }, { level: 0 }),
  );

  assert.deepEqual(result, {
    contents: ["stored content"],
    urls: ["blob:file-1"],
  });
});

Deno.test("zipToUrls extracts a DEFLATE entry", async () => {
  const result = await unzipThroughBrowserBoundary(
    zipSync({ "compressed.txt": strToU8("compressed content") }, { level: 6 }),
  );

  assert.deepEqual(result, {
    contents: ["compressed content"],
    urls: ["blob:file-1"],
  });
});

Deno.test("zipToUrls extracts multiple entries", async () => {
  const result = await unzipThroughBrowserBoundary(
    zipSync({
      "first.txt": strToU8("first"),
      "second.txt": strToU8("second"),
    }),
  );

  assert.deepEqual(result, {
    contents: ["first", "second"],
    urls: ["blob:file-1", "blob:file-2"],
  });
});

Deno.test("zipToUrls resolves an empty archive", async () => {
  assert.deepEqual(
    await unzipThroughBrowserBoundary(zipSync({})),
    { contents: [], urls: [] },
  );
});

Deno.test("zipToUrls rejects corrupt input", async () => {
  await assert.rejects(() =>
    unzipThroughBrowserBoundary(strToU8("this is not a ZIP archive"))
  );
});
