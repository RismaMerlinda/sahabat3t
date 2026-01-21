'use client';

import Link from 'next/link';
import { Home, ClipboardList, BarChart2, FileText, Clock, TrendingUp, User, LogOut, CheckCircle, XCircle } from 'lucide-react';

export default function Sidebar({ user, open, setOpen, pathname, verified, officialName }: any) {
    const menus = [
        { href: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
        { href: '/pengajuan', icon: <ClipboardList size={20} />, label: 'Pengajuan' },
        { href: '/ringkasan', icon: <BarChart2 size={20} />, label: 'Ringkasan' },
        { href: '/laporan', icon: <FileText size={20} />, label: 'Laporan' },
        { href: '/timeline', icon: <Clock size={20} />, label: 'Timeline' },
        { href: '/progress', icon: <TrendingUp size={20} />, label: 'Progress' },
        { href: '/profil', icon: <User size={20} />, label: 'Profil' },
    ];

    const displayName = officialName || user?.schoolName || 'Sekolah';

    return (
        <>
            {open && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#B2F5EA] flex flex-col transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6">
                    <h1 className="text-xl font-bold text-[#1E8F86] truncate tracking-tight mb-1">
                        {displayName}
                    </h1>

                    {verified === true && (
                        <p className="text-xs text-[#22C55E] flex items-center gap-1 font-medium bg-green-50 px-2 py-1 rounded-md w-fit">
                            <CheckCircle size={14} /> Terverifikasi
                        </p>
                    )}
                    {verified === false && (
                        <p className="text-xs text-[#EF4444] flex items-center gap-1 font-medium bg-red-50 px-2 py-1 rounded-md w-fit">
                            <XCircle size={14} /> Belum Terverifikasi
                        </p>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-2">
                    {menus.map((menu) => {
                        const isActive = pathname === menu.href;
                        return (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                                    ${isActive
                                        ? 'bg-[#E6FFFA] text-[#40E0D0]'
                                        : 'text-[#4A6F6C] hover:bg-[#F8FAFC] hover:text-[#40E0D0]'
                                    }`}
                            >
                                {menu.icon}
                                {menu.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[#B2F5EA]">
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/login';
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full text-[#6B8E8B] hover:text-[#EF4444] hover:bg-red-50 rounded-xl transition-colors font-medium text-sm"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
