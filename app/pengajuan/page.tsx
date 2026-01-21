'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/axios'; // Axios instance with token
import { useForm } from 'react-hook-form';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';
import {
    ClipboardList,
    Clock,
    CheckCircle,
    X,
    Upload,
    Edit,
    Trash2,
    Plus,
    FileCheck,
    ExternalLink,
    FileText
} from 'lucide-react';

/* ================= COMPONENT: DRAFT LIST ================= */

function DraftList({ onEdit, onNew }: any) {
    const [drafts, setDrafts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDrafts = async () => {
        try {
            const res = await api.get('/proposals');
            setDrafts(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrafts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus draft ini?")) return;
        try {
            await api.delete(`/proposals/${id}`);
            toast.success("Draft dihapus");
            fetchDrafts();
        } catch (error) {
            toast.error("Gagal menghapus");
        }
    };

    if (loading) return <div className="p-8 text-center text-[#6B8E8B]">Memuat daftar...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#B2F5EA] shadow-sm flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2F2E]">Daftar Pengajuan</h1>
                    <p className="text-sm text-[#6B8E8B]">Kelola draft dan pengajuan kampanye sekolah.</p>
                </div>
                <button
                    onClick={onNew}
                    className="px-5 py-2.5 bg-[#40E0D0] text-white font-bold rounded-xl hover:bg-[#2CB1A6] transition shadow-lg shadow-[#40E0D0]/20 flex items-center gap-2"
                >
                    <Plus size={18} /> Buat Pengajuan
                </button>
            </div>

            {drafts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#B2F5EA]">
                    <div className="mx-auto w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4">
                        <ClipboardList size={32} className="text-[#6B8E8B]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F2F2E]">Belum ada Pengajuan</h3>
                    <p className="text-[#6B8E8B] mb-6">Mulai buat kampanye penggalangan dana untuk sekolah Anda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {drafts.map((item: any) => {
                        const isDraft = item.status === 'draft';
                        const isPending = item.status === 'pending';
                        const isApproved = item.status === 'approved';

                        return (
                            <div key={item._id} className="bg-white p-6 rounded-2xl border border-[#B2F5EA] hover:shadow-md transition-all flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide flex items-center gap-1
                                            ${isDraft ? 'bg-gray-100 text-gray-500' :
                                                isApproved ? 'bg-green-100 text-green-600' :
                                                    item.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                                        'bg-yellow-100 text-yellow-600' // Pending
                                            }
                                        `}>
                                            {isDraft && <Edit size={10} />}
                                            {isPending && <Clock size={10} />}
                                            {isApproved && <CheckCircle size={10} />}
                                            {isPending ? 'Menunggu Persetujuan' : item.status}
                                        </span>
                                        <span className="text-xs text-[#6B8E8B]">{new Date(item.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-bold text-[#0F2F2E] text-lg">{item.title || '(Tanpa Judul)'}</h3>
                                    <p className="text-sm text-[#6B8E8B]">{item.category || '-'}</p>
                                </div>
                                <div className="flex gap-2">
                                    {isDraft ? (
                                        <>
                                            <button onClick={() => onEdit(item)} className="p-2 text-[#6B8E8B] hover:text-[#1E8F86] hover:bg-[#F0FDFA] rounded-lg transition" title="Edit">
                                                <Edit size={20} />
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="p-2 text-[#6B8E8B] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition" title="Hapus">
                                                <Trash2 size={20} />
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => onEdit(item)} className="px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-500 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition" title="Lihat Detail">
                                            <FileText size={14} /> Lihat Detail
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}

/* ================= COMPONENT: PROPOSAL FORM ================= */

function ProposalForm({ initialData, onCancel, onSuccess, user, schoolName }: any) {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: initialData || {
            schoolName: schoolName,
            npsn: user?.npsn,
            title: '',
            category: '',
            region: '',
            description: '',
            files: {
                schoolCertificate: '',
                proposalDoc: '',
                schoolPhoto: [], // Default as Empty Array for Multi Upload
                budgetPlan: ''
            }
        }
    });

    const [isSaving, setIsSaving] = useState(false);
    const [submitAction, setSubmitAction] = useState<'save' | 'submit'>('save');

    // Check if Read Only (Not draft)
    const isReadOnly = initialData && initialData.status !== 'draft';

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            let proposalId = initialData?._id;

            // 1. SAVE / UPDATE (Only if not read-only)
            if (!isReadOnly) {
                if (proposalId) {
                    await api.put(`/proposals/${proposalId}`, data);
                } else {
                    const res = await api.post('/proposals', data);
                    proposalId = res.data._id;
                }
            }

            // 2. SUBMIT ACTION
            if (submitAction === 'submit' && !isReadOnly) {
                if (confirm("Apakah Anda yakin ingin MENGIRIM pengajuan ini?\n\nSetelah dikirim, data tidak dapat diubah lagi.")) {
                    await api.post(`/proposals/${proposalId}/submit`);
                    toast.success("Pengajuan BERHASIL DIKIRIM!");
                } else {
                    toast.success("Draft disimpan (Belum dikirim)");
                }
            } else if (!isReadOnly) {
                toast.success(initialData ? "Draft diperbarui" : "Draft disimpan");
            }

            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Gagal menyimpan pengajuan");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#B2F5EA] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2F2E] mb-1">
                        {isReadOnly ? 'Detail Pengajuan' : (initialData ? 'Edit Pengajuan' : 'Form Pengajuan Baru')}
                    </h1>
                    <p className="text-sm text-[#6B8E8B]">
                        {isReadOnly
                            ? `Status Saat Ini: ${initialData.status.toUpperCase()}`
                            : 'Isi lengkap data pengajuan Anda.'}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-[#F1F5F9] text-[#64748B] rounded-xl hover:bg-[#E2E8F0] transition text-sm font-semibold flex items-center gap-2"
                >
                    <X size={16} /> Kembali
                </button>
            </div>

            <fieldset disabled={isReadOnly} className="contents">
                <Section title="1. Informasi Umum">
                    <TwoCol>
                        <AutoField label="Nama Kampanye" name="title" register={register} placeholder="Contoh: Renovasi Perpustakaan" />
                        <AutoField label="Kategori Kebutuhan" name="category" register={register} placeholder="Contoh: Infrastruktur" />
                        <AutoField label="Wilayah Sekolah" name="region" register={register} placeholder="Contoh: Kab. Belu, NTT" />
                        <AutoField label="Ringkasan Kampanye" name="description" register={register} placeholder="Deskripsi singkat..." />
                    </TwoCol>
                </Section>

                <Section title="2. Informasi Sekolah">
                    <TwoCol>
                        <AutoField label="Nama Sekolah" name="schoolName" register={register} disabled />
                        <AutoField label="NPSN" name="npsn" register={register} disabled />
                        <AutoField label="Kontak Penanggung Jawab" name="contactPhone" register={register} placeholder="08..." />
                        <AutoField label="Nama Penanggung Jawab" name="principalName" register={register} placeholder="Nama Kepala Sekolah" />
                        <AutoField label="Alamat Sekolah" name="schoolAddress" register={register} placeholder="Jln..." />
                        <AutoField label="Alamat Penanggung Jawab" name="principalAddress" register={register} placeholder="Alamat Domisili" />
                    </TwoCol>
                </Section>

                <Section title="3. Kondisi Awal">
                    <TwoCol>
                        <AutoField label="Latar Belakang" name="background" register={register} placeholder="Jelaskan kondisi saat ini..." />
                        <UploadBox label="Surat Keterangan Sekolah" name="files.schoolCertificate" setValue={isReadOnly ? null : setValue} watch={watch} />
                        <AutoField label="Tujuan Penggalangan Dana" name="purpose" register={register} placeholder="Apa yang ingin dicapai?" />
                        <UploadBox label="Proposal Pengajuan" name="files.proposalDoc" setValue={isReadOnly ? null : setValue} watch={watch} />
                        <AutoField label="Manfaat yang Diharapkan" name="benefits" register={register} placeholder="Dampak bagi siswa/guru..." />
                        <UploadBox label="Foto Kondisi Sekolah" name="files.schoolPhoto" setValue={isReadOnly ? null : setValue} watch={watch} multiple={true} />
                    </TwoCol>
                </Section>

                <Section title="4. Rencana Dana & Waktu">
                    <TwoCol>
                        <AutoField label="Target Dana (Rp)" name="targetAmount" register={register} placeholder="Contoh: 15000000" type="number" />
                        <DateField label="Tanggal Mulai" name="startDate" register={register} />
                        <UploadBox label="Rincian Penggunaan Dana" name="files.budgetPlan" setValue={isReadOnly ? null : setValue} watch={watch} />
                        <DateField label="Tanggal Selesai" name="endDate" register={register} />
                    </TwoCol>
                </Section>
            </fieldset>

            {!isReadOnly && (
                <div className="flex justify-end gap-3 pt-4 pb-8">
                    <button
                        type="submit"
                        onClick={() => setSubmitAction('save')}
                        disabled={isSaving}
                        className="px-6 py-3 bg-white border border-[#B2F5EA] text-[#6B8E8B] font-bold rounded-xl hover:bg-[#F8FAFC] transition"
                    >
                        Simpan Draft
                    </button>
                    <button
                        type="submit"
                        onClick={() => setSubmitAction('submit')}
                        disabled={isSaving}
                        className="px-6 py-3 bg-[#40E0D0] text-white font-bold rounded-xl hover:bg-[#2CB1A6] transition shadow-lg shadow-[#40E0D0]/20 flex items-center gap-2"
                    >
                        {isSaving ? 'Memproses...' : (
                            <><Upload size={18} /> Kirim Pengajuan</>
                        )}
                    </button>
                </div>
            )}
        </form>
    );
}

/* ================= PAGE ROOT ================= */

export default function PengajuanPage() {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [officialSchool, setOfficialSchool] = useState<any>(null);
    const [verified, setVerified] = useState<boolean | null>(null);
    const [openSidebar, setOpenSidebar] = useState(false);

    // View State
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editingDraft, setEditingDraft] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (!stored) {
            window.location.href = '/login';
            return;
        }

        const parsed = JSON.parse(stored);
        setUser(parsed);

        // API PROXY
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
        } else {
            setVerified(false);
        }
    }, []);

    if (!user) return null;

    const schoolName = officialSchool?.nama || user.schoolName || 'Sekolah';

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
                    title="Pengajuan Kampanye"
                />

                <main className="p-4 md:p-8 max-w-5xl mx-auto w-full">
                    {view === 'list' ? (
                        <DraftList
                            onNew={() => {
                                setEditingDraft(null);
                                setView('form');
                            }}
                            onEdit={(draft: any) => {
                                setEditingDraft(draft);
                                setView('form');
                            }}
                        />
                    ) : (
                        <ProposalForm
                            initialData={editingDraft}
                            user={user}
                            schoolName={schoolName}
                            onCancel={() => setView('list')}
                            onSuccess={() => setView('list')}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}

/* ================= HELPERS (Updated Multiple Files) ================= */

function Section({ title, children }: any) {
    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#B2F5EA] shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-bold text-[#1E8F86] mb-6 pb-2 border-b border-[#F1F5F9]">{title}</h2>
            {children}
        </div>
    );
}

function TwoCol({ children }: any) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>;
}

function AutoField({ label, register, name, disabled, placeholder, type = "text" }: any) {
    return (
        <div>
            <label className="text-sm font-semibold text-[#0F2F2E] mb-2 block">{label}</label>
            {type === 'textarea' || !type || type === 'text' ? (
                <textarea
                    rows={1}
                    disabled={disabled}
                    placeholder={placeholder}
                    {...(register ? register(name) : {})}
                    className={`w-full px-4 py-3 h-[50px] rounded-xl outline-none resize-none transition text-sm font-medium
                    ${disabled
                            ? 'bg-[#F1F5F9] text-[#64748B] border border-transparent cursor-not-allowed'
                            : 'bg-[#F8FAFC] text-[#0F2F2E] border border-[#E2E8F0] focus:border-[#40E0D0] focus:bg-white focus:ring-2 focus:ring-[#CCFBF1]'
                        }`}
                />
            ) : (
                <input
                    type={type}
                    disabled={disabled}
                    placeholder={placeholder}
                    {...(register ? register(name) : {})}
                    className="w-full px-4 py-3 h-[50px] bg-[#F8FAFC] text-[#0F2F2E] rounded-xl outline-none border border-[#E2E8F0] focus:border-[#40E0D0] focus:bg-white focus:ring-2 focus:ring-[#CCFBF1] transition text-sm font-medium"
                />
            )}
        </div>
    );
}

function DateField({ label, register, name }: any) {
    return (
        <div>
            <label className="text-sm font-semibold text-[#0F2F2E] mb-2 block">{label}</label>
            <input
                type="date"
                {...(register ? register(name) : {})}
                className="w-full px-4 py-3 h-[50px] bg-[#F8FAFC] text-[#0F2F2E] rounded-xl outline-none border border-[#E2E8F0] focus:border-[#40E0D0] focus:bg-white focus:ring-2 focus:ring-[#CCFBF1] transition text-sm font-medium"
            />
        </div>
    );
}

function UploadBox({ label, name, setValue, watch, multiple = false }: any) {
    const ref = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Watch current value
    const rawValue = watch ? watch(name) : null;

    // Normalize value for multi/single
    const files = multiple
        ? (Array.isArray(rawValue) ? rawValue : (rawValue ? [rawValue] : []))
        : (rawValue ? [rawValue] : []);

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

            if (setValue) {
                if (multiple) {
                    setValue(name, [...files, res.data.url]);
                } else {
                    setValue(name, res.data.url);
                }
                toast.success("File berhasil diupload");
            }
        } catch (err) {
            console.error(err);
            toast.error("Gagal upload file");
        } finally {
            setUploading(false);
            if (ref.current) ref.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        if (multiple) {
            const newFiles = [...files];
            newFiles.splice(index, 1);
            setValue(name, newFiles);
        } else {
            setValue(name, '');
        }
    };

    return (
        <div>
            <label className="text-sm font-semibold text-[#0F2F2E] mb-2 block">
                {label} {multiple && <span className="text-[#6B8E8B] font-normal text-xs">(Bisa upload banyak)</span>}
            </label>

            <div className="space-y-3">
                {/* File List */}
                {files.length > 0 && files.map((url: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <FileCheck size={18} className="text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-green-700 font-medium truncate">{url.split('/').pop()}</p>
                            <a href={url} target="_blank" className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                                <ExternalLink size={10} /> Lihat File
                            </a>
                        </div>
                        {setValue && ( // Only show delete button if setValue provided (writable)
                            <button
                                type="button"
                                onClick={() => removeFile(idx)}
                                className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}

                {/* Upload Button */}
                {(!setValue) ? null : (!multiple && files.length > 0) ? null : (
                    <div
                        onClick={() => !uploading && ref.current?.click()}
                        className={`w-full h-[50px] bg-[#F8FAFC] rounded-xl flex items-center gap-3 px-4 cursor-pointer hover:bg-[#E6FFFA] border border-dashed border-[#CBD5E1] hover:border-[#40E0D0] transition group
                            ${uploading ? 'opacity-70 cursor-wait' : ''}
                        `}
                    >
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-[#E2E8F0] group-hover:border-[#40E0D0]">
                            <Upload size={16} className={`${uploading ? 'animate-bounce' : ''} text-[#6B8E8B] group-hover:text-[#1E8F86] transition`} />
                        </div>
                        <span className="text-sm text-[#94A3B8] group-hover:text-[#40E0D0] font-medium">
                            {uploading ? 'Mengupload...' : (multiple ? 'Tambah File Foto (+)' : 'Upload file (PDF, JPG)')}
                        </span>
                    </div>
                )}
            </div>

            <input ref={ref} type="file" hidden onChange={handleFile} disabled={uploading} />
        </div>
    );
}
