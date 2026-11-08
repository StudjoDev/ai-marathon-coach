import { RaceEditor } from "./components/RaceEditor";
import { RaceList } from "./components/RaceList";
import { RaceMemo } from "./components/RaceMemo";
import { RaceRecord } from "./components/RaceRecord";
import { PhotoGallery } from "./components/PhotoGallery";
import { SignIn } from "./components/SignIn";
import { href } from "./router";
import { StoreProvider, useStore } from "./data/store";
import { useRoute } from "./router";

export default function App() {
  return (
    <StoreProvider>
      <Screens />
    </StoreProvider>
  );
}

function Screens() {
  const { authReady, canEdit, status, error, races } = useStore();
  const route = useRoute();

  if (!authReady) return <Loading />;
  if (route.name === "login") return <SignIn />;
  if (status === "loading") return <Loading />;
  if (status === "error") return <Message title="無法連到後台" body={error ?? "請稍後再試。"} />;

  if (route.name === "new") return canEdit ? <RaceEditor /> : <SignIn asGate />;
  if (route.name === "list") return <RaceList />;

  const race = races.find((item) => item.id === route.id);
  if (!race) return <Message title="找不到這場賽事" body="可能已被刪除。" />;

  switch (route.name) {
    case "record":
      return <RaceRecord key={race.id} race={race} />;
    case "photos":
      return <PhotoGallery key={race.id} race={race} initialPhoto={route.photo} />;
    case "edit":
      return canEdit ? <RaceEditor key={race.id} race={race} /> : <SignIn asGate />;
    case "race":
    default:
      return <RaceMemo key={race.id} race={race} />;
  }
}

function Loading() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-ink">
      <p className="font-display text-xl font-extrabold tracking-[2px] text-muted-dark" role="status">
        LOADING…
      </p>
    </main>
  );
}

function Message({ title, body }: { title: string; body: string }) {
  return (
    <main className="mx-auto flex min-h-svh max-w-[480px] flex-col justify-center bg-paper px-5">
      <h1 className="text-[28px] font-black">{title}</h1>
      <p className="mt-2 text-[15px] text-muted">{body}</p>
      <a href={href.list()} className="focus-ring mt-6 self-start rounded text-[15px] font-bold text-accent-ink">
        回賽事列表
      </a>
    </main>
  );
}
