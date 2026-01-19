'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ClipboardList,
  BarChart2,
  FileText,
  Clock,
  TrendingUp,
  User,
  LogOut,
  CheckCircle,
  XCircle,
  ImageOff,
} from 'lucide-react';

/* ================= TOP NAVBAR ================= */
function TopNavbar({ user }: any) {
  const avatarLetter =
    typeof user?.schoolName === 'string'
      ? user.schoolName.charAt(0).toUpperCase()
      : 'S';

  return (
    <div className="h-16 bg-white px-8 flex items-center justify-between">
      <div className="flex-1 flex justify-start">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search for something"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 cursor-pointer">
        <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
          {avatarLetter}
        </div>
        <div className="text-right leading-tight">
          <p className="text-sm font-medium text-gray-800 truncate max-w-[140px]">
            {user?.schoolName}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-[140px]">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */
export default function ProgresPage() {
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [officialSchool, setOfficialSchool] = useState<any>(null);
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

    if (!parsed.npsn) {
      setVerified(false);
      return;
    }

    fetch(`https://api.fazriansyah.eu.org/v1/sekolah?npsn=${parsed.npsn}`)
      .then(res => res.json())
      .then(json => {
        if (json?.data?.satuanPendidikan) {
          setVerified(true);
          setOfficialSchool(json.data.satuanPendidikan);
        } else {
          setVerified(false);
        }
      })
      .catch(() => setVerified(false));
  }, []);

  if (!user) {
    return <div className="p-10 text-sm text-gray-400">Memuat data akun...</div>;
  }

  const schoolName =
    officialSchool?.nama || user.schoolName || 'Sekolah';

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white px-6 py-6 flex flex-col justify-between">
        <div>
          <div className="mb-10">
            <h1 className="text-lg font-bold text-indigo-600 truncate">
              {schoolName}
            </h1>

            {verified === true && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle size={14} />
                Terverifikasi Kemendikbud
              </p>
            )}

            {verified === false && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <XCircle size={14} />
                Belum Terverifikasi
              </p>
            )}
          </div>

          <nav className="space-y-2 text-sm">
            <MenuLink href="/dashboard" icon={<Home size={18} />} label="Dashboard" active={pathname === '/dashboard'} />
            <MenuLink href="/pengajuan" icon={<ClipboardList size={18} />} label="Pengajuan" active={pathname === '/pengajuan'} />
            <MenuLink href="/ringkasan" icon={<BarChart2 size={18} />} label="Ringkasan" active={pathname === '/ringkasan'} />
            <MenuLink href="/laporan" icon={<FileText size={18} />} label="Laporan" active={pathname === '/laporan'} />
            <MenuLink href="/timeline" icon={<Clock size={18} />} label="Timeline" active={pathname === '/timeline'} />
            <MenuLink href="/progres" icon={<TrendingUp size={18} />} label="Progres" active />
            <MenuLink href="/profil" icon={<User size={18} />} label="Profil" active={pathname === '/profil'} />
          </nav>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">
        <TopNavbar user={user} />

        <main className="p-10">
          <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">
              Galeri Kondisi & Progres
            </h1>

            {/* ===== EMPTY STATE (USER BARU) ===== */}
            <div className="bg-white p-12 rounded-2xl shadow text-center">
              <ImageOff size={56} className="mx-auto text-gray-400" />
              <h2 className="mt-4 text-lg font-semibold">
                Belum Ada Progres
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                Anda belum menambahkan dokumentasi kondisi awal maupun progres kegiatan.
                Setelah pengajuan disetujui, perkembangan akan ditampilkan di halaman ini.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */

function MenuLink({ href, icon, label, active }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
        ${
          active
            ? 'bg-indigo-100 text-indigo-600 font-medium'
            : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
        }`}
    >
      {icon}
      {label}
    </Link>
  );
}
