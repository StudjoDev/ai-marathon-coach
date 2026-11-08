import { useState, type FormEvent } from "react";
import { ChevronLeft } from "lucide-react";
import { useStore } from "../data/store";
import { href, navigate } from "../router";
import { PrimaryButton } from "./ui";

/** 登入頁。asGate 為 true 時是直接擋在編輯頁前面，登入後原頁面會自動顯示 */
export function SignIn({ asGate = false }: { asGate?: boolean }) {
  const { signIn } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate(href.list(), { replace: true });
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    const signInError = await signIn(email.trim(), password);
    setBusy(false);
    setError(signInError);
    if (!signInError && !asGate) goBack();
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col bg-ink px-5 pb-[calc(env(safe-area-inset-bottom)+32px)] pt-[calc(env(safe-area-inset-top)+20px)] text-white">
      <button
        type="button"
        onClick={goBack}
        className="focus-ring -ml-1.5 flex min-h-11 items-center gap-0.5 self-start rounded-md pr-2 text-base text-white"
      >
        <ChevronLeft className="h-[22px] w-[22px]" aria-hidden="true" />
        先不登入
      </button>

      <p className="mt-10 font-display text-xl font-extrabold tracking-[2px]">RACES</p>
      <h1 className="mt-6 text-[34px] font-black leading-tight">登入以編輯</h1>
      <p className="mt-2 text-[15px] text-muted-dark">不用登入也能瀏覽。登入後可以新增賽事、改備忘、勾清單、填成績。</p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4">
        <label className="block">
          <span className="mb-2 block text-[13px] font-bold text-muted-dark">Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring min-h-12 w-full rounded-xl border border-line-dark bg-transparent px-3.5 text-base text-white"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[13px] font-bold text-muted-dark">密碼</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-ring min-h-12 w-full rounded-xl border border-line-dark bg-transparent px-3.5 text-base text-white"
          />
        </label>
        {error ? (
          <p role="alert" className="text-[15px] font-bold text-accent">
            {error}
          </p>
        ) : null}
        <div className="mt-4">
          <PrimaryButton type="submit" disabled={busy}>
            {busy ? "登入中…" : "登入"}
          </PrimaryButton>
        </div>
      </form>
    </main>
  );
}
