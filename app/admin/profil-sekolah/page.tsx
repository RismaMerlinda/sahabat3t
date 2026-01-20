"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/* ================= TYPES ================= */

type SchoolSubmission = {
  // ini bisa kamu sesuaikan nanti sama response backend
  npsn: string;
  namaSekolah?: string;
  jenjang?: string; // SD/SMP/SMA/SMK
  statusSekolah?: string; // Negeri/Swasta
  alamat?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;

  kepalaSekolah?: string;
  email?: string;
  telp?: string;

  // dokumen pendukung (opsional)
  dokumenUrl?: string;

  submittedAt?: string; // ISO
};

type VerifyStatus = "menunggu" | "terverifikasi" | "ditolak";

/* ================= PAGE ================= */

export default function AdminVerifikasiSekolahDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // route contoh: /admin/profil-sekolah/detail?npsn=222140
  const npsnFromUrl = (sp.get("npsn") || "").trim();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // data pengajuan (kosong dulu, nanti backend)
  const [submission, setSubmission] = useState<SchoolSubmission | null>(null);

  // verifikasi admin
  const [status, setStatus] = useState<VerifyStatus>("menunggu");
  const [catatan, setCatatan] = useState("");

  // hasil cek NPSN (nanti backend)
  const [npsnCheck, setNpsnCheck] = useState<
    | { state: "idle" }
    | { state: "checking" }
    | { state: "found"; message: string }
    | { state: "not_found"; message: string }
    | { state: "error"; message: string }
  >({ state: "idle" });

  /* ================= EFFECTS ================= */

  // ✅ Guard login
  useEffect(() => {
    const ok = localStorage.getItem("admin_auth") === "true";
    if (!ok) window.location.href = "/admin";
  }, []);

  // ✅ lock scroll saat drawer kebuka
  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  // ✅ load data pengajuan (sementara kosong, nanti backend)
  useEffect(() => {
    if (!npsnFromUrl) return;

    // TODO BACKEND:
    // fetch(`/api/admin/verifikasi-sekolah?npsn=${encodeURIComponent(npsnFromUrl)}`)
    //  -> setSubmission(data)
    //  -> setStatus(data.verifyStatus) dll

    // sementara: kosong (tidak pakai dummy)
    setSubmission(null);
    setStatus("menunggu");
    setCatatan("");
  }, [npsnFromUrl]);

  /* ================= HANDLERS ================= */

  function logout() {
    localStorage.removeItem("admin_auth");
    window.location.href = "/admin";
  }

  async function checkNpsn() {
    if (!npsnFromUrl) return;
    setNpsnCheck({ state: "checking" });

    try {
      // TODO BACKEND:
      // const res = await fetch(`/api/admin/cek-npsn?npsn=${encodeURIComponent(npsnFromUrl)}`);
      // const json = await res.json();
      // if (json.exists) setNpsnCheck({ state: "found", message: "NPSN terdaftar." })
      // else setNpsnCheck({ state: "not_found", message: "NPSN tidak ditemukan." })

      // sementara: belum backend
      await new Promise((r) => setTimeout(r, 300));
      setNpsnCheck({
        state: "error",
        message: "Backend belum terhubung. Nanti tombol ini akan cek NPSN beneran.",
      });
    } catch {
      setNpsnCheck({ state: "error", message: "Gagal cek NPSN. Coba lagi." });
    }
  }

  async function saveVerification(next: VerifyStatus) {
    if (!npsnFromUrl) return;
    setLoading(true);
    try {
      // TODO BACKEND:
      // await fetch("/api/admin/verifikasi-sekolah", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ npsn: npsnFromUrl, status: next, catatan }),
      // });

      // sementara: cuma set state (tanpa dummy storage)
      await new Promise((r) => setTimeout(r, 300));
      setStatus(next);
    } finally {
      setLoading(false);
    }
  }

  const statusLabel = useMemo(() => {
    if (status === "menunggu") return "Menunggu Verifikasi";
    if (status === "terverifikasi") return "Terverifikasi";
    return "Ditolak";
  }, [status]);

  const statusPillClass = useMemo(() => {
    if (status === "menunggu")
      return "bg-[#FEF9C3] text-[#6B4E00] border-[#FDE68A]";
    if (status === "terverifikasi")
      return "bg-[#BBF7D0] text-[#0F2F2E] border-[#22C55E]/25";
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

  /* ================= GUARDS ================= */

  if (!npsnFromUrl) {
    return (
      <div className="min-h-screen bg-[#E6FFFA] p-6">
        <div className="rounded-2xl bg-white/80 border border-[#B2F5EA] p-6">
          <div className="text-lg font-extrabold text-[#0F2F2E]">
            NPSN belum dipilih
          </div>
          <p className="mt-2 text-sm text-[#4A6F6C]">
            Buka halaman ini dari menu Verifikasi dengan query:
            <br />
            <code className="inline-block mt-2 px-2 py-1 rounded-lg bg-white border border-[#B2F5EA] text-[#0F2F2E] font-semibold">
              /admin/profil-sekolah/detail?npsn=222140
            </code>
          </p>
          <button
            onClick={() => router.push("/admin/verifikasi")}
            className="mt-4 rounded-xl px-4 py-3 text-sm font-semibold bg-[#0F2F2E] text-white"
            type="button"
          >
            Kembali ke Verifikasi
          </button>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#E6FFFA]">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#40E0D0]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#2CB1A6]/20 blur-3xl" />
      </div>

      {/* MOBILE DRAWER */}
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

      {/* DESKTOP LAYOUT */}
      <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block bg-white/70 lg:border-r border-[#B2F5EA]">
          {SidebarContent}
        </aside>

        {/* MAIN */}
        <div className="flex flex-col min-h-screen">
          {/* TOPBAR (tanpa search box kayak yang kamu minta dihapus) */}
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
                  <div className="text-xs font-semibold text-[#6B8E8B]">
                    Verifikasi
                  </div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-[#0F2F2E]">
                    Detail Verifikasi Sekolah
                  </h1>
                </div>
              </div>

              <button
                onClick={() => router.push("/admin/verifikasi")}
                className="rounded-xl px-4 py-2 text-sm font-semibold
                           border border-[#B2F5EA] bg-white/80 hover:shadow-md transition"
                type="button"
              >
                Kembali
              </button>
            </div>
          </header>

          {/* CONTENT */}
          <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-4">
            {/* Header card */}
            <div className="rounded-3xl bg-white/75 border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/10 overflow-hidden">
              <div className="px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[#6B8E8B]">
                      NPSN
                    </div>
                    <div className="text-2xl font-extrabold text-[#0F2F2E]">
                      {npsnFromUrl}
                    </div>
                    <div className="mt-1 text-sm text-[#4A6F6C]">
                      {submission?.namaSekolah ? submission.namaSekolah : "(Nama sekolah akan muncul dari backend)"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold border ${statusPillClass}`}
                    >
                      {statusLabel}
                    </div>

                    <button
                      type="button"
                      onClick={checkNpsn}
                      className="rounded-xl px-4 py-2 text-sm font-semibold
                                 bg-[#0F2F2E] text-white hover:opacity-95 transition"
                    >
                      Cek NPSN
                    </button>
                  </div>
                </div>

                {npsnCheck.state !== "idle" && (
                  <div className="mt-4">
                    <div
                      className={
                        "rounded-2xl border px-4 py-3 text-sm " +
                        (npsnCheck.state === "found"
                          ? "bg-[#BBF7D0]/60 border-[#22C55E]/25 text-[#0F2F2E]"
                          : npsnCheck.state === "not_found"
                          ? "bg-[#FECACA]/70 border-[#EF4444]/25 text-[#0F2F2E]"
                          : npsnCheck.state === "checking"
                          ? "bg-white border-[#B2F5EA] text-[#4A6F6C]"
                          : "bg-white border-[#B2F5EA] text-[#4A6F6C]")
                      }
                    >
                      {npsnCheck.state === "checking"
                        ? "Sedang mengecek NPSN..."
                        : npsnCheck.message}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* GRID */}
            <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
              {/* KIRI: Data Sekolah */}
              <div className="space-y-4">
                <SectionCard title="Data Sekolah">
                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    <Info label="Nama Sekolah" value={submission?.namaSekolah} />
                    <Info label="Jenjang" value={submission?.jenjang} />
                    <Info label="Status Sekolah" value={submission?.statusSekolah} />
                    <Info label="Alamat" value={submission?.alamat} wide />
                    <Info label="Provinsi" value={submission?.provinsi} />
                    <Info label="Kabupaten/Kota" value={submission?.kabupaten} />
                    <Info label="Kecamatan" value={submission?.kecamatan} />
                  </div>

                  {!submission && (
                    <EmptyNote text="Belum ada data sekolah ditampilkan. Nanti setelah backend jalan, isi dari API akan muncul di sini." />
                  )}
                </SectionCard>

                <SectionCard title="Kontak & Penanggung Jawab">
                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    <Info label="Kepala Sekolah" value={submission?.kepalaSekolah} />
                    <Info label="Email" value={submission?.email} />
                    <Info label="Telepon" value={submission?.telp} />
                    <Info label="Dokumen Pendukung" value={submission?.dokumenUrl ? "Tersedia" : undefined} />
                  </div>

                  {submission?.dokumenUrl ? (
                    <div className="mt-3">
                      <a
                        href={submission.dokumenUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold
                                   border border-[#B2F5EA] bg-white/80 hover:shadow-md transition text-[#0F2F2E]"
                      >
                        <DocIcon />
                        Lihat Dokumen
                      </a>
                    </div>
                  ) : (
                    <EmptyNote text="Dokumen pendukung belum ada (nanti ambil dari backend)." />
                  )}
                </SectionCard>
              </div>

              {/* KANAN: Panel Verifikasi */}
              <div className="space-y-4">
                <SectionCard title="Keputusan Verifikasi">
                  <div className="space-y-2 text-sm text-[#4A6F6C]">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="verify"
                        checked={status === "terverifikasi"}
                        onChange={() => setStatus("terverifikasi")}
                      />
                      Terverifikasi (NPSN valid & data sesuai)
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="verify"
                        checked={status === "ditolak"}
                        onChange={() => setStatus("ditolak")}
                      />
                      Ditolak (data tidak sesuai / NPSN tidak valid)
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="verify"
                        checked={status === "menunggu"}
                        onChange={() => setStatus("menunggu")}
                      />
                      Menunggu
                    </label>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white/80 border border-[#B2F5EA] p-4">
                    <div className="text-sm font-extrabold text-[#0F2F2E]">
                      Catatan Admin
                    </div>
                    <textarea
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      placeholder="Tulis catatan (opsional)..."
                      className="mt-2 w-full min-h-[120px] rounded-xl border border-[#B2F5EA]
                                 bg-white p-3 text-sm outline-none text-[#0F2F2E]"
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => saveVerification("ditolak")}
                      className="rounded-full px-4 py-2 text-sm font-extrabold
                                 bg-[#6B7280] text-white hover:opacity-95 disabled:opacity-60"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => saveVerification("terverifikasi")}
                      className="rounded-full px-4 py-2 text-sm font-extrabold
                                 bg-[#0F2F2E] text-white hover:opacity-95 disabled:opacity-60"
                    >
                      Verifikasi
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-[#6B8E8B]">
                    *Saat ini tombol simpan masih placeholder (tanpa backend). Nanti tinggal sambungkan ke API.
                  </p>
                </SectionCard>

                <button
                  type="button"
                  onClick={() => router.push("/admin/verifikasi")}
                  className="w-full rounded-2xl px-4 py-3 text-sm font-extrabold
                             border border-[#B2F5EA] bg-white/80 hover:shadow-md transition"
                >
                  Kembali ke List Verifikasi
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ================= UI PIECES ================= */

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white/75 border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#B2F5EA] bg-white/70">
        <div className="text-base font-extrabold text-[#0F2F2E]">{title}</div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Info({
  label,
  value,
  wide,
}: {
  label: string;
  value?: string | number;
  wide?: boolean;
}) {
  const isEmpty = value === undefined || value === null || value === "";
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <div className="text-xs font-semibold text-[#6B8E8B]">{label}</div>
      <div className={"mt-1 rounded-xl border px-3 py-2 text-sm " + (isEmpty
        ? "border-[#B2F5EA] bg-white/60 text-[#9CA3AF]"
        : "border-[#B2F5EA] bg-white text-[#0F2F2E] font-semibold")}>
        {isEmpty ? "-" : String(value)}
      </div>
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-[#B2F5EA] bg-white/60 p-4 text-sm text-[#4A6F6C]">
      {text}
    </div>
  );
}

/* ================= SIDEBAR ITEM ================= */

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
        (active
          ? "bg-[#0F2F2E] text-white shadow-md"
          : "text-[#0F2F2E] hover:bg-black/5")
      }
      type="button"
    >
      {label}
    </button>
  );
}

/* ================= ICONS ================= */

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
