# joushou

日本地図から城を探して訪問記録を残せ、城にゆかりのある戦国武将の情報まで調べられる、城めぐりと歴史好きのための Web サービス「城将（じょうしょう）※仮称」です。
目的・範囲・原則は `docs/constitution.md` を参照してください。

## 技術スタック

| 領域 | 技術 |
|---|---|
| フロントエンド（画面 + BFF） | Next.js（App Router）、Bun、Biome、shadcn/ui、mapcn（MapLibre GL） |
| 認証 | Better Auth |
| バックエンド（API） | Laravel（DDD）、Pest、Pint、Larastan |
| データベース | MySQL 8.4 |
| 実行環境 | Docker Compose、Caddy、AWS（Lightsail） |

選定理由と構成の詳細は `docs/architecture.md` を参照してください。

## ディレクトリ構成

```
apps/web/      Next.js（画面 + BFF）
apps/api/      Laravel API
infra/docker/  Dockerfile と Docker Compose から参照する設定
docs/          仕様・設計・規約のドキュメント
compose.yaml   ローカル開発環境の定義
DESIGN.md      デザインシステム（色・タイポグラフィなどのトークン）
```

`apps/` 配下の構成は `docs/architecture.md` の10章を参照してください。

## ドキュメント

| 知りたいこと | ドキュメント |
|---|---|
| 目的・範囲・判断に迷ったときの基準 | `docs/constitution.md` |
| 要件 | `docs/requirements.md` |
| 技術選定・システム構成・ディレクトリ構成 | `docs/architecture.md` |
| 用語の定義と表記 | `docs/glossary.md` |
| 画面一覧・画面遷移 | `docs/design/screens.md` |
| UI のデザイン | `DESIGN.md` |
| コーディング規約（フロントエンド） | `docs/conventions/React-Nextjs.md` |
| コーディング規約（バックエンド） | `docs/conventions/PHP-Laravel.md` |
| ブランチ・コミットメッセージ | `docs/conventions/branch-commit.md` |
| 機能ごとの仕様 | `docs/specs/` |
| ローカル開発環境の詳細 | `infra/docker/README.md` |

## ローカル開発環境

前提として Docker（Docker Compose）が必要です。コマンドはリポジトリのルートで実行します。

```sh
cp .env.example .env           # 初回のみ。MYSQL_PASSWORD と MYSQL_ROOT_PASSWORD を設定する
docker compose up -d --build   # 起動
```

| 対象 | URL |
|---|---|
| 画面（Next.js） | https://localhost |
| Laravel API（確認用） | http://localhost:8080 |
| Mailpit（送信されたメール） | http://localhost:8025 |

停止・作り直し・証明書の警告への対処は `infra/docker/README.md` を参照してください。

## よく使うコマンド

コンテナ内で実行します（例：`docker compose exec web bun run lint`、`docker compose exec api composer test`）。

| 用途 | web（`apps/web`） | api（`apps/api`） |
|---|---|---|
| Lint | `bun run lint` | `composer lint` |
| 整形 | `bun run format` | `composer format` |
| 型チェック・静的解析 | `bun run typecheck` | `composer analyse` |
| テスト | `bun run test` | `composer test` |
| E2E テスト | `bun run test:e2e` | － |

各ツールの使い方は `docs/conventions/` の規約を参照してください。
