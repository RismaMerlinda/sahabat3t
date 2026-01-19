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
  ImagePlus,
  PlusCircle,
  ChevronDown,
  CheckCircle,
  XCircle,
} from 'lucide-react';

/* ================= TOP NAVBAR ================= */
function TopNavbar({ user }: any) {
  const avatarLetter =
    typeof user?.schoolName === 'string'
      ? user.schoolName.charAt(0).toUpperCase()
      : 'S';

  return (
    <div className="h-16 bg-white px-8 flex items-center justify-between">
      
      {/* SEARCH */}
      <div className="flex-1 flex justify-start">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search for something"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* PROFILE */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => (window.location.href = '/profil')}
      >
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

export default function DashboardPage() {

  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [officialSchool, setOfficialSchool] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      window.location.href = '/login';
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    if (parsedUser.npsn) {
      verifySchool(parsedUser.npsn);
    }
  }, []);

  /* ================= VERIFY SCHOOL ================= */
  const verifySchool = async (npsn: string) => {
    try {
      const res = await fetch(
        `https://api.fazriansyah.eu.org/v1/sekolah?npsn=${npsn}`
      );
      const json = await res.json();

      if (json?.data?.satuanPendidikan) {
        setVerified(true);
        setOfficialSchool(json.data.satuanPendidikan);
      } else {
        setVerified(false);
      }
    } catch {
      setVerified(false);
    }
  };

  if (!user) {
    return (
      <div className="p-10 text-sm text-gray-400">
        Memuat data akun...
      </div>
    );
  }

  /* ================= SAFE DATA ================= */
  const schoolName =
    officialSchool?.nama || user.schoolName || 'Sekolah';

  const avatarLetter =
    typeof schoolName === 'string'
      ? schoolName.charAt(0).toUpperCase()
      : 'S';

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      {/* ================= SIDEBAR ================= */}
<aside className="w-64 bg-white px-6 py-6 flex flex-col justify-between">

  <div>
    {/* SCHOOL INFO */}
    <div className="mb-10">
      <h1 className="text-lg font-bold text-indigo-600 truncate">
        {schoolName}
      </h1>

      {verified === null && (
        <p className="text-xs text-gray-400">
          memeriksa verifikasi...
        </p>
      )}

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

    {/* MENU */}
    <nav className="space-y-2 text-sm">
      <MenuLink href="/dashboard" icon={<Home size={18} />} label="Dashboard" active={pathname === '/dashboard'} />
      <MenuLink href="/pengajuan" icon={<ClipboardList size={18} />} label="Pengajuan" active={pathname === '/pengajuan'} />
      <MenuLink href="/ringkasan" icon={<BarChart2 size={18} />} label="Ringkasan" active={pathname === '/ringkasan'} />
      <MenuLink href="/laporan" icon={<FileText size={18} />} label="Laporan" active={pathname === '/laporan'} />
      <MenuLink href="/timeline" icon={<Clock size={18} />} label="Timeline" active={pathname === '/timeline'} />
      <MenuLink href="/progres" icon={<TrendingUp size={18} />} label="Progres" active={pathname === '/progres'} />
      <MenuLink href="/profil" icon={<User size={18} />} label="Profil" active={pathname === '/profil'} />
    </nav>
  </div>

  {/* LOGOUT */}
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

  <main className="flex-1 p-10">
    <div className="max-w-5xl mx-auto space-y-8">

      {/* STAT */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard title="Target Dana" value="Rp 0" color="indigo" />
        <StatCard title="Dana Terkumpul" value="Rp 0" color="blue" />
        <StatCard title="Dana Digunakan" value="Rp 0" color="emerald" />
        <StatCard
          title="Status"
          value="Belum Mengajukan"
          color="gray"
          badge="Nonaktif"
        />
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card title="Galeri Kondisi & Progress">
            <EmptyState
              icon={<ImagePlus size={36} />}
              text="Belum ada foto kondisi sekolah"
              action="Upload Foto"
            />
          </Card>

          <Card title="Timeline Kegiatan">
            <EmptyState
              icon={<PlusCircle size={36} />}
              text="Belum ada kegiatan yang diajukan"
              action="Ajukan Kegiatan"
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Ringkasan Transparansi Dana">
            <p className="text-sm text-gray-400 text-center py-8">
              Data akan muncul setelah pengajuan disetujui
            </p>
          </Card>

          <Card title="Notifikasi">
            <p className="text-sm text-gray-400 text-center py-8">
              Belum ada notifikasi
            </p>
          </Card>
        </div>
      </div>

    </div>
  </main>
</div>
    </div>
  );
}

/* ================= SIDEBAR LINK ================= */
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

/* ================= UI COMPONENTS ================= */

function StatCard({ title, value, badge, color }: any) {
  const colors: any = {
    indigo: 'text-indigo-600',
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    gray: 'text-gray-600',
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <div className="flex items-center justify-between mt-2">
        <p className={`text-lg font-semibold ${colors[color]}`}>
          {value}
        </p>
        {badge && (
          <span className="text-xs px-3 py-1 rounded-full bg-gray-200 text-gray-600">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="font-semibold text-gray-700 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({ icon, text, action }: any) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 text-gray-400 border-2 border-dashed rounded-xl">
      <div className="mb-3">{icon}</div>
      <p className="text-sm">{text}</p>
      <button className="mt-3 text-sm text-indigo-600 hover:underline">
        {action}
      </button>
    </div>
  );
}
