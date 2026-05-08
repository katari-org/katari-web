import { describe, expect, it } from "vitest";
import { getDoc, listAllSlugs } from "../docs";

describe("getDoc", () => {
  it("returns frontmatter and body for index.md via category slug", () => {
    const doc = getDoc("v0.0", ["getting-started"]);
    expect(doc?.frontmatter).toEqual({
      title: "Introduction",
      description: "Welcome to the fixture.",
    });
    expect(doc?.body).toContain("Hello, world.");
    expect(doc?.href).toBe("/docs/v0.0/getting-started");
  });

  it("returns the named file when no index.md exists at that path", () => {
    const doc = getDoc("v0.0", ["getting-started", "install"]);
    expect(doc?.frontmatter.title).toBe("Install");
    expect(doc?.body).toContain("Install steps.");
  });

  it("returns undefined for a slug that does not resolve to any file", () => {
    expect(getDoc("v0.0", ["nope"])).toBeUndefined();
    expect(getDoc("v0.0", ["getting-started", "missing"])).toBeUndefined();
  });

  it("returns undefined for an empty slug", () => {
    expect(getDoc("v0.0", [])).toBeUndefined();
  });
});

describe("listAllSlugs", () => {
  it("includes every nav item across versions", () => {
    const slugs = listAllSlugs();
    expect(slugs.length).toBe(4);
    expect(slugs).toContainEqual({ version: "v0.0", slug: ["getting-started"] });
    expect(slugs).toContainEqual({ version: "v0.0", slug: ["getting-started", "install"] });
    expect(slugs).toContainEqual({ version: "v0.0", slug: ["advanced", "effects"] });
    expect(slugs).toContainEqual({ version: "v0.1", slug: ["getting-started", "quickstart"] });
  });
});
