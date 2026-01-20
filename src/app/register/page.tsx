'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Password tidak sama');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.schoolName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Register gagal');
        return;
      }

      alert('Register berhasil');
      router.push('/login');

    } catch (err) {
      console.error(err);
      alert('Backend tidak bisa dihubungi');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="schoolName"
          placeholder="Nama Sekolah"
          onChange={handleChange}
        /><br /><br />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        /><br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        /><br /><br />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
        /><br /><br />

        <button type="submit">Daftar</button>
      </form>
    </div>
  );
}
