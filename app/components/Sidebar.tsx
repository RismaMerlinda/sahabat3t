'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Sidebar({ user }: { user: any }) {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [officialSchool, setOfficialSchool] = useState<any>(null);

  useEffect(() => {
    if (user?.npsn) {
      verifySchool(user.npsn);
    }
  }, [user]);

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

  const schoolName =
    officialSchool?.nama || user.schoolName || 'Sekolah';

  return (
    <aside className="w-64 bg-white px-6 py-6">
      <div className="mb-10">
        <h1 className="text-lg font-bold text-indigo-600 truncate">
          {schoolName}
        </h1>

        {verified === null && (
          <p className="text-xs text-gray-400">memeriksa verifikasi...</p>
        )}

        {verified === true && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <CheckCircle size={14} />
            Terverifikasi Kemendikbud
          </p>
        )}

        {verified === false && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <XCircle size={14} />
            Belum Terverifikasi
          </p>
        )}
      </div>
    </aside>
  );
}
