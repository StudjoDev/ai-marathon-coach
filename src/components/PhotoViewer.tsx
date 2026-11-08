import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { shortTime, type Photo } from "../data/photos";

const SWIPE_THRESHOLD_PX = 50;

export function PhotoViewer({
  photos,
  index,
  onIndexChange,
  onClose
}: {
  photos: Photo[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index];
  const touchStartX = useRef<number | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;

  const go = (step: number) => {
    const next = index + step;
    if (next >= 0 && next < photos.length) onIndexChange(next);
  };

  // 鎖住背景捲動、聚焦關閉鈕
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // 鍵盤：左右切換、Esc 關閉
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // 預先載入前後一張
  useEffect(() => {
    [photos[index - 1], photos[index + 1]].forEach((neighbor) => {
      if (!neighbor) return;
      const image = new Image();
      image.referrerPolicy = "no-referrer";
      image.src = neighbor.src;
    });
  }, [photos, index]);

  if (!photo) return null;

  // 掛到 body：避免頁面進場動畫的 transform 讓 fixed 圖層跟著頁面捲動
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="照片大圖"
      className="fixed inset-0 z-50 flex flex-col bg-ink pb-[calc(env(safe-area-inset-bottom)+24px)] pt-[calc(env(safe-area-inset-top)+12px)] text-white"
    >
      <div className="mx-auto flex w-full max-w-[480px] items-center justify-between px-3">
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          aria-label="關閉"
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-full"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
        <p className="font-display text-xl font-bold tabular-nums tracking-[1px]" aria-live="polite">
          {index + 1} <span className="text-muted-dark">/ {photos.length}</span>
        </p>
        <span className="w-11" />
      </div>

      <div
        className="relative mt-4 flex min-h-0 flex-1 items-center justify-center"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const delta = event.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(delta) > SWIPE_THRESHOLD_PX) go(delta < 0 ? 1 : -1);
        }}
      >
        <img
          key={photo.key}
          src={photo.src}
          alt={`${photo.owner} 拍攝的照片，${shortTime(photo.time)}`}
          referrerPolicy="no-referrer"
          className="max-h-full w-full max-w-[960px] select-none object-contain"
          draggable={false}
        />
        {hasPrev ? (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="上一張"
            className="focus-ring absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/55"
          >
            <ChevronLeft className="h-[22px] w-[22px]" aria-hidden="true" />
          </button>
        ) : null}
        {hasNext ? (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="下一張"
            className="focus-ring absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/55"
          >
            <ChevronRight className="h-[22px] w-[22px]" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="mx-auto w-full max-w-[480px] px-5">
        <dl className="mt-6 grid grid-cols-3 border-t border-line-dark pt-4">
          <div className="min-w-0">
            <dt className="text-xs text-muted-dark">拍攝時間</dt>
            <dd className="mt-0.5 font-display text-[28px] font-bold tabular-nums">{shortTime(photo.time)}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs text-muted-dark">號碼布</dt>
            <dd className="mt-0.5 font-display text-[28px] font-bold tabular-nums">{photo.bib}</dd>
          </div>
          {photo.price ? (
            <div className="min-w-0">
              <dt className="text-xs text-muted-dark">原圖</dt>
              <dd className="mt-0.5 font-display text-[28px] font-bold">NT${photo.price}</dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-3 text-sm text-[#D4D4D4]">
          攝影師 {photo.owner} · {photo.siteName} · {photo.exact ? "確定是你" : "可能是"}
        </p>

        <a
          href={photo.buyUrl}
          target="_blank"
          rel="noreferrer"
          className="focus-ring mt-5 flex min-h-[54px] items-center justify-between rounded-full bg-accent px-5 text-base font-extrabold text-ink"
        >
          到 {photo.siteName} 購買原圖
          <ArrowUpRight className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
        </a>
        <p className="mt-2.5 text-center text-xs text-muted-dark">
          左右滑動切換照片{photo.buyNote ? ` · ${photo.buyNote}` : ""}
        </p>
      </div>
    </div>,
    document.body
  );
}
