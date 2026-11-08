import { useEffect, useLayoutEffect, useState } from "react";

export type Route =
  | { name: "list" }
  | { name: "race"; id: string }
  | { name: "record"; id: string }
  | { name: "edit"; id: string }
  | { name: "photos"; id: string; photo?: string }
  | { name: "new" }
  | { name: "login" };

export function parseRoute(hash: string): Route {
  const [, page, id, action, extra] = hash.replace(/^#/, "").split("/");
  if (page === "new") return { name: "new" };
  if (page === "login") return { name: "login" };
  if (page === "race" && id) {
    const raceId = decodeURIComponent(id);
    if (action === "record") return { name: "record", id: raceId };
    if (action === "edit") return { name: "edit", id: raceId };
    if (action === "photos") return { name: "photos", id: raceId, photo: extra ? decodeURIComponent(extra) : undefined };
    return { name: "race", id: raceId };
  }
  return { name: "list" };
}

export const href = {
  list: () => "#/",
  race: (id: string) => `#/race/${encodeURIComponent(id)}`,
  record: (id: string) => `#/race/${encodeURIComponent(id)}/record`,
  edit: (id: string) => `#/race/${encodeURIComponent(id)}/edit`,
  photos: (id: string, photo?: string) =>
    `#/race/${encodeURIComponent(id)}/photos${photo ? `/${encodeURIComponent(photo)}` : ""}`,
  new: () => "#/new",
  login: () => "#/login"
};

export function navigate(to: string, { replace = false } = {}) {
  if (replace) {
    window.location.replace(to);
  } else {
    window.location.hash = to;
  }
}

// 每個網址離開時的捲動位置；回到上層時還原，往下一層走時回到頂端
const scrollPositions = new Map<string, number>();
let pendingScroll = 0;

function normalizeHash(hash: string) {
  return hash && hash !== "#" ? hash : "#/";
}

/** 頁面層級：列表 0、賽事 1、紀錄/編輯/照片 2、單張照片 3 */
function depthOf(hash: string) {
  const segments = normalizeHash(hash).replace(/^#\/?/, "").split("/").filter(Boolean);
  if (segments.length === 0) return 0;
  if (segments[0] !== "race") return 1;
  // 照片頁是完賽紀錄的下一層
  return segments.length - 1 + (segments[2] === "photos" ? 1 : 0);
}

export function useRoute() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

    const onChange = (event: HashChangeEvent) => {
      const oldHash = normalizeHash(new URL(event.oldURL).hash);
      const newHash = normalizeHash(window.location.hash);
      scrollPositions.set(oldHash, window.scrollY);

      // 回到上層（返回鍵或左上角返回）：還原；往下一層或同層：回到頂端
      const goingUp = depthOf(newHash) < depthOf(oldHash);
      pendingScroll = goingUp ? scrollPositions.get(newHash) ?? 0 : 0;
      setRoute(parseRoute(window.location.hash));
    };

    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

/** 換頁畫面繪出前捲到該在的位置 */
export function useScrollRestoration(route: Route) {
  useLayoutEffect(() => {
    window.scrollTo(0, pendingScroll);
  }, [route]);
}
