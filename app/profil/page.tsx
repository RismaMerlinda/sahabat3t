'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="p-10 text-sm text-gray-400">
        Memuat data profil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm p-8">

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
            {user.schoolName?.charAt(0)}
          </div>

          <div>
            <h1 className="text-xl font-semibold">
              {user.schoolName}
            </h1>
            <p className="text-sm text-gray-500">
              {user.email}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <ProfileRow label="NPSN" value={user.npsn || '-'} />
          <ProfileRow label="Jenjang" value={user.level || '-'} />
          <ProfileRow label="Alamat" value={user.address || '-'} />
        </div>

      </div>
    </div>
  );
}

function ProfileRow({ label, value }: any) {
  return (
    <div className="flex justify-between border-b py-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
