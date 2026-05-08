import path from "node:path";

// `lib/content/*` の fs アクセスを fixture に向けるため、
// production code が CONTENT_ROOT を参照する前に env var をセットする。
process.env.KATARI_CONTENT_ROOT = path.resolve(
  __dirname,
  "lib/content/__tests__/__fixtures__/docs",
);
