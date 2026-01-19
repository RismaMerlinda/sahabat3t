'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      alert('akun belum terdaftar');
      return;
    }

    const user = JSON.parse(storedUser);

    // ✅ CUKUP CEK EMAIL DULU
    if (form.email === user.email) {
      alert('login berhasil');
      window.location.href = '/dashboard';
    } else {
      alert('email tidak terdaftar');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT */}
      <div className="bg-[#D7DEE8] p-10 flex flex-col justify-between">
        <div className="bg-white px-6 py-3 rounded-full w-fit shadow">
          ★ LOGO
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">
            Selamat Datang di Platform Crowdfunding Sekolah 3T!
          </h1>
          <p className="text-gray-700 max-w-sm">
            Platform transparan untuk membantu sekolah di wilayah 3T
            membangun fasilitas pendidikan.
          </p>

          <div className="mt-10 w-56 h-40 bg-white rounded-lg flex items-center justify-center text-gray-400 shadow">
            📷
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4"
        >
          <h2 className="text-2xl font-bold">
            Selamat datang kembali!
          </h2>
          <p className="text-sm text-gray-500">
            Bersama, Hadirkan Harapan untuk Pendidikan
          </p>

          <div>
            <label className="text-sm font-medium">E-mail</label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 mt-1"
              placeholder="Masukkan E-mail Anda"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Kata Sandi</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 mt-1"
              placeholder="Masukkan Password Anda"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-full font-semibold mt-2"
          >
            Masuk
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Belum punya akun?{' '}
            <a href="/register" className="font-semibold text-black">
              Daftar
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
