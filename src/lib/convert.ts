export interface Variant {
  label: string;
  note: string;
  url: string;
}

export type Converted = { ok: true; id: string; variants: Variant[] } | { ok: false; reason: string };

const HOSTS = /^(?:www\.|mobile\.)?(?:x|twitter)\.com$/i;

/** X / Twitter の投稿 URL を、このサービスの各種 URL に変換する */
export function convert(input: string, host: string): Converted {
  const text = input.trim();
  if (!text) return { ok: false, reason: "" };
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return { ok: false, reason: "URL として読み取れません" };
  }
  if (!HOSTS.test(url.hostname)) return { ok: false, reason: "x.com または twitter.com の URL を入力してください" };
  const m = url.pathname.match(/^\/([A-Za-z0-9_]{1,15})\/status(?:es)?\/(\d+)/);
  if (!m) return { ok: false, reason: "投稿の URL(…/status/数字)を入力してください" };
  const [, user, id] = m;
  const base = `https://${host}/${user}/status/${id}`;
  return {
    ok: true,
    id,
    variants: [
      { label: "標準", note: "画像・動画つきの通常の埋め込み", url: base },
      { label: "メディアのみ", note: "Discord 向けに本文を省く", url: `${base}/d` },
      { label: "画像を1枚に", note: "複数画像をモザイクにまとめる", url: `${base}/m` },
      { label: "動画を直接", note: "動画ファイルそのものを再生", url: `${base}.mp4` },
      { label: "画像を直接", note: "画像ファイルそのものを表示", url: `${base}.jpg` },
      { label: "日本語に翻訳", note: "本文を日本語に訳す", url: `${base}/jp` },
      { label: "最小限", note: "本文と統計を省いた表示", url: `${base}/g` },
      { label: "テキストのみ", note: "メディアを出さない", url: `${base}/t` },
    ],
  };
}
