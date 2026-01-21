'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';
import {
  Edit3, Save, MapPin, Phone, Mail, CheckCircle, XCircle
} from 'lucide-react';

/* ================= PAGE CONTENT ================= */
export default function ProfilPage() {
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [officialSchool, setOfficialSchool] = useState<any>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  const [form, setForm] = useState<any>({
    schoolName: '',
    npsn: '',
    jenjang: '',
    provinsi: '',
    jalan: '',
    detail: '',
    phone: '',
    email: '',
    deskripsi: '',
    kebutuhan: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

    if (parsed.npsn) {
      fetch(`/api/verifikasi-sekolah?npsn=${parsed.npsn}`)
        .then(res => res.json())
        .then(json => {
          if (json?.data?.satuanPendidikan) {
            setVerified(true);
            setOfficialSchool(json.data.satuanPendidikan);

            // Auto fill from Kemendikbud if available
            setForm((prev: any) => ({
              ...prev,
              schoolName: json.data.satuanPendidikan.nama,
              npsn: json.data.satuanPendidikan.npsn,
              jalan: json.data.satuanPendidikan.alamat_jalan,
              provinsi: "Indonesia", // Default for now
            }));

          } else {
            setVerified(false);
          }
        })
        .catch(() => setVerified(false));
    } else {
      setVerified(false);
    }

    // Initialize with local data if available
    setForm((prev: any) => ({
      ...prev,
      schoolName: parsed.schoolName || prev.schoolName,
      npsn: parsed.npsn || prev.npsn,
      email: parsed.email || prev.email,
    }));

  }, []);

  const handleSave = () => {
    // Mock Save
    toast.success("Perubahan profil berhasil disimpan (Mock)");
    setIsEditing(false);
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#E6FFFA]">
      <Sidebar
        user={user}
        open={openSidebar}
        setOpen={setOpenSidebar}
        pathname={pathname}
        verified={verified}
        officialName={officialSchool?.nama}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          setOpen={setOpenSidebar}
          officialName={officialSchool?.nama}
          title="Profil Sekolah"
        />

        <main className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0F2F2E]">Profil Sekolah</h1>
              <p className="text-sm text-[#6B8E8B]">Kelola informasi sekolah dan data verifikasi.</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#CCFBF1] text-[#1E8F86] px-5 py-2.5 rounded-xl font-bold hover:bg-[#bbf0e5] transition flex items-center gap-2 text-sm"
              >
                <Edit3 size={18} /> Edit Profil
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-white text-[#6B8E8B] border border-[#B2F5EA] px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#40E0D0] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#2CB1A6] transition shadow-lg shadow-[#40E0D0]/20 flex items-center gap-2 text-sm"
                >
                  <Save size={18} /> Simpan
                </button>
              </div>
            )}
          </div>

          {/* CARD 1: HERO & PHOTO (Improved Layout) */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#B2F5EA] overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[#ccfbf1] to-[#99f6e4]"></div>

            <div className="px-8 pb-8">
              <div className="relative flex flex-col md:flex-row gap-6 items-end -mt-12">
                <div className="w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center shrink-0 z-10">
                  <div className="w-full h-full bg-[#E6FFFA] rounded-xl flex items-center justify-center text-[#40E0D0] text-5xl font-bold">
                    {officialSchool?.nama?.charAt(0) || user.schoolName?.charAt(0) || 'S'}
                  </div>
                </div>

                <div className="flex-1 pb-2 space-y-1 w-full text-center md:text-left">
                  <h2 className="text-2xl font-bold text-[#0F2F2E] leading-tight">
                    {officialSchool?.nama || user.schoolName}
                  </h2>
                  <div className="flex flex-col md:flex-row items-center gap-3 text-[#6B8E8B] text-sm md:justify-start justify-center">
                    <span className="flex items-center gap-2 font-medium bg-gray-50 px-2 py-1 rounded-lg">
                      <Mail size={14} /> {user.email}
                    </span>

                    {verified && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold border border-green-200 flex items-center gap-1">
                        <CheckCircle size={12} /> Terverifikasi
                      </span>
                    )}
                    {!verified && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs font-bold border border-red-200 flex items-center gap-1">
                        <XCircle size={12} /> Belum Terverifikasi
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: FORM */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#B2F5EA]">
            <h3 className="text-lg font-bold text-[#0F2F2E] mb-6 border-b border-[#F1F5F9] pb-4">Informasi Detail</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nama Sekolah"
                value={form.schoolName}
                onChange={(val: string) => setForm({ ...form, schoolName: val })}
                disabled={!isEditing}
              />
              <InputField
                label="NPSN"
                value={form.npsn}
                onChange={(val: string) => setForm({ ...form, npsn: val })}
                disabled // NPSN always disabled
              />
              <InputField
                label="Alamat / Jalan"
                value={form.jalan}
                onChange={(val: string) => setForm({ ...form, jalan: val })}
                disabled={!isEditing}
                icon={<MapPin size={16} className="text-[#6B8E8B]" />}
              />
              <InputField
                label="Nomor Telepon"
                value={form.phone}
                onChange={(val: string) => setForm({ ...form, phone: val })}
                disabled={!isEditing}
                icon={<Phone size={16} className="text-[#6B8E8B]" />}
              />
              <InputField
                label="Email Resmi"
                value={form.email}
                onChange={(val: string) => setForm({ ...form, email: val })}
                disabled={!isEditing}
                icon={<Mail size={16} className="text-[#6B8E8B]" />}
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-[#0F2F2E] mb-2 block">Deskripsi Sekolah</label>
              <textarea
                className={`w-full p-4 rounded-xl border ${!isEditing ? 'bg-[#F8FAFC] border-transparent text-[#64748B]' : 'bg-white border-[#B2F5EA] text-[#0F2F2E] focus:ring-2 focus:ring-[#CCFBF1]'} outline-none transition h-32 resize-none`}
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                disabled={!isEditing}
                placeholder={isEditing ? "Tuliskan deskripsi singkat sekolah..." : "Belum ada deskripsi"}
              />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, disabled, icon }: any) {
  return (
    <div>
      <label className="text-sm font-bold text-[#0F2F2E] mb-2 block">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl border outline-none transition font-medium text-sm
                        ${icon ? 'pl-10' : ''}
                        ${disabled
              ? 'bg-[#F8FAFC] border-transparent text-[#64748B] cursor-not-allowed'
              : 'bg-white border-[#B2F5EA] text-[#0F2F2E] focus:border-[#40E0D0] focus:ring-2 focus:ring-[#CCFBF1]'
            }
                    `}
        />
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
