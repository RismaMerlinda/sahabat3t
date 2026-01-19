'use client';

import { useEffect, useState, useRef } from 'react';
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
      <div className="flex-1">
        <input
          placeholder="Search for something"
          className="w-full max-w-md pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
          {avatarLetter}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{user?.schoolName}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */
export default function ProfilPage() {
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [officialSchool, setOfficialSchool] = useState<any>(null);
  const [verified, setVerified] = useState<boolean | null>(null);

  const [form, setForm] = useState<any>({
    schoolName: '',
    npsn: '',
    jenjang: '',
    provinsi: '',
    jalan: '',
    detail: '',
    kepala: '',
    phone: '',
    email: '',
    deskripsi: '',
    kebutuhan: '',
  });

  /* ===== LOAD USER & AUTO FILL ===== */
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

    setForm({
      schoolName: parsed.schoolName || '',
      npsn: parsed.npsn || '',
      jenjang: parsed.jenjang || '',
      provinsi: parsed.alamat?.provinsi || '',
      jalan: parsed.alamat?.jalan || '',
      detail: parsed.alamat?.detail || '',
      kepala: parsed.kepala || '',
      phone: parsed.phone || '',
      email: parsed.email || '',
      deskripsi: parsed.deskripsi || '',
      kebutuhan: parsed.kebutuhan || '',
    });

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

  if (!user) return null;

  const schoolName =
    officialSchool?.nama || form.schoolName || 'Sekolah';

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-white px-6 py-6 flex flex-col justify-between">
        <div>
          <h1 className="text-lg font-bold text-indigo-600 truncate">
            {schoolName}
          </h1>

          {verified && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle size={14} /> Terverifikasi Kemendikbud
            </p>
          )}

          {!verified && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <XCircle size={14} /> Belum Terverifikasi
            </p>
          )}

          <nav className="mt-8 space-y-2 text-sm">
            <MenuLink href="/dashboard" label="Dashboard" icon={<Home size={18} />} />
            <MenuLink href="/pengajuan" label="Pengajuan" icon={<ClipboardList size={18} />} />
            <MenuLink href="/ringkasan" label="Ringkasan" icon={<BarChart2 size={18} />} />
            <MenuLink href="/laporan" label="Laporan" icon={<FileText size={18} />} />
            <MenuLink href="/timeline" label="Timeline" icon={<Clock size={18} />} />
            <MenuLink href="/progres" label="Progres" icon={<TrendingUp size={18} />} />
            <MenuLink href="/profil" label="Profil" icon={<User size={18} />} active />
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

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col">
        <TopNavbar user={user} />

        <main className="p-10">
          <div className="max-w-4xl mx-auto space-y-8">

            <h1 className="text-2xl font-bold">Profil Sekolah</h1>

            {/* ===== FOTO PROFIL ===== */}
            <Section title="Profil Sekolah">
              <div className="flex gap-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <Upload size={32} className="text-gray-500" />
                </div>

                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">Upload Foto Profil Sekolah</p>
                  <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-lg">
                    <label className="bg-gray-300 px-4 py-2 rounded-md text-sm cursor-pointer">
                      Pilih File
                      <input type="file" hidden />
                    </label>
                    <span className="text-sm text-gray-500">
                      Tidak ada file yang terpilih
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Format JPG, PNG, JPEG. Maks 2MB.
                  </p>
                </div>
              </div>
            </Section>

            {/* ===== INFORMASI ===== */}
            <Section title="Informasi Akun">
              <TwoCol>
                <Input label="Nama Sekolah" value={schoolName} disabled />
                <Input label="NPSN" value={form.npsn} disabled />
                <Input label="Jenjang Pendidikan" value={form.jenjang} />
                <PhoneInput value={form.phone} setForm={setForm} />
                <Input label="Email Sekolah" value={form.email} />
              </TwoCol>
            </Section>

            <Section title="Alamat Sekolah">
              <TwoCol>
                <Input label="Provinsi/Kota" value={form.provinsi} />
                <Input label="Alamat Jalan" value={form.jalan} />
                <Input label="Detail Lainnya" value={form.detail} />
              </TwoCol>
            </Section>

            <Section title="Gambaran Singkat">
              <Textarea label="Deskripsi Singkat Kondisi Sekolah" value={form.deskripsi} />
              <Textarea label="Kebutuhan Sekolah" value={form.kebutuhan} />
            </Section>

            <div className="flex justify-end">
              <button className="px-6 py-2 bg-gray-400 text-white rounded-lg">
                Simpan Perubahan
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
      className={`flex items-center gap-3 px-4 py-2 rounded-lg
        ${active ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-indigo-50'}`}
    >
      {icon} {label}
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

function Input({ label, value, disabled }: any) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        value={value}
        disabled={disabled}
        className={`w-full mt-1 px-4 py-2 rounded-lg outline-none
          ${disabled ? 'bg-gray-200' : 'bg-gray-100'}`}
      />
    </div>
  );
}

function Textarea({ label, value }: any) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <textarea
        rows={4}
        value={value}
        className="w-full mt-1 px-4 py-2 bg-gray-100 rounded-lg outline-none"
      />
    </div>
  );
}

function PhoneInput({ value, setForm }: any) {
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    const num = e.target.value.replace(/\D/g, '');

    if (num.length < 11) setError('Minimal 11 digit');
    else if (num.length > 15) setError('Maksimal 15 digit');
    else setError('');

    setForm((prev: any) => ({ ...prev, phone: num }));
  };

  return (
    <div>
      <label className="text-sm">Telepon Sekolah</label>
      <input
        value={value}
        onChange={handleChange}
        className={`w-full mt-1 px-4 py-2 rounded-lg outline-none
          ${error ? 'border border-red-400 bg-red-50' : 'bg-gray-100'}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
