'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#E6FFFA] text-[#0F2F2E]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur bg-[#E6FFFA]/80 border-b border-[#B2F5EA]">
        <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#home" className="font-extrabold tracking-tight text-[#0F2F2E]">
            Sahabat<span className="text-[#2CB1A6]">3T</span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4A6F6C]">
            <a className="hover:text-[#1E8F86] transition" href="#tentang-3t">Sekolah 3T</a>
            <a className="hover:text-[#1E8F86] transition" href="#tentang-platform">Platform</a>
            <a className="hover:text-[#1E8F86] transition" href="#cara-kerja">Cara Kerja</a>
            <a className="hover:text-[#1E8F86] transition" href="#faq">FAQ</a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/login')}
              className="rounded-full px-4 py-2 text-sm font-semibold border border-[#2CB1A6] text-[#2CB1A6] bg-white/70 hover:bg-white transition"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#40E0D0] to-[#2CB1A6] shadow-md shadow-[#40E0D0]/30 hover:scale-[1.02] active:scale-95 transition"
            >
              Register
            </button>
          </div>
        </nav>
      </header>

      {/* HERO (KODE KAMU — TETAP) */}
      <section id="home">
        {/* Top gradient bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#40E0D0] via-[#2CB1A6] to-[#1E8F86]" />

        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* LEFT */}
            <section className="relative">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B2F5EA] bg-white/80 px-4 py-1 text-xs font-medium text-[#0F2F2E] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#40E0D0]" />
                Platform Crowdfunding Sekolah 3T
              </div>

              <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[#0F2F2E]">
                Bangun masa depan{' '}
                <span className="text-[#2CB1A6]">sekolah 3T</span>
                <br className="hidden sm:block" />
                bersama kita
              </h1>

              <p className="mt-4 text-sm sm:text-base text-[#4A6F6C] max-w-xl">
                Donasi transparan dan terukur untuk membantu sekolah di wilayah 3T
                membangun fasilitas pendidikan yang lebih baik — dari ruang kelas,
                perpustakaan, hingga akses internet.
              </p>

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push('/register')}
                  className="
                    w-full sm:w-fit
                    rounded-full px-8 py-3 font-semibold text-white
                    bg-gradient-to-r from-[#40E0D0] to-[#2CB1A6]
                    shadow-lg shadow-[#40E0D0]/40
                    hover:scale-[1.03] hover:brightness-105
                    active:scale-95 transition
                  "
                >
                  Register
                </button>

                <button
                  onClick={() => router.push('/login')}
                  className="
                    w-full sm:w-fit
                    rounded-full px-8 py-3 font-semibold
                    border border-[#2CB1A6]
                    text-[#2CB1A6]
                    bg-white/70
                    hover:bg-white hover:scale-[1.03]
                    active:scale-95 transition
                  "
                >
                  Login
                </button>
              </div>

              {/* Stats (dengan hover gerak) */}
              <div className="mt-9 grid grid-cols-3 gap-3 max-w-md">
                {[
                  { title: '100%', desc: 'Transparan' },
                  { title: '3T', desc: 'Fokus daerah' },
                  { title: 'Aman', desc: 'Terverifikasi' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="
                      group rounded-2xl bg-white/80 border border-[#B2F5EA] p-4 shadow-sm
                      transition-all duration-300 ease-out cursor-pointer
                      hover:-translate-y-1 hover:scale-[1.02]
                      hover:shadow-lg hover:shadow-[#40E0D0]/25
                      hover:bg-white hover:border-[#40E0D0]
                    "
                  >
                    <div className="text-lg font-extrabold text-[#0F2F2E] transition-colors duration-300 group-hover:text-[#1E8F86]">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#4A6F6C] transition-colors duration-300 group-hover:text-[#0F2F2E]">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs text-[#4A6F6C]">
                Dengan berdonasi, kamu ikut membantu menciptakan akses pendidikan
                yang lebih merata.
              </p>
            </section>

            {/* RIGHT */}
            <section className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/50 shadow-xl">
                {/* Glow */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#40E0D0]/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[#2CB1A6]/30 blur-3xl" />

                <div className="relative p-4 sm:p-5">
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#CCFBF1]">
                    <Image
                      src="/assets/LandingPage.jpg"
                      alt="Sekolah 3T"
                      fill
                      className="object-cover"
                      priority
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F2F2E]/40 via-transparent to-transparent" />

                    <div className="absolute left-4 bottom-4 right-4">
                      <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/85 border border-[#B2F5EA] px-4 py-3 shadow-sm">
                        <div>
                          <div className="text-sm font-bold text-[#0F2F2E]">Dampak Nyata</div>
                          <div className="text-xs text-[#4A6F6C]">
                            Donasi kamu membantu fasilitas sekolah
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-white rounded-full px-3 py-1 bg-[#1E8F86]">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/75 border border-[#B2F5EA] p-4">
                      <div className="text-xs text-[#4A6F6C]">Tracking</div>
                      <div className="mt-1 text-sm font-bold text-[#0F2F2E]">Laporan & progres</div>
                    </div>
                    <div className="rounded-2xl bg-white/75 border border-[#B2F5EA] p-4">
                      <div className="text-xs text-[#4A6F6C]">Keamanan</div>
                      <div className="mt-1 text-sm font-bold text-[#0F2F2E]">Donasi terverifikasi</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -z-10 inset-0 translate-x-4 translate-y-6 rounded-[40px] bg-[#40E0D0]/20 blur-[1px]" />
            </section>
          </div>
        </main>
      </section>

      {/* SECTION: PENGERTIAN 3T */}
      <section id="tentang-3t" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-3xl bg-white/70 border border-[#B2F5EA] p-6 sm:p-10 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2F2E]">
            Apa itu Sekolah 3T?
          </h2>
          <p className="mt-3 text-[#4A6F6C] max-w-3xl">
            3T adalah singkatan dari <b>Terdepan</b>, <b>Tertinggal</b>, dan <b>Terluar</b>.
            Sekolah di wilayah 3T sering menghadapi tantangan akses, fasilitas, serta konektivitas.
            Karena itu, dukungan bersama bisa jadi jembatan untuk pemerataan pendidikan.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Terdepan', desc: 'Wilayah perbatasan/strategis dengan akses terbatas.' },
              { title: 'Tertinggal', desc: 'Kondisi sarana & prasarana pendidikan belum memadai.' },
              { title: 'Terluar', desc: 'Daerah kepulauan/remote jauh dari pusat layanan.' },
            ].map((x) => (
              <div
                key={x.title}
                className="rounded-2xl bg-white/85 border border-[#B2F5EA] p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-[#40E0D0]/20 transition-all"
              >
                <div className="text-lg font-extrabold text-[#0F2F2E]">{x.title}</div>
                <p className="mt-2 text-sm text-[#4A6F6C]">{x.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: TENTANG PLATFORM */}
      <section id="tentang-platform" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white/70 border border-[#B2F5EA] p-8 shadow-sm">
            <h2 className="text-2xl font-extrabold">Tentang Platform</h2>
            <p className="mt-3 text-[#4A6F6C]">
              Platform ini menghubungkan donatur dengan kebutuhan sekolah 3T secara transparan.
              Setiap campaign punya target, timeline, dan laporan progres yang bisa dilihat publik.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-[#4A6F6C]">
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[#40E0D0]" />Campaign terverifikasi & jelas tujuannya</li>
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[#40E0D0]" />Update progres berkala</li>
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[#40E0D0]" />Riwayat donasi & laporan penggunaan</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white/70 border border-[#B2F5EA] p-8 shadow-sm">
            <h2 className="text-2xl font-extrabold">Kenapa Ini Penting?</h2>
            <p className="mt-3 text-[#4A6F6C]">
              Pendidikan yang merata adalah investasi jangka panjang. Bantuan kecil jika dilakukan bersama
              akan memberi dampak besar untuk generasi berikutnya.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/85 border border-[#B2F5EA] p-4">
                <div className="text-sm font-bold">Fasilitas</div>
                <div className="text-xs text-[#4A6F6C] mt-1">Ruang kelas, meja kursi, listrik</div>
              </div>
              <div className="rounded-2xl bg-white/85 border border-[#B2F5EA] p-4">
                <div className="text-sm font-bold">Akses</div>
                <div className="text-xs text-[#4A6F6C] mt-1">Perpustakaan, internet, buku</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: CARA KERJA */}
      <section id="cara-kerja" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-14">
        <div className="rounded-3xl bg-white/70 border border-[#B2F5EA] p-8 sm:p-10 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Cara Kerja</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Pilih Campaign', desc: 'Lihat kebutuhan sekolah & target donasi.' },
              { step: '02', title: 'Donasi Aman', desc: 'Lakukan donasi, dapatkan bukti transaksi.' },
              { step: '03', title: 'Pantau Progres', desc: 'Update dan laporan transparan dapat diakses.' },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-2xl bg-white/85 border border-[#B2F5EA] p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-[#40E0D0]/20 transition-all"
              >
                <div className="text-sm font-extrabold text-[#1E8F86]">{s.step}</div>
                <div className="mt-1 text-lg font-extrabold">{s.title}</div>
                <p className="mt-2 text-sm text-[#4A6F6C]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-white/70 border border-[#B2F5EA] p-8 sm:p-10 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold">FAQ</h2>

          <div className="mt-6 space-y-3">
            {[
              { q: 'Apakah donasi saya bisa dilacak?', a: 'Bisa. Kamu dapat melihat progres campaign dan laporan penggunaan dana.' },
              { q: 'Apakah campaign sudah diverifikasi?', a: 'Campaign dipublikasikan setelah melewati proses verifikasi kebutuhan sekolah.' },
              { q: 'Bagaimana cara sekolah mengajukan bantuan?', a: 'Sekolah bisa daftar dan mengisi pengajuan kebutuhan melalui menu pengajuan.' },
            ].map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl bg-white/85 border border-[#B2F5EA] p-5 shadow-sm"
              >
                <summary className="cursor-pointer font-semibold text-[#0F2F2E]">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-[#4A6F6C]">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="w-full mt-15">
        <div className="h-3 bg-gradient-to-r from-[#40E0D0] via-[#2CB1A6] to-[#1E8F86]" />
        <div className="h-1 bg-[#E6FFFA]" />
      </div>


      {/* FOOTER */}
      <footer className="border-t border-[#B2F5EA] bg-white/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="text-sm text-[#4A6F6C]">
            © {new Date().getFullYear()} Sahabat3T — Crowdfunding Sekolah 3T
          </div>
          <div className="text-sm text-[#4A6F6C] flex gap-4">
            <a className="hover:text-[#1E8F86] transition" href="#home">Home</a>
            <a className="hover:text-[#1E8F86] transition" href="#cara-kerja">Cara Kerja</a>
            <a className="hover:text-[#1E8F86] transition" href="#faq">FAQ</a>
          </div>
        </div>
      </footer>

  
    </div>
  );
}
