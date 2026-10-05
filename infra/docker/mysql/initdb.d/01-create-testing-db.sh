#!/bin/sh
# Laravel のテスト（PHPUnit）用のデータベースを作る。
# 開発用のデータを消さないように、テストは <MYSQL_DATABASE>_testing を使う。
set -eu

mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" <<SQL
CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}_testing\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}_testing\`.* TO '${MYSQL_USER}'@'%';
SQL
