import { useStore } from "../data/store";
import { appMeta } from "../data/appMeta";
import { cn } from "./ui";

const syncLabels = {
  synced: "已同步",
  saving: "儲存中…",
  offline: "同步失敗，連線後會重試"
} as const;

export function SyncFooter() {
  const { mode, sync, session, signOut } = useStore();

  return (
    <footer className="border-t border-line px-5 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-5 text-[13px] text-muted">
      {mode === "cloud" ? (
        <div className="flex items-center justify-between gap-3">
          <p className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden="true"
              className={cn("h-2 w-2 shrink-0 rounded-full", sync === "offline" ? "bg-accent" : "bg-[#1F9D55]")}
            />
            <span className="truncate">
              {syncLabels[sync]} · {session?.user.email}
            </span>
          </p>
          <button type="button" onClick={signOut} className="focus-ring min-h-11 shrink-0 rounded-md px-1 font-bold text-ink">
            登出
          </button>
        </div>
      ) : (
        <p>本機模式：資料只存在這台裝置。</p>
      )}
      <p className="mt-1">版本 {appMeta.version}</p>
    </footer>
  );
}
