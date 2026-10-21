import { expect, test } from "bun:test";
import { convert } from "../src/lib/convert";

test("x.com の投稿を変換する", () => {
  const r = convert("https://x.com/jack/status/20?s=20", "fxx.lapius7.com");
  expect(r.ok).toBe(true);
  if (r.ok) {
    expect(r.id).toBe("20");
    expect(r.variants[0]!.url).toBe("https://fxx.lapius7.com/jack/status/20");
    expect(r.variants.some((v) => v.url.endsWith("/status/20/m"))).toBe(true);
  }
});
test("twitter.com とスキームなしも受け付ける", () => {
  expect(convert("twitter.com/jack/status/20", "h").ok).toBe(true);
});
test("他サイトとステータス以外は拒否", () => {
  expect(convert("https://example.com/a/status/1", "h").ok).toBe(false);
  expect(convert("https://x.com/jack", "h").ok).toBe(false);
  expect(convert("", "h")).toEqual({ ok: false, reason: "" });
});
