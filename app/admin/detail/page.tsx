"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/* ================= TYPES ================= */

type UsageItem = {
  tanggal: string;
  kategori: string;
  deskripsi: string;
  jumlah: number;
  buktiUrl?: string;
};

type UsageReport = {
  id: string;
  namaSekolah: string;
  npsn: string;
  lokasi: string;

  periode?: string;
  diajukanPada?: string; // ISO
  ringkasan?: string;

  kegiatanUtama?: string[];
  dampakAwal?: string;

  items: UsageItem[];

  fotoUrls?: string[];
  notaUrls?: string[];
};

type ModerationStatus = "menunggu" | "disetujui" | "ditolak";

/* ================= LS KEYS (optional for later) ================= */

const LS_MOD_KEY = "school_usage_moderation"; // { [id]: { status, catatan, updatedAt } }

/* ================= PAGE ================= */

export default function AdminDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const id = sp.get("id");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // data kosong dulu
  const [report, setReport] = useState<UsageReport | null>(null);

  const [status, setStatus] = useState<ModerationStatus>("menunggu");
  const [catatan, setCatatan] = useState("");
  const [tab, setTab] = useState<"foto" | "rekapan" | "nota">("foto");

  // modal preview foto
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  // ✅ Guard login
  useEffect(() => {
    const ok = localStorage.getItem("admin_auth") === "true";
    if (!ok) window.location.href = "/admin";
  }, []);

  // ✅ Load (kosong dulu) by query id
  useEffect(() => {
    if (!id) return;

    // TODO: nanti kalau backend sudah jalan:
    // fetchReport(id).then(setReport)
    // sementara: data kosong
    setReport(null);

    const mod = readModeration(id);
    if (mod) {
      setStatus(mod.status);
      setCatatan(mod.catatan || "");
    } else {
      setStatus("menunggu");
      setCatatan("");
    }
  }, [id]);

  // ✅ lock scroll saat drawer kebuka
  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  function logout() {
    localStorage.removeItem("admin_auth");
    window.location.href = "/admin";
  }

  function saveModeration(next: ModerationStatus) {
    if (!id) return;
    const raw = localStorage.getItem(LS_MOD_KEY);
    const map = raw ? safeJson(raw) : {};
    map[id] = {
      status: next,
      catatan: catatan.trim(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(LS_MOD_KEY, JSON.stringify(map));
    setStatus(next);
  }

  const total = useMemo(() => {
    if (!report) return 0;
    return report.items.reduce((a, b) => a + (b.jumlah || 0), 0);
  }, [report]);

  const statusLabel = useMemo(() => {
    if (status === "menunggu") return "Menunggu Review";
    if (status === "disetujui") return "Disetujui";
    return "Ditolak";
  }, [status]);

  const statusPillClass = useMemo(() => {
    if (status === "menunggu") return "bg-[#FEF9C3] text-[#6B4E00] border-[#FDE68A]";
    if (status === "disetujui") return "bg-[#BBF7D0] text-[#0F2F2E] border-[#22C55E]/25";
    return "bg-[#FECACA] text-[#0F2F2E] border-[#EF4444]/25";
  }, [status]);

  const SidebarContent = (
    <div className="h-full flex flex-col">
      <div className="px-6 py-6">
        <div className="text-lg font-extrabold text-[#0F2F2E]">Admin</div>
        <div className="text-xs text-[#6B8E8B] mt-1">SAHABAT3T Portal</div>
      </div>

      <nav className="px-4 flex-1 space-y-2">
        <SidebarItem
          label="Dashboard"
          href="/admin/dashboard"
          active={pathname === "/admin/dashboard"}
          onClick={() => setSidebarOpen(false)}
        />
        <SidebarItem
          label="Verifikasi"
          href="/admin/verifikasi"
          active={pathname === "/admin/verifikasi"}
          onClick={() => setSidebarOpen(false)}
        />
        <SidebarItem
          label="Laporan"
          href="/admin/laporan"
          active={pathname === "/admin/laporan"}
          onClick={() => setSidebarOpen(false)}
        />
        <SidebarItem
          label="Profil Sekolah"
          href="/admin/profil-sekolah"
          active={pathname === "/admin/profil-sekolah"}
          onClick={() => setSidebarOpen(false)}
        />
      </nav>

      <div className="px-4 pb-6">
        <button
          onClick={() => {
            setSidebarOpen(false);
            logout();
          }}
          className="w-full rounded-xl px-4 py-3 text-sm font-semibold
                     border border-[#B2F5EA] bg-white/80 hover:shadow-md transition"
          type="button"
        >
          Logout
        </button>
      </div>
    </div>
  );

  // ====== GUARD STATE ======
  if (!id) {
    return (
      <div className="min-h-screen bg-[#E6FFFA] p-6">
        <div className="rounded-2xl bg-white/80 border border-[#B2F5EA] p-6">
          <div className="text-lg font-extrabold text-[#0F2F2E]">ID laporan tidak ada</div>
          <p className="mt-2 text-sm text-[#6B8E8B]">
            Buka dari tombol detail:{" "}
            <code className="px-2 py-0.5 rounded-full bg-white border border-[#B2F5EA] text-[#0F2F2E] font-semibold">
              /admin/detail?id=rep-1
            </code>
          </p>
          <button
            className="mt-4 rounded-xl px-4 py-3 text-sm font-semibold bg-[#0F2F2E] text-white"
            onClick={() => router.push("/admin/laporan")}
            type="button"
          >
            Kembali ke Laporan
          </button>
        </div>
      </div>
    );
  }

  // ====== UI (warna mint) ======
  return (
    <div className="min-h-screen bg-[#E6FFFA]">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#40E0D0]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#2CB1A6]/20 blur-3xl" />
      </div>

      {/* ===== MOBILE DRAWER SIDEBAR ===== */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity lg:hidden ${
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[280px] bg-white/90 border-r border-[#B2F5EA]
                    shadow-xl transition-transform lg:hidden
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {SidebarContent}
      </aside>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block bg-white/70 lg:border-r border-[#B2F5EA]">
          {SidebarContent}
        </aside>

        {/* MAIN */}
        <div className="flex flex-col min-h-screen">
          {/* TOPBAR (versi bersih: tanpa search+icon) */}
          <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-[#B2F5EA]">
            <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden mt-0.5 rounded-xl p-2
                             border border-[#B2F5EA] bg-white/80
                             hover:shadow-md transition"
                  aria-label="Buka menu"
                >
                  <MenuIcon />
                </button>

                <div>
                  <div className="text-xs font-semibold text-[#6B8E8B]">Detail</div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-[#0F2F2E]">
                    Laporan Penggunaan Dana
                  </h1>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/admin/laporan")}
                className="rounded-xl px-4 py-2 text-sm font-semibold
                           border border-[#B2F5EA] bg-white/80 hover:shadow-md transition"
              >
                Kembali
              </button>
            </div>
          </header>

          {/* CONTENT */}
          <main className="p-4 sm:p-6 lg:p-8 flex-1">
            {/* Header info (wireframe feel) */}
            <div className="rounded-3xl bg-white/75 border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/10 overflow-hidden">
              <div className="px-6 py-5 border-b border-[#B2F5EA] bg-white/70">
                <div className="text-sm font-semibold text-[#6B8E8B]">Laporan</div>
                <div className="mt-1 text-xl sm:text-2xl font-extrabold text-[#0F2F2E]">
                  Laporan Penggunaan Dana
                </div>

                <div className="mt-3 rounded-2xl bg-white/80 border border-[#B2F5EA] px-4 py-3">
                  <div className="text-sm font-extrabold text-[#0F2F2E]">
                    Laporan (data belum tersedia)
                  </div>
                  <div className="mt-1 text-sm text-[#6B8E8B]">
                    ID: <span className="font-semibold text-[#0F2F2E]">{id}</span>
                  </div>
                </div>
              </div>

              {/* GRID */}
              <div className="p-6 grid gap-4 lg:grid-cols-[1fr_360px]">
                {/* KIRI */}
                <div className="space-y-4">
                  {/* Identitas */}
                  <Card title="Identitas Laporan">
                    {!report ? (
                      <EmptyBlock />
                    ) : (
                      <div className="grid gap-2 text-sm text-[#4A6F6C]">
                        <RowMint label="Nama" value={report.namaSekolah} />
                        <RowMint label="NPSN" value={report.npsn} />
                        <RowMint label="Lokasi" value={report.lokasi} />
                        <RowMint label="Periode" value={report.periode || "-"} />
                        <RowMint label="Diajukan" value={report.diajukanPada ? formatDate(report.diajukanPada) : "-"} />
                      </div>
                    )}
                  </Card>

                  {/* Ringkasan */}
                  <Card title="Ringkasan Penggunaan Dana">
                    {!report ? (
                      <EmptyBlock />
                    ) : (
                      <>
                        <div className="rounded-2xl bg-[#40E0D0]/10 border border-[#40E0D0]/25 p-4 text-sm text-[#4A6F6C]">
                          {report.ringkasan || "-"}
                        </div>

                        <div className="mt-4 text-sm font-extrabold text-[#0F2F2E]">
                          Total Dana digunakan:{" "}
                          <span className="inline-flex items-center rounded-full bg-[#40E0D0]/10 border border-[#40E0D0]/25 px-3 py-1">
                            {formatRupiah(total)}
                          </span>
                        </div>
                      </>
                    )}
                  </Card>

                  {/* Rincian */}
                  <Card
                    title="Rincian Penggunaan Dana"
                    right={
                      <div className="inline-flex rounded-xl border border-[#B2F5EA] bg-white/70 overflow-hidden">
                        <TabBtnMint active={tab === "foto"} onClick={() => setTab("foto")}>
                          Foto
                        </TabBtnMint>
                        <TabBtnMint active={tab === "rekapan"} onClick={() => setTab("rekapan")}>
                          Rekapan
                        </TabBtnMint>
                        <TabBtnMint active={tab === "nota"} onClick={() => setTab("nota")}>
                          Nota
                        </TabBtnMint>
                      </div>
                    }
                  >
                    {!report ? (
                      <EmptyBlock
                        extra={
                          <div className="mt-3 text-xs text-[#6B8E8B]">
                            Nanti kalau backend sudah nyala, tab Foto/Rekapan/Nota akan terisi.
                          </div>
                        }
                      />
                    ) : (
                      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
                        <div>
                          {tab === "foto" ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {(report.fotoUrls || []).slice(0, 6).map((src, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => setPreviewSrc(src)}
                                  className="aspect-[4/3] rounded-2xl bg-black/5 border border-[#B2F5EA] overflow-hidden hover:shadow-md transition"
                                  aria-label="Preview foto"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={src} alt="Foto" className="h-full w-full object-cover" />
                                </button>
                              ))}
                            </div>
                          ) : null}

                          {tab === "rekapan" ? (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm min-w-[620px]">
                                <thead>
                                  <tr className="bg-black/5 text-[#0F2F2E]">
                                    <th className="text-left px-4 py-3 rounded-l-xl">No</th>
                                    <th className="text-left px-4 py-3">Tanggal</th>
                                    <th className="text-left px-4 py-3">Kategori</th>
                                    <th className="text-left px-4 py-3">Deskripsi</th>
                                    <th className="text-right px-4 py-3 rounded-r-xl">Jumlah</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {report.items.map((it, idx) => (
                                    <tr key={idx} className="border-b border-black/5 hover:bg-black/5 transition">
                                      <td className="px-4 py-3">{idx + 1}</td>
                                      <td className="px-4 py-3">{formatDate(it.tanggal)}</td>
                                      <td className="px-4 py-3 font-semibold text-[#0F2F2E]">{it.kategori}</td>
                                      <td className="px-4 py-3 text-[#4A6F6C]">{it.deskripsi}</td>
                                      <td className="px-4 py-3 text-right font-semibold">{formatRupiah(it.jumlah)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : null}

                          {tab === "nota" ? (
                            <div className="space-y-2">
                              {(report.notaUrls || []).slice(0, 6).map((u, i) => (
                                <a
                                  key={i}
                                  href={u}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-between gap-3 rounded-2xl border border-[#B2F5EA] bg-white/70 px-4 py-3 hover:shadow-md transition"
                                >
                                  <div className="flex items-center gap-3">
                                    <DocIcon />
                                    <div>
                                      <div className="text-sm font-extrabold text-[#0F2F2E]">
                                        Dokumen Nota #{i + 1}
                                      </div>
                                      <div className="text-xs text-[#6B8E8B] break-all">{u}</div>
                                    </div>
                                  </div>
                                  <span className="text-xs font-bold text-[#0F2F2E] underline underline-offset-4">
                                    Lihat
                                  </span>
                                </a>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        <div className="rounded-2xl bg-white/70 border border-[#B2F5EA] p-4">
                          <div className="text-sm font-extrabold text-[#0F2F2E]">Ringkas Item</div>
                          <div className="mt-3 text-sm text-[#6B8E8B]">
                            {topSummary(report.items, 6).length === 0 ? (
                              <div>-</div>
                            ) : (
                              <div className="space-y-2">
                                {topSummary(report.items, 6).map((x, i) => (
                                  <div key={i} className="flex items-start justify-between gap-3">
                                    <div className="text-[#4A6F6C]">
                                      {i + 1}.{" "}
                                      <span className="font-semibold text-[#0F2F2E]">{x.kategori}</span>
                                    </div>
                                    <div className="font-extrabold text-[#0F2F2E]">{formatRupiah(x.total)}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="pt-3 mt-3 border-t border-black/10 flex items-center justify-between text-sm">
                            <div className="font-semibold text-[#6B8E8B]">Total</div>
                            <div className="font-extrabold text-[#0F2F2E]">{formatRupiah(total)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                {/* KANAN */}
                <div className="space-y-4">
                  <div className="rounded-3xl bg-white/75 border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/10 overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#B2F5EA] bg-white/70">
                      <div className="font-extrabold text-[#0F2F2E]">Approve/Reject Laporan</div>
                      <div className="mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border">
                        <span className={`rounded-full px-3 py-1 border ${statusPillClass}`}>{statusLabel}</span>
                      </div>
                      <div className="mt-2 text-xs text-[#6B8E8B]">
                        Update terakhir:{" "}
                        <span className="font-semibold text-[#0F2F2E]">
                          {readModeration(id)?.updatedAt ? formatDateTime(readModeration(id)!.updatedAt!) : "-"}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <label className="flex items-center gap-2 text-sm text-[#4A6F6C]">
                        <input
                          type="radio"
                          name="mod"
                          checked={status === "disetujui"}
                          onChange={() => setStatus("disetujui")}
                        />
                        Setujui laporan
                      </label>

                      <label className="flex items-center gap-2 text-sm text-[#4A6F6C]">
                        <input
                          type="radio"
                          name="mod"
                          checked={status === "ditolak"}
                          onChange={() => setStatus("ditolak")}
                        />
                        Tolak laporan
                      </label>

                      <div className="mt-2 rounded-2xl bg-white/70 border border-[#B2F5EA] p-4">
                        <div className="text-sm font-extrabold text-[#0F2F2E]">Catatan dari Admin</div>
                        <textarea
                          value={catatan}
                          onChange={(e) => setCatatan(e.target.value)}
                          placeholder="Tulis catatan disini.."
                          className="mt-2 w-full min-h-[110px] rounded-xl border border-[#B2F5EA] bg-white/90 p-3 text-sm outline-none text-[#0F2F2E]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => saveModeration("ditolak")}
                          className="rounded-xl px-4 py-2 text-sm font-bold
                                     bg-white/80 border border-[#B2F5EA] text-[#0F2F2E]
                                     hover:shadow-md transition"
                        >
                          Tolak
                        </button>
                        <button
                          type="button"
                          onClick={() => saveModeration("disetujui")}
                          className="rounded-xl px-4 py-2 text-sm font-bold
                                     bg-[#0F2F2E] text-white hover:opacity-95 transition"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white/75 border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/10 p-6">
                    <div className="text-sm font-extrabold text-[#0F2F2E]">Preview</div>
                    <div className="mt-3 h-[180px] rounded-2xl bg-white/70 border border-[#B2F5EA] grid place-items-center">
                      <BigDocIcon />
                    </div>
                    <div className="mt-3 text-xs text-[#6B8E8B]">
                      Preview placeholder. Nanti kalau ada URL PDF/image dari backend bisa diganti viewer.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/admin/laporan")}
                    className="w-full rounded-2xl px-4 py-3 text-sm font-bold
                               border border-[#B2F5EA] bg-white/80 hover:shadow-md transition"
                  >
                    Kembali ke List Laporan
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* MODAL PREVIEW FOTO */}
      {previewSrc && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPreviewSrc(null)} />
          <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-[#B2F5EA] shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#B2F5EA] bg-white/80 flex items-center justify-between">
              <div className="text-sm font-extrabold text-[#0F2F2E]">Preview Foto</div>
              <button
                type="button"
                onClick={() => setPreviewSrc(null)}
                className="rounded-xl p-2 border border-[#B2F5EA] bg-white hover:shadow-md transition"
                aria-label="Tutup"
              >
                <XIcon />
              </button>
            </div>

            <div className="p-4 bg-[#E6FFFA]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewSrc} alt="Preview" className="w-full max-h-[75vh] object-contain rounded-2xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= SMALL UI PARTS ================= */

function Card({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white/75 border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#B2F5EA] bg-white/70 flex items-center justify-between gap-3">
        <div className="font-extrabold text-[#0F2F2E]">{title}</div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function EmptyBlock({ extra }: { extra?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/80 border border-[#B2F5EA] p-5 text-center">
      <div className="text-sm font-extrabold text-[#0F2F2E]">Belum ada data</div>
      <div className="mt-1 text-sm text-[#6B8E8B]">Nanti akan tampil otomatis kalau backend sudah jalan.</div>
      {extra ? extra : null}
    </div>
  );
}

function RowMint({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-[86px] text-[#6B8E8B]">{label}:</div>
      <div className="font-semibold text-[#0F2F2E]">{value}</div>
    </div>
  );
}

function TabBtnMint({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-4 py-2 text-xs font-extrabold transition " +
        (active ? "bg-white text-[#0F2F2E]" : "text-[#6B8E8B] hover:text-[#0F2F2E]")
      }
    >
      {children}
    </button>
  );
}

function SidebarItem({
  label,
  href,
  active,
  onClick,
}: {
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        onClick?.();
        router.push(href);
      }}
      className={
        "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition " +
        (active ? "bg-[#0F2F2E] text-white shadow-md" : "text-[#0F2F2E] hover:bg-black/5")
      }
      type="button"
    >
      {label}
    </button>
  );
}

/* ================= DATA HELPERS (local moderation only) ================= */

function readModeration(
  reportId: string
): { status: ModerationStatus; catatan?: string; updatedAt?: string } | null {
  const raw = localStorage.getItem(LS_MOD_KEY);
  if (!raw) return null;
  const map = safeJson(raw);
  const v = map?.[reportId];
  if (!v) return null;
  return {
    status: v.status as ModerationStatus,
    catatan: v.catatan,
    updatedAt: v.updatedAt,
  };
}

function safeJson(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function topSummary(items: UsageItem[], limit: number) {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = it.kategori || "Lainnya";
    map.set(k, (map.get(k) || 0) + (it.jumlah || 0));
  }
  const arr = Array.from(map.entries()).map(([kategori, total]) => ({ kategori, total }));
  arr.sort((a, b) => b.total - a.total);
  return arr.slice(0, limit);
}

/* ================= FORMATTERS ================= */

function formatRupiah(n: number) {
  if (!Number.isFinite(n)) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(d);
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

/* ================= ICONS ================= */

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="2" />
      <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function BigDocIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="2" />
      <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" />
      <path d="M8 13h8M8 9h5M8 17h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ================= FUTURE BACKEND HOOK (optional) =================
async function fetchReport(id: string): Promise<UsageReport | null> {
  // TODO: ganti ke fetch API kamu nanti
  // const res = await fetch(`/api/reports/${id}`);
  // if (!res.ok) return null;
  // return await res.json();
  return null;
}
*/
