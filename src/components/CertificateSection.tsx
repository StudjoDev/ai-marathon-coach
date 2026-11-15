import { Download } from "lucide-react";
import { getCertificates } from "../data/certificates";

/** 完賽紀錄頁的證書區：每人一張預覽＋下載按鈕 */
export function CertificateSection({ raceId }: { raceId: string }) {
  const certificates = getCertificates(raceId);
  if (certificates.length === 0) return null;

  return (
    <section aria-labelledby="certificates-title" className="mt-9 flex flex-col">
      <h2 id="certificates-title" className="flex items-baseline justify-between">
        <span className="text-xl font-black">完賽證書</span>
        <span className="font-display text-base font-bold tracking-[1px] text-muted">
          CERTIFICATES · {certificates.length}
        </span>
      </h2>
      <p className="mb-3.5 mt-1.5 text-[13px] text-muted">點圖片看大圖，按下載存原檔。</p>

      <ul className="grid grid-cols-2 gap-3">
        {certificates.map((certificate) => (
          <li key={certificate.bib} className="flex min-w-0 flex-col">
            <a
              href={certificate.fileUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`看 ${certificate.name} 的完賽證書大圖`}
              className="focus-ring block overflow-hidden rounded-[14px] bg-soft"
            >
              <img
                src={certificate.previewUrl}
                alt={`${certificate.name} 的完賽證書，號碼 ${certificate.bib}，成績 ${certificate.netTime}`}
                width={720}
                height={1018}
                loading="lazy"
                decoding="async"
                className="h-auto w-full"
              />
            </a>
            <p className="mt-2.5 truncate text-[15px] font-bold">{certificate.name}</p>
            <p className="text-[13px] tabular-nums text-muted">
              #{certificate.bib} · {certificate.netTime}
            </p>
            <a
              href={certificate.fileUrl}
              download={certificate.downloadName}
              aria-label={`下載 ${certificate.name} 的完賽證書`}
              className="focus-ring mt-2.5 flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-ink px-4 text-[15px] font-bold text-white"
            >
              <Download className="h-[18px] w-[18px]" strokeWidth={2.4} aria-hidden="true" />
              下載
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
