# 開発規約：バックエンド（PHP / Laravel）

| 項目 | 内容 |
|---|---|
| バージョン | 1.0（初版） |
| 作成日 | 2026-10-05 |
| ステータス | 確定 |
| 対象 | `apps/api/` |
| 関連ドキュメント | `architecture.md`、`design/data-model.md`、`api/openapi.yaml`、`conventions/branch-commit.md` |

このドキュメントは、`apps/api/`（Laravel）のコードの書き方を定めます。Laravel の機能を活かしながら DDD の考え方で作るためのレイヤー構成、命名、テストの書き方を含みます。AI エージェントに実装させるときは、本書と該当する機能仕様を必ず渡します。

---

## 1. 基本方針

- **Pint、Larastan、Pest が通らないコードはマージしない**。
- **Laravel の機能で実現できることは、Laravel の機能を使う**。トランザクション、時刻、権限、ファイル保存、メール送信、キューなどについて、同じ役割の仕組み（ラッパーやサービスクラス）を自前で作らない。
- **ドメイン層だけは Laravel に依存させない**。業務のルールは、フレームワークがなくても読める・テストできる素の PHP で書く。
- **すべてのリクエストでトークンと権限を確認する**。Next.js から呼ばれる前提でも、検証を省略しない（`architecture.md` 4.3）。
- **仕様が先、実装が後**。テーブルを変えるなら `design/data-model.md`、API を変えるなら `api/openapi.yaml` を先に更新する。

---

## 2. ツールとコマンド

| 用途 | ツール | コマンド（例） |
|---|---|---|
| 整形 | Laravel Pint（プリセット：`laravel`） | `composer lint`（確認のみ）、`composer format`（修正） |
| 静的解析 | Larastan | `composer analyse` |
| テスト | Pest | `composer test` |

コマンド名は `composer.json` の `scripts` で上記のとおり定義します。CI でも同じコマンドを実行します。

### 2.1 Larastan のレベル

| 時期 | レベル |
|---|---|
| 開始時 | 5 |
| 以降 | エラーが0の状態が続いたら、1つずつ上げる。最終的に 8 以上を目指す |

- レベルを上げたら、本書のこの表を更新する。
- 新しく書くコードのエラーを、ベースライン（`phpstan-baseline.neon`）に入れて黙らせない。ベースラインは、レベルを上げた直後の既存コードのエラーにだけ使い、少しずつ減らす。
- `@phpstan-ignore` を使う場合は、理由を同じ行に書く。

---

## 3. PHP の書き方

| ルール | 内容 |
|---|---|
| 厳密な型 | `app/` 配下のすべてのファイルの先頭に `declare(strict_types=1);` を書く |
| 型宣言 | 引数、戻り値、プロパティにはすべて型を宣言する。`mixed` はドメイン層では使わない |
| `final` | クラスは原則 `final` にする。継承させる場合（Laravel の基底クラスを継承する側ではなく、継承される側）だけ外す |
| 不変 | 値オブジェクトと DTO は `readonly class` にする |
| 列挙 | 決まった値の集まり（ゆかりの種類、ロールなど）は PHP の `enum` で表す |
| 配列の型 | 配列を返す場合は、PHPDoc で中身の型を書く（例：`@return list<Castle>`） |
| ファサード・ヘルパー | ドメイン層では使わない（`DB::`、`Log::`、`now()`、`config()` など）。ほかの層では使ってよい（6.2） |
| `env()` | `config/` 配下のファイル以外では使わない。設定値は `config()` 経由で読む |
| デバッグ用の関数 | `dd()`、`dump()`、`var_dump()` をコミットしない |

```php
<?php

declare(strict_types=1);

namespace App\Domain\Castle;

final readonly class CastleName
{
    public function __construct(public string $value)
    {
        if ($value === '' || mb_strlen($value) > 100) {
            throw new InvalidCastleNameException($value);
        }
    }
}
```

---

## 4. ディレクトリと名前空間

### 4.1 方針

**Laravel 標準の `app/` の構成をそのまま使い、DDD のために `Domain`・`Application`・`Infrastructure`・`Queries` の4つだけを加える**構成とします。名前空間は Laravel 標準の `App\` のままにし、`php artisan make:*` でどの層のクラスも作れるようにします。各層の下は、集約（業務のまとまり）ごとに分けます。

```
apps/api/
├── app/
│   ├── Domain/                            # ドメイン層（素の PHP。Laravel に依存しない）
│   │   ├── Castle/
│   │   │   ├── Castle.php                 # エンティティ（集約ルート）
│   │   │   ├── CastleId.php               # 値オブジェクト
│   │   │   ├── CastleName.php
│   │   │   ├── CastleRepository.php       # リポジトリのインターフェース
│   │   │   └── Exceptions/
│   │   │       └── InvalidCastleNameException.php
│   │   ├── Warlord/
│   │   ├── Member/
│   │   │   └── Role.php                   # ロール。権限の判定を持つ enum（5.6）
│   │   ├── Visit/
│   │   ├── Contribution/
│   │   ├── Notification/
│   │   └── Common/                        # 複数の集約で使う値オブジェクト、例外の基底クラス
│   ├── Application/                       # アプリケーション層：ユースケース
│   │   ├── Visit/
│   │   │   ├── RegisterVisitUseCase.php
│   │   │   └── RegisterVisitInput.php
│   │   ├── Auth/
│   │   │   └── AuthenticatedMember.php    # 認証済みの会員（9.4）
│   │   └── Common/
│   ├── Queries/                           # アプリケーション層：参照用のクエリ（6.4）
│   │   └── VisitQuery.php
│   ├── Policies/                          # アプリケーション層：権限の判定（6.3）
│   │   └── VisitPolicy.php
│   ├── Events/                            # アプリケーション層：業務上の出来事（6.5）
│   │   └── ContributionApproved.php
│   ├── Infrastructure/                    # インフラ層：リポジトリの実装
│   │   └── Persistence/
│   │       └── EloquentVisitRepository.php
│   ├── Models/                            # インフラ層：Eloquent モデル（7.1）
│   │   └── Visit.php
│   ├── Listeners/                         # インフラ層：イベントを受けた後続処理（6.5）
│   ├── Notifications/                     # インフラ層：システム内通知、メール通知
│   ├── Jobs/                              # インフラ層：キューで動かす処理
│   ├── Http/                              # プレゼンテーション層
│   │   ├── Controllers/
│   │   │   ├── VisitController.php        # リソースコントローラー（9.1）
│   │   │   └── Admin/
│   │   │       └── CastleController.php
│   │   ├── Requests/
│   │   │   └── Visit/
│   │   │       ├── StoreVisitRequest.php
│   │   │       └── UpdateVisitRequest.php
│   │   ├── Resources/
│   │   │   └── VisitResource.php
│   │   ├── Middleware/
│   │   └── Auth/
│   │       └── AccessTokenGuard.php       # JWT の検証（9.4）
│   └── Providers/
│       ├── AppServiceProvider.php         # Gate・Policy の登録、ガードの登録、モデルの設定
│       └── RepositoryServiceProvider.php  # インターフェースと実装の結びつけ（7.2）
├── bootstrap/app.php                      # ルーティング、ミドルウェア、例外の変換（9.3）
├── database/
├── routes/
│   └── api.php
└── tests/
```

集約のディレクトリ名（`Castle`、`Warlord` など）は例です。確定した一覧と、日本語の用語との対応は `docs/glossary.md` で管理します。

各ディレクトリがどの層に属するかは、次のとおりです。

| 層 | ディレクトリ | 置くもの |
|---|---|---|
| Domain | `Domain/` | エンティティ、値オブジェクト、ドメインサービス、リポジトリのインターフェース、ドメインの例外 |
| Application | `Application/`、`Queries/`、`Policies/`、`Events/` | ユースケースと入力 DTO、参照用のクエリ、権限の判定、イベント |
| Infrastructure | `Infrastructure/`、`Models/`、`Listeners/`、`Notifications/`、`Jobs/` | リポジトリの実装、Eloquent モデル、通知・メールなどの後続処理 |
| Presentation | `Http/` | コントローラー、FormRequest、API Resource、ミドルウェア、認証ガード |
| つなぎ込み | `Providers/`、`bootstrap/app.php` | サービスコンテナへの登録、ルーティング、例外の変換 |

### 4.2 クラスの作り方

ファイルは `php artisan make:*` で作ります。

| 作るもの | コマンド（例） |
|---|---|
| Eloquent モデル（マイグレーション、Factory 付き） | `php artisan make:model Visit -mf` |
| コントローラー | `php artisan make:controller VisitController --api`（9.1） |
| FormRequest | `php artisan make:request Visit/StoreVisitRequest` |
| API Resource | `php artisan make:resource VisitResource` |
| Policy | `php artisan make:policy VisitPolicy` |
| イベント、リスナー、通知、ジョブ | `make:event`、`make:listener`、`make:notification`、`make:job` |
| ドメイン層・アプリケーション層などのクラス | `php artisan make:class Domain/Visit/VisitDate` |
| enum、インターフェース | `php artisan make:enum Domain/Member/Role`、`php artisan make:interface Domain/Visit/VisitRepository` |

`php artisan stub:publish` でスタブ（ひな形）をリポジトリに取り込み、`declare(strict_types=1);` と `final` を入れておきます。生成したファイルを毎回手で直さないためです。

### 4.3 依存の向き

| 層 | 依存してよい先 | 依存してはいけない先 |
|---|---|---|
| Domain | Domain のみ | ほかのすべての層、Laravel（`Illuminate\*`） |
| Application | Domain、Laravel | Infrastructure（`App\Infrastructure`、`App\Models`）、Presentation（`App\Http`）。ただし `Queries/` は `App\Models` を使ってよい（6.4） |
| Infrastructure | Domain、Application、Laravel | Presentation |
| Presentation | Application、Domain（値・例外・エンティティの参照）、Laravel | Infrastructure。ただし `Http/Resources/` は、参照用のクエリが返した `App\Models` を整形するため使ってよい（9.2） |

このルールは、Pest のアーキテクチャテスト（`tests/Architecture/`）で自動的に検査します。

```php
arch('ドメイン層は他の層と Laravel に依存しない')
    ->expect('App\Domain')
    ->not->toUse([
        'App\Application', 'App\Queries', 'App\Policies', 'App\Events',
        'App\Infrastructure', 'App\Models', 'App\Http', 'Illuminate',
    ]);

arch('ユースケースは Eloquent モデルとプレゼンテーション層に依存しない')
    ->expect(['App\Application', 'App\Policies', 'App\Events'])
    ->not->toUse(['App\Infrastructure', 'App\Models', 'App\Http']);

arch('参照用のクエリはプレゼンテーション層に依存しない')
    ->expect('App\Queries')
    ->not->toUse(['App\Infrastructure', 'App\Http']);

arch('プレゼンテーション層はインフラ層に依存しない')
    ->expect('App\Http')
    ->not->toUse(['App\Infrastructure', 'App\Models'])
    ->ignoring('App\Http\Resources');

arch('Service という名前のクラスを作らない')
    ->expect('App')
    ->not->toHaveSuffix('Service')
    ->ignoring('App\Providers');

arch('app 配下は strict_types を宣言する')
    ->expect('App')
    ->toUseStrictTypes();
```

---

## 5. ドメイン層

### 5.1 エンティティ

- コンストラクタは `private` にし、作り方に応じた静的メソッドを用意する。
  - `create()`：新しく作る。業務ルールの検証を行う
  - `reconstruct()`：データベースから復元する。検証は行わない（保存済みのデータは正しい前提）
- setter は作らない。状態を変えるメソッドは、業務の言葉で名前を付ける（`approve()`、`reject()`、`suspend()` など）。値を読むメソッド（`id()`、`status()` など）は用意してよい。
- 識別子は専用の値オブジェクト（`CastleId` など）で持つ。ID の型（連番、ULID など）は `design/data-model.md` に従う。
- 現在時刻が必要な判定（訪問日が未来でないかなど）は、時刻を引数で受け取る（`DateTimeImmutable`）。ドメイン層で `now()` を呼ばない。

```php
final class Contribution
{
    private function __construct(
        private readonly ContributionId $id,
        private ContributionStatus $status,
        // ...
    ) {}

    public function approve(MemberId $reviewerId, DateTimeImmutable $now): void
    {
        if ($this->status !== ContributionStatus::Pending) {
            throw new ContributionAlreadyReviewedException($this->id);
        }
        $this->status = ContributionStatus::Approved;
        // ...
    }
}
```

### 5.2 値オブジェクト

- `final readonly class` にし、コンストラクタで値を検証する。不正な値ならドメインの例外を投げる。
- 値で比べる必要がある場合は `equals()` を用意する。

### 5.3 リポジトリのインターフェース

- Domain 層にインターフェースだけを置き、実装は Infrastructure 層に置く（7.2）。
- 集約ルート1つにつき、リポジトリを1つ作る。
- メソッドは `findById()`（見つからなければ `null`）、`save()`、`delete()` を基本とし、業務で必要なものだけを追加する。Eloquent のモデル、クエリビルダ、`Collection` を戻り値にしない。
- リポジトリは更新系の処理（ユースケース）のためのもの。表示のための一覧・検索は、参照用のクエリ（6.4）で行う。

### 5.4 ドメインサービス

複数のエンティティにまたがる業務ルールで、どのエンティティにも自然に置けないものだけを、ドメインサービスにします（例：同じ城の訪問記録が重複していないかの判定）。名前は `XxxService` ではなく、役割を表す名前にします（例：`DuplicateVisitChecker`）。

### 5.5 例外

- 業務ルールに反した場合は、`App\Domain\Common\Exceptions\DomainException`（基底クラス）を継承した例外を投げる。
- 例外のクラス名は、何が起きたかを表す（例：`VisitDateInFutureException`）。
- 例外には `docs/design/errors.md` のエラーコードを持たせる。HTTP のステータスコードへの変換は `bootstrap/app.php` で行う（9.3）。

### 5.6 ロールと権限の判定

- ロール（会員、管理者、特権管理者）は `App\Domain\Member\Role` の enum で表す。
- 「このロールで何ができるか」は、enum のメソッドとして書く（例：`canReviewContributions()`、`canManageUsers()`）。権限は業務ルールの一部として、ドメイン層で扱う（`architecture.md` 6.1）。
- 「この会員の記録か」など、対象に関する判定はエンティティのメソッドとして書く（例：`$visit->isOwnedBy($memberId)`）。
- これらの判定は Laravel の Policy から呼ぶ（6.3）。

---

## 6. アプリケーション層

### 6.1 ユースケース

- 更新を伴う操作は、1つのユースケースを1つのクラスにする。名前は `<動詞><対象>UseCase` とする（例：`RegisterVisitUseCase`、`ApproveContributionUseCase`）。
- 公開するメソッドは `handle()` だけにする（Laravel のジョブ・リスナーと同じ名前にそろえる）。
- 依存するもの（リポジトリ、ドメインサービス）はコンストラクタで受け取り、Laravel のサービスコンテナに自動で解決させる。
- 入力は、ユースケースごとの DTO（`<ユースケース名>Input`、`readonly class`）で受け取る。FormRequest の `toInput()` で作る（9.2）。
- 戻り値は、作成・更新した集約の ID など、必要な値だけにする。専用の Output DTO は作らない。レスポンスの本文が必要な場合は、コントローラーが参照用のクエリで取り直す（9.1）。
- 表示するだけの処理には、ユースケースを作らない。参照用のクエリ（6.4）をコントローラーから直接呼ぶ。

```php
final readonly class RegisterVisitUseCase
{
    public function __construct(
        private VisitRepository $visits,
        private DuplicateVisitChecker $duplicateChecker,
    ) {}

    public function handle(RegisterVisitInput $input): VisitId
    {
        return DB::transaction(function () use ($input): VisitId {
            $visit = Visit::create(
                memberId: $input->memberId,
                castleId: $input->castleId,
                visitedOn: $input->visitedOn,
                today: now(),
            );
            $this->duplicateChecker->ensureNotDuplicated($visit);
            $this->visits->save($visit);

            return $visit->id();
        });
    }
}
```

### 6.2 アプリケーション層で使う Laravel の機能

| やりたいこと | 使う機能 | 自前で作らないもの |
|---|---|---|
| トランザクション | `DB::transaction()`。境界はユースケースとする | トランザクション管理のインターフェース |
| 現在時刻 | `now()`。`AppServiceProvider` で `Date::use(CarbonImmutable::class)` とし、不変の日時を返すようにする | 時刻を返すインターフェース（Clock） |
| 権限の確認 | Gate と Policy（6.3） | 独自の権限チェッカー |
| 後続処理（通知、メール） | イベントとキューのリスナー（6.5） | 通知用のサービスクラス |
| ファイルの保存 | `Storage::disk('images')`（本番は S3、ローカルは local ディスク。7.3） | ストレージのラッパー |
| ログ | `Log` | ロガーのインターフェース |
| 設定値 | `config()` | |

テストでは、これらを Laravel の機能で置き換えます（11.3）。そのためにインターフェースを自作する必要はありません。

### 6.3 権限（Gate と Policy）

- 判定は Policy（`app/Policies/`）に書く。Policy はドメイン層のエンティティに対して作り、`AppServiceProvider` で `Gate::policy(Visit::class, VisitPolicy::class)` のように登録する（Eloquent モデルではないため、自動検出は使わない）。
- Policy の中では、判定をドメインのメソッドに任せ（5.6）、業務ルールを直接書かない。
- 対象のエンティティがある操作は、ユースケースの中で、エンティティを読み込んだあとに `Gate::authorize('update', $visit)` で確認する。
- 対象を持たない操作（管理画面の機能を使えるかなど）は、`Gate::define()` で能力を定義し、ルートに `can:` ミドルウェアを付けて確認する（9.1）。
- 他人の記録など、存在を知らせたくない場合は `Response::denyAsNotFound()` を返し、403 ではなく 404 にする（`screens.md` 1.4）。

```php
final class VisitPolicy
{
    public function update(AuthenticatedMember $member, Visit $visit): Response
    {
        return $visit->isOwnedBy($member->id)
            ? Response::allow()
            : Response::denyAsNotFound();
    }
}
```

### 6.4 参照用のクエリ

一覧・検索・集計など、データを表示するだけの処理は、エンティティを経由せずに `app/Queries/` のクエリクラスで取得します（参照と更新の分離）。

- 対象ごとに1クラスとし、名前は `<対象>Query` とする（例：`CastleQuery`、`VisitQuery`）。メソッドは用途を表す名前にする（`search()`、`findPublished()` など）。
- Eloquent を直接使ってよい。戻り値は Eloquent モデル、コレクション、ページネーター（`paginate()`）とし、API Resource で整形する（9.2）。
- 関連は `with()` で先に読み込み、N+1 を防ぐ（7.1 の `preventLazyLoading()` で検出する）。
- 公開範囲の条件（非公開、利用停止中、論理削除など）は、Eloquent モデルのローカルスコープにまとめ、付け忘れを防ぐ。
- 見つからない場合は `findOrFail()` などで `ModelNotFoundException` を投げ、404 にする。
- データを変更する処理には使わない。

### 6.5 イベントと後続処理

- 業務上の出来事（情報提供が承認された、など）は、`app/Events/` に Laravel のイベントとして定義し、ユースケースから発行する（`ContributionApproved::dispatch($contribution->id())`）。
- トランザクションの中で発行するイベントは `ShouldDispatchAfterCommit` を実装し、コミットされてから配信されるようにする。
- イベントには ID などの値だけを持たせ、エンティティそのものは持たせない（キューで直列化するため）。
- 通知やメールは、リスナー（`ShouldQueue` を実装してキューで動かす）から Laravel の Notification で送る。メールは `mail` チャネル（SES）、システム内通知の保存先は `design/data-model.md` に従う。

---

## 7. インフラ層

### 7.1 Eloquent モデル

- `app/Models/` に置き、名前は Laravel の慣習どおり集約名の単数形とする（例：`Castle`）。`make:model` と Factory をそのまま使うため。
- ドメインのエンティティと名前が同じになるため、両方を使うクラス（リポジトリ）では `use App\Models\Castle as CastleModel;` のように別名で import する。
- Eloquent モデルを使ってよいのは、インフラ層（リポジトリ、リスナー、通知、ジョブ）、参照用のクエリ（6.4）、API Resource（9.2）だけ。ユースケースとコントローラーでは使わない。
- リレーション、キャスト（`casts()`）、ローカルスコープは積極的に使う。キャストには、ドメインの enum（`Role` など）を使ってよい。
- 業務ルールをモデルに書かない。モデルのメソッドは、リレーション、キャスト、スコープのためだけに使う。
- `$fillable` で書き込める列を明示する。`$guarded = []` は使わない。
- `AppServiceProvider` で `Model::shouldBeStrict(! app()->isProduction())` を設定し、開発中に N+1（遅延読み込み）や存在しない属性への代入を検出する。

### 7.2 リポジトリの実装

- `app/Infrastructure/Persistence/` に置き、名前は `Eloquent<集約>Repository` とする。
- Eloquent モデルとエンティティの変換は、リポジトリの中で行う（読み込みは `reconstruct()`、保存はモデルへの代入）。
- インターフェースと実装の結びつけは、`RepositoryServiceProvider` の `$bindings` プロパティにまとめる。

```php
final class RepositoryServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    public array $bindings = [
        CastleRepository::class => EloquentCastleRepository::class,
        VisitRepository::class => EloquentVisitRepository::class,
    ];
}
```

### 7.3 外部との接続（サービスクラスを作らない）

Infrastructure 層には、`XxxService` のような外部連携のラッパークラスを作りません。外部との接続は、Laravel の機能と `config/` の設定で行います。

| 接続先 | 使う機能 | 設定 |
|---|---|---|
| S3（画像） | Filesystem（`Storage::disk('images')`） | `config/filesystems.php` |
| SES（メール） | Mail と Notification | `config/mail.php` |
| Next.js（JWKS の取得） | `Http` と `Cache`（認証ガードの中で使う。9.4） | `config/auth.php` |
| キュー | Queue（ジョブ、`ShouldQueue` のリスナー） | `config/queue.php` |

- 画像の Exif 削除とリサイズは、Intervention Image を使い、画像を受け取るユースケースの中で行う（`architecture.md` 7.2）。複数のユースケースで同じ処理が必要になったら、`app/Application/Common/` に役割を表す名前のクラス（例：`ImageSanitizer`）としてまとめる。
- テストでは、Laravel の fake（`Storage::fake()`、`Notification::fake()`、`Http::fake()`、`Queue::fake()`）で置き換える。

---

## 8. データベース

| 対象 | ルール | 例 |
|---|---|---|
| テーブル名 | snake_case の複数形 | `castles`、`visit_records` |
| 中間テーブル | 2つのテーブルの単数形を、アルファベット順に `_` でつなぐ | `castle_warlord` |
| カラム名 | snake_case | `visited_on`、`is_public` |
| 外部キー | `<参照先の単数形>_id` | `castle_id` |
| 日時 | `_at` で終える（日付だけなら `_on`） | `approved_at`、`visited_on` |
| 真偽値 | `is_`、`has_` で始める | `is_public` |

- マイグレーションを作る前に、`design/data-model.md` を更新する。
- マイグレーションには `down()` を書き、元に戻せるようにする。
- `main` にマージ済みのマイグレーションは編集しない。変更は新しいマイグレーションで行う。
- 文字コードは utf8mb4 とする（`architecture.md` 7.1）。
- 城・武将などの初期データはシーダーで投入する。

---

## 9. プレゼンテーション層

### 9.1 ルーティングとコントローラー

- ルートは `routes/api.php` に書き、`bootstrap/app.php` の `withRouting()` に登録する（`php artisan install:api` は Sanctum を入れるため使わない）。パス・メソッドは `docs/api/openapi.yaml` と一致させる。
- コントローラーは**リソースコントローラー**とし、1つのリソース（URL の名詞）につき1つのクラスにする。`php artisan make:controller VisitController --api` で作り、ルートは `Route::apiResource()` で定義する。`--api` は `--resource` から、画面を返す `create`・`edit` を除いたもの。
- メソッドは `index`、`show`、`store`、`update`、`destroy` のうち必要なものだけを残す（`apiResource()` の `only()` でルートもそろえる）。
- リソースの基本操作に当てはまらない操作（承認、却下、利用停止など）は、同じコントローラーにメソッドを追加してよい。メソッド名は業務の動詞にし（`approve`、`reject`）、ルートは個別に定義する。
- 管理画面向けのコントローラーは `Http/Controllers/Admin/` に置き、ルートはまとめて `can:` ミドルウェアで守る（6.3）。
- 各メソッドに書くのは、次の処理だけにする。業務のロジックを書かない。
  - 更新系：FormRequest の `toInput()` → ユースケースの `handle()` → レスポンス
  - 参照系：参照用のクエリ → API Resource
- 作成（`store`）で本文を返す場合は、ユースケースが返した ID で参照用のクエリから取り直し、`show` と同じ Resource で返す。レスポンスの形を Resource の1か所で決めるため。

```php
final class VisitController extends Controller
{
    public function index(Request $request, VisitQuery $query): AnonymousResourceCollection
    {
        return VisitResource::collection($query->paginateFor($request->user()->id));
    }

    public function store(
        StoreVisitRequest $request,
        RegisterVisitUseCase $useCase,
        VisitQuery $query,
    ): JsonResponse {
        $visitId = $useCase->handle($request->toInput());

        return VisitResource::make($query->findOrFail($visitId))
            ->response()
            ->setStatusCode(201);
    }

    public function destroy(int $visit, DeleteVisitUseCase $useCase): Response
    {
        $useCase->handle(new VisitId($visit));

        return response()->noContent();
    }
}
```

```php
// routes/api.php
Route::middleware(['auth:api', 'member.active'])->group(function () {
    Route::apiResource('visits', VisitController::class);
    Route::post('contributions/{contribution}/approve', [ContributionController::class, 'approve']);
});
```

### 9.2 入力の検証とレスポンス

| 検証の種類 | 担当 |
|---|---|
| 形式の検証（必須、型、文字数、日付の形式など） | FormRequest（`Http/Requests/`） |
| 業務ルールの検証（訪問日が未来でない、重複していないなど） | 値オブジェクト、エンティティ、ユースケース |

- FormRequest の名前は `<操作><対象>Request` とする（`StoreVisitRequest`、`UpdateVisitRequest`、`ApproveContributionRequest`）。
- FormRequest には、検証済みの値から Input DTO を作る `toInput()` を用意する。会員 ID は `$this->user()` から取り、本文からは受け取らない。
- FormRequest の `authorize()` は `true` を返す。権限はユースケースとルートで確認する（6.3）。
- レスポンスは API Resource（`Http/Resources/`）で整形し、形は `openapi.yaml` と一致させる。Resource では返す項目を1つずつ書き、モデルをそのまま（`parent::toArray()`）返さない（非公開の項目を漏らさないため）。
- 一覧は `paginate()` の結果を `Resource::collection()` に渡し、ページ分割の情報（`meta`、`links`）は Laravel の標準の形で返す。

### 9.3 例外と HTTP ステータス

例外は `bootstrap/app.php` の `withExceptions()` でまとめて HTTP レスポンスに変換します。レスポンスの本文は `docs/design/errors.md` の形式（エラーコードとメッセージ）にそろえます。

| 状況 | 例外 | ステータス |
|---|---|---|
| トークンがない、または無効 | `AuthenticationException`（Laravel） | 401 |
| 権限がない、利用停止中、メールアドレスが未確認 | `AuthorizationException`（Laravel） | 403 |
| 対象が存在しない（非公開のものを含む） | `ModelNotFoundException`、`denyAsNotFound()`（Laravel） | 404 |
| 重複・状態の競合（審査済みの情報提供を再審査など） | ドメインの例外 | 409 |
| 入力の形式エラー | `ValidationException`（Laravel） | 422 |
| 業務ルール違反 | ドメインの例外 | 422 |
| 予期しないエラー | その他 | 500（詳細は返さず、Sentry に送る） |

- Laravel が標準で変換する例外は、ステータスをそのまま使い、本文の形だけを `errors.md` にそろえる。
- ドメインの例外は基底クラス（5.5）でまとめて捕まえ、例外が持つエラーコードからステータスを決める。

### 9.4 認証

- トークンの検証は、Laravel の認証ガードとして実装する。`Http/Auth/AccessTokenGuard`（`__invoke` を持つクラス）を `AppServiceProvider` で `Auth::viaRequest('access-token', ...)` に登録し、`config/auth.php` の `api` ガードのドライバーにする。Laravel 標準の `User` モデルと `users` テーブルは使わない。
- ガードの中で、Better Auth（Next.js）が発行した JWT の署名・発行者・対象（audience）・有効期限を、Next.js が公開する JWKS で検証する（`architecture.md` 6.1）。JWKS は `Http` で取得し、`Cache` に保存する。
- 検証できたら、トークンの `sub` から会員を特定し、`App\Application\Auth\AuthenticatedMember`（`Authenticatable` を実装し、会員 ID とロールを持つ）を返す。初回登録（M-01）の前で会員がまだいない場合の扱いは、`docs/design/auth.md` で定める。
- 認証が必要なルートには `auth:api` ミドルウェアを付ける。利用停止中・メールアドレス未確認の会員は、ミドルウェア（`member.active`）で 403 にする。
- 会員 ID は `$request->user()` から取り、リクエストの本文から受け取らない。

---

## 10. 命名のまとめ

| 対象 | 形式 | 例 |
|---|---|---|
| クラス、インターフェース、enum | PascalCase | `Castle`、`CastleRepository`、`ContributionStatus` |
| インターフェース | 接頭辞・接尾辞（`I`、`Interface`）を付けない | `CastleRepository` |
| enum のケース | PascalCase | `ContributionStatus::Pending` |
| メソッド、変数、プロパティ | camelCase | `findById`、`$visitedOn` |
| 定数 | UPPER_SNAKE_CASE | `MAX_MEMO_LENGTH` |
| 真偽値を返すメソッド | `is`、`has`、`can` で始める | `isPublic()`、`canReviewContributions()` |
| ドメインの例外 | 起きたこと＋`Exception` | `VisitDateInFutureException` |
| ユースケース | 動詞＋対象＋`UseCase` | `ApproveContributionUseCase` |
| ユースケースの入力 | ユースケース名＋`Input` | `RegisterVisitInput` |
| 参照用のクエリ | 対象＋`Query` | `CastleQuery` |
| コントローラー | 対象（単数）＋`Controller` | `VisitController`、`Admin\CastleController` |
| FormRequest | 操作＋対象＋`Request` | `StoreVisitRequest`、`ApproveContributionRequest` |
| API Resource | 対象＋`Resource` | `VisitResource` |
| Policy | 対象＋`Policy` | `VisitPolicy` |
| イベント | 対象＋過去分詞 | `ContributionApproved` |
| リスナー | 行う処理（動詞から始める） | `SendContributionReviewedNotification` |
| 通知 | 内容＋`Notification` | `ContributionReviewedNotification` |
| Eloquent モデル | 集約名（単数）。エンティティと一緒に使う場合は `<集約>Model` の別名で import する | `Castle` |
| リポジトリの実装 | `Eloquent`＋集約＋`Repository` | `EloquentCastleRepository` |

- `Service` で終わる名前のクラスは作らない（`App\Providers` の ServiceProvider を除く）。ドメインサービスも役割を表す名前にする（5.4）。
- ドメインの用語（城、武将、ゆかりなど）の英語名は `docs/glossary.md` に従い、フロントエンドと同じ単語を使う。

---

## 11. テスト（Pest）

### 11.1 構成

```
tests/
├── Unit/
│   └── Domain/            # ドメイン層。app/Domain と同じ構成にする（必須）
├── Feature/               # API のエンドポイント。ユースケース、クエリ、Policy もここで確認する（データベースを使う）
└── Architecture/          # 依存の向きなどの検査（4.3）
```

ユースケースは Laravel の機能（トランザクション、Gate、イベント）を使うため、Unit テストではなく、エンドポイントを通した Feature テストで確認します。

### 11.2 書き方

- テストは `php artisan make:test --pest`（Unit テストは `--unit` を付ける）で作る。
- テスト名は**日本語**で書く。`describe` に対象のクラス、`it` に確認する振る舞いを書く。
- Feature テストのうち、受け入れ基準に対応するものは、テスト名の先頭に AC の ID を付ける（`docs/testing.md` の対応表と結びつけるため）。
- 1つのテストでは1つのことを確認する。

```php
describe('VisitDate', function () {
    it('今日の日付で作成できる', function () {
        // ...
    });

    it('未来の日付では作成できない', function () {
        expect(fn () => new VisitDate(/* 明日 */, /* 今日 */))
            ->toThrow(VisitDateInFutureException::class);
    });
});
```

```php
it('AC-11-2: 未ログインでは訪問記録を登録できない', function () {
    $this->postJson('/api/visits', [/* ... */])->assertUnauthorized();
});

it('AC-11-5: 他人の訪問記録は編集できない', function () {
    $visit = Visit::factory()->create();

    $this->actingAs(authenticatedMember(), 'api')
        ->putJson("/api/visits/{$visit->id}", [/* ... */])
        ->assertNotFound();
});
```

### 11.3 ルール

- ドメイン層のクラスには、必ず Unit テストを書く。正常な場合に加え、境界値と業務ルール違反の場合を確認する。
- Unit テストではデータベースと Laravel の機能を使わない。
- Feature テストでは `RefreshDatabase` を使い、テスト用のデータベースで実行する。テストデータは Factory で作る。
- 認証は `$this->actingAs($member, 'api')` で置き換え、任意の会員としてリクエストする。`AuthenticatedMember` を作るヘルパーを `tests/Pest.php` に用意する。JWT の検証そのもののテストだけ、`Http::fake()` で JWKS を差し替えて行う。
- 外部との接続は Laravel の fake で置き換える（`Storage::fake('images')`、`Notification::fake()`、`Event::fake()`、`Queue::fake()`）。
- 現在時刻に依存する処理は、`$this->travelTo()` で時刻を固定する。

---

## 12. セキュリティ

- 生の SQL に値を文字列で埋め込まない。クエリビルダか、プレースホルダを使う。
- アクセストークン、パスワード、メールアドレスなどの個人情報をログや Sentry に送らない。
- アップロードされた画像は、保存前に Exif を削除し、ファイル名を UUID にする（`architecture.md` 7.2）。
- 公開プロフィールが非公開の会員の情報や、他人の非公開データを返していないかを、Feature テストで確認する。
- 秘密情報をコードに直接書かない。`.env.example` には変数名だけを書き、値は空にする（憲章 8.6）。

---

## 13. ログ

- ログは標準出力に出す（`architecture.md` 8章）。
- ドメイン層ではログを書かない。ほかの層では `Log` ファサードを使ってよい。
- ログのレベルと出力する項目の詳細は `docs/ops/monitoring.md` で定める。

---

## 14. コメントと PHPDoc

- コメントは日本語で書き、**なぜそうしているか**を書く。
- PHPDoc は、型宣言で表せない情報（配列の中身の型、投げる例外など）がある場合にだけ書く。型宣言と同じ内容を繰り返さない。
- 後で対応する作業は、Linear の Issue を作ったうえで `// TODO(TAK-123): 内容` の形で書く。

---

## 15. AI エージェントに実装させるときのチェック

AI が書いたコードは、マージ前に次を確認します（憲章 8.4）。

- [ ] ドメイン層で Laravel の機能（ファサード、`now()`、Eloquent）を使っていない（アーキテクチャテストが通る）。
- [ ] ユースケースとコントローラーで Eloquent モデルを直接使っていない（参照用のクエリと API Resource を除く）。
- [ ] Laravel の機能で済むところに、自前のラッパーや `Service` クラスを作っていない。
- [ ] コントローラーに業務のロジックが入っていない。
- [ ] 権限の確認が抜けていない（ユースケースの `Gate::authorize()`、ルートの `can:`）。会員 ID をリクエストの本文から受け取っていない。
- [ ] 一覧で N+1 が起きていない（`with()` で先に読み込んでいる）。
- [ ] ドメイン層のクラスに Unit テストがある。
- [ ] `design/data-model.md`、`openapi.yaml` と実装が一致している。
- [ ] 自分でコードの動きを説明できる。

---

## 改訂履歴

| バージョン | 日付 | 内容 |
|---|---|---|
| 1.0 | 2026-10-05 | 初版作成 |