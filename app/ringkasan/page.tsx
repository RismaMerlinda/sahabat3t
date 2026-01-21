'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';
import {
  PieChart,
  DollarSign,
  Activity,
  Layers,
  Clock,
  CheckCircle,
  Menu,
  Bell,
  Search
} from 'lucide-react';

/* ================= MAIN PAGE COMPONENTS ================= */

function StatCard({ title, value, icon: Icon, colorClass, subtext }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#B2F5EA] shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[#6B8E8B] text-sm font-semibold mb-1">{title}</h3>
          <p className="text-3xl font-bold text-[#0F2F2E]">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
      {subtext && <p className="text-xs text-[#6B8E8B] mt-4">{subtext}</p>}
    </div>
  );
}

function StatusDistribution({ stats }: any) {
  const total = Object.values(stats).reduce((a: any, b: any) => a + b, 0) as number;

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#B2F5EA] shadow-sm min-h-[300px]">
      <h3 className="text-lg font-bold text-[#0F2F2E] mb-6 flex items-center gap-2">
        <PieChart size={20} className="text-[#40E0D0]" />
        Status Pengajuan
      </h3>

      {total === 0 ? (
        <div className="h-40 flex items-center justify-center text-[#6B8E8B] text-sm italic">
          Belum ada data pengajuan
        </div>
      ) : (
        <div className="space-y-4">
          <StatusItem label="Draft" count={stats.draft} total={total} color="bg-gray-400" />
          <StatusItem label="Menunggu Persetujuan" count={stats.pending} total={total} color="bg-yellow-400" />
          <StatusItem label="Disetujui" count={stats.approved} total={total} color="bg-green-500" />
          <StatusItem label="Ditolak" count={stats.rejected} total={total} color="bg-red-500" />
        </div>
      )}
    </div>
  );
}

function StatusItem({ label, count, total, color }: any) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-[#0F2F2E] font-medium">{label}</span>
        <span className="text-[#6B8E8B]">{count} ({percentage}%)</span>
      </div>
      <div className="w-full bg-[#F1F5F9] rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function RecentProposals({ proposals }: any) {
  const recent = proposals.slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#B2F5EA] shadow-sm">
      <h3 className="text-lg font-bold text-[#0F2F2E] mb-6 flex items-center gap-2">
        <Activity size={20} className="text-[#40E0D0]" />
        Aktivitas Terkini
      </h3>

      {recent.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-[#6B8E8B] text-sm italic">
          Belum ada aktivitas
        </div>
      ) : (
        <div className="space-y-4">
          {recent.map((p: any) => (
            <div key={p._id} className="flex items-center gap-4 p-3 hover:bg-[#F8FAFC] rounded-xl transition border border-transparent hover:border-[#F1F5F9]">
              <div className={`w-2 h-2 rounded-full shrink-0
                                ${p.status === 'approved' ? 'bg-green-500' :
                  p.status === 'rejected' ? 'bg-red-500' :
                    p.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-400'}
                            `} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F2F2E] truncate">{p.title || 'Draft Baru'}</p>
                <p className="text-xs text-[#6B8E8B] truncate">
                  {p.status === 'pending' ? 'Menunggu Persetujuan' :
                    p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  • {new Date(p.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-xs font-bold text-[#1E8F86]">
                Rp {p.targetAmount?.toLocaleString('id-ID') || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RingkasanPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [officialSchool, setOfficialSchool] = useState<any>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  // Data State
  const [proposals, setProposals] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProposals: 0,
    totalTarget: 0,
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

    // Verification Check
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

    // Fetch Proposals
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/proposals');
      const data = res.data;
      setProposals(data);

      // Calculate Stats
      const newStats = {
        totalProposals: data.length,
        totalTarget: data.reduce((sum: number, item: any) => sum + (Number(item.targetAmount) || 0), 0),
        draft: data.filter((i: any) => i.status === 'draft').length,
        pending: data.filter((i: any) => i.status === 'pending').length,
        approved: data.filter((i: any) => i.status === 'approved').length,
        rejected: data.filter((i: any) => i.status === 'rejected').length
      };
      setStats(newStats);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
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
          title="Ringkasan & Statistik"
        />

        <main className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0F2F2E]">Ringkasan Eksekutif</h1>
              <p className="text-sm text-[#4A6F6C]">Ikhtisar performa pengajuan dan statistik sekolah.</p>
            </div>
            <button
              onClick={() => router.push('/pengajuan')}
              className="bg-[#40E0D0] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#2CB1A6] transition shadow-lg shadow-[#40E0D0]/20 text-sm"
            >
              + Buat Pengajuan Baru
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Pengajuan"
              value={stats.totalProposals}
              icon={Layers}
              colorClass="bg-blue-100 text-blue-600"
            />
            <StatCard
              title="Total Target Dana"
              value={`Rp ${(stats.totalTarget / 1000000).toFixed(1)} Jt`}
              icon={DollarSign}
              colorClass="bg-green-100 text-green-600"
              subtext="Akumulasi target seluruh proposal"
            />
            <StatCard
              title="Menunggu Review"
              value={stats.pending}
              icon={Clock}
              colorClass="bg-yellow-100 text-yellow-600"
            />
            <StatCard
              title="Disetujui"
              value={stats.approved}
              icon={CheckCircle}
              colorClass="bg-teal-100 text-teal-600"
            />
          </div>

          {/* Charts & Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusDistribution stats={stats} />
            <RecentProposals proposals={proposals} />
          </div>
        </main>
      </div>
    </div>
  );
}
