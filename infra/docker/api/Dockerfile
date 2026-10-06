# syntax=docker/dockerfile:1

# =====================================================================
# Laravel API（PHP-FPM）
#
# api / worker / scheduler は同じイメージを使い、command だけを変える
# （architecture.md 3.2）。HTTP は Caddy が受けて FastCGI で中継する。
#
# ステージ構成:
#   base   : PHP-FPM + 拡張 + Composer
#   dev    : 開発用（Compose からバインドマウントして使う） -> compose の target: dev
#   vendor : 本番用の依存関係（--no-dev）
#   prod   : 本番実行
#
# build context は apps/api
# =====================================================================

ARG PHP_VERSION=8.5

# ---------------------------------------------------------------------
# Stage: base
# ---------------------------------------------------------------------
FROM php:${PHP_VERSION}-fpm-alpine AS base

WORKDIR /var/www/html

# PHP 拡張のビルドに必要なパッケージの解決を任せるため、install-php-extensions を使う
#   pdo_mysql       : MySQL
#   bcmath, intl    : Laravel で使う数値・国際化の処理
#   gd, exif        : Intervention Image（画像のリサイズ、Exif の扱い。NFR-05）
#   zip             : Composer、CSV 入出力まわり
#   pcntl           : キューワーカーのシグナル処理（タイムアウト、停止）
#   opcache         : 本番の性能
COPY --from=mlocati/php-extension-installer:2 /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo_mysql bcmath intl gd exif zip pcntl opcache

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# Lightsail 2GB プランでのメモリ配分（PHP-FPM 300MB）に合わせ、ワーカー数を制限する
# （architecture.md 3.3）
COPY <<'EOF' /usr/local/etc/php-fpm.d/zz-app.conf
[www]
pm = ondemand
pm.max_children = 5
pm.process_idle_timeout = 30s
pm.max_requests = 500
EOF

# 画像のアップロード上限 5MB（NFR-05）に余裕を持たせる
COPY <<'EOF' /usr/local/etc/php/conf.d/zz-app.ini
expose_php = Off
memory_limit = 128M
upload_max_filesize = 8M
post_max_size = 10M
EOF

# ---------------------------------------------------------------------
# Stage: dev  — 開発用
# ---------------------------------------------------------------------
FROM base AS dev

RUN cp "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

COPY composer.json composer.lock ./
RUN --mount=type=cache,target=/root/.composer/cache \
    composer install --no-scripts --no-autoloader --no-interaction

COPY . .
RUN composer dump-autoload

# 開発ステージは PHP-FPM のマスタープロセスを root のまま動かす（ワーカーは www-data）。
# ホスト側ソースをバインドマウントするため、UID 不一致による権限エラーを避ける狙い。

EXPOSE 9000

CMD ["php-fpm"]

# ---------------------------------------------------------------------
# Stage: vendor  — 本番用の依存関係
# ---------------------------------------------------------------------
FROM base AS vendor

COPY composer.json composer.lock ./
RUN --mount=type=cache,target=/root/.composer/cache \
    composer install --no-dev --no-scripts --no-autoloader --no-interaction --prefer-dist

COPY . .
RUN composer dump-autoload --no-dev --optimize --classmap-authoritative

# ---------------------------------------------------------------------
# Stage: prod  — 本番実行
# ---------------------------------------------------------------------
FROM base AS prod

RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# 本番ではファイルが変わらないため、更新の確認を止めて性能を上げる
COPY <<'EOF' /usr/local/etc/php/conf.d/zz-opcache.ini
opcache.enable = 1
opcache.validate_timestamps = 0
opcache.memory_consumption = 64
EOF

COPY --from=vendor --chown=www-data:www-data /var/www/html ./

# セキュリティのため非 root ユーザーに切り替える
USER www-data

EXPOSE 9000

CMD ["php-fpm"]
