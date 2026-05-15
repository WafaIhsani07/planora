import Link from 'next/link';
import { ArrowRight, Apple, Play, Check, Sparkles, Menu, Bell, MoreHorizontal, Calendar, User, MessageSquare, BarChart3, ShieldCheck } from 'lucide-react';
import Footer from '@/components/Footer';

const features = [
  'Berbincang langsung dengan klien Anda secara real-time.',
  'Tinjau klien potensial dan terhubung dengan cepat.',
  'Unggah dan kelola portofolio karya terbaru Anda.',
  'Kelola paket layanan dan harga dalam hitungan detik.',
  'Perbaharui informasi bisnis Anda secara berkala.',
];

export default function DownloadPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#FDF1F0]/50 px-6 pb-0 pt-4 md:px-12 md:pt-6 lg:px-12 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2A]/10 bg-white px-4 py-2 text-sm font-bold text-[#2A2A2A] shadow-sm transition hover:border-[#FF9A9E]/30 hover:text-[#FF527B] hover:shadow-md">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Kembali
          </Link>
        </div>

        <div className="absolute -mr-96 -mt-96 right-0 top-0 h-[600px] w-[600px] rounded-full bg-white opacity-80 blur-[120px]"></div>
        <div className="absolute -mb-48 -ml-48 bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#FFDED7]/20 blur-[100px]"></div>

        <div className="relative z-10 mx-auto mt-6 grid max-w-7xl items-start gap-16 lg:grid-cols-12">
          <div className="order-2 relative flex h-[500px] items-end justify-center lg:col-span-6 lg:order-1 md:h-[650px] lg:mt-2">
            <div className="absolute bottom-0 left-0 z-10 w-[240px] animate-float md:w-[280px]">
              <div className="relative rounded-[48px] border-4 border-[#333333] bg-[#2A2A2A] p-3 shadow-2xl">
                <div className="relative aspect-[9/19.5] overflow-hidden rounded-[40px] bg-[#0A0A0A]">
                  <div className="space-y-6 p-6">
                    <div className="flex items-center justify-between opacity-40">
                      <Menu className="h-5 w-5 text-white" />
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-lg font-black tracking-tight text-white">Statistics</h4>
                    <div className="space-y-4 rounded-2xl bg-white/5 p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Profile Views</p>
                          <p className="text-xl font-black text-[#FF9A9E]">12K</p>
                          <p className="text-[8px] font-bold text-emerald-400">↑ 12.52%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Leads</p>
                          <p className="text-xl font-black text-white">159</p>
                          <p className="text-[8px] font-bold text-emerald-400">↑ 14.89%</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/5">
                        <MessageSquare className="h-6 w-6 text-[#FF9A9E]" />
                        <p className="text-[8px] font-bold uppercase text-white/40">New Message</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-12 right-0 z-20 w-[240px] animate-float-delayed md:w-[280px]">
              <div className="relative rounded-[48px] border-4 border-slate-50 bg-white p-3 shadow-2xl">
                <div className="relative aspect-[9/19.5] overflow-hidden rounded-[40px] bg-slate-50">
                  <div className="space-y-6 p-6">
                    <div className="flex items-center justify-between">
                      <MoreHorizontal className="h-5 w-5 text-slate-300" />
                      <Calendar className="h-5 w-5 text-slate-300" />
                    </div>
                    <h4 className="text-lg font-black tracking-tight text-[#2A2A2A]">Active Orders</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Andini Putri', label: 'Wedding Decor' },
                        { name: 'Raka Pratama', label: 'Engagement' },
                      ].map((item) => (
                        <div key={item.name} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FDF1F0] text-[#FF9A9E]">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black leading-tight">{item.name}</p>
                            <p className="text-[7px] font-bold text-slate-400">{item.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full rounded-xl bg-[#2A2A2A] py-3 text-[8px] font-black uppercase tracking-widest text-white shadow-lg">
                      Check All Leads
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 space-y-10 py-4 lg:col-span-6 lg:order-2 lg:pt-6">
            <div className="space-y-4">
              <div className="h-1 w-20 rounded-full bg-gradient-to-r from-[#FF9A9E] to-[#FF527B]"></div>
              <h2 className="text-4xl font-[900] uppercase leading-tight tracking-tight text-[#2A2A2A] md:text-6xl">
                Kelola Bisnis <br /> <span className="font-logo italic text-[#FF527B]">Kapan pun, Di mana pun</span>
              </h2>
            </div>

            <ul className="space-y-6">
              {features.map((item) => (
                <li key={item} className="group flex items-start gap-4">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-[#FF9A9E] bg-white shadow-sm transition-colors group-hover:bg-[#FF9A9E]">
                    <Check className="h-3.5 w-3.5 text-[#FF9A9E] transition-colors group-hover:text-white" />
                  </div>
                  <p className="text-lg font-bold text-[#2A2A2A]/60 transition-colors group-hover:text-[#2A2A2A]">{item}</p>
                </li>
              ))}
            </ul>

            <div className="space-y-6 pt-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2A2A2A]/20">Download Planora Pro on</p>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="flex items-center gap-4 rounded-2xl border border-[#2A2A2A]/5 bg-black px-8 py-4 text-white shadow-lg transition-transform hover:scale-105">
                  <Apple className="h-8 w-8 fill-white text-white" />
                  <div className="text-left">
                    <p className="mb-1 text-[8px] font-black uppercase leading-none text-white/60">Download on</p>
                    <p className="text-lg font-black leading-none text-white">App Store</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-4 rounded-2xl border border-[#2A2A2A]/5 bg-black px-8 py-4 text-white shadow-lg transition-transform hover:scale-105">
                  <Play className="h-8 w-8 text-white" />
                  <div className="text-left">
                    <p className="mb-1 text-[8px] font-black uppercase leading-none text-white/60">Get it on</p>
                    <p className="text-lg font-black leading-none text-white">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-32 md:px-12">
        <div className="mx-auto max-w-7xl space-y-20">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-black tracking-tighter text-[#2A2A2A] md:text-5xl">
              Satu Aplikasi, <span className="text-[#FF527B]">Kontrol Penuh</span>
            </h2>
            <p className="mx-auto max-w-xl font-medium text-gray-400">
              Lupakan pencatatan manual yang merepotkan. Semua transaksi dan komunikasi tersentralisasi dengan aman.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-6 rounded-[48px] border border-slate-100 bg-slate-50 p-12 transition-colors hover:bg-[#FDF1F0]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#FF527B] shadow-sm">
                <MessageSquare className="h-8 w-8" />
              </div>
              <div className="space-y-4">
                <h5 className="text-xl font-black text-[#2A2A2A]">Smart Chat</h5>
                <p className="text-sm leading-relaxed font-medium text-slate-400">
                  Balas pertanyaan klien lebih cepat dengan fitur quick-reply dan notifikasi instan.
                </p>
              </div>
            </div>

            <div className="scale-105 space-y-6 rounded-[48px] bg-[#2A2A2A] p-12 text-white shadow-2xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-white/10 text-[#FF9A9E]">
                <BarChart3 className="h-8 w-8" />
              </div>
              <div className="space-y-4">
                <h5 className="text-xl font-black text-white">Analitik Bisnis</h5>
                <p className="text-sm leading-relaxed font-medium text-white/40">
                  Pantau pertumbuhan jumlah view profil dan konversi booking setiap bulannya.
                </p>
              </div>
            </div>

            <div className="space-y-6 rounded-[48px] border border-slate-100 bg-slate-50 p-12 transition-colors hover:bg-[#FDF1F0]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#FF527B] shadow-sm">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="space-y-4">
                <h5 className="text-xl font-black text-[#2A2A2A]">Escrow Payment</h5>
                <p className="text-sm leading-relaxed font-medium text-slate-400">
                  Dana klien dijamin aman di sistem Planora dan akan cair otomatis ke saldo Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
