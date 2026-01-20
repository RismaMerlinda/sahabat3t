'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    npsn: '',
    schoolName: '',
    level: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (formData.password.length < 8) {
    alert('Kata sandi minimal 8 karakter');
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    alert('Kata sandi tidak sama');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        full_name: formData.schoolName, // ⬅️ WAJIB INI
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Register gagal');
      return;
    }

    alert('Register berhasil, silakan login');
    router.push('/login');
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan server');
  }
};


  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#EDF2F7]">

      {/* LEFT */}
      <div className="bg-[#D7DEE8] px-8 py-12 flex flex-col justify-between">
        <div className="bg-white rounded-full px-6 py-3 inline-flex gap-2 shadow w-fit">
          <span>★</span>
          <span className="font-semibold">LOGO</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Daftar Akun
          </h1>
          <p className="text-gray-700 text-sm md:text-base">
            Lengkapi data sekolah untuk mulai menggunakan platform
            crowdfunding pendidikan wilayah 3T.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 py-10 md:px-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg space-y-4"
        >
          <Input label="NPSN" name="npsn" onChange={handleChange} />
          <Input label="Nama Sekolah" name="schoolName" onChange={handleChange} />
          <Input label="Jenjang Pendidikan" name="level" onChange={handleChange} />
          <Input label="Alamat Sekolah" name="address" onChange={handleChange} />
          <Input label="E-mail" type="email" name="email" onChange={handleChange} />

          <InputPassword
            label="Kata Sandi"
            name="password"
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
            onChange={handleChange}
          />

          <InputPassword
            label="Konfirmasi Kata Sandi"
            name="confirmPassword"
            show={showConfirm}
            toggle={() => setShowConfirm(!showConfirm)}
            onChange={handleChange}
          />

          <button className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-900 transition">
            Daftar
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Sudah punya akun?{' '}
            <a href="/login" className="font-semibold text-black hover:underline">
              Masuk
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

/* ===== COMPONENTS (LOGIKA TETAP) ===== */

function Input({ label, name, type = 'text', onChange }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        onChange={onChange}
        className="
          w-full bg-white rounded-lg
          px-4 py-3 mt-1 text-sm
          border border-gray-200
          focus:outline-none focus:ring-2 focus:ring-black
        "
      />
    </div>
  );
}

function InputPassword({ label, name, show, toggle, onChange }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="relative mt-1">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          onChange={onChange}
          className="
            w-full bg-white rounded-lg
            px-4 py-3 pr-12 text-sm
            border border-gray-200
            focus:outline-none focus:ring-2 focus:ring-black
          "
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm"
        >
          {show ? '👁️' : '🙈'}
        </button>
      </div>
    </div>
  );
}
