---
version: alpha
name: 城将 Design System
description: 地図とコンテンツを主役にしたミニマルな基調に、日本の伝統色と明朝体の城名・武将名で和のアクセントを添える、城めぐりと歴史好きのための UI。
colors:
  primary: "#223A70"
  primary-hover: "#1A2D57"
  on-primary: "#FFFFFF"
  primary-container: "#E9EDF5"
  on-primary-container: "#223A70"
  secondary: "#5B6068"
  tertiary: "#B7282E"
  tertiary-hover: "#9A1F25"
  on-tertiary: "#FFFFFF"
  tertiary-container: "#FBEAEA"
  on-tertiary-container: "#9A1F25"
  neutral: "#F5F6F7"
  background: "#F5F6F7"
  surface: "#FFFFFF"
  surface-variant: "#EDEFF2"
  on-surface: "#23262B"
  on-surface-variant: "#5B6068"
  outline: "#7A808A"
  outline-variant: "#DADDE2"
  focus-ring: "#223A70"
  inverse-surface: "#23262B"
  inverse-on-surface: "#FFFFFF"
  error: "#B3261E"
  on-error: "#FFFFFF"
  error-container: "#FCE8E6"
  on-error-container: "#8C1D18"
  success: "#1E6B3A"
  success-container: "#E4F2E8"
  on-success-container: "#17552E"
  warning-container: "#FDF1D6"
  on-warning-container: "#7A5200"
  scrim: "rgba(35, 38, 43, 0.5)"
  pin-top100: "#B7282E"
  pin-zoku100: "#223A70"
  pin-cluster: "#23262B"
  pin-stroke: "#FFFFFF"
typography:
  name-display:
    fontFamily: Noto Serif JP
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.04em
  name-md:
    fontFamily: Noto Serif JP
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Noto Sans JP
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.4
    fontFeature: '"palt"'
  headline-md:
    fontFamily: Noto Sans JP
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.5
    fontFeature: '"palt"'
  headline-sm:
    fontFamily: Noto Sans JP
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.5
    fontFeature: '"palt"'
  body-lg:
    fontFamily: Noto Sans JP
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.85
  body-md:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75
  body-sm:
    fontFamily: Noto Sans JP
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.7
  label-lg:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
  label-md:
    fontFamily: Noto Sans JP
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.4
  label-sm:
    fontFamily: Noto Sans JP
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.4
  caption:
    fontFamily: Noto Sans JP
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  numeric-lg:
    fontFamily: Noto Sans JP
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  2xs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  margin-mobile: 16px
  margin-desktop: 32px
  gutter: 16px
  container-max: 1200px
  content-max: 720px
  sidebar-width: 280px
  header-height: 56px
  bottom-nav-height: 56px
  touch-target: 44px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 20px
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 20px
    height: 44px
  button-secondary-hover:
    backgroundColor: "{colors.primary-container}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  button-ghost-hover:
    backgroundColor: "{colors.surface-variant}"
  button-destructive:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-error}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 20px
    height: 44px
  link:
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  input-field-error:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
  input-helper-text:
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.caption}"
  input-error-text:
    textColor: "{colors.error}"
    typography: "{typography.caption}"
  chip-filter:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 16px
    height: 40px
  chip-filter-selected:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 16px
  list-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    padding: 16px
  badge-top100:
    backgroundColor: "{colors.tertiary-container}"
    textColor: "{colors.on-tertiary-container}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 6px
  badge-zoku100:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 6px
  badge-status-pending:
    backgroundColor: "{colors.warning-container}"
    textColor: "{colors.on-warning-container}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 6px
  badge-status-approved:
    backgroundColor: "{colors.success-container}"
    textColor: "{colors.on-success-container}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 6px
  badge-status-rejected:
    backgroundColor: "{colors.error-container}"
    textColor: "{colors.on-error-container}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 6px
  notification-count:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: 20px
  header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    height: "{spacing.header-height}"
  bottom-nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    height: "{spacing.bottom-nav-height}"
  bottom-nav-item:
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.caption}"
    width: 64px
  bottom-nav-item-selected:
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
  header-admin:
    backgroundColor: "{colors.inverse-surface}"
    textColor: "{colors.inverse-on-surface}"
    height: "{spacing.header-height}"
  table-header:
    backgroundColor: "{colors.surface-variant}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    padding: 12px
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 24px
  toast:
    backgroundColor: "{colors.inverse-surface}"
    textColor: "{colors.inverse-on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px
  map-overlay:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 8px
  map-popup:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 16px
  map-pin-top100:
    backgroundColor: "{colors.pin-top100}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.full}"
    size: 28px
  map-pin-zoku100:
    backgroundColor: "{colors.pin-zoku100}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    size: 26px
  map-pin-unvisited:
    backgroundColor: "{colors.surface}"
  map-pin-selected:
    size: 36px
  map-cluster:
    backgroundColor: "{colors.pin-cluster}"
    textColor: "{colors.inverse-on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    size: 36px
---

# デザインシステム／UIガイドライン：城将（仮）第一フェーズ

| 項目 | 内容 |
|---|---|
| バージョン | 1.2 |
| 作成日 | 2026-10-05 |
| ステータス | レビュー待ち |
| 関連ドキュメント | `constitution.md`、`requirements.md`、`architecture.md`、`docs/design/screens.md` |

このドキュメントは、城将の見た目の決まりごと（色、文字、余白、形、部品）を定めます。冒頭の YAML（デザイントークン）が正の値であり、本文はその使い方と理由を説明します。画面ごとのレイアウトは、Claude Design で作成した画面モック（HTML）で示し、本書はその土台となる共通ルールを扱います。モックと本書が食い違っていることに気づいたら、どちらに合わせるかを決めて、先に本書を更新します。

## Overview

### コンセプト：地図が主役、和は「銘板」に宿る

城将の主役は、地図と、城・武将の情報そのものです。UI はそれを邪魔しない、静かで整ったミニマルな基調とします。そのうえで、和の要素は次の3点だけに絞って添えます。

1. **伝統色の名前と色味**：基調色に紺（こん）、差し色に茜（あかね）、文字に墨（すみ）、補助に鈍色（にびいろ）を使う。色数は増やさない。
2. **城名・武将名だけを明朝体で表示する**：城や人物の名前を、城門に掛かる銘板や家名の札のように扱う。本書で唯一の「目立たせる」表現であり、これ以外の見出しや UI はゴシック体で控えめにする。
3. **年の表記**：西暦を主に、元号を一段控えめな色と大きさで添える（例：1560年（永禄3年）、`requirements.md` 6.5）。

和柄（青海波など）の背景、筆文字、金のグラデーション、和紙の質感といった装飾は使いません。地図の上に重なると情報が読みにくくなり、スマホでの表示も重くなるためです。

### 利用者と、感じてほしい印象

| 観点 | 方針 |
|---|---|
| 利用者 | 城めぐりが趣味の人、戦国時代が好きな人。スマホで眺める時間が長い |
| 印象 | 落ち着いていて信頼できる資料。博物館の展示解説のように、静かだが情報は正確 |
| 密度 | 一般向けはゆったり、管理画面はやや詰める（Layout を参照） |
| 初めての人 | 説明を読まなくても、地図と検索の使い方が分かる |

### 守る前提

- WCAG 2.2 レベル AA を目標とし、情報を色だけで区別しない（NFR-07）。
- スマホ優先。画面幅 360px 以上で崩れない（NFR-02）。
- 第一フェーズはライトモードのみ。ただし、将来ダークモードを追加できるように、部品は必ず意味を表すトークン（`surface`、`on-surface` など）を参照し、色の値を直接書かない。

## Colors

基調は、白と、わずかに青みのある明るい灰色の2段です。そこに「操作」を表す紺と、「100名城・目印」を表す茜を置きます。紺と茜は、どちらも城の瓦や幕、甲冑の縅（おどし）に見られる色で、地理院タイル（淡色地図）の灰色の上でもはっきり見えます。

### 基本の色

- **紺（Primary, #223A70）**：操作の色。主ボタン、リンク、選択中の状態、フォーカスリングに使う。続100名城のピンにも使う。
- **鈍色（Secondary, #5B6068）**：補足の文字。所在地、読み仮名、元号、件数などのメタ情報に使う。
- **茜（Tertiary, #B7282E）**：目印の色。100名城のピンとバッジ、未読通知の件数バッジ、推し武将の印に限って使う。ボタンや本文には使わない。
- **白練に近い灰（Neutral／background, #F5F6F7）**：ページの地の色。カードや入力欄（白）との差で、面の区切りを表す。
- **墨（on-surface, #23262B）**：本文と見出しの色。真っ黒より柔らかく、紺と調和する青みを少し含む。

### 状態の色

| 用途 | 色 | 使う場所 |
|---|---|---|
| エラー（error） | #B3261E | 入力エラーの文字・枠、削除ボタン |
| 成功（success） | #1E6B3A | 情報提供の「承認」、保存完了の印 |
| 注意（warning-container／on-warning-container） | #FDF1D6／#7A5200 | 情報提供の「審査待ち」 |

状態は色だけで伝えず、必ず文字（「審査待ち」「承認」「却下」）やアイコンを添えます。

### コントラスト（確認済みの組み合わせ）

| 文字・部品 | 背景 | コントラスト比 | 判定 |
|---|---|---|---|
| on-surface | surface／background | 15.2／14.0 | AA（本文） |
| on-surface-variant | surface／background／surface-variant | 6.3／5.9／5.5 | AA（本文） |
| on-primary | primary | 11.0 | AA（本文） |
| on-tertiary | tertiary | 6.3 | AA（本文） |
| on-tertiary-container | tertiary-container | 7.0 | AA（本文） |
| on-error-container／on-success-container／on-warning-container | 各 container | 7.7／7.7／6.2 | AA（本文） |
| outline（入力欄の枠） | surface／background | 4.0／3.7 | AA（部品の境界 3:1） |
| pin-top100／pin-zoku100 | 淡色地図に近い灰（#EEEEEE） | 5.4／9.5 | AA（部品 3:1） |

`outline-variant`（#DADDE2）は区切り線などの装飾用で、コントラスト比は 3:1 未満です。入力欄やボタンの境界には使わず、必ず `outline` を使います。

### shadcn/ui との対応

shadcn/ui の CSS 変数には、次のようにトークンを割り当てます。色の追加・変更は、本書のトークンを先に更新してから CSS 変数に反映します。

| shadcn/ui の変数 | トークン |
|---|---|
| `--background` | `background` |
| `--foreground` | `on-surface` |
| `--card`、`--popover` | `surface` |
| `--primary`／`--primary-foreground` | `primary`／`on-primary` |
| `--secondary`／`--secondary-foreground` | `primary-container`／`on-primary-container` |
| `--muted`／`--muted-foreground` | `surface-variant`／`on-surface-variant` |
| `--accent`／`--accent-foreground` | `surface-variant`／`on-surface`（ホバー時の背景） |
| `--destructive` | `error` |
| `--border` | `outline-variant` |
| `--input` | `outline` |
| `--ring` | `focus-ring` |
| `--radius` | `rounded.md`（8px） |
| `--card-foreground`、`--popover-foreground` | `on-surface` |
| `--destructive-foreground` | `on-error` |
| `--sidebar`／`--sidebar-foreground` | `surface`／`on-surface`（管理画面の左メニュー） |
| `--sidebar-primary`／`--sidebar-primary-foreground` | `primary`／`on-primary` |
| `--sidebar-accent`／`--sidebar-accent-foreground` | `surface-variant`／`on-surface` |
| `--sidebar-border`／`--sidebar-ring` | `outline-variant`／`focus-ring` |

shadcn/ui の `accent` は「ホバー時の背景」の意味で使われるため、本書の `tertiary`（茜）とは対応させません。

shadcn/ui に対応する変数がないトークンは、次の CSS 変数として追加し、Tailwind のクラス（`bg-tertiary`、`text-success` など）で使えるようにします。名前は shadcn/ui に合わせ、`on-*` は `*-foreground` とします。

| CSS 変数 | トークン |
|---|---|
| `--primary-hover` | `primary-hover` |
| `--tertiary`／`--tertiary-foreground`／`--tertiary-hover` | `tertiary`／`on-tertiary`／`tertiary-hover` |
| `--tertiary-container`／`--tertiary-container-foreground` | `tertiary-container`／`on-tertiary-container` |
| `--inverse`／`--inverse-foreground` | `inverse-surface`／`inverse-on-surface` |
| `--error-container`／`--error-container-foreground` | `error-container`／`on-error-container` |
| `--success`／`--success-container`／`--success-container-foreground` | `success`／`success-container`／`on-success-container` |
| `--warning-container`／`--warning-container-foreground` | `warning-container`／`on-warning-container` |
| `--scrim` | `scrim` |
| `--pin-top100`／`--pin-zoku100`／`--pin-cluster`／`--pin-stroke` | `pin-top100`／`pin-zoku100`／`pin-cluster`／`pin-stroke` |

### ダークモードへの備え

第一フェーズではダークモードを実装しませんが、追加するときは同じトークン名のまま値だけを差し替えます。そのため、部品やコードでは `#FFFFFF` のような値や Tailwind の固定色（`bg-white`、`text-gray-600` など）を使わず、必ずトークン（CSS 変数）を参照します。

## Typography

### 書体

| 書体 | 役割 | ウェイト |
|---|---|---|
| Noto Sans JP | 本文、見出し、ボタン、ラベルなど UI のほぼすべて | 400、700 |
| Noto Serif JP | 城名・武将名の表示に限定（`name-display`、`name-md`） | 600 |

ゴシック体を基本にするのは、スマホの小さな画面でも読みやすく、地図の上のラベルや管理画面の表でも崩れないためです。明朝体は城名・武将名にだけ使い、名前が画面の中で「銘板」として立ち上がるようにします。見出しまで明朝体にすると画面全体が重くなり、名前が目立たなくなるため、使う場所を広げません。

### 読み込み方

- フォントは Next.js の `next/font` で自前配信する（外部の CDN から読み込まないため、CSP も厳しく保てる。`architecture.md` 2.3）。
- 日本語フォントは容量が大きいため、`display: swap` とし、読み込み中は代替フォントで表示する。Noto Serif JP は名前の表示にしか使わないため、プリロードしない。
- 代替フォントの指定は次のとおり。
  - ゴシック：`"Noto Sans JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", Meiryo, sans-serif`
  - 明朝：`"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif`
- 実装後に LCP（2.5秒以内、NFR-01）を測り、フォントが原因で目標を超える場合は、明朝体の読み込みをやめてシステムの明朝体に切り替える。

### 文字の段階

トークンはスマホでの値です。画面幅 768px 以上では、次の3つだけを大きくします。

| トークン | スマホ | 768px 以上 | 主な用途 |
|---|---|---|---|
| `name-display` | 28px | 36px | 城詳細・武将詳細の名前（ページの h1） |
| `name-md` | 20px | 20px | 一覧の行・カード、地図のポップアップ、ゆかりの一覧の名前 |
| `headline-lg` | 24px | 28px | 名前以外のページ見出し（マイページ、管理画面など） |
| `headline-md` | 20px | 20px | セクション見出し（h2） |
| `headline-sm` | 18px | 18px | 小見出し（h3）、ダイアログのタイトル |
| `body-lg` | 17px | 17px | 武将の略歴など、長く読ませる文章 |
| `body-md` | 16px | 16px | 本文の標準、入力欄 |
| `body-sm` | 14px | 14px | 補足説明、表のセル（管理画面） |
| `label-lg` | 16px | 16px | ボタン |
| `label-md` | 14px | 14px | チップ、タブ、表の見出し、地図のクラスタの数字 |
| `label-sm` | 12px | 12px | バッジ |
| `caption` | 12px | 12px | 入力欄の補足・エラー、出典表示、地図の凡例 |
| `numeric-lg` | 32px | 40px | マイページの訪問数（例：42 / 200） |

### 文字組みのルール

- 本文の1行は、全角40字前後に収める（`content-max` の 720px で約45字）。
- 文章は左揃えにし、両端揃えや中央揃えは使わない（中央揃えは空の状態の案内など短い文に限る）。
- 見出しにはプロポーショナル詰め（`palt`）を使い、本文には使わない。
- 英字の大文字化（全部大文字のラベル）は使わない。
- 読み仮名は名前のすぐ下に `body-sm`・`on-surface-variant` で表示する。ルビ（`<ruby>`）は使わない（読み上げで名前が二重に読まれるのを防ぐため）。
- 年は「1560年」を `on-surface`、「（永禄3年）」を `on-surface-variant` で表示する。不詳・諸説ありは「不詳」「諸説あり」「1560年頃」と文字で示す（AC-06-5）。
- 値が登録されていない項目は「不明」と `on-surface-variant` で表示するか、項目ごと表示しない（AC-04-1。どちらにするかは機能仕様で項目ごとに決める）。

## Layout

### グリッドと余白

- 余白は 4px を最小単位とし、8px の倍数を基本とする（`spacing` を参照）。
- 画面の左右の余白は、スマホで 16px（`margin-mobile`）、768px 以上で 32px（`margin-desktop`）。
- コンテンツの最大幅は 1200px（`container-max`）。文章が中心の部分は 720px（`content-max`）に収める。
- ブレークポイントは Tailwind CSS の初期値（640px、768px、1024px、1280px）を使う。レイアウトを大きく切り替えるのは 768px（md）と 1024px（lg）の2か所に限る。
- タップできる部品は、見た目が小さくても 44px × 44px（`touch-target`）以上の範囲で反応させる。

### 画面の型

| 画面の型 | スマホ | 1024px 以上 | 該当画面 |
|---|---|---|---|
| 地図 | ヘッダーの下を地図が全面に占める。検索ボックスを上部に浮かせる | 同じ。絞り込みを左上のパネルに表示する | P-01 |
| 一覧 | 1列のリスト。絞り込みはボタンからシートで開く | 左に絞り込み（`sidebar-width` 280px）、右に結果 | P-02、P-04、A-02 など |
| 詳細 | 1列。名前 → 基本情報 → ゆかり → 小地図 の順 | 本文 720px の1列を基本とし、小地図と画像を右に置いてもよい | P-03、P-05、P-06 |
| フォーム | 1列。入力欄は画面幅いっぱい | 1列のまま最大 720px | M-04、M-06、M-09 など |
| 管理画面 | 表は横にスクロールさせる | 左にメニュー、右に表やフォーム。表は `body-sm` で行を詰める | A-01〜A-19 |

### ナビゲーション

画面幅によって、主要な画面への移動手段を切り替えます。

| 画面幅 | 一般向け | 管理画面 |
|---|---|---|
| 768px 未満 | 上部にヘッダー、画面下に下部ナビゲーション | 上部にヘッダー。メニューはボタンから左のシートで開く |
| 768px 以上 | 上部のヘッダーにすべてのメニューを並べる（`screens.md` 6章）。下部ナビゲーションは表示しない | 上部にヘッダー、左にメニュー |

スマホでハンバーガーメニューではなく下部ナビゲーションを採用する理由は次のとおりです。

- 地図・城・武将という主要な画面が常に見えているため、初めての人でも説明なしで行き先が分かる。
- 片手で持ったときに親指が届く位置にある。
- 主要な画面が4つで、下部ナビゲーションに無理なく収まる。

#### スマホでの配置

| 場所 | 内容 |
|---|---|
| 下部ナビゲーション | 地図（P-01）、城（P-02）、武将（P-04）、マイページ（M-02）の4つ。未ログイン時は「マイページ」の代わりに「ログイン」を表示し、ログイン後はマイページを開く |
| ヘッダーの左 | ロゴ（P-01 へ） |
| ヘッダーの右（ログイン中） | 通知（未読件数のバッジ付き、M-13 へ）と、ユーザーメニュー（プロフィール設定、管理画面※、ログアウト）。※管理者以上のみ |
| ヘッダーの右（未ログイン） | 何も置かない（ログインは下部ナビゲーションから） |

#### 下部ナビゲーションを表示しない画面

入力の途中で別の画面へ移ってしまうことと、キーボードと重なることを防ぐため、次のフォーム画面では下部ナビゲーションを表示しません。ヘッダーの左に「戻る」ボタンを置きます。

- M-01 初回登録、M-04 訪問記録の登録、M-05 訪問記録の編集、M-06 プロフィール設定、M-09 情報提供（新規）、M-10 情報提供（修正提案）

### 地図画面のルール

- 地図の高さは「画面の高さ − ヘッダー（56px）」とし、スマホではさらに下部ナビゲーションの高さを引く。`100dvh` を基準にする（スマホのアドレスバーの伸縮に対応するため）。
- 地図の上に重ねる部品（検索ボックス、絞り込み、凡例、現在地などの操作ボタン）は `map-overlay` を使い、画面の端から 12px 離す。
- **右下の出典表示（地理院タイル）は、どの部品でも覆わない**（`architecture.md` 5.1）。下からシートを出すときは、出典表示をシートの上に移す。
- ピンを選んだときの表示は、スマホでは画面下からのシート、768px 以上ではピンの近くのポップアップとする。スマホでポップアップにすると、ピンや周りの地図を指で隠してしまうため。シートは下部ナビゲーションのすぐ上に表示し、シートを開いたままでも画面を切り替えられるようにする。
- 凡例（100名城・続100名城、訪問済み・未訪問の見分け方）は、地図の左下に常に表示し、スマホでは折りたためるようにする。

## Elevation & Depth

奥行きは、影ではなく**面の色の差と線**で表します。ページの地（`background`）の上に白い面（`surface`）を置き、区切りには `outline-variant` の 1px の線を使います。

影を使うのは、背景の上に「浮いている」ことを伝える必要がある、次の2段階だけです。

| 段階 | 使う場所 | 影 |
|---|---|---|
| 浮遊 | 地図の上の部品（検索ボックス、凡例、ポップアップ、操作ボタン） | `0 1px 2px rgba(35, 38, 43, 0.12), 0 2px 6px rgba(35, 38, 43, 0.12)` |
| 最前面 | ダイアログ、下からのシート、ドロップダウン、トースト | `0 8px 24px rgba(35, 38, 43, 0.18)`。ダイアログとシートの背後には `scrim` を敷く |

地図の上の部品に影を付けるのは、地図の模様の上でも部品の輪郭が分かるようにするためです。一覧のカードや行には影を付けません。

## Shapes

角の丸みは、部品の大きさと役割に合わせて段階を分けます。すべてを同じ丸みにはしません。

| トークン | 値 | 使う場所 |
|---|---|---|
| `none` | 0px | 表、ページ全体に広がる帯、画像の上端（カードの中で上に接する場合） |
| `sm` | 4px | バッジ、続100名城のピン（45度回してひし形にする） |
| `md` | 8px | ボタン、入力欄、トースト |
| `lg` | 12px | カード、ダイアログ、地図の上の部品、下からのシート（上側の角のみ） |
| `full` | 9999px | チップ、100名城のピン、クラスタ、通知件数のバッジ、アバター |

## Components

部品は shadcn/ui をもとに、本書のトークンで見た目を合わせます。トークンにない枠線の指定は、以下の本文に従います。

### ボタン

| 種類 | 用途 | 枠線 |
|---|---|---|
| `button-primary` | 1画面に1つの主要な操作（登録する、保存する、承認する） | なし |
| `button-secondary` | 主要な操作と並ぶ補助の操作（キャンセル、修正を提案する） | 1px `outline` |
| `button-ghost` | 目立たせない操作（ヘッダーのメニュー、閉じる） | なし |
| `button-destructive` | 取り消せない操作（削除、退会、却下）。確認ダイアログの中でのみ使う | なし |

- ボタンの文字は、押すと何が起きるかを動詞で書く（「送信」ではなく「訪問記録を登録する」「提案を送る」）。
- 押した後のメッセージも同じ言葉を使う（「訪問記録を登録しました」）。
- 無効状態は不透明度 0.5 とし、なぜ押せないかを近くに文字で示す。
- 送信中は文字を「登録しています…」に変え、二重送信を防ぐ。

### 入力欄

- 入力欄の文字は 16px（`body-md`）とする。16px 未満にすると、iOS の Safari で入力時に画面が拡大されるため。
- 枠線は 1px `outline`、フォーカス時は 2px `focus-ring`。
- エラー時は枠線を 2px `error` にし、欄の下に `input-error-text` で「何が違うか」と「どう直すか」を書く（例：「訪問日に未来の日付は指定できません。今日以前の日付を選んでください」）。エラーは色だけでなく、文字とアイコンで示す。
- ラベルは必ず入力欄の上に表示する（プレースホルダーをラベルの代わりにしない）。必須項目はラベルに「必須」と文字で添える。

### チップ（絞り込み）

- 未選択は白地に 1px `outline`、選択中は `chip-filter-selected` に加えて、先頭にチェックのアイコンを付ける（色だけで選択状態を示さない）。

### 一覧の行・カード

- 城・武将の一覧は、スマホでは `list-row`（区切り線で分けた行）を基本とする。画像を大きく見せる必要がある場合だけ `card` を使う。
- 行の構成は「名前（`name-md`、明朝体）→ 読み仮名・所在地（`body-sm`、`on-surface-variant`）→ バッジ」の順。
- 行全体を1つのリンクにし、行の中にほかのリンクやボタンを入れない。

### バッジ

| 種類 | 表示する文字 |
|---|---|
| `badge-top100` | 「100名城 No.20」 |
| `badge-zoku100` | 「続100名城 No.120」 |
| `badge-status-pending`／`approved`／`rejected` | 「審査待ち」「承認」「却下」 |

### 地図のピン

ピンは、**形で区分を、塗り方とアイコンで訪問の有無を**表します。色はそれを補うものであり、色が見分けられなくても区別できるようにします（AC-01-4、AC-12-1、NFR-07）。

| 状態 | 100名城 | 続100名城 |
|---|---|---|
| 形 | 円（28px） | ひし形（26px の角丸四角を45度回す） |
| 未ログイン時 | 茜で塗りつぶし | 紺で塗りつぶし |
| ログイン中・訪問済み | 茜で塗りつぶし＋白いチェックのアイコン | 紺で塗りつぶし＋白いチェックのアイコン |
| ログイン中・未訪問 | 白地（`map-pin-unvisited`）＋茜の 3px の枠 | 白地＋紺の 3px の枠 |
| 選択中 | 36px に拡大し、外側に 2px の `on-surface` の輪を付ける | 同左 |

- すべてのピンに 2px の白い縁（`pin-stroke`）を付け、地図の道路や地名と重なっても輪郭が分かるようにする。
- クラスタ（`map-cluster`）は墨の円に白い数字とする。含まれる城の数に応じて 36px／44px／52px の3段階で大きくする。区分の違う城がまとまるため、区分の色は使わない。
- ピンにはそれぞれ城名を読み上げられるラベルを付ける（例：「松本城、100名城、訪問済み」）。

### ヘッダーと下部ナビゲーション

- 一般向けは `header`（白地、下に 1px `outline-variant`）。ロゴの文字は明朝体（`name-md`）とし、城名・武将名と同じ「銘板」の扱いにする。
- 管理画面は `header-admin`（墨の地に白い文字）とし、一般向けの画面にいるのか管理画面にいるのかを一目で分かるようにする。
- 未読通知の件数は `notification-count` で表示し、100件以上は「99+」とする。件数は読み上げ用のラベルにも含める（例：「通知 未読3件」）。
- 下部ナビゲーション（`bottom-nav`）は白地で、上に 1px `outline-variant` の線を引く。iPhone のホームバーと重ならないよう、下に `env(safe-area-inset-bottom)` の余白を足す。
- 各項目（`bottom-nav-item`）は、24px のアイコンと文字のラベルを縦に並べる。アイコンだけにはしない。
- 選択中の項目（`bottom-nav-item-selected`）は、文字を紺の太字にし、項目の上端に紺の 3px の線を付ける。色だけに頼らず、線と太さでも選択中であることを示す。読み上げ用に `aria-current="page"` を付ける。
- 下部ナビゲーションは `<nav>` 要素とし、「メインメニュー」のラベルを付ける。

### ダイアログ・シート・トースト

- ダイアログは最大幅 480px。タイトルは `headline-sm`、ボタンは右下に「補助 → 主要」の順で並べる（スマホでは縦に並べ、主要な操作を上にする）。
- 閉じたら、開く前の位置へフォーカスを戻す（`screens.md` 5章）。
- トーストは画面下の中央に4秒表示する。操作の結果を伝えるだけにし、トーストの中に操作ボタンを置かない（取り消しなどが必要な場合はダイアログにする）。

### 空の状態・エラー画面

- 検索結果が0件のときは、条件を見直すための操作（条件をクリアする）と、情報提供への案内を示す（AC-03-5、`screens.md` 4.1）。
- エラー画面（C-03〜C-05）は、何が起きたかと、次に何ができるか（トップへ戻る、一覧から探す）を書く。謝罪の言葉を重ねない。

### 共通の振る舞い

| 項目 | ルール |
|---|---|
| フォーカス | キーボード操作時は、すべての操作できる部品に 2px の `focus-ring` と 2px の隙間を表示する（`:focus-visible`）。フォーカスの表示を消さない |
| 動き | 開閉や選択など、利用者の操作に応える動きだけにする（150〜200ms、ease-out）。ページを開いたときの演出は入れない。`prefers-reduced-motion` が有効なら、地図の移動も含めてアニメーションを止める |
| アイコン | shadcn/ui 標準のアイコンセットを使い、線の太さは 2px、大きさは 20px（文字と並ぶ場合）または 24px（単独のボタン）。アイコンだけのボタンには、必ず読み上げ用のラベルを付ける |
| 画像 | 城・武将の画像は 4:3 で切り抜いて表示し、すぐ下に出典とライセンスを `caption` で表示する（AC-04-4）。代替テキストを必ず付ける |

## Do's and Don'ts

- Do：城名・武将名は明朝体（`name-display`、`name-md`）で表示する。それ以外の見出しや UI はゴシック体にする。
- Don't：ページ見出し、ボタン、説明文に明朝体を使わない。名前が目立たなくなる。
- Do：主要なボタン（`button-primary`）は1画面に1つにする。
- Don't：茜（`tertiary`）をボタンや本文の強調に使わない。茜は100名城・未読通知・推し武将の「目印」専用。
- Do：区分や状態は、色に加えて形・アイコン・文字で示す（ピン、バッジ、チップ、入力エラー）。
- Don't：和柄、筆文字、金のグラデーション、和紙の質感などの装飾を入れない。
- Do：地図の出典表示をいつでも見える状態に保つ。
- Don't：色の値や Tailwind の固定色をコードに直接書かない。必ずトークンを参照する（ダークモードへの備え）。
- Do：文字と背景のコントラスト比は 4.5:1 以上、部品の境界は 3:1 以上を保つ。新しい色の組み合わせを使う前に確認し、Colors の表に追記する。
- Don't：カードや一覧の行に影を付けない。影は地図の上の部品とダイアログだけに使う。
- Do：画面の文言は利用者の言葉で書く（「コンテンツを投稿」ではなく「城の情報を提供する」）。同じ操作には画面をまたいで同じ言葉を使う。
- Don't：1画面で3つ以上のウェイト（太さ）を使わない（本文 400、見出し・ラベル 700、名前 600 の範囲に収める）。

## 今後決める事項

| No. | 該当箇所 | 内容 |
|---|---|---|
| 1 | Typography | 明朝体の Web フォントを読み込んだ状態で LCP 2.5秒以内（NFR-01）を満たせるか。実装後に Lighthouse で測る |
| 2 | Components | ロゴを文字だけにするか、マーク（記号）を作るか |
| 3 | Colors | ダークモードの色の値（第二フェーズ以降。トークン名は変えずに値だけを追加する） |

## 改訂履歴

| バージョン | 日付 | 内容 |
|---|---|---|
| 1.0 | 2026-10-05 | 初版作成 |
| 1.1 | 2026-10-05 | `wireframes.md` を作成しないことに合わせて記述を修正。ピン選択時の表示方法を本書で確定 |
| 1.2 | 2026-10-05 | スマホでのナビゲーション（下部ナビゲーション）を本書で確定 |