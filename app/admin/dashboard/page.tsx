"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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

type OfficialSchool = {
  npsn?: string;
  nama?: string;
  namaSekolah?: string;
  satuanPendidikan?: string;
  alamat?: string;
  kabupaten?: string;
  kota?: string;
  provinsi?: string;
  kecamatan?: string;
};

export default function AdminDashboardPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // ✅ MOBILE SIDEBAR
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ SEARCH NPSN API
  const [npsn, setNpsn] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [officialSchool, setOfficialSchool] = useState<OfficialSchool | null>(
    null
  );

  // ✅ Guard login
  useEffect(() => {
    const ok = localStorage.getItem("admin_auth") === "true";
    if (!ok) window.location.href = "/admin";
  }, []);

  // ✅ Load data (dashboard list dari localStorage)
  useEffect(() => {
    loadSchools();
    const onFocus = () => loadSchools();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ lock scroll saat drawer kebuka (biar cakep)
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

  const verifySchool = async (npsnValue: string) => {
    const clean = (npsnValue || "").trim();
    if (!clean) {
      setVerified(false);
      setOfficialSchool(null);
      return;
    }

    setVerifying(true);
    setVerified(null);
    setOfficialSchool(null);

    try {
      const res = await fetch(
        `https://api.fazriansyah.eu.org/v1/sekolah?npsn=${encodeURIComponent(
          clean
        )}`
      );
      const json = await res.json();

      if (json?.data?.satuanPendidikan) {
        setVerified(true);
        setOfficialSchool({
          satuanPendidikan:
            json.data.satuanPendidikan?.nama ??
            json.data.satuanPendidikan?.namaSekolah,
          npsn: json.data.satuanPendidikan?.npsn ?? clean,
          alamat: json.data.satuanPendidikan?.alamat,
          kecamatan: json.data.satuanPendidikan?.kecamatan,
          kabupaten: json.data.satuanPendidikan?.kabupaten,
          kota: json.data.satuanPendidikan?.kota,
          provinsi: json.data.satuanPendidikan?.provinsi,
          nama: json.data.satuanPendidikan?.nama,
          namaSekolah: json.data.satuanPendidikan?.namaSekolah,
        });
      } else {
        setVerified(false);
        setOfficialSchool(null);
      }
    } catch {
      setVerified(false);
      setOfficialSchool(null);
    } finally {
      setVerifying(false);
    }
  };

  const stats = useMemo(() => {
    const approved = schools.filter((s) => s.status === "approved").length;
    const pending = schools.filter((s) => s.status === "pending").length;
    const rejected = schools.filter((s) => s.status === "rejected").length;
    return { approved, pending, rejected };
  }, [schools]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return schools;
    return schools.filter((s) => {
      return (
        s.namaSekolah.toLowerCase().includes(q) ||
        s.npsn.toLowerCase().includes(q) ||
        s.lokasi.toLowerCase().includes(q)
      );
    });
  }, [schools, query]);

  const officialName =
    officialSchool?.satuanPendidikan ||
    officialSchool?.namaSekolah ||
    officialSchool?.nama ||
    "-";

  const officialNpsn = officialSchool?.npsn || npsn.trim();

  const officialLocation = [
    officialSchool?.kecamatan,
    officialSchool?.kabupaten || officialSchool?.kota,
    officialSchool?.provinsi,
  ]
    .filter(Boolean)
    .join(", ");

  // Sidebar content biar gak dobel
  const SidebarContent = (
    <div className="h-full flex flex-col">
      <div className="px-6 py-6">
        <div className="text-lg font-extrabold text-[#0F2F2E]">Admin</div>
        <div className="text-xs text-[#6B8E8B] mt-1">SAHABAT3T Portal</div>
      </div>

      <nav className="px-4 flex-1 space-y-2">
        <SidebarItem
          active
          label="Dashboard"
          onClick={() => setSidebarOpen(false)}
        />
        <SidebarItem label="Verifikasi" onClick={() => setSidebarOpen(false)} />
        <SidebarItem label="Laporan" onClick={() => setSidebarOpen(false)} />
        <SidebarItem
          label="Profil Sekolah"
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
      {/* overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity lg:hidden ${
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      {/* panel */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[280px] bg-white/90 border-r border-[#B2F5EA]
                    shadow-xl transition-transform lg:hidden
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {SidebarContent}
      </aside>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
        {/* SIDEBAR DESKTOP */}
        <aside className="hidden lg:block bg-white/70 lg:border-r border-[#B2F5EA]">
          {SidebarContent}
        </aside>

        {/* MAIN */}
        <div className="flex flex-col min-h-screen">
          {/* NAVBAR / TOPBAR */}
          <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-[#B2F5EA]">
            <div className="px-4 sm:px-6 lg:px-8 py-2 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                {/* ✅ hamburger mobile */}
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
                    Dashboard
                  </div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-[#0F2F2E]">
                    Dashboard Admin
                  </h1>
                </div>
              </div>

              {/* kanan: cari NPSN */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-white/85 border border-[#B2F5EA] px-4 py-2 shadow-sm hover:shadow-md transition">
                  <NpsnIcon />
                  <input
                    value={npsn}
                    onChange={(e) => setNpsn(e.target.value)}
                    placeholder="Cek NPSN (Kemendikbud)"
                    className="bg-transparent outline-none text-sm w-52 max-w-[70vw] text-[#0F2F2E]"
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    onClick={() => verifySchool(npsn)}
                    disabled={verifying}
                    aria-label="Cari sekolah"
                    className="
                      rounded-full p-2
                      bg-gradient-to-r from-[#40E0D0] to-[#2CB1A6]
                      text-white
                      shadow shadow-[#40E0D0]/25
                      hover:scale-[1.05] active:scale-95 transition
                      disabled:opacity-70 disabled:hover:scale-100
                    "
                  >
                    {verifying ? <SpinnerIcon /> : <SearchIcon />}
                  </button>
                </div>
              </div>
            </div>

            {/* hasil cari NPSN */}
            {verified !== null && (
              <div className="px-4 sm:px-6 lg:px-8 pb-4">
                {verified ? (
                  <div className="rounded-2xl border border-[#B2F5EA] bg-[#E6FFFA] p-4">
                    <div className="text-sm font-extrabold text-[#0F2F2E]">
                      Sekolah ditemukan
                    </div>
                    <div className="mt-1 text-sm text-[#4A6F6C]">
                      <span className="font-semibold text-[#0F2F2E]">
                        {officialName}
                      </span>{" "}
                      <span className="text-[#6B8E8B]">
                        • NPSN {officialNpsn}
                      </span>
                      {officialLocation ? (
                        <span className="text-[#6B8E8B]">
                          {" "}
                          • {officialLocation}
                        </span>
                      ) : null}
                    </div>

                    {officialSchool?.alamat ? (
                      <div className="mt-1 text-xs text-[#6B8E8B]">
                        {officialSchool.alamat}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#EF4444]/25 bg-[#EF4444]/10 p-4">
                    <div className="text-sm font-extrabold text-[#0F2F2E]">
                      Sekolah tidak ditemukan
                    </div>
                    <div className="mt-1 text-sm text-[#4A6F6C]">
                      Pastikan NPSN benar.
                    </div>
                  </div>
                )}
              </div>
            )}
          </header>

          <main className="p-4 sm:p-6 lg:p-8 flex-1">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Jumlah Sekolah Disetujui"
                value={stats.approved}
                foot="Disetujui"
              />
              <StatCard
                title="Sekolah Menunggu Verifikasi"
                value={stats.pending}
                foot="Menunggu"
              />
              <StatCard
                title="Jumlah Sekolah Tidak Disetujui"
                value={stats.rejected}
                foot="Ditolak"
              />
            </div>

            {/* Table */}
            <div className="mt-6 rounded-3xl bg-white/75 border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/10 overflow-hidden">
              <div className="px-6 py-4">
                <h2 className="text-base sm:text-lg font-extrabold text-[#0F2F2E]">
                  Daftar Sekolah
                </h2>
                <p className="text-sm text-[#6B8E8B] mt-1">
                  Data muncul saat sekolah mengajukan penggalangan dana.
                </p>
              </div>

              {schools.length === 0 ? (
                <div className="px-6 pb-8">
                  <div className="rounded-2xl bg-white/80 border border-[#B2F5EA] p-6 text-center">
                    <div className="text-base font-extrabold text-[#0F2F2E]">
                      Belum ada pengajuan sekolah
                    </div>
                    <p className="mt-2 text-sm text-[#6B8E8B]">
                      Saat sekolah mengisi data, daftar akan tampil di sini.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="px-4 sm:px-6 pb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-black/5 text-[#0F2F2E]">
                          <th className="text-left px-4 py-3 rounded-l-xl">
                            No
                          </th>
                          <th className="text-left px-4 py-3">Nama Sekolah</th>
                          <th className="text-left px-4 py-3">NPSN</th>
                          <th className="text-left px-4 py-3">Lokasi</th>
                          <th className="text-left px-4 py-3">Status</th>
                          <th className="text-right px-4 py-3 rounded-r-xl">
                            Aksi
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filtered.map((s, idx) => (
                          <tr
                            key={s.id}
                            className="border-b border-black/5 hover:bg-black/5 transition"
                          >
                            <td className="px-4 py-3">{idx + 1}</td>
                            <td className="px-4 py-3 font-semibold text-[#0F2F2E]">
                              {s.namaSekolah}
                            </td>
                            <td className="px-4 py-3">{s.npsn}</td>
                            <td className="px-4 py-3">{s.lokasi}</td>
                            <td className="px-4 py-3">
                              <StatusPill status={s.status} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="inline-flex gap-2">
                                <button
                                  onClick={() => updateStatus(s.id, "approved")}
                                  className="rounded-xl px-3 py-2 text-xs font-semibold
                                             bg-[#22C55E]/10 text-[#0F2F2E]
                                             border border-[#22C55E]/25 hover:shadow-md transition"
                                  type="button"
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() => updateStatus(s.id, "rejected")}
                                  className="rounded-xl px-3 py-2 text-xs font-semibold
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
                    Sumber data: localStorage key{" "}
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

function SidebarItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
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

function StatCard({
  title,
  value,
  foot,
}: {
  title: string;
  value: number;
  foot: string;
}) {
  return (
    <div className="rounded-2xl bg-white/75 border border-[#B2F5EA] shadow-lg shadow-[#40E0D0]/10 p-5 hover:shadow-xl transition">
      <div className="text-xs text-[#6B8E8B] font-semibold">{title}</div>
      <div className="mt-2 text-4xl font-extrabold text-[#0F2F2E]">{value}</div>
      <div className="mt-1 text-sm font-semibold text-[#4A6F6C]">{foot}</div>
    </div>
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

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}

function NpsnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 13h8M8 9h5M8 17h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
