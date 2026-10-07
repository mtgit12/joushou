# テストの書き方の例

`user-event` と `jest-dom` を使わない前提の書き方です。例の `visit`（訪問記録）は説明用で、実際のファイル名・文言・SC の ID は仕様書と実装に合わせてください。

## 目次

1. [jest-dom を使わない確認の書き方](#1-jest-dom-を使わない確認の書き方)
2. [zod スキーマ](#2-zod-スキーマ)
3. [ユーティリティ関数](#3-ユーティリティ関数)
4. [クライアントコンポーネント（フォーム）](#4-クライアントコンポーネントフォーム)
5. [カスタムフック](#5-カスタムフック)
6. [モック](#6-モック)
7. [日付・時刻に依存するテスト](#7-日付時刻に依存するテスト)

---

## 1. jest-dom を使わない確認の書き方

| 確かめたいこと | 書き方 |
|---|---|
| 表示されている | `expect(screen.getByRole("alert")).toBeTruthy()`（`getBy*` は見つからないと例外を投げる） |
| 表示されていない | `expect(screen.queryByRole("alert")).toBeNull()` |
| あとから表示される | `expect(await screen.findByText("…")).toBeTruthy()` |
| 文言 | `expect(screen.getByRole("alert").textContent).toBe("…")` |
| 押せない | `expect(screen.getByRole("button", { name: "登録する" })).toHaveProperty("disabled", true)` |
| 入力値 | `expect(screen.getByLabelText("メモ")).toHaveProperty("value", "…")` |
| 属性（a11y） | `expect(input.getAttribute("aria-invalid")).toBe("true")` |
| エラーと入力欄の結びつき | `input.getAttribute("aria-describedby")` の ID の要素の `textContent` を確かめる |

`toHaveProperty` を使うと、`as HTMLButtonElement` のような型アサーションを書かずに済みます。

## 2. zod スキーマ

仕様書 3章の制約を、**ちょうどの値**と**1つ外の値**の組で確かめます。正しい入力の基本形を1つ作り、確かめたい項目だけを上書きすると、何を確かめているテストかが読みやすくなります。

```ts
// features/visit/schemas.test.ts
import { describe, expect, it } from "vitest";
import { visitSchema } from "./schemas";

const validInput = {
  castleId: "1",
  visitedOn: "2026-10-01",
  memo: "",
};

describe("visitSchema", () => {
  it("正しい入力を受け付ける", () => {
    const result = visitSchema.safeParse(validInput);

    expect(result.success).toBe(true);
  });

  it("メモが500文字のときは受け付ける", () => {
    const result = visitSchema.safeParse({ ...validInput, memo: "あ".repeat(500) });

    expect(result.success).toBe(true);
  });

  it("メモが501文字のときは、文字数のエラーにする", () => {
    const result = visitSchema.safeParse({ ...validInput, memo: "あ".repeat(501) });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toContain(
      "メモは500文字以内で入力してください",
    );
  });
});
```

- エラーは `success` が `false` であることに加え、**メッセージ**も確かめる。別の理由で失敗していても通ってしまうのを防ぐため。メッセージは `docs/design/errors.md` と仕様書に合わせる。
- 同じ形のテストが多い場合は `it.each` を使ってよい。ただしテスト名は `it.each(...)("メモが%i文字のときは…")` のように、何を確かめたかが読める形にする。

## 3. ユーティリティ関数

入力と期待する出力の組を、仕様書の言葉で書きます。

```ts
// lib/utils/formatVisitRate.test.ts
import { describe, expect, it } from "vitest";
import { formatVisitRate } from "./formatVisitRate";

describe("formatVisitRate", () => {
  it("訪問城数が0のときは、0% と表示する", () => {
    expect(formatVisitRate(0, 100)).toBe("0%");
  });
});
```

## 4. クライアントコンポーネント（フォーム）

```tsx
// features/visit/components/VisitForm.test.tsx
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createVisit } from "@/features/visit/actions";
import { VisitForm } from "./VisitForm";

// Server Actions は "server-only" を含む lib/api を読み込むため、必ず置き換える
vi.mock("@/features/visit/actions", () => ({
  createVisit: vi.fn(),
}));

afterEach(cleanup);

beforeEach(() => {
  vi.mocked(createVisit).mockReset();
});

describe("VisitForm", () => {
  it("SC-008-02 訪問日を空にして送信すると、エラーメッセージを表示する", async () => {
    render(<VisitForm castleId="1" />);

    fireEvent.change(screen.getByLabelText("訪問日"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));

    expect(await screen.findByText("訪問日を入力してください")).toBeTruthy();
    expect(createVisit).not.toHaveBeenCalled();
  });

  it("SC-008-01 正しく入力して送信すると、入力した内容で登録する", async () => {
    vi.mocked(createVisit).mockResolvedValue({ ok: true, data: undefined });
    render(<VisitForm castleId="1" />);

    fireEvent.change(screen.getByLabelText("訪問日"), { target: { value: "2026-10-01" } });
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));

    await vi.waitFor(() => {
      expect(createVisit).toHaveBeenCalledWith(
        expect.objectContaining({ castleId: "1", visitedOn: "2026-10-01" }),
      );
    });
  });

  it("Server Actions が入力エラーを返したとき、該当する入力欄にエラーを表示する", async () => {
    vi.mocked(createVisit).mockResolvedValue({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "入力内容を確認してください",
        fieldErrors: { visitedOn: ["未来の日付は登録できません"] },
      },
    });
    render(<VisitForm castleId="1" />);

    fireEvent.change(screen.getByLabelText("訪問日"), { target: { value: "2026-10-01" } });
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));

    expect(await screen.findByText("未来の日付は登録できません")).toBeTruthy();
    expect(screen.getByLabelText("訪問日").getAttribute("aria-invalid")).toBe("true");
  });

  it("送信中は、登録ボタンを押せない", async () => {
    // 解決しない Promise で「送信中」の状態を保つ
    vi.mocked(createVisit).mockReturnValue(new Promise(() => {}));
    render(<VisitForm castleId="1" />);

    fireEvent.change(screen.getByLabelText("訪問日"), { target: { value: "2026-10-01" } });
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));

    await vi.waitFor(() => {
      expect(screen.getByRole("button", { name: /登録/ })).toHaveProperty("disabled", true);
    });
  });
});
```

`fireEvent` を使うときの注意：

- react-hook-form の検証と送信は非同期に進む。送信後の結果は `findBy*` か `vi.waitFor` で待つ。`getBy*` ですぐ確かめると、まだ表示されていなくて失敗する。
- `fireEvent.change` は値を入れる `change` イベントだけを起こす。フォームが `mode: "onBlur"` などで検証する場合は、`fireEvent.blur` も起こす。
- `fireEvent.click` は、無効化されたボタンにもイベントを送れてしまう。「押せない」ことは、クリックの結果ではなく `disabled` プロパティで確かめる。
- ボタンの名前が送信中に変わる（「登録する」→「登録中…」）場合は、正規表現や変化後の名前で探す。

## 5. カスタムフック

```ts
// features/visit/hooks/useVisitDraft.test.ts
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useVisitDraft } from "./useVisitDraft";

describe("useVisitDraft", () => {
  it("メモを更新すると、下書きに反映する", () => {
    const { result } = renderHook(() => useVisitDraft());

    act(() => {
      result.current.updateMemo("天守からの眺めが良かった");
    });

    expect(result.current.draft.memo).toBe("天守からの眺めが良かった");
  });
});
```

zustand のストアを使うテストは、テストどうしで状態が残らないよう、`beforeEach` で初期状態に戻します（`useMapStore.setState(初期状態)`）。

## 6. モック

| 置き換えるもの | 理由 | 書き方 |
|---|---|---|
| Server Actions（`features/*/actions.ts`） | `lib/api/` 経由で `server-only` を読み込むため。結果（`ActionResult`）を自由に変えたいため | 4章の例 |
| `lib/api/` | `server-only` を含むため | `vi.mock("@/lib/api/…", () => ({ … }))` |
| `next/navigation` | jsdom には Next.js のルーターがないため | 下記 |

```tsx
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(() => "/castles"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

it("登録に成功すると、城の詳細画面へ移動する", async () => {
  const push = vi.fn();
  vi.mocked(useRouter).mockReturnValue({
    push,
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  });
  // …
  await vi.waitFor(() => expect(push).toHaveBeenCalledWith("/castles/1"));
});
```

- `useRouter` の戻り値の型はバージョンで変わることがある。型エラーが出たら `node_modules/next/dist/` の型定義を確認し、必要なメソッドをそろえる（`as` でごまかさない）。
- モックしたい関数をテストの中で参照するときは、上の例のように対象のモジュールから import して `vi.mocked()` で包む。`vi.mock` の中で外の変数を使いたい場合は `vi.hoisted` を使う（`vi.mock` はファイルの先頭に巻き上げられるため）。
- 受け入れ基準は「利用者から見て何が起きるか」なので、モックの呼ばれ方だけでなく、画面に出た結果も確かめる。

## 7. 日付・時刻に依存するテスト

「今日以前」「初期値は今日」のような仕様は、実行する日によって結果が変わらないよう、時刻を固定します。

```ts
beforeEach(() => {
  // Date だけを固定する。タイマーまで偽物にすると findBy* の待ち時間が進まず止まるため
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-07T09:00:00+09:00"));
});

afterEach(() => {
  vi.useRealTimers();
});
```

仕様が「日本時間」で決まっている場合は、日付の変わり目（`2026-10-07T23:59:59+09:00` と `2026-10-08T00:00:00+09:00`）も境界値として確かめます。
