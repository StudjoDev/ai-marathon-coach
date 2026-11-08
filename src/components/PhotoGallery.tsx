import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { groupByOwner, shortTime, usePhotos, type Photo } from "../data/photos";
import { href } from "../router";
import type { Race } from "../types";
import { Page, cn } from "./ui";
import { PhotoViewer } from "./PhotoViewer";

type MatchFilter = "exact" | "maybe" | "all";

const matchLabels: Record<MatchFilter, string> = { exact: "確定是你", maybe: "可能是", all: "全部" };

export function PhotoGallery({ race, initialPhoto }: { race: Race; initialPhoto?: string }) {
  const set = usePhotos(race.id);
  const [bib, setBib] = useState("all");
  const [match, setMatch] = useState<MatchFilter>("all");
  const [openKey, setOpenKey] = useState<string>();
  const pushedHistory = useRef(false);
  const initialHandled = useRef(false);

  // 有「可能是」的照片時，預設只看確定是你的
  useEffect(() => {
    if (set && set.maybeCount > 0 && set.exactCount > 0 && !initialPhoto) setMatch("exact");
  }, [set, initialPhoto]);

  const visible = useMemo(() => {
    if (!set) return [];
    return set.photos.filter(
      (photo) =>
        (bib === "all" || photo.bib === bib) &&
        (match === "all" || (match === "exact" ? photo.exact : !photo.exact))
    );
  }, [set, bib, match]);

  const groups = useMemo(() => groupByOwner(visible), [visible]);

  const openPhoto = useCallback((photo: Photo) => {
    setOpenKey(photo.key);
    if (!pushedHistory.current) {
      window.history.pushState({ photoViewer: true }, "");
      pushedHistory.current = true;
    }
  }, []);

  const closeViewer = useCallback(() => {
    if (pushedHistory.current) {
      window.history.back();
    } else {
      setOpenKey(undefined);
    }
  }, []);

  // 手機返回鍵：關閉大圖而不是離開頁面
  useEffect(() => {
    const onPop = () => {
      pushedHistory.current = false;
      setOpenKey(undefined);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // 從完賽紀錄頁點某張照片進來：直接打開那張
  useEffect(() => {
    if (!set || !initialPhoto || initialHandled.current) return;
    initialHandled.current = true;
    const photo = set.photos.find((item) => item.key === initialPhoto);
    window.history.replaceState(null, "", href.photos(race.id));
    if (photo) openPhoto(photo);
  }, [set, initialPhoto, race.id, openPhoto]);

  const openIndex = openKey ? visible.findIndex((photo) => photo.key === openKey) : -1;
  const viewerList = openIndex >= 0 ? visible : set?.photos ?? [];
  const viewerIndex = openIndex >= 0 ? openIndex : viewerList.findIndex((photo) => photo.key === openKey);

  return (
    <Page>
      <section aria-labelledby="gallery-title" className="flex flex-col bg-ink px-5 pb-6 pt-[calc(env(safe-area-inset-top)+20px)] text-white">
        <a href={href.record(race.id)} className="focus-ring -ml-1.5 flex min-h-11 items-center gap-0.5 self-start rounded-md pr-2 text-base text-white">
          <ChevronLeft className="h-[22px] w-[22px]" aria-hidden="true" />
          完賽紀錄
        </a>
        <p className="mt-5 font-display text-base font-bold tracking-[1.5px] text-accent">PHOTOS · {race.shortName}</p>
        <h1 id="gallery-title" className="mt-1 flex items-baseline gap-2 font-display font-extrabold italic leading-[0.95]">
          <span className="text-[72px] tracking-[-2px]">{set ? visible.length : "—"}</span>
          <span className="text-[22px] text-muted-dark">張照片</span>
        </h1>
      </section>

      {set && (set.bibs.length > 1 || set.maybeCount > 0) ? (
        <div className="sticky top-0 z-10 flex flex-col gap-2.5 border-b border-line bg-paper/95 px-5 pb-3 pt-3.5 backdrop-blur">
          {set.bibs.length > 1 ? (
            <div role="group" aria-label="號碼布" className="flex gap-2 overflow-x-auto">
              {["all", ...set.bibs].map((value) => (
                <Chip key={value} active={bib === value} onClick={() => setBib(value)}>
                  {value === "all" ? "全部號碼" : value} · {countFor(set.photos, value, match)}
                </Chip>
              ))}
            </div>
          ) : null}
          {set.maybeCount > 0 ? (
            <div role="group" aria-label="辨識結果" className="flex gap-2">
              {(Object.keys(matchLabels) as MatchFilter[]).map((value) => (
                <Chip key={value} active={match === value} onClick={() => setMatch(value)}>
                  {matchLabels[value]}
                </Chip>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {set === undefined ? (
        <p className="px-5 py-10 text-[15px] text-muted" role="status">
          照片載入中…
        </p>
      ) : set === null ? (
        <p className="px-5 py-10 text-[15px] text-muted">這場還沒有照片。</p>
      ) : visible.length === 0 ? (
        <p className="px-5 py-10 text-[15px] text-muted">這個條件下沒有照片。</p>
      ) : (
        <div className="flex flex-col pt-2">
          {groups.map((group) => (
            <section key={`${group.siteName}:${group.owner}`} aria-label={`${group.owner} 拍攝的照片`}>
              <h2 className="flex items-baseline justify-between gap-3 px-5 pb-2 pt-4">
                <span className="font-display text-xl font-extrabold tabular-nums">
                  {shortTime(group.start)}
                  {group.end !== group.start && /^\d/.test(group.end) ? `–${shortTime(group.end)}` : ""}
                </span>
                <span className="truncate text-[13px] font-medium text-muted">
                  {group.owner} · {group.siteName} · {group.photos.length} 張
                </span>
              </h2>
              <div className="grid grid-cols-3 gap-0.5">
                {group.photos.map((photo) => (
                  <button
                    key={photo.key}
                    type="button"
                    onClick={() => openPhoto(photo)}
                    aria-label={`放大照片，${photo.owner} ${shortTime(photo.time)}`}
                    className="focus-ring relative aspect-square bg-soft"
                  >
                    <img
                      src={photo.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    {!photo.exact ? (
                      <span className="absolute left-1.5 top-1.5 rounded-md bg-white px-1.5 py-0.5 text-[11px] font-bold text-ink">
                        可能是
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {set ? (
        <p className="px-5 pb-[calc(env(safe-area-inset-bottom)+40px)] pt-6 text-[13px] leading-relaxed text-muted">
          照片來自 {set.siteNames.join("、")}，依號碼布搜尋。預覽圖有浮水印，原圖需到平台購買。
        </p>
      ) : null}

      {openKey && viewerIndex >= 0 ? (
        <PhotoViewer
          photos={viewerList}
          index={viewerIndex}
          onIndexChange={(next) => setOpenKey(viewerList[next].key)}
          onClose={closeViewer}
        />
      ) : null}
    </Page>
  );
}

function countFor(photos: Photo[], bib: string, match: MatchFilter) {
  return photos.filter(
    (photo) => (bib === "all" || photo.bib === bib) && (match === "all" || (match === "exact" ? photo.exact : !photo.exact))
  ).length;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "focus-ring min-h-10 shrink-0 whitespace-nowrap rounded-full px-3.5 text-sm",
        active ? "bg-ink font-bold text-white" : "bg-soft font-medium text-ink"
      )}
    >
      {children}
    </button>
  );
}
