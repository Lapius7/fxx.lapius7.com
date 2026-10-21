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

埋め込み用のメタデータは、上流の FxTwitter(fxtwitter.com)から取得し、サービス名とリンクを書き換えて返します。画像・動画・モザイク画像も上流を経由します。このサービス自身は投稿の内容を保存しません。

トップページ(Next.js)は、URL の変換、タブ式の使い方、ライト/ダークの切り替えを備えています。デザインは [FxGithub](https://github.com/Lapius7/fxgh.lapius7.com) と共通です。

## 開発

```sh
pnpm install
pnpm dev        # http://localhost:4001
pnpm test
pnpm build && pnpm start
```

| 環境変数 | 内容 |
| --- | --- |
| `PORT` | 待ち受けポート(既定 4001) |

## デプロイ

`sitedeploy fxx.lapius7.com "<メッセージ>"` で、GitHub への push と VPS への反映を行います。VPS では `/root/project/web/fxx.lapius7.com` に置き、pm2(`fxx-lapius7`)で常駐させ、nginx が `127.0.0.1:4001` へ転送します。nginx の設定は `nginx.conf` です。旧ドメイン `x.lapius7.com` は新ドメインへ 301 で転送します。

## 利用したもの

- 上流サービス: FxTwitter(fxtwitter.com)
- UI: Arc UI、transition-kit(circle-blur)、IBM Plex Mono(SIL OFL)
