'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';
import {
    ClipboardList,
    BarChart2,
    Clock,
    TrendingUp,
    Image as ImageIcon,
    ChevronRight,
    AlertCircle,
    CheckCircle,
    XCircle
} from 'lucide-react';

/* ================= TYPES ================= */
interface UserData {
    schoolName: string;
    email: string;
    npsn?: string;
}

/* ================= COMPONENTS (LOCAL) ================= */

function StatCard({ title, value, icon, type = 'info' }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-[#B2F5EA] hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${type === 'primary' ? 'bg-[#E6FFFA] text-[#1E8F86]' :
                    type === 'warning' ? 'bg-orange-50 text-orange-500' :
                        'bg-gray-50 text-[#6B8E8B]'
                    }`}>
                    {icon}
                </div>
            </div>
            <p className="text-sm text-[#6B8E8B] font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-[#0F2F2E]">{value}</h3>
        </div>
    );
}

function SectionCard({ title, children, actionLabel, onAction }: any) {
    return (
        <div className="bg-white rounded-2xl border border-[#B2F5EA] overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-[#F1F5F9] flex justify-between items-center">
                <h3 className="font-bold text-[#0F2F2E]">{title}</h3>
                {actionLabel && (
                    <button
                        onClick={onAction}
                        className="text-xs font-semibold text-[#40E0D0] hover:text-[#1E8F86] transition flex items-center gap-1"
                    >
                        {actionLabel} <ChevronRight size={14} />
                    </button>
                )}
            </div>
            <div className="p-5 flex-1">
                {children}
            </div>
        </div>
    );
}

function EmptyState({ icon, title, description, action, onAction }: any) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-8 h-full min-h-[200px]">
            <div className="p-4 bg-[#F8FAFC] rounded-full mb-4 text-[#6B8E8B] border border-dashed border-[#B2F5EA]">
                {icon}
            </div>
            <h4 className="text-sm font-bold text-[#0F2F2E] mb-1">{title}</h4>
            <p className="text-xs text-[#6B8E8B] max-w-[200px] mb-4 leading-relaxed">{description}</p>
            {action && (
                <button
                    onClick={onAction}
                    className="px-4 py-2 bg-[#E6FFFA] text-[#1E8F86] text-xs font-bold rounded-lg hover:bg-[#CCFBF1] transition"
                >
                    {action}
                </button>
            )}
        </div>
    );
}

/* ================= MAIN DASHBOARD PAGE ================= */

export default function DashboardPage() {
    const pathname = usePathname();
    const router = useRouter();
    const [openSidebar, setOpenSidebar] = useState(false);

    // State
    const [user, setUser] = useState<UserData | null>(null);
    const [officialSchool, setOfficialSchool] = useState<any>(null);
    const [verified, setVerified] = useState<boolean | null>(null);

    // Financial Stats
    const [stats, setStats] = useState({
        totalBudget: 0,
        usedBudget: 0,
        remainingBudget: 0
    });

    // Initial Load & Verification
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            window.location.href = '/login';
            return;
        }

        const parsed = JSON.parse(storedUser);
        setUser(parsed);

        // Fetch Kemendikbud Data via Next.js API Route (Same Origin - No CORS)
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
                .catch((err) => {
                    console.error("Verification Error:", err);
                    setVerified(false);
                });
        }

        // Fetch Financial Data
        fetchFinancialData();

    }, []);

    const fetchFinancialData = async () => {
        try {
            const [proposalsRes, reportsRes] = await Promise.all([
                api.get('/proposals'),
                api.get('/reports')
            ]);

            // Calculate Total Budget (Target Amount of Approved Proposals)
            const approvedProposals = proposalsRes.data.filter((p: any) => p.status === 'approved');
            const totalBudget = approvedProposals.reduce((sum: number, p: any) => sum + (Number(p.targetAmount) || 0), 0);

            // Calculate Used Budget (Sum of Report Amounts - Submitted)
            const submittedReports = reportsRes.data.filter((r: any) => r.status === 'submitted');
            const usedBudget = submittedReports.reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0);

            setStats({
                totalBudget,
                usedBudget,
                remainingBudget: totalBudget - usedBudget
            });

        } catch (error) {
            console.error("Failed to fetch financial stats", error);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex bg-[#E6FFFA]">
            {/* 1. SIDEBAR */}
            <Sidebar
                user={user}
                open={openSidebar}
                setOpen={setOpenSidebar}
                pathname={pathname}
                verified={verified}
                officialName={officialSchool?.nama}
            />

            <div className="flex-1 flex flex-col min-w-0">
                {/* 2. HEADER */}
                <Header
                    user={user}
                    setOpen={setOpenSidebar}
                    officialName={officialSchool?.nama}
                    title="Dashboard Sekolah"
                />

                <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-8">

                    {/* 3. SUMMARY CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Anggaran Disetujui"
                            value={formatCurrency(stats.totalBudget)}
                            icon={<ClipboardList size={24} />}
                            type="primary"
                        />
                        <StatCard
                            title="Dana Digunakan (Laporan)"
                            value={formatCurrency(stats.usedBudget)}
                            icon={<TrendingUp size={24} />}
                            type="warning"
                        />
                        <StatCard
                            title="Sisa Anggaran"
                            value={formatCurrency(stats.remainingBudget)}
                            icon={<BarChart2 size={24} />}
                            type="primary"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">

                        {/* 4. MAIN CONTENT (LEFT COL) */}
                        <div className="space-y-8">
                            {/* A. GALERI */}
                            <div className="h-[320px]">
                                <SectionCard
                                    title="Galeri Dokumentasi"
                                    actionLabel="Lihat Semua"
                                    onAction={() => router.push('/progress')}
                                >
                                    <EmptyState
                                        icon={<ImageIcon size={32} />}
                                        title="Belum ada dokumentasi"
                                        description="Upload foto perkembangan sekolah untuk transparansi."
                                        action="Upload Foto"
                                        onAction={() => router.push('/progress')}
                                    />
                                </SectionCard>
                            </div>

                            {/* B. TIMELINE KEGIATAN */}
                            <div className="h-[320px]">
                                <SectionCard
                                    title="Timeline Kegiatan"
                                    actionLabel="Lihat Timeline"
                                    onAction={() => router.push('/timeline')}
                                >
                                    <EmptyState
                                        icon={<Clock size={32} />}
                                        title="Belum ada kegiatan"
                                        description="Jadwal kegiatan yang akan datang akan muncul di sini."
                                        action="Buat Kegiatan"
                                        onAction={() => router.push('/timeline')}
                                    />
                                </SectionCard>
                            </div>
                        </div>

                        {/* 5. RIGHT PANEL */}
                        <div className="space-y-8">
                            {/* INFO SEKOLAH */}
                            <SectionCard
                                title="Informasi Sekolah"
                                actionLabel="Edit"
                                onAction={() => router.push('/profil')}
                            >
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-[#6B8E8B] mb-1">Nama Sekolah</p>
                                        <p className="font-semibold text-[#0F2F2E]">
                                            {officialSchool?.nama || user.schoolName || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#6B8E8B] mb-1">NPSN</p>
                                        <p className="font-semibold text-[#0F2F2E]">{user.npsn || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#6B8E8B] mb-1">Lokasi</p>
                                        <p className="text-sm font-medium text-[#4A6F6C] italic">{officialSchool?.alamat_jalan || 'Belum diisi'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#6B8E8B] mb-1">Penanggung Jawab</p>
                                        <p className="text-sm font-medium text-[#4A6F6C] italic">Belum diisi</p>
                                    </div>
                                </div>
                            </SectionCard>

                            {/* TRANSPARANSI DANA & NOTIF */}
                            <SectionCard title="Notifikasi Baru">
                                <EmptyState
                                    icon={<AlertCircle size={28} />}
                                    title="Tidak ada notifikasi"
                                    description="Anda akan mendapat pemberitahuan penting di sini."
                                />
                            </SectionCard>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
