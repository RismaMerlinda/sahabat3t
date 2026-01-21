'use client';

import { Menu, Search, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header({ user, setOpen, officialName, title = "Dashboard Sekolah" }: any) {
    const router = useRouter();
    const displayName = officialName || user?.schoolName || 'Sekolah';
    const avatarLetter = displayName.charAt(0).toUpperCase();

    const handleNotificationClick = () => {
        router.push('/dashboard');
    };

    const handleProfileClick = () => {
        router.push('/profil');
    };

    return (
        <header className="h-20 bg-white border-b border-[#B2F5EA] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button onClick={() => setOpen(true)} className="lg:hidden text-[#1E8F86] hover:text-[#40E0D0]">
                    <Menu size={24} />
                </button>
                <h2 className="text-xl font-bold text-[#0F2F2E] hidden sm:block">{title}</h2>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
                <div className="hidden md:flex relative w-64 lg:w-80">
                    <input type="text" placeholder="Cari data..." className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-transparent focus:border-[#B2F5EA] focus:bg-white rounded-full text-sm outline-none transition-all placeholder-[#6B8E8B] text-[#0F2F2E]" />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8E8B]" size={18} />
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleNotificationClick}
                        className="relative text-[#6B8E8B] hover:text-[#40E0D0] transition"
                    >
                        <Bell size={22} />
                    </button>

                    <div className="h-8 w-[1px] bg-[#B2F5EA] hidden sm:block"></div>

                    <div
                        onClick={handleProfileClick}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-[#0F2F2E] truncate max-w-[150px] group-hover:text-[#40E0D0] transition">{displayName}</p>
                            <p className="text-xs text-[#6B8E8B] truncate max-w-[150px]">{user?.email || 'email@sekolah.com'}</p>
                        </div>
                        <div className="w-10 h-10 bg-[#40E0D0] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-[#2CB1A6] transition">
                            {avatarLetter}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
