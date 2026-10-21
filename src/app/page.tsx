"use client";

import { useState, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Input } from "@/components/arc/input/input";
import { CopyButton } from "@/components/arc/copy-button/copy-button";
import { useThemeTransition } from "@/components/transitions/theme-transition";
import { convert } from "@/lib/convert";
import styles from "./page.module.css";

const EXAMPLE = "https://x.com/jack/status/20";
const REPO = "https://github.com/Lapius7/fxx.lapius7.com";

const TABS = [
  { id: "default", label: "標準", to: "{host}/jack/status/20", note: "ドメインを書き換えるだけで、画像・動画つきの埋め込みになります。" },
  { id: "media", label: "メディア", to: "{host}/jack/status/20/d", note: "末尾に /d を付けると本文を省き、メディアを大きく見せます。/m で複数画像を1枚にまとめます。" },
  { id: "direct", label: "直接", to: "{host}/jack/status/20.mp4", note: ".mp4 や .jpg を付けると、ファイルそのものを再生・表示します。" },
  { id: "lang", label: "翻訳", to: "{host}/jack/status/20/jp", note: "末尾に言語コード(jp、en など)を付けると、本文を翻訳します。" },
] as const;

const FEATURES = [
  ["画像と動画をそのまま", "投稿のメディアを Discord の中で直接見られます。動画は埋め込みのまま再生できます。"],
  ["いいねとリポストも表示", "返信、リポスト、いいね、閲覧数を本文の下にまとめて出します。"],
  ["複数画像を1枚に", "/m を付けると、複数の画像を1枚のモザイクにします。"],
  ["翻訳つき", "/jp や /en を付けると、翻訳した本文で展開します。"],
  ["ブラウザでは X へ", "人が開いたときは、元の投稿へそのまま移動します。"],
  ["ログインも設定も不要", "x.com の部分を書き換えるだけで使えます。"],
];

const subscribeNone = () => () => {};
const useHost = () => useSyncExternalStore(subscribeNone, () => location.host, () => "fxx.lapius7.com");

export default function Page() {
  const host = useHost();
  const [value, setValue] = useState("");
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("default");
  const { toggleTheme, resolvedTheme, mounted } = useThemeTransition();
  const result = convert(value, host);
  const invalid = value.trim() !== "" && !result.ok;
  const current = TABS.find((t) => t.id === tab)!;
  const dark = mounted && resolvedTheme === "dark";

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <span className={styles.brand}>FxTwitter</span>
        <span className={styles.actions}>
          <button
            type="button"
            className={styles.icon}
            aria-label={dark ? "ライトテーマにする" : "ダークテーマにする"}
            onClick={(e) => {
              toggleTheme({ origin: e });
              e.currentTarget.blur();
            }}
          >
            {dark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
          </button>
          <a href={REPO}>github.com</a>
        </span>
      </header>

      <main style={{ display: "grid", gap: 56 }}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Share posts in Discord.</h1>
          <p className={styles.lead}>
            X の投稿 URL を、画像・動画つきで展開される URL に変換します。
            <br />
            ログインも拡張機能もいりません。
          </p>
        </section>

        <section className={styles.tool} aria-label="URL の変換">
          <Input
            label="X の投稿 URL"
            placeholder={EXAMPLE}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={invalid && !result.ok ? result.reason : undefined}
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
          />
          {result.ok ? (
            <div className={styles.list} aria-live="polite">
              {result.variants.map((v) => (
                <div key={v.label} className={styles.item}>
                  <span className={styles.itemLabel}>{v.label}</span>
                  <span className={styles.itemNote}>{v.note}</span>
                  <output className={styles.itemUrl}>{v.url}</output>
                  <span className={styles.itemCopy}>
                    <CopyButton value={v.url} iconOnly label={`${v.label}の URL をコピー`} variant="plain" />
                  </span>
                </div>
              ))}
            </div>
          ) : (
            !invalid && (
              <p className={styles.hint}>
                <button type="button" className={styles.link} onClick={() => setValue(EXAMPLE)}>
                  例を入れてみる
                </button>
              </p>
            )
          )}
        </section>

        <section className={styles.demo} aria-label="使い方">
          <div className={styles.tabs} role="tablist">
            {TABS.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={styles.tab} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          <div className={styles.window}>
            <div className={styles.bar}>
              <span className={styles.dots} aria-hidden><i /><i /><i /></span>
              <span>URL</span>
              <span />
            </div>
            <div className={styles.body} role="tabpanel">
              <div className={styles.row}><span>$</span><span>x.com/jack/status/20</span></div>
              <div className={`${styles.row} ${styles.out}`}><span>→</span><span>{current.to.replace("{host}", host)}</span></div>
            </div>
          </div>
          <p className={styles.caption}>{current.note}</p>
        </section>

        <section className={styles.grid} aria-label="特徴">
          {FEATURES.map(([title, body]) => (
            <div key={title} className={styles.cell}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className={styles.footer}>
        FxTwitter · <a href={REPO}>Lapius7/fxx.lapius7.com</a>
      </footer>
    </div>
  );
}
