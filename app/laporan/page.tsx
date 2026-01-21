'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';
import {
  Upload, Plus, FileCheck, Trash2, ExternalLink, Clock, FileText
} from 'lucide-react';

/* ================= PAGE CONTENT ================= */

export default function LaporanPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [officialSchool, setOfficialSchool] = useState<any>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  // Data State
  const [approvedProposals, setApprovedProposals] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();
  const [submitStatus, setSubmitStatus] = useState<'draft' | 'submitted'>('draft');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

    // Fetch School verification
    if (parsed.npsn) {
      fetch(`/api/verifikasi-sekolah?npsn=${parsed.npsn}`)
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
    }

    // Fetch Data
    fetchInitialData();

  }, []);

  const fetchInitialData = async () => {
    try {
      const [propRes, repRes] = await Promise.all([
        api.get('/proposals'),
        api.get('/reports')
      ]);

      const approved = propRes.data.filter((p: any) => p.status === 'approved');
      setApprovedProposals(approved);
      setReports(repRes.data);
    } catch (error) {
      console.error("Failed fetch data", error);
    } finally {
      setLoadingProposals(false);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      setReports(res.data);
    } catch (err) { console.error(err) }
  };

  const onSubmit = async (data: any) => {
    if (!data.proposalId) {
      toast.error("Pilih Proposal terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        status: submitStatus
      };

      await api.post('/reports', payload);
      toast.success(submitStatus === 'draft' ? "Draft tersimpan" : "Laporan berhasil dikirim!");
      reset();
      fetchReports();
      scrollToHistory();

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menyimpan laporan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (!confirm("Hapus laporan ini?")) return;
    try {
      await api.delete(`/reports/${id}`);
      toast.success("Laporan dihapus");
      fetchReports();
    } catch (error) {
      toast.error("Gagal menghapus");
    }
  };

  const scrollToHistory = () => {
    const element = document.getElementById('riwayat-laporan');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

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
          title="Laporan Pertanggungjawaban"
        />

        <main className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-6">

          {/* Intro Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0F2F2E]">Buat Laporan Baru</h1>
              <p className="text-sm text-[#6B8E8B]">Laporkan penggunaan dana secara transparan.</p>
            </div>
            <button
              onClick={scrollToHistory}
              className="bg-[#CCFBF1] text-[#1E8F86] px-5 py-2.5 rounded-xl font-bold hover:bg-[#bbf0e5] transition border border-[#B2F5EA] text-sm flex items-center gap-2"
            >
              <Clock size={18} /> Riwayat Laporan
            </button>
          </div>

          {/* Report Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 md:p-8 rounded-2xl border border-[#B2F5EA] shadow-sm">
            <div className="space-y-6">
              {/* Select Proposal Section */}
              <div>
                <label className="text-sm font-semibold text-[#0F2F2E] mb-2 block">Pilih Kampanye / Pengajuan</label>
                <div className="relative">
                  <select
                    {...register('proposalId', { required: true })}
                    className="w-full px-4 py-3 bg-[#F8FAFC] text-[#0F2F2E] rounded-xl outline-none border border-[#E2E8F0] focus:border-[#40E0D0] focus:ring-2 focus:ring-[#CCFBF1] transition text-sm font-medium appearance-none"
                  >
                    <option value="">-- Pilih Kampanye yang Disetujui --</option>
                    {approvedProposals.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.title} (Disetujui)
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B8E8B]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                  </div>
                </div>
              </div>

              <Section title="Informasi Kegiatan">
                <TwoCol>
                  <AutoField label="Judul Laporan" name="title" register={register} placeholder="Contoh: Pembelian Semen Tahap 1" required />
                  <DateField label="Tanggal Transaksi" name="transactionDate" register={register} required />
                  <AutoField label="Deskripsi Penggunaan" name="description" register={register} placeholder="Jelaskan detail pengeluaran..." />
                  <AutoField label="Pihak Penerima Dana" name="recipient" register={register} placeholder="Contoh: Toko Bangunan Abadi" />
                </TwoCol>
              </Section>

              <Section title="Rincian Dana">
                <TwoCol>
                  <AutoField label="Nominal Dana (Rp)" name="amount" register={register} placeholder="Contoh: 500000" type="number" required />
                  <UploadBox label="Upload Bukti Struk/Nota" name="evidence" setValue={setValue} watch={watch} />
                </TwoCol>
              </Section>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F1F5F9] mt-8">
                <button
                  type="submit"
                  onClick={() => setSubmitStatus('draft')}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#F1F5F9] text-[#64748B] font-bold rounded-xl hover:bg-[#E2E8F0] transition flex items-center gap-2"
                >
                  Simpan Draft
                </button>
                <button
                  type="submit"
                  onClick={() => setSubmitStatus('submitted')}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#40E0D0] text-white font-bold rounded-xl hover:bg-[#2CB1A6] transition shadow-lg shadow-[#40E0D0]/20 flex items-center gap-2"
                >
                  <Upload size={18} /> {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
                </button>
              </div>
            </div>
          </form>

          {/* Report List History */}
          <div className="pt-8" id="riwayat-laporan">
            <h2 className="text-lg font-bold text-[#0F2F2E] mb-4">Laporan Terbaru</h2>

            {reports.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-[#B2F5EA] text-center">
                <div className="mx-auto w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4">
                  <FileText size={32} className="text-[#6B8E8B]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F2F2E]">Belum ada laporan</h3>
                <p className="text-[#6B8E8B]">Laporan yang Anda kirim akan muncul di sini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {reports.map((item: any) => (
                  <div key={item._id} className="bg-white p-6 rounded-2xl border border-[#B2F5EA] hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide
                                                    ${item.status === 'draft' ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}
                                                `}>
                          {item.status === 'draft' ? 'Draft' : 'Terkirim'}
                        </span>
                        <span className="text-xs text-[#6B8E8B]">{new Date(item.transactionDate).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-[#0F2F2E] text-lg">{item.title}</h3>
                      <p className="text-sm text-[#6B8E8B] text-ellipsis line-clamp-1">{item.description}</p>
                      <p className="text-xs text-[#1E8F86] font-semibold mt-1">Rp {Number(item.amount).toLocaleString('id-ID')}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.evidence && (
                        <a href={item.evidence} target="_blank" className="flex items-center gap-1 text-xs text-blue-500 hover:underline bg-blue-50 px-3 py-1.5 rounded-lg">
                          <ExternalLink size={12} /> Bukti
                        </a>
                      )}
                      {item.status === 'draft' && (
                        <button onClick={() => handleDeleteReport(item._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition" title="Hapus">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}

/* ================= HELPERS (Styled + Functional) ================= */

function Section({ title, children }: any) {
  return (
    <div>
      <h3 className="text-[#1E8F86] font-bold mb-4 pb-2 border-b border-[#F1F5F9] flex items-center gap-2">
        <FileCheck size={18} /> {title}
      </h3>
      {children}
    </div>
  );
}

function TwoCol({ children }: any) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>;
}

function AutoField({ label, name, register, placeholder, type = "text", required }: any) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#0F2F2E] mb-2 block">{label} {required && '*'}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...(register ? register(name, { required }) : {})}
        className="w-full px-4 py-3 bg-[#F8FAFC] text-[#0F2F2E] rounded-xl outline-none border border-[#E2E8F0] focus:border-[#40E0D0] focus:bg-white focus:ring-2 focus:ring-[#CCFBF1] transition text-sm font-medium"
      />
    </div>
  );
}

function DateField({ label, name, register, required }: any) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#0F2F2E] mb-2 block">{label} {required && '*'}</label>
      <input
        type="date"
        {...(register ? register(name, { required }) : {})}
        className="w-full px-4 py-3 bg-[#F8FAFC] text-[#0F2F2E] rounded-xl outline-none border border-[#E2E8F0] focus:border-[#40E0D0] focus:bg-white focus:ring-2 focus:ring-[#CCFBF1] transition text-sm font-medium"
      />
    </div>
  );
}

function UploadBox({ label, name, setValue, watch }: any) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const fileUrl = watch ? watch(name) : null;

  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (setValue) setValue(name, res.data.url);
      toast.success("Uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="text-sm font-semibold text-[#0F2F2E] mb-2 block">{label}</label>

      {fileUrl ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
          <FileCheck size={18} className="text-green-600" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-green-700 font-medium truncate">File Terunggah</p>
            <a href={fileUrl} target="_blank" className="text-[10px] text-blue-500 hover:underline">Lihat</a>
          </div>
          {setValue && (
            <button type="button" onClick={() => setValue(name, '')} className="text-red-400 p-2 hover:bg-red-100 rounded">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ) : (
        <>
          <div
            onClick={() => !uploading && ref.current?.click()}
            className={`w-full h-[50px] bg-[#F8FAFC] rounded-xl flex items-center gap-3 px-4 cursor-pointer hover:bg-[#E6FFFA] border border-dashed border-[#CBD5E1] hover:border-[#40E0D0] transition group ${uploading ? 'opacity-50' : ''}`}
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-[#E2E8F0] group-hover:border-[#40E0D0]">
              <Upload size={16} className={`${uploading ? 'animate-bounce' : ''} text-[#6B8E8B] group-hover:text-[#1E8F86] transition`} />
            </div>
            <span className="text-sm text-[#94A3B8] group-hover:text-[#40E0D0] font-medium">
              {uploading ? 'Uploading...' : 'Upload Dokumen / Foto'}
            </span>
          </div>
          <input ref={ref} type="file" hidden onChange={handleFile} disabled={uploading} />
        </>
      )}
    </div>
  );
}
