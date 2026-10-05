# syntax=docker/dockerfile:1

# =====================================================================
# Next.js（output: "standalone"）
#
# パッケージ管理とスクリプト実行は Bun、Next.js の実行は Node.js とする
# （architecture.md 2.3）。Bun のバイナリは公式イメージからコピーして使う。
#
# ステージ構成:
#   bun     : Bun のバイナリを取り出すだけのステージ
#   base    : Node.js + Bun
#   deps    : 依存関係のインストール（キャッシュ層）
#   dev     : 開発用（bun run dev）                  -> compose の target: dev
#   builder : 本番ビルド（bun run build）
#   runner  : 本番実行（node server.js）。Bun は含めない
#
# build context は apps/web
# =====================================================================

ARG NODE_VERSION=24
ARG BUN_VERSION=1

# ---------------------------------------------------------------------
# Stage: bun
# ---------------------------------------------------------------------
FROM oven/bun:${BUN_VERSION}-alpine AS bun

# ---------------------------------------------------------------------
# Stage: base
# ---------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

# Next.js の匿名テレメトリを無効化
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun

# ---------------------------------------------------------------------
# Stage: deps  — 依存関係のみをインストールしてレイヤキャッシュを効かせる
# ---------------------------------------------------------------------
FROM base AS deps

# lockfile を先にコピーすることで、ソース変更時に再インストールが走らないようにする
COPY package.json bun.lock ./

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# ---------------------------------------------------------------------
# Stage: dev  — 開発サーバー（Compose からバインドマウントして使う）
# ---------------------------------------------------------------------
FROM base AS dev

ENV NODE_ENV=development
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Docker 内ではファイル変更イベントが届かないことがあるため、
# webpack を使う場合はポーリングでの監視を有効にする
ENV WATCHPACK_POLLING=true

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 開発ステージはあえて root のまま動かす。
# ホスト側ソースをバインドマウントするため、UID 不一致による書き込み権限エラーを避ける狙い。
# （本番ステージ runner は非 root で実行する）

EXPOSE 3000

# `bun run` はスクリプトを実行するだけで、next 自体は Node.js で動く
CMD ["bun", "run", "dev"]

# ---------------------------------------------------------------------
# Stage: builder  — 本番ビルド
# ---------------------------------------------------------------------
FROM base AS builder

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# public/ が存在しないプロジェクトでも runner の COPY が失敗しないようにする
RUN mkdir -p public

# next.config.ts に output: "standalone" が必須
RUN bun run build

# ---------------------------------------------------------------------
# Stage: runner  — 本番実行（最小構成）
# ---------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# プリレンダーキャッシュ用のディレクトリを先に用意し、所有者を node にしておく
RUN mkdir -p .next && chown node:node .next

COPY --from=builder --chown=node:node /app/public ./public

# Output File Tracing により、実行に必要なファイルだけがコピーされる
# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# セキュリティのため非 root ユーザーに切り替える
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
