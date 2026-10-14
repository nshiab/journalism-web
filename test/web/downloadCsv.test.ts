import { test } from "vite-plus/test";
import { strict as assert } from "node:assert";
import downloadCSV from "../../src/web/downloadCsv.ts";

async function getDownloadedCsv(data: Record<string, unknown>[]): Promise<string> {
  let downloadedBlob: Blob | undefined;
  const events: string[] = [];
  const anchor = {
    download: "",
    href: "",
    click() {
      events.push("click");
    },
  };
  const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, "document");
  const createObjectUrlDescriptor = Object.getOwnPropertyDescriptor(URL, "createObjectURL");
  const revokeObjectUrlDescriptor = Object.getOwnPropertyDescriptor(URL, "revokeObjectURL");

  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      body: {
        appendChild(child: unknown) {
          assert.equal(child, anchor);
          events.push("append");
        },
        removeChild(child: unknown) {
          assert.equal(child, anchor);
          events.push("remove");
        },
      },
      createElement: (tag: string) => {
        assert.equal(tag, "a");
        return anchor;
      },
    },
  });
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: (blob: Blob) => {
      downloadedBlob = blob;
      return "blob:csv";
    },
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: (url: string) => {
      assert.equal(url, "blob:csv");
      events.push("revoke");
    },
  });

  try {
    downloadCSV(data, "data.csv");
    assert.ok(downloadedBlob);
    assert.equal(downloadedBlob.type, "text/csv");
    assert.equal(anchor.download, "data.csv");
    assert.equal(anchor.href, "blob:csv");
    assert.deepEqual(events, ["append", "click", "remove", "revoke"]);
    return await downloadedBlob.text();
  } finally {
    restoreProperty(globalThis, "document", documentDescriptor);
    restoreProperty(URL, "createObjectURL", createObjectUrlDescriptor);
    restoreProperty(URL, "revokeObjectURL", revokeObjectUrlDescriptor);
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

test("downloadCSV formats empty input as an empty file", async () => {
  assert.equal(await getDownloadedCsv([]), "");
});

test("downloadCSV discovers headers in row order", async () => {
  assert.equal(
    await getDownloadedCsv([{ first: 1 }, { second: 2, first: 3 }]),
    "first,second\n1,\n3,2",
  );
});

test("downloadCSV formats nullish values as empty fields", async () => {
  assert.equal(
    await getDownloadedCsv([{ nil: null, missing: undefined, value: "text" }]),
    "nil,missing,value\n,,text",
  );
});

test("downloadCSV quotes and escapes delimiter characters", async () => {
  assert.equal(
    await getDownloadedCsv([
      {
        comma: "one,two",
        quote: 'one"two',
        carriageReturn: "one\rtwo",
        lineFeed: "one\ntwo",
      },
    ]),
    'comma,quote,carriageReturn,lineFeed\n"one,two","one""two","one\rtwo","one\ntwo"',
  );
});

test("downloadCSV preserves UTC date formatting", async () => {
  assert.equal(
    await getDownloadedCsv([
      { date: new Date("2024-01-02T00:00:00.000Z") },
      { date: new Date("2024-01-02T03:04:05.000Z") },
      { date: new Date("2024-01-02T03:04:05.678Z") },
      { date: new Date(Number.NaN) },
    ]),
    "date\n2024-01-02\n2024-01-02T03:04:05Z\n2024-01-02T03:04:05.678Z\nInvalid Date",
  );
});

test("downloadCSV serializes objects and arrays as JSON while preserving primitives", async () => {
  assert.equal(
    await getDownloadedCsv([
      { object: { key: "value" }, array: [1, 2], number: 3, boolean: true, bigint: 4n },
    ]),
    'object,array,number,boolean,bigint\n"{""key"":""value""}","[1,2]",3,true,4',
  );
});
