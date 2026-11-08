import { useState, type FormEvent } from "react";
import { useStore } from "../data/store";
import { PrimaryButton } from "./ui";

export function SignIn() {
  const { signIn } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(await signIn(email.trim(), password));
    setBusy(false);
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col bg-ink px-5 pb-[calc(env(safe-area-inset-bottom)+32px)] pt-[calc(env(safe-area-inset-top)+64px)] text-white">
      <p className="font-display text-xl font-extrabold tracking-[2px]">RACES</p>
      <h1 className="mt-16 text-[34px] font-black leading-tight">賽事備忘</h1>
      <p className="mt-2 text-[15px] text-muted-dark">登入後，兩支手機的賽事與備忘會同步。</p>

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
