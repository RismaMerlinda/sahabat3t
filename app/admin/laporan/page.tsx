"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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
  schoolId: string;
  namaSekolah: string;
  npsn: string;
  lokasi: string;
  submittedAt: string;
  items: UsageItem[];
};

/* ================= CONFIG ================= */

// ✅ Default: KOSONG (backend belum jalan)
const USE_LOCAL_STORAGE = false;

// localStorage key (kalau nanti mau test)
const LS_USAGE_KEY = "school_usage_reports";

/* ================= PAGE ================= */

export default function AdminLaporanPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [reports, setReports] = useState<UsageReport[]>([]);
  const [query, setQuery] = useState("");

  // ✅ Guard login
  useEffect(() => {
    const ok = localStorage.getItem("admin_auth") === "true";
    if (!ok) window.location.href = "/admin";
  }, []);

  // ✅ Load laporan
  useEffect(() => {
    loadReports();
    const onFocus = () => loadReports();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function loadReports() {
    // ✅ default kosong dulu sampai backend ada
    if (!USE_LOCAL_STORAGE) {
      setReports([]);
      return;
    }

    // --- kalau mau test localStorage, set USE_LOCAL_STORAGE = true ---
    const raw = localStorage.getItem(LS_USAGE_KEY);
    if (!raw) return setReports([]);

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return setReports([]);

      const cleaned: UsageReport[] = parsed
        .map((x: any) => ({
          id: String(x?.id ?? ""),
          schoolId: String(x?.schoolId ?? ""),
          namaSekolah: String(x?.namaSekolah ?? ""),
          npsn: String(x?.npsn ?? ""),
          lokasi: String(x?.lokasi ?? ""),
          submittedAt: String(x?.submittedAt ?? ""),
          items: Array.isArray(x?.items) ? x.items : [],
        }))
        .filter((x) => x.id);

      setReports(cleaned);
    } catch {
      setReports([]);
    }
  }

  function logout() {
    localStorage.removeItem("admin_auth");
    window.location.href = "/admin";
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter((r) => {
      return (
        r.namaSekolah.toLowerCase().includes(q) ||
        r.npsn.toLowerCase().includes(q) ||
        r.lokasi.toLowerCase().includes(q)
      );
    });
  }, [reports, query]);

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
                     border border-[#B2F5EA] bg-white/80
                     hover:shadow-md transition"
          type="button"
        >
          Logout
        </button>
      </div>
    </div>
  );

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
          {/* TOPBAR */}
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
                    Laporan
                  </div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-[#0F2F2E]">
                    Laporan Penggunaan Dana
                  </h1>
                </div>
              </div>

              {/* Search */}
              <div className="w-full sm:w-[420px]">
                <div className="flex items-center gap-2 rounded-full bg-white/85 border border-[#B2F5EA] px-4 py-2 shadow-sm hover:shadow-md transition">
                  <SearchIcon />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari sekolah / NPSN / lokasi..."
                    className="bg-transparent outline-none text-sm w-full text-[#0F2F2E]"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="p-4 sm:p-6 lg:p-8 flex-1">
            <div className="rounded-3xl bg-white/75 border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/10 overflow-hidden">
              <div className="px-6 py-4">
                <h2 className="text-base sm:text-lg font-extrabold text-[#0F2F2E]">
                  Daftar Sekolah yang Sudah Input Rincian
                </h2>
                <p className="text-sm text-[#6B8E8B] mt-1">
                  Kelola dan tinjau laporan penggunaan dana dari sekolah-sekolah
                </p>
              </div>

              {filtered.length === 0 ? (
                <div className="px-6 pb-8">
                  <div className="rounded-2xl bg-white/80 border border-[#B2F5EA] p-6 text-center">
                    <div className="text-base font-extrabold text-[#0F2F2E]">
                      Belum ada laporan penggunaan dana
                    </div>
                    <p className="mt-2 text-sm text-[#6B8E8B]">
                      Belum ada data yang diinput.
                    </p>

                    {/* tombol placeholder */}
                    <button
                      className="mt-4 rounded-xl px-4 py-3 text-sm font-semibold
                                 bg-[#0F2F2E] text-white/90 cursor-not-allowed opacity-70"
                      type="button"
                      disabled
                    >
                      Menunggu Data Masuk
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 sm:px-6 pb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[920px]">
                      <thead>
                        <tr className="bg-black/5 text-[#0F2F2E]">
                          <th className="text-left px-4 py-3 rounded-l-xl">No</th>
                          <th className="text-left px-4 py-3">Nama Sekolah</th>
                          <th className="text-left px-4 py-3">NPSN</th>
                          <th className="text-left px-4 py-3">Lokasi</th>
                          <th className="text-left px-4 py-3">Jumlah Rincian</th>
                          <th className="text-left px-4 py-3">Total Penggunaan</th>
                          <th className="text-left px-4 py-3">Tanggal Submit</th>
                          <th className="text-right px-4 py-3 rounded-r-xl">Aksi</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filtered.map((r, idx) => {
                          const total = r.items.reduce((a, b) => a + (b.jumlah || 0), 0);
                          return (
                            <tr
                              key={r.id}
                              className="border-b border-black/5 hover:bg-black/5 transition"
                            >
                              <td className="px-4 py-3">{idx + 1}</td>
                              <td className="px-4 py-3 font-semibold text-[#0F2F2E]">
                                {r.namaSekolah}
                              </td>
                              <td className="px-4 py-3">{r.npsn}</td>
                              <td className="px-4 py-3">{r.lokasi}</td>
                              <td className="px-4 py-3">{r.items.length}</td>
                              <td className="px-4 py-3 font-semibold">
                                {formatRupiah(total)}
                              </td>
                              <td className="px-4 py-3 text-[#4A6F6C]">
                                {formatDateTime(r.submittedAt)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() =>
                                    router.push(`/admin/detail?id=${encodeURIComponent(r.id)}`)
                                  }
                                  className="rounded-xl px-3 py-2 text-xs font-semibold
                                             bg-[#40E0D0]/15 text-[#0F2F2E]
                                             border border-[#40E0D0]/30 hover:shadow-md transition"
                                >
                                  Lihat Detail
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
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

/* ================= HELPERS ================= */

function formatRupiah(n: number) {
  if (!Number.isFinite(n)) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
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

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
