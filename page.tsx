'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Upload,
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
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
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

/* ================= PAGE ================= */
export default function LaporanPage() {
  const pathname = usePathname();
  const router = useRouter();

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

            {verified === null && (
              <p className="text-xs text-gray-400">memeriksa verifikasi...</p>
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

          <nav className="space-y-2 text-sm">
            <MenuLink href="/dashboard" icon={<Home size={18} />} label="Dashboard" active={pathname === '/dashboard'} />
            <MenuLink href="/pengajuan" icon={<ClipboardList size={18} />} label="Pengajuan" />
            <MenuLink href="/ringkasan" icon={<BarChart2 size={18} />} label="Ringkasan" />
            <MenuLink href="/laporan" icon={<FileText size={18} />} label="Laporan" active />
            <MenuLink href="/timeline" icon={<Clock size={18} />} label="Timeline" />
            <MenuLink href="/progres" icon={<TrendingUp size={18} />} label="Progres" />
            <MenuLink href="/profil" icon={<User size={18} />} label="Profil" />
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
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Kembali
            </button>

            <h1 className="text-3xl font-bold">
              Form Laporan Penggunaan Dana
            </h1>

            <Section title="Informasi Kegiatan">
              <TwoCol>
                <AutoField label="Judul Kegiatan" />
                <DateField label="Tanggal Kegiatan" />
                <AutoField label="Deskripsi Kegiatan" />
              </TwoCol>
            </Section>

            <Section title="Informasi Dana">
              <TwoCol>
                <AutoField label="Nominal Dana Terpakai (Rp)" placeholder="Contoh: 500000" />
                <UploadBox label="Upload Bukti Pembayaran" />
              </TwoCol>

              <p className="text-sm text-gray-500 mt-4">
                Status: <span className="font-medium">Draft</span>
              </p>
            </Section>

            <div className="flex justify-end gap-3">
              <button className="px-5 py-2 bg-gray-200 rounded-lg">
                Simpan Draft
              </button>
              <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg">
                Kirim Laporan
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function MenuLink({ href, icon, label, active }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
        ${active
          ? 'bg-indigo-100 text-indigo-600 font-medium'
          : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
        }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function TwoCol({ children }: any) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

/* === AUTO FIELD: ENTER + AUTO HEIGHT + NO SCROLLBAR === */
function AutoField({ label, value, disabled, placeholder }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <textarea
        rows={1}
        defaultValue={value}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full mt-1 px-4 py-2 h-[42px] rounded-lg resize-none outline-none
          ${disabled ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-gray-100'}
        `}
      />
    </div>
  );
}

function DateField({ label }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="date"
        className="w-full mt-1 px-4 py-2 h-[42px] bg-gray-100 rounded-lg outline-none"
      />
    </div>
  );
}

function UploadBox({ label }: any) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div
        onClick={() => ref.current?.click()}
        className="w-full mt-1 h-[42px] bg-gray-100 rounded-lg flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200"
      >
        <Upload size={18} className="text-indigo-600" />
        <span className="text-sm text-gray-600">
          Upload file (JPG, PNG, PDF, WORD, DLL)
        </span>
      </div>

      <input
        ref={ref}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
        hidden
      />
    </div>
  );
}
