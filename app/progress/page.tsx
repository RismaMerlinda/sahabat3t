'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';
import {
  TrendingUp, Image as ImageIcon,
  Loader2
} from 'lucide-react';

/* ================= PAGE CONTENT ================= */

export default function ProgressPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [officialSchool, setOfficialSchool] = useState<any>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  // Data
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          } else {
            setVerified(false);
          }
        })
        .catch(() => setVerified(false));
    }

    fetchProjects();

  }, []);

  const fetchProjects = async () => {
    try {
      const [propRes, repRes] = await Promise.all([
        api.get('/proposals'),
        api.get('/reports')
      ]);

      const approvedProposals = propRes.data.filter((p: any) => p.status === 'approved');
      const allReports = repRes.data;

      // Map proposals to projects
      const projectList = approvedProposals.map((proposal: any) => {
        // Calculate used funds for this proposal
        const relatedReports = allReports.filter((r: any) => r.proposal && r.proposal._id === proposal._id && r.status === 'submitted');
        const used = relatedReports.reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0);
        const target = Number(proposal.targetAmount) || 0;
        const percentage = target > 0 ? Math.min(100, Math.round((used / target) * 100)) : 0;

        return {
          id: proposal._id,
          title: proposal.title,
          description: proposal.description,
          target,
          used,
          percentage
        };
      });

      setProjects(projectList);

    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
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
          title="Progress Kegiatan"
        />

        <main className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0F2F2E]">Galeri & Progress</h1>
              <p className="text-sm text-[#6B8E8B]">Pantau perkembangan realisasi dana dan fisik.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-12 text-[#6B8E8B]">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : projects.length === 0 ? (
            /* EMPTY STATE */
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-[#B2F5EA] text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-6">
                <ImageOffIcon />
              </div>
              <h2 className="text-xl font-bold text-[#1E8F86] mb-2">Belum Ada Project Berjalan</h2>
              <p className="text-[#6B8E8B] max-w-md mx-auto mb-6">
                Project akan muncul di sini setelah proposal pengajuan Anda disetujui (ACC).
              </p>
              <button
                onClick={() => router.push('/pengajuan')}
                className="bg-[#CCFBF1] text-[#1E8F86] px-6 py-3 rounded-xl font-bold hover:bg-[#bbf0e5] transition"
              >
                Buat Pengajuan
              </button>
            </div>
          ) : (
            /* PROJECT LIST */
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-2xl border border-[#B2F5EA] overflow-hidden hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="p-6 border-b border-[#F1F5F9] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-[#0F2F2E]">{project.title}</h2>
                      <p className="text-sm text-[#6B8E8B] line-clamp-1">{project.description}</p>
                    </div>
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                      Berjalan
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Financial Progress */}
                    <div>
                      <h4 className="text-sm font-bold text-[#0F2F2E] mb-4 flex items-center gap-2">
                        <TrendingUp size={16} /> Realisasi Dana
                      </h4>
                      <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[#6B8E8B]">Dana Terpakai</span>
                          <span className="font-bold text-[#0F2F2E]">{formatCurrency(project.used)}</span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] h-3 rounded-full overflow-hidden mb-2">
                          <div
                            className="bg-[#40E0D0] h-full rounded-full transition-all duration-500"
                            style={{ width: `${project.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-[#40E0D0] font-bold">{project.percentage}% Terealisasi</span>
                          <span className="text-[#6B8E8B]">Target: {formatCurrency(project.target)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Gallery Mockup */}
                    <div>
                      <h4 className="text-sm font-bold text-[#0F2F2E] mb-4 flex items-center gap-2">
                        <ImageIcon size={16} /> Dokumentasi Terbaru
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="aspect-square bg-[#F1F5F9] rounded-lg flex items-center justify-center border border-[#E2E8F0]">
                          <ImageIcon className="text-[#94A3B8]" size={20} />
                        </div>
                        <div className="aspect-square bg-[#F1F5F9] rounded-lg flex items-center justify-center border border-[#E2E8F0]">
                          <ImageIcon className="text-[#94A3B8]" size={20} />
                        </div>
                        <div className="aspect-square bg-[#F1F5F9] rounded-lg flex items-center justify-center border border-[#E2E8F0] relative">
                          <span className="text-[10px] text-[#6B8E8B]">Lihat Semua</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

function ImageOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 11-5-5-2.295 2.293" /><path d="m21 16-5-5-2.3 2.3" /><path d="M12 2a10 10 0 0 0-4.048 19.146" /><circle cx="12" cy="12" r="10" /><path d="m2 2 20 20" /></svg>
  )
}
