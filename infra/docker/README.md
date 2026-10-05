# ローカル開発環境（Docker Compose）

構成と方針は `docs/architecture.md`（3章、9.1）を参照してください。コマンドはすべてリポジトリのルートで実行します。

## 初回の準備

```sh
cp .env.example .env   # MYSQL_PASSWORD と MYSQL_ROOT_PASSWORD を設定する
```

## 起動

| 状況 | コマンド |
|---|---|
| 起動 | `docker compose up -d --build` |
| 依存パッケージを変更したとき | `docker compose up -d --build -V`（`node_modules`・`vendor` の匿名ボリュームを作り直す） |
| 停止してデータも消す | `docker compose down -v` |

## 接続先

| 対象 | URL |
|---|---|
| 画面（Next.js） | https://localhost |
| Laravel API（確認用） | http://localhost:8080 |
| Mailpit（送信されたメール） | http://localhost:8025 |
| MySQL | `127.0.0.1:3306`（テスト用 DB は `<MYSQL_DATABASE>_testing`） |

## HTTPS の証明書の警告を消す（macOS）

Caddy は `localhost` 用の証明書を自前の CA で発行します。その CA をキーチェーンに登録すると、ブラウザの警告が消えます。

```sh
docker compose cp caddy:/data/caddy/pki/authorities/local/root.crt ./caddy-root.crt
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./caddy-root.crt
rm ./caddy-root.crt
```

`docker compose down -v` で `caddy-data` ボリュームを消した場合は CA が作り直されるため、再度登録が必要です。

## Dockerfile

| ファイル | 対象 | build context |
|---|---|---|
| `web/Dockerfile` | Next.js | `apps/web` |
| `api/Dockerfile` | Laravel | `apps/api` |

Dockerfile を build context の外に置いているため、`.dockerignore` も context の直下ではなく、Dockerfile と同じディレクトリに `Dockerfile.dockerignore` として置いています（BuildKit の機能）。

Compose を使わずにビルドする場合も、context と Dockerfile を指定します。

```sh
docker build -f infra/docker/web/Dockerfile --target runner apps/web
docker build -f infra/docker/api/Dockerfile --target prod apps/api
```
