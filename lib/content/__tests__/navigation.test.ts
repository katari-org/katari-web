import { describe, expect, it } from "vitest";
import { getNavigation } from "../navigation";
import { latestVersion, listVersions } from "../versions";

describe("listVersions", () => {
  it("returns versions in descending (latest-first) order", () => {
    expect(listVersions()).toEqual(["v0.1", "v0.0"]);
  });
});

describe("latestVersion", () => {
  it("returns the highest version", () => {
    expect(latestVersion()).toBe("v0.1");
  });
});

describe("getNavigation", () => {
  it("applies version-level _meta.json order to sections", () => {
    const nav = getNavigation("v0.0");
    expect(nav.sections.map((s) => s.id)).toEqual(["getting-started", "advanced"]);
  });

  it("uses category-level _meta.json label", () => {
    const nav = getNavigation("v0.0");
    const section = nav.sections.find((s) => s.id === "getting-started");
    expect(section?.label).toBe("Getting Started");
  });

  it("falls back to humanize for missing label", () => {
    const nav = getNavigation("v0.0");
    const section = nav.sections.find((s) => s.id === "advanced");
    expect(section?.label).toBe("Advanced");
  });

  it("applies file-level order from _meta.json", () => {
    const nav = getNavigation("v0.0");
    const section = nav.sections.find((s) => s.id === "getting-started");
    expect(section?.items.map((i) => i.title)).toEqual(["Introduction", "Install"]);
  });

  it("maps index.md to the category slug (no trailing segment)", () => {
    const nav = getNavigation("v0.0");
    const section = nav.sections.find((s) => s.id === "getting-started");
    const indexItem = section?.items.find((i) => i.title === "Introduction");
    expect(indexItem?.slug).toEqual(["getting-started"]);
    expect(indexItem?.href).toBe("/docs/v0.0/getting-started");
  });

  it("maps a non-index file to category/name slug", () => {
    const nav = getNavigation("v0.0");
    const section = nav.sections.find((s) => s.id === "getting-started");
    const installItem = section?.items.find((i) => i.title === "Install");
    expect(installItem?.slug).toEqual(["getting-started", "install"]);
  });

  it("uses frontmatter title over filename humanize", () => {
    const nav = getNavigation("v0.0");
    const advancedSection = nav.sections.find((s) => s.id === "advanced");
    expect(advancedSection?.items[0]?.title).toBe("Effects");
  });
});
