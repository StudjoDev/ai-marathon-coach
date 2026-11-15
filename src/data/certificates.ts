/** 完賽證書：檔案放在 public/certificates/<賽事 id>/，原檔供下載，-preview.jpg 供頁面顯示 */
export type Certificate = {
  bib: string;
  name: string;
  /** 證書上的個人（晶片）成績 */
  netTime: string;
  previewUrl: string;
  fileUrl: string;
  downloadName: string;
};

type RawCertificate = { bib: string; name: string; netTime: string; ext: "png" | "jpg" };

const raw: Record<string, { label: string; items: RawCertificate[] }> = {
  "banqiao-marathon-2026-half": {
    label: "板橋馬拉松",
    items: [
      { bib: "30804", name: "許仁杰", netTime: "2:54:29", ext: "png" },
      { bib: "40322", name: "陳惠欣", netTime: "2:34:49", ext: "png" }
    ]
  },
  "marie-claire-pink-run-2026-10k": {
    label: "裙襬澎澎Run",
    items: [
      { bib: "1279", name: "許仁杰", netTime: "1:09:19", ext: "jpg" },
      { bib: "1280", name: "陳惠欣", netTime: "1:08:37", ext: "jpg" }
    ]
  }
};

export function getCertificates(raceId: string): Certificate[] {
  const set = raw[raceId];
  if (!set) return [];
  const dir = `${import.meta.env.BASE_URL}certificates/${raceId}/`;
  return set.items.map((item) => ({
    bib: item.bib,
    name: item.name,
    netTime: item.netTime,
    previewUrl: `${dir}${item.bib}-preview.jpg`,
    fileUrl: `${dir}${item.bib}.${item.ext}`,
    downloadName: `${set.label}-完賽證書-${item.bib}.${item.ext}`
  }));
}
