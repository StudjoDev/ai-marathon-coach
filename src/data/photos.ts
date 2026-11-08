import { useEffect, useState } from "react";

type RawSite = { name: string; img: string; buy: string; buyMaybe?: string; note?: string };
/** [平台, 號碼布, 照片 id, 攝影師, 拍攝時間, 圖片路徑, 確定辨識(1/0), 原圖價格] */
type RawPhoto = [string, string, string, string, string, string, number, number | null];
type RawSet = { sites: Record<string, RawSite>; photos: RawPhoto[]; source: string };

export type Photo = {
  key: string;
  siteName: string;
  bib: string;
  owner: string;
  time: string;
  src: string;
  exact: boolean;
  price?: number;
  buyUrl: string;
  buyNote?: string;
};

export type PhotoGroup = { owner: string; siteName: string; start: string; end: string; photos: Photo[] };

export type PhotoSet = {
  photos: Photo[];
  bibs: string[];
  siteNames: string[];
  exactCount: number;
  maybeCount: number;
};

const loaders = import.meta.glob<RawSet>("./photos/*.json", { import: "default" });
const cache = new Map<string, PhotoSet>();

function loaderFor(raceId: string) {
  return loaders[`./photos/${raceId}.json`];
}

export function hasPhotos(raceId: string) {
  return Boolean(loaderFor(raceId));
}

function timeSortKey(time: string) {
  return /^\d{2}:\d{2}/.test(time) ? time : "99";
}

function normalize(raw: RawSet): PhotoSet {
  const photos = raw.photos
    .map(([site, bib, id, owner, time, path, exact, price]): Photo => {
      const info = raw.sites[site];
      const template = !exact && info.buyMaybe ? info.buyMaybe : info.buy;
      return {
        key: `${site}${id}`,
        siteName: info.name,
        bib,
        owner: owner || "未具名攝影師",
        time,
        src: info.img + path,
        exact: exact === 1,
        price: price ?? undefined,
        buyUrl: template.replace("{bib}", encodeURIComponent(bib)),
        buyNote: info.note
      };
    })
    .sort((a, b) => timeSortKey(a.time).localeCompare(timeSortKey(b.time)) || a.key.localeCompare(b.key));

  return {
    photos,
    bibs: [...new Set(photos.map((photo) => photo.bib))].sort(),
    siteNames: [...new Set(photos.map((photo) => photo.siteName))],
    exactCount: photos.filter((photo) => photo.exact).length,
    maybeCount: photos.filter((photo) => !photo.exact).length
  };
}

export async function loadPhotos(raceId: string) {
  const cached = cache.get(raceId);
  if (cached) return cached;
  const load = loaderFor(raceId);
  if (!load) return null;
  const set = normalize(await load());
  cache.set(raceId, set);
  return set;
}

export function usePhotos(raceId: string) {
  const [set, setSet] = useState<PhotoSet | null | undefined>(() => cache.get(raceId) ?? (hasPhotos(raceId) ? undefined : null));

  useEffect(() => {
    let active = true;
    if (!hasPhotos(raceId)) {
      setSet(null);
      return;
    }
    loadPhotos(raceId).then((loaded) => {
      if (active) setSet(loaded);
    });
    return () => {
      active = false;
    };
  }, [raceId]);

  return set;
}

/** 依攝影師分組，組別依該攝影師第一張照片的時間排序 */
export function groupByOwner(photos: Photo[]): PhotoGroup[] {
  const groups = new Map<string, PhotoGroup>();
  for (const photo of photos) {
    const id = `${photo.siteName}:${photo.owner}`;
    const group = groups.get(id);
    if (group) {
      group.photos.push(photo);
      if (/^\d/.test(photo.time)) group.end = photo.time;
    } else {
      groups.set(id, { owner: photo.owner, siteName: photo.siteName, start: photo.time, end: photo.time, photos: [photo] });
    }
  }
  return [...groups.values()];
}

export function shortTime(time: string) {
  return /^\d{2}:\d{2}/.test(time) ? time.slice(0, 5) : "—";
}
