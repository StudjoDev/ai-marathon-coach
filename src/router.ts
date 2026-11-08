import { useEffect, useState } from "react";

export type Route =
  | { name: "list" }
  | { name: "race"; id: string }
  | { name: "record"; id: string }
  | { name: "edit"; id: string }
  | { name: "new" };

export function parseRoute(hash: string): Route {
  const [, page, id, action] = hash.replace(/^#/, "").split("/");
  if (page === "new") return { name: "new" };
  if (page === "race" && id) {
    const raceId = decodeURIComponent(id);
    if (action === "record") return { name: "record", id: raceId };
    if (action === "edit") return { name: "edit", id: raceId };
    return { name: "race", id: raceId };
  }
  return { name: "list" };
}

export const href = {
  list: () => "#/",
  race: (id: string) => `#/race/${encodeURIComponent(id)}`,
  record: (id: string) => `#/race/${encodeURIComponent(id)}/record`,
  edit: (id: string) => `#/race/${encodeURIComponent(id)}/edit`,
  new: () => "#/new"
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
