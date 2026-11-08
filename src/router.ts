import { useEffect, useState } from "react";

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

export function useRoute() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onChange = () => {
      setRoute(parseRoute(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}
