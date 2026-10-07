# Claude Design のデザインを実装に置き換える

Claude Design のキャンバス（Artifact の種類は「Design」）の読み方と、その中身を城将の実装に置き換えるときの対応をまとめる。

## 目次

1. キャンバスの構成
2. `.dc.html` の読み方
3. 実装に持ち込まないもの
4. 部品の対応表
5. 色・文字の対応表
6. リンクとルート
7. レイアウトの読み替え

---

## 1. キャンバスの構成

```
project/
├── canvas.json            # 目次。boards に画面ごとのファイル、title に「A-02 城一覧（管理）」のような名前
├── Main.dc.html           # 最初のアートボード（例：A-01 ダッシュボード）
├── A02-castles.dc.html    # 画面ごとのアートボード
├── ...
└── Dialogs.dc.html        # ダイアログをまとめたアートボード（あれば）
```

- `canvas.json` の `boards.<ファイル名>.title` で画面 ID を探す。ファイル名は画面 ID に似ていることが多いが、`Main.dc.html` のように ID が入っていないものもあるので、`title` で判断する。
- `w`（幅）はアートボードの幅。1440 なら PC 幅のデザイン、390 前後ならスマホ幅のデザインと考える。
- `notes` の `kind: "title1"` は画面のグループ見出し（「城の管理」など）。実装には関係しない。
- `artifact-type/` と `SKILL.md`（キャンバス直下）はエディタ側のファイルで、画面のデザインではない。読まない。

## 2. `.dc.html` の読み方

1つのファイルが1画面で、次の構造になっている。

```html
<x-dc>
  <helmet>
    <link ... fonts.googleapis.com ...>   <!-- フォントの読み込み（実装では使わない） -->
    <style>
      :root{--primary:#223A70; ...}        <!-- DESIGN.md のトークンを手で写したもの -->
      .btn-p{...} .badge{...} ...           <!-- 部品の見た目を再現するクラス -->
    </style>
  </helmet>
  <div style="...">                         <!-- 画面の本体 -->
    <header>…</header>
    <nav aria-label="管理メニュー">…</nav>
    <main>…</main>
  </div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='...'>
  class Component extends DCLogic { renderVals() { ... } }
</script>
```

読むときに見るポイント：

| 見るところ | 分かること |
|---|---|
| `<main>` の中 | 画面固有の内容。ここが実装の中心 |
| `<header>`、`<nav>`（メニュー） | 共通レイアウト。画面ごとに作らず、`components/layout/` や `layout.tsx` に1か所で作る |
| 見出しの階層（`h1`〜`h3`） | 画面の構成。`h1` が画面名 |
| `<form>`、`<label>`、`<input>`、`<select>` | 入力項目。機能仕様・`openapi.yaml` の項目と突き合わせる |
| `<table>` の `<th>` | 一覧で表示する列 |
| `aria-label`、`aria-current`、`role` | a11y の意図。実装でも引き継ぐ |
| `<sc-for>`、`<sc-if>` | 繰り返しと条件分岐。データの配列や状態による出し分けを表す |
| `{{名前}}` と `renderVals()` | 動的な値やデザイン上の切り替え（タブ、開閉など）。`data-props` はデザイナー用の調整つまみで、実装の Props ではない |
| `<dc-import>` | 別アートボードの部品を読み込んでいる。必要ならそのファイルも読む |

## 3. 実装に持ち込まないもの

- **`<style>` の CSS とインラインの `style="..."`**：見た目の参考にとどめ、Tailwind のクラスとトークンで書き直す。CSS をコピーしない。
- **色のコード（`#223A70` など）**：すべてトークンに置き換える（5章）。
- **Google Fonts の `<link>`**：フォントは `DESIGN.md` の「読み込み方」に従って `next/font` などで読み込む。
- **ダミーデータ**：城名、ユーザー名（「山田 太郎」など）、件数（「200件」「審査待ち12件」）、日付（「今日」「9月12日」）は表示例。API から取得した値で表示する。
- **インラインの `<svg>` アイコン**：lucide-react の同じアイコンに置き換える（`lucide-react` は導入済み）。形から近いものを選ぶ。
- **`href="A04-castle-edit.dc.html"` のようなリンク**：画面の URL に置き換える（6章）。
- **`href="#"`**：未定義のリンク。`screens.md` の画面遷移図で行き先を決める。分からなければ報告する。
- **`<script>` の `DCLogic`**：デザインツール用のコード。React の状態とイベントで作り直す。

## 4. 部品の対応表

デザインの CSS クラスは Claude Design が独自に付けた名前なので、キャンバスによって違う場合がある。名前ではなく見た目と役割で判断する。

| デザインでの見た目・クラスの例 | 実装 |
|---|---|
| 塗りつぶしの主要ボタン（`.btn-p`） | shadcn/ui の `Button`（`variant="default"`）。1画面に1つ |
| 枠線のボタン（`.btn-s`） | `Button`（`variant="outline"`） |
| 背景なしのボタン（`.btn-g`） | `Button`（`variant="ghost"`） |
| ボタンの見た目のリンク（`<a class="btn ...">`） | 移動するものは `<a>`（`next/link`）のまま、ボタンの見た目にする。このプロジェクトの shadcn/ui は Base UI 版（`components.json` の `style: "base-vega"`）なので、Radix 版の `asChild` ではなく `render` を使う。書き方は追加した `button.tsx` で確かめる |
| 区分・状態のラベル（`.badge`） | `Badge`。色は `DESIGN.md` の「バッジ」に従う |
| 白い枠の箱（`.card`） | `Card`。影は付けない（`DESIGN.md`） |
| 入力欄（`.input`）、`<select>` | `Input`、`Select`、`Textarea`。`Label` と組み合わせる |
| チェックボックス（`.check`） | `Checkbox` ＋ `Label`。複数あるなら `fieldset` と `legend` で囲む |
| 表（`.tbl`）と横スクロールの枠 | `Table`。スマホでは横にスクロールさせる（`DESIGN.md` の管理画面） |
| ページ番号（`.pg`） | `Pagination`。ページ番号は URL のクエリで持つ |
| パンくずリスト（`.crumb`） | `Breadcrumb` |
| ダイアログ | `Dialog`／確認なら `AlertDialog`。閉じたら元の位置にフォーカスを戻す |
| 下から出るパネル | `Sheet`（`side="bottom"`）または `Drawer` |
| 一時的な通知 | `DESIGN.md` の「ダイアログ・シート・トースト」に従う |
| 地図 | `src/components/ui/map.tsx`（mapcn）。クライアントコンポーネントの中で `next/dynamic` の `ssr: false` で読み込む |

部品が `src/components/ui/` にない場合は、shadcn スキル（`apps/web/.claude/skills/shadcn`）に従って CLI で追加する。

## 5. 色・文字の対応表

デザインの `:root` の CSS 変数は `DESIGN.md` のトークンを写したもの。実装では shadcn/ui の CSS 変数経由の Tailwind クラスを使う（対応は `DESIGN.md` の「shadcn/ui との対応」）。

| デザインの変数 | DESIGN.md のトークン | Tailwind のクラスの例 |
|---|---|---|
| `--bg` | `background` | `bg-background` |
| `--surface` | `surface` | `bg-card` |
| `--on-surface` | `on-surface` | `text-foreground` |
| `--on-surface-variant`、`.mute`、`.cap` | `on-surface-variant` | `text-muted-foreground` |
| `--surface-variant` | `surface-variant` | `bg-muted` |
| `--primary` | `primary` | `bg-primary`、`text-primary` |
| `--primary-container` | `primary-container` | `bg-secondary`、`text-secondary-foreground` |
| `--outline-variant` | `outline-variant` | `border-border` |
| `--outline` | `outline` | `border-input` |
| `--error` | `error` | `text-destructive`、`bg-destructive` |
| `--primary-hover` | `primary-hover` | `hover:bg-primary-hover` |
| `--tertiary`、`--tertiary-container` | `tertiary` 系 | `bg-tertiary`、`text-tertiary-foreground`、`bg-tertiary-container`、`text-tertiary-container-foreground`。茜は目印専用 |
| `--inverse` | `inverse-surface` | `bg-inverse`、`text-inverse-foreground`（管理画面のヘッダーなど） |
| `--error-container` | `error-container` 系 | `bg-error-container`、`text-error-container-foreground` |
| `--success`、`--success-container` | `success` 系 | `text-success`、`bg-success-container`、`text-success-container-foreground` |
| `--warning-container` | `warning-container` 系 | `bg-warning-container`、`text-warning-container-foreground` |
| ピンの色 | `pin-*` | `bg-pin-top100`、`bg-pin-zoku100` など |

文字：

| デザイン | 実装 |
|---|---|
| `font-family: var(--serif)`、`.name` | 城名・武将名だけに使う明朝体（`name-display`、`name-md`）。見出しやボタンには使わない |
| `.h1`、`.h3`、`.sm`、`.cap` | `DESIGN.md` の「文字の段階」のトークン（`headline-*`、`body-*`、`label-*` など）に対応させる |
| `font-feature-settings:"palt"` | `DESIGN.md` の「文字組みのルール」に従う |

デザインの値がトークンのどれにも当てはまらない場合は、近いトークンに寄せて、報告の「デザインと違う点」に書く。任意の値（`text-[13px]` など）は、トークンで表せない場合に限る。

## 6. リンクとルート

アートボード間のリンクは、`canvas.json` の `title` で画面 ID に変え、`screens.md` の URL に置き換える。

| デザインのリンク | 手がかり | 実装 |
|---|---|---|
| `href="A04-castle-edit.dc.html"` | `title: "A-04 城編集"` | `screens.md` の A-04 の URL（例：`/admin/castles/[id]/edit`）に、行のデータの ID を入れる |
| `href="Main.dc.html"` | `title: "A-01 ダッシュボード"` | A-01 の URL |

画面 ID の接頭辞とルートグループの対応は `screens.md` 1.2（`P` → `(public)`、`M` → `(member)`、`A` → `admin`、`C` → `(public)`）。

## 7. レイアウトの読み替え

- デザインは `flex-wrap` と `flex: 1 1 260px` のような指定で幅に応じて折り返すことが多い。実装では `DESIGN.md` のブレークポイント（レイアウトを切り替えるのは `md` と `lg` の2か所）に合わせて、Tailwind のレスポンシブなクラスで書き直す。
- デザインが PC 幅だけでも、スマホ幅は `DESIGN.md` の「画面の型」に従う（例：一覧画面はスマホで絞り込みをシートに入れる）。デザインとドキュメントで違えば、ドキュメントに合わせる。
- 左右の余白、最大幅、ヘッダーの高さ（56px）、タップ領域（44px）は `DESIGN.md` の Layout のトークンを使う。
