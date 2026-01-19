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
} from 'lucide-react';

/* ================= TOP NAVBAR ================= */
function TopNavbar({ user }: any) {
  const avatarLetter =
    typeof user?.schoolName === 'string'
      ? user.schoolName.charAt(0).toUpperCase()
      : 'S';

  return (
    <div className="h-16 bg-white px-8 flex items-center justify-between shadow-sm">
      <div className="flex-1 max-w-md relative">
        <input
          type="text"
          placeholder="Search for something"
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

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

export default function RingkasanPage() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [officialSchool, setOfficialSchool] = useState<any>(null);

  const [summary, setSummary] = useState({
    totalDonatur: 0,
    sisaHari: 0,
    targetDana: 0,
    danaTerkumpul: 0,
    danaTerpakai: 0,
    status: 'Draft',
  });

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

    setSummary({
      totalDonatur: 0,
      sisaHari: 0,
      targetDana: 0,
      danaTerkumpul: 0,
      danaTerpakai: 0,
      status: 'Draft',
    });
  }, []);

  const verifySchool = async (npsn: string) => {
    try {
      const res = await fetch(`https://api.fazriansyah.eu.org/v1/sekolah?npsn=${npsn}`);
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
    return <div className="p-10 text-sm text-gray-400">Memuat data akun...</div>;
  }

  const schoolName = officialSchool?.nama || user.schoolName || 'Sekolah';

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <aside className="w-64 bg-white px-6 py-6 flex flex-col justify-between">
        <div>
          <div className="mb-10">
            <h1 className="text-lg font-bold text-indigo-600 truncate">{schoolName}</h1>
            {verified === true && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle size={14} /> Terverifikasi Kemendikbud
              </p>
            )}
            {verified === false && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <XCircle size={14} /> Belum Terverifikasi
              </p>
            )}
          </div>

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

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        <TopNavbar user={user} />

        <main className="flex-1 p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Ringkasan Kampanye</h1>
              <p className="text-sm text-gray-500">Pemantauan data transaksi kampanye</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <SummaryCard title="Jumlah Donatur" value={summary.totalDonatur} suffix="Donatur" />
              <SummaryCard title="Sisa Hari Kampanye" value={summary.sisaHari} suffix="Hari" />
              <SummaryCard title="Target Dana" value={`Rp ${summary.targetDana.toLocaleString('id-ID')}`} />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <SummaryCard title="Total Dana Terkumpul" value={`Rp ${summary.danaTerkumpul.toLocaleString('id-ID')}`} />
              <SummaryCard title="Dana Terpakai" value={`Rp ${summary.danaTerpakai.toLocaleString('id-ID')}`} />
              <StatusCard status={summary.status} />
            </div>

            <Card title="Grafik Progres Dana">
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                Grafik akan muncul setelah terdapat transaksi dana
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function MenuLink({ href, icon, label, active }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
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

function SummaryCard({ title, value, suffix }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-700 mt-2">
        {value} {suffix && <span className="text-base">{suffix}</span>}
      </p>
    </div>
  );
}

function StatusCard({ status }: any) {
  const map: any = {
    Draft: 'text-gray-500',
    Ditinjau: 'text-yellow-500',
    Publik: 'text-green-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <p className="text-sm text-gray-500 mb-4">Status Kampanye</p>
      <div className="flex items-center justify-center h-24">
        <span className={`text-lg font-semibold ${map[status]}`}>{status}</span>
      </div>
      <div className="flex justify-center gap-4 text-xs text-gray-400">
        <span>Draft</span>
        <span>Ditinjau</span>
        <span>Publik</span>
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
