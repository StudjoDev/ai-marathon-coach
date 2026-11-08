import { ArrowRight } from "lucide-react";
import { usePhotos } from "../data/photos";
import { href } from "../router";

const PREVIEW_COUNT = 5;

/** 完賽紀錄頁的照片區：前幾張縮圖＋看全部 */
export function PhotoPreview({ raceId }: { raceId: string }) {
  const set = usePhotos(raceId);
  if (set === null) return null;

  const preview = set ? [...set.photos.filter((p) => p.exact), ...set.photos.filter((p) => !p.exact)].slice(0, PREVIEW_COUNT) : [];
  const rest = set ? set.photos.length - preview.length : 0;

  return (
    <section aria-labelledby="photos-title" className="mt-9 flex flex-col">
      <h2 id="photos-title" className="flex items-baseline justify-between">
        <span className="text-xl font-black">賽事照片</span>
        <span className="font-display text-base font-bold tracking-[1px] text-muted">
          PHOTOS{set ? ` · ${set.photos.length}` : ""}
        </span>
      </h2>
      <p className="mb-3.5 mt-1.5 text-[13px] text-muted">
        {set
          ? [
              set.maybeCount > 0 ? `確定是你 ${set.exactCount} 張 · 可能是 ${set.maybeCount} 張` : `共 ${set.photos.length} 張`,
              set.siteNames.join("、")
            ].join(" · ")
          : "載入中…"}
      </p>

      <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-[14px]">
        {set
          ? preview.map((photo, index) => (
              <a
                key={photo.key}
                href={href.photos(raceId, photo.key)}
                aria-label={`照片 ${index + 1}，攝影師 ${photo.owner}`}
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
              </a>
            ))
          : Array.from({ length: 6 }, (_, index) => <div key={index} className="aspect-square animate-pulse bg-soft" />)}
        {set && rest > 0 ? (
          <a
            href={href.photos(raceId)}
            aria-label={`看全部 ${set.photos.length} 張照片`}
            className="focus-ring flex aspect-square items-center justify-center bg-ink font-display text-[30px] font-extrabold italic text-white"
          >
            +{rest}
          </a>
        ) : null}
      </div>

      {set ? (
        <a
          href={href.photos(raceId)}
          className="focus-ring mt-3.5 flex min-h-[52px] items-center justify-between rounded-full bg-ink px-5 text-base font-bold text-white"
        >
          看全部照片
          <ArrowRight className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
        </a>
      ) : null}
    </section>
  );
}
