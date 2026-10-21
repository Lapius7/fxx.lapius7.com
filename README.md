# FxTwitter

X(Twitter)の投稿 URL を、Discord などで画像・動画つきのプレビューになる URL に変換するサービスです。

https://fxx.lapius7.com

`x.com` の部分を `fxx.lapius7.com` に書き換えるだけで使えます。

```
https://x.com/jack/status/20
https://fxx.lapius7.com/jack/status/20
```

## URL の末尾

| 末尾 | 動作 |
| --- | --- |
| なし | 標準の埋め込み |
| `/d` | 本文を省き、メディアを大きく表示 |
| `/m` | 複数画像を1枚にまとめる |
| `/g` | 最小限の表示 |
| `/t` | テキストのみ |
| `/jp`、`/en` など | 翻訳 |
| `.mp4`、`.jpg` など | メディアのファイルそのもの |
| `/photo/N` | N 枚目の画像 |

ユーザー名を省いた `/status/<id>` と `/<id>` も受け付けます。ブラウザで開いたときは、元の投稿へ移動します。

## 仕組み

埋め込み用のメタデータは、上流の FxTwitter(fxtwitter.com)から取得し、サービス名とリンクを書き換えて返します。画像・動画も上流を経由し、このサービス自身は投稿の内容を保存しません。

## 開発

```sh
pnpm install
pnpm dev
```
