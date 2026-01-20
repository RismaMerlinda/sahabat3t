"use client";

import { useEffect, useMemo, useState } from "react";

type SchoolStatus = "approved" | "pending" | "rejected";

type School = {
  id: string;
  namaSekolah: string;
  npsn: string;
  lokasi: string;
  status: SchoolStatus;
  createdAt: string;
};

const LS_KEY = "school_submissions";

export default function AdminVerifikasiPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // optional: filter sederhana
  const [search, setSearch] = useState("");

  // ✅ Guard login
  useEffect(() => {
    const ok = localStorage.getItem("admin_auth") === "true";
    if (!ok) window.location.href = "/admin";
  }, []);

  // ✅ Load data
  useEffect(() => {
    loadSchools();
    const onFocus = () => loadSchools();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
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

  function loadSchools() {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return setSchools([]);
    try {
      const parsed = JSON.parse(raw);
      setSchools(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSchools([]);
    }
  }

  function logout() {
    localStorage.removeItem("admin_auth");
    window.location.href = "/admin";
  }

  function updateStatus(id: string, status: SchoolStatus) {
    const next = schools.map((s) => (s.id === id ? { ...s, status } : s));
    setSchools(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  }

  const pendingList = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = schools.filter((s) => s.status === "pending");
    if (!q) return base;

    return base.filter((s) => {
      return (
        s.namaSekolah.toLowerCase().includes(q) ||
        s.npsn.toLowerCase().includes(q) ||
        s.lokasi.toLowerCase().includes(q)
      );
    });
  }, [schools, search]);

  const SidebarContent = (
    <div className="h-full flex flex-col">
      <div className="px-6 py-6">
        <div className="text-lg font-extrabold text-[#0F2F2E]">Admin</div>
        <div className="text-xs text-[#6B8E8B] mt-1">SAHABAT3T Portal</div>
      </div>

      <nav className="px-4 flex-1 space-y-2">
        <SidebarItem label="Dashboard" href="/admin/dashboard" onClick={() => setSidebarOpen(false)} />
        <SidebarItem active label="Verifikasi" href="/admin/verifikasi" onClick={() => setSidebarOpen(false)} />
        <SidebarItem label="Laporan" href="/admin/laporan" onClick={() => setSidebarOpen(false)} />
        <SidebarItem label="Profil Sekolah" href="/admin/profil-sekolah" onClick={() => setSidebarOpen(false)} />
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

      {/* DESKTOP */}
      <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block bg-white/70 lg:border-r border-[#B2F5EA]">
          {SidebarContent}
        </aside>

        <div className="flex flex-col min-h-screen">
          {/* TOPBAR */}
          <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-[#B2F5EA]">
            <div className="px-4 sm:px-6 lg:px-8 py-2 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
                  <div className="text-xs font-semibold text-[#6B8E8B]">Verifikasi</div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-[#0F2F2E]">
                    Verifikasi Sekolah
                  </h1>
                </div>
              </div>

              {/* search kecil */}
              <div className="flex items-center gap-2 rounded-full bg-white/85 border border-[#B2F5EA] px-4 py-2 shadow-sm hover:shadow-md transition">
                <SearchIcon />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama / NPSN / lokasi"
                  className="bg-transparent outline-none text-sm w-60 max-w-[70vw] text-[#0F2F2E]"
                />
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8 flex-1">
            <div className="rounded-3xl bg-white/75 border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/10 overflow-hidden">
              <div className="px-6 py-4">
                <h2 className="text-base sm:text-lg font-extrabold text-[#0F2F2E]">
                  Antrian Verifikasi
                </h2>
                <p className="text-sm text-[#6B8E8B] mt-1">
                  Verifikasi Sekolah <span className="font-semibold text-[#0F2F2E]">Menunggu</span> Adanya Pengajuan Pengalanggan Dana.
                </p>
              </div>

              {pendingList.length === 0 ? (
                <div className="px-6 pb-8">
                  <EmptyState />
                </div>
              ) : (
                <div className="px-4 sm:px-6 pb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm table-fixed">
                      <thead>
                        <tr className="bg-black/5 text-[#0F2F2E]">
                          <th className="text-left px-4 py-3 rounded-l-xl w-16">No</th>
                          <th className="text-left px-4 py-3 min-w-[240px]">Nama Sekolah</th>
                          <th className="text-left px-4 py-3 w-28">NPSN</th>
                          <th className="text-left px-4 py-3 min-w-[220px]">Lokasi</th>
                          <th className="text-left px-4 py-3 w-32">Status</th>
                          <th className="text-right px-4 py-3 rounded-r-xl w-40">Aksi</th>
                        </tr>
                      </thead>

                      <tbody>
                        {pendingList.map((s, idx) => (
                          <tr
                            key={s.id}
                            className="border-b border-black/5 hover:bg-black/5 transition"
                          >
                            <td className="px-4 py-3">{idx + 1}</td>

                            <td className="px-4 py-3 font-semibold text-[#0F2F2E]">
                              {s.namaSekolah}
                            </td>

                            <td className="px-4 py-3">{s.npsn}</td>

                            <td className="px-4 py-3 max-w-[260px] truncate">
                              {s.lokasi}
                            </td>

                            <td className="px-4 py-3">
                              <StatusPill status="pending" />
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex flex-col items-end gap-2">
                                <button
                                  onClick={() => updateStatus(s.id, "approved")}
                                  className="w-full max-w-[110px] rounded-xl px-3 py-2 text-xs font-semibold
                                             bg-[#22C55E]/10 text-[#0F2F2E]
                                             border border-[#22C55E]/25 hover:shadow-md transition"
                                  type="button"
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() => updateStatus(s.id, "rejected")}
                                  className="w-full max-w-[110px] rounded-xl px-3 py-2 text-xs font-semibold
                                             bg-[#EF4444]/10 text-[#0F2F2E]
                                             border border-[#EF4444]/25 hover:shadow-md transition"
                                  type="button"
                                >
                                  Tolak
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-4 text-xs text-[#6B8E8B]">
                    Data sementara dibaca dari localStorage key{" "}
                    <code className="px-2 py-0.5 rounded-full bg-white border border-[#B2F5EA] text-[#0F2F2E] font-semibold">
                      {LS_KEY}
                    </code>
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ===== UI Components ===== */

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
  return (
    <a
      href={href}
      onClick={onClick}
      className={
        "block w-full px-4 py-3 rounded-xl text-sm font-semibold transition " +
        (active
          ? "bg-[#0F2F2E] text-white shadow-md"
          : "text-[#0F2F2E] hover:bg-black/5")
      }
    >
      {label}
    </a>
  );
}

function StatusPill({ status }: { status: SchoolStatus }) {
  const map: Record<SchoolStatus, { label: string; cls: string }> = {
    approved: { label: "Disetujui", cls: "bg-[#22C55E]/10 border-[#22C55E]/25" },
    pending: { label: "Menunggu", cls: "bg-[#F59E0B]/10 border-[#F59E0B]/25" },
    rejected: { label: "Ditolak", cls: "bg-[#EF4444]/10 border-[#EF4444]/25" },
  };
  const v = map[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-[#0F2F2E] border ${v.cls}`}
    >
      {v.label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl bg-white/80 border border-[#B2F5EA] p-8 text-center">
      <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-[#40E0D0]/10 border border-[#B2F5EA] flex items-center justify-center">
        <InboxIcon />
      </div>
      <div className="text-base font-extrabold text-[#0F2F2E]">
        Belum ada sekolah untuk diverifikasi
      </div>
      <p className="mt-2 text-sm text-[#6B8E8B]">
        Saat sekolah mengajukan penggalangan dana, data akan muncul di halaman ini.
      </p>
    </div>
  );
}

/* ===== Icons ===== */

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

function InboxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4h16v10l-2 6H6l-2-6V4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 14h5l1.5 2h3L15 14h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
