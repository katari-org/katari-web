import { describe, expect, it } from "vitest";
import {
  parseCategoryMeta,
  parseDocFrontmatter,
  parseVersionMeta,
  tryParseDocFrontmatter,
} from "../frontmatter";

describe("parseDocFrontmatter (strict)", () => {
  it("accepts a valid frontmatter", () => {
    expect(parseDocFrontmatter({ title: "Hello", description: "world" }, "x.md")).toEqual({
      title: "Hello",
      description: "world",
    });
  });

  it("accepts title-only", () => {
    expect(parseDocFrontmatter({ title: "Only" }, "x.md")).toEqual({ title: "Only" });
  });

  it("strips unknown fields", () => {
    const parsed = parseDocFrontmatter({ title: "T", extra: "ignored" }, "x.md");
    expect(parsed).toEqual({ title: "T" });
  });

  it("throws when title is missing", () => {
    expect(() => parseDocFrontmatter({}, "x.md")).toThrow(/Invalid frontmatter in x\.md/);
  });

  it("throws when title is an empty string", () => {
    expect(() => parseDocFrontmatter({ title: "" }, "x.md")).toThrow();
  });

  it("throws when title is not a string", () => {
    expect(() => parseDocFrontmatter({ title: 123 }, "x.md")).toThrow();
  });
});

describe("tryParseDocFrontmatter (lenient)", () => {
  it("returns parsed data for valid input", () => {
    expect(tryParseDocFrontmatter({ title: "Hi" })).toEqual({ title: "Hi" });
  });

  it("returns undefined for invalid input", () => {
    expect(tryParseDocFrontmatter({})).toBeUndefined();
    expect(tryParseDocFrontmatter({ title: 1 })).toBeUndefined();
  });
});

describe("parseVersionMeta", () => {
  it("accepts empty object", () => {
    expect(parseVersionMeta({}, "_meta.json")).toEqual({});
  });

  it("accepts label and order", () => {
    expect(parseVersionMeta({ label: "v1", order: ["a", "b"] }, "_meta.json")).toEqual({
      label: "v1",
      order: ["a", "b"],
    });
  });

  it("throws on malformed shape", () => {
    expect(() => parseVersionMeta({ order: "not-array" }, "_meta.json")).toThrow();
  });
});

describe("parseCategoryMeta", () => {
  it("accepts empty object", () => {
    expect(parseCategoryMeta({}, "_meta.json")).toEqual({});
  });

  it("throws on malformed shape", () => {
    expect(() => parseCategoryMeta({ label: 42 }, "_meta.json")).toThrow();
  });
});
