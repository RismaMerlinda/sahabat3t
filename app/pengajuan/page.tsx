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

/* ================= PAGE ================= */
export default function PengajuanPage() {
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
    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);

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
    verifySchool(parsedUser.npsn);
  }, []);

  if (!user) return <div className="p-10 text-sm text-gray-400">Memuat data akun...</div>;

  const schoolName = officialSchool?.nama || user.schoolName || 'Sekolah';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white px-6 py-6 flex flex-col justify-between">
        <div>
          <div className="mb-10">
            <h1 className="text-lg font-bold text-indigo-600 truncate">{schoolName}</h1>
            {verified === null && <p className="text-xs text-gray-400">memeriksa verifikasi...</p>}
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

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <TopNavbar user={user} />

        <main className="flex-1 p-10">
          <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Form Pengajuan Kampanye Sekolah 3T</h1>

            {/* INFORMASI UMUM */}
            <Section title="Informasi Umum Kampanye">
              <TwoCol>
                <Input label="Nama Kampanye" />
                <Input label="Kategori Kebutuhan" />
                <Input label="Wilayah Sekolah" />
                <Input label="Ringkasan Singkat Kampanye" />
              </TwoCol>
            </Section>

            {/* INFORMASI SEKOLAH */}
            <Section title="Informasi Sekolah dan Penanggung Jawab">
              <TwoCol>
                <Input label="Nama Sekolah" value={schoolName} disabled />
                <Input label="Kontak Penanggung Jawab" />
                <Input label="NPSN" value={user.npsn} disabled />
                <Input label="Nama Penanggung Jawab" />
                <Textarea label="Alamat Sekolah" />
                <Textarea label="Alamat Penanggung Jawab" />
              </TwoCol>
            </Section>

            {/* KONDISI AWAL */}
            <Section title="Kondisi Awal Sekolah">
              <TwoCol>
                <Textarea label="Latar Belakang" />
                <FileInput label="Surat Keterangan Sekolah" />
                <Textarea label="Tujuan Penggalangan Dana" />
                <FileInput label="Proposal Pengajuan" />
                <Textarea label="Manfaat yang Diharapkan" />
                <FileInput label="Foto Kondisi Sekolah" />
              </TwoCol>
            </Section>

            {/* DANA & WAKTU */}
            <Section title="Rencana Anggaran Dana dan Timeline Kegiatan">
              <TwoCol>
                <Input label="Target Dana" type="number" />
                <Input label="Tanggal Mulai Kegiatan" type="date" />
                <FileInput label="Rincian Penggunaan Dana" />
                <Input label="Tanggal Selesai Kegiatan" type="date" />
              </TwoCol>

              <div className="pt-4">
                <Checkbox
                  label="Saya menyatakan bahwa seluruh data dan informasi yang saya isikan merupakan data yang benar dan dapat dipertanggungjawabkan."
                />
              </div>
            </Section>

            {/* ACTION */}
            <div className="flex justify-end gap-3">
              <button className="px-5 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">
                Simpan Draft
              </button>
              <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
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
function MenuLink({ href, label, icon, active }: any) {
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

function Section({ title, children }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
      <h2 className="font-semibold text-gray-700">{title}</h2>
      {children}
    </div>
  );
}

function TwoCol({ children }: any) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="w-full mt-1 px-4 py-2 bg-gray-100 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>
  );
}

function Textarea({ label, ...props }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        {...props}
        className="w-full mt-1 px-4 py-2 bg-gray-100 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>
  );
}

function FileInput({ label, ...props }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        {...props}
        className="w-full mt-1 px-4 py-2 bg-gray-100 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>
  );
}

function Checkbox({ label, ...props }: any) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox"
        {...props}
        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-300"
      />
      {label}
    </label>
  );
}
