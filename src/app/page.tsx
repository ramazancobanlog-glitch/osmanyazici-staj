"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Cpu, History, Laptop, ShieldCheck, Mail, Send, ChevronRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (res.ok) {
        setIsSent(true);
        setFormState({ name: "", email: "", message: "" });
        setTimeout(() => setIsSent(false), 5000);
      }
    } catch (error) {
      alert("Mesaj gönderilemedi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const historyMilestones = [
    { year: "1981", title: "Osborne 1", desc: "10.7 kg ağırlığında, 5 inç ekranlı ilk ticari taşınabilir bilgisayar.", color: "blue" },
    { year: "1982", title: "GRiD Compass 1101", desc: "Astronotlar tarafından uzayda kullanılan, kapaklı (clamshell) tasarımın öncüsü.", color: "purple" },
    { year: "1985", title: "Toshiba T1100", desc: "İlk başarılı kitlesel pazar laptopu. Modern PC mimarisini taşınabilir hale getirdi.", color: "emerald" },
    { year: "1991", title: "Apple PowerBook 100", desc: "Trackball kullanımıyla modern laptop ergonomisinin standartlarını belirledi.", color: "slate" },
    { year: "2008", title: "MacBook Air", desc: "Steve Jobs'ın bir zarftan çıkardığı, ultra ince ve hafif notebook devrinin başlangıcı.", color: "blue" },
    { year: "2024+", title: "AI Notebook Çağı", desc: "NPU (Sinir İşleme Birimi) ile donatılmış, yerleşik yapay zeka istasyonları.", color: "purple" }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="glass-nav px-6 py-4 flex justify-between items-center decoration-inherit">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">N</div>
          <span className="text-xl font-bold tracking-tight">Notebook<span className="text-blue-500">Hub</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#history" className="hover:text-white transition-colors">Tarihçe</a>
          <a href="#tech" className="hover:text-white transition-colors">Teknoloji</a>
          <a href="#contact" className="hover:text-white transition-colors">İletişim</a>
        </div>
        <Link href="/admin/login" className="px-4 py-2 text-sm font-medium bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all decoration-inherit">
          Admin
        </Link>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-6 hero-gradient overflow-hidden">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-8xl font-extrabold mb-6 tracking-tighter leading-none">
              Taşınabilir Gücün <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Yolculuğu</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Geçmişin devasa makinelerinden geleceğin yapay zeka asistanlarına... Dünyayı değiştiren taşınabilir teknolojileri keşfedin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#history" className="px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-full font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 justify-center">
                Keşfetmeye Başla <ChevronRight size={18} />
              </a>
              <a href="#contact" className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-bold transition-all flex items-center gap-2 justify-center">
                Bize Yazın <Mail size={18} />
              </a>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"></div>
        </section>

        {/* Improved History Section */}
        <section id="history" className="py-32 px-6 border-t border-white/5 bg-[#050505]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4 text-blue-500 justify-center">
              <History size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">İkonik Miltaşları</span>
            </div>
            <h2 className="text-5xl font-extrabold mb-24 text-center">Notebook Tarihçesi</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {historyMilestones.map((item, index) => (
                <div key={index} className="premium-card p-8 group hover:-translate-y-2 transition-all duration-500 flex flex-col h-full decoration-inherit">
                  <div className={`text-sm font-black text-white/10 mb-2 tracking-tighter text-4xl group-hover:text-blue-500/20 transition-colors decoration-inherit`}>
                    {item.year}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm flex-grow">
                    {item.desc}
                  </p>
                  <div className="mt-6 w-8 h-1 bg-blue-500/30 group-hover:w-full transition-all duration-700 decoration-inherit"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Section */}
        <section id="tech" className="py-32 px-6 bg-black">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: <Cpu className="text-blue-400" />, title: "Maksimum Verimlilik", desc: "Düşük güç tüketimi ile en yüksek performansı sunan modern mimariler." },
                { icon: <ShieldCheck className="text-emerald-400" />, title: "Kurumsal Güvenlik", desc: "Donanım düzeyinde şifreleme ve biyometrik doğrulama sistemleri." },
                { icon: <Laptop className="text-purple-400" />, title: "Sınırsız Mobilite", desc: "Hafiflik ve dayanıklılığın mükemmel dengesiyle her yer ofisiniz." }
              ].map((item, index) => (
                <div key={index} className="text-center group decoration-inherit">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-white/10 group-hover:scale-110 transition-all decoration-inherit">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-6 bg-slate-950/20 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">İletişime Geçin</h2>
              <p className="text-slate-500">Sorularınız veya geri bildirimleriniz için bize yazabilirsiniz.</p>
            </div>

            <div className="premium-card p-8 md:p-12 decoration-inherit">
              {isSent ? (
                <div className="text-center py-12 flex flex-col items-center gap-6 decoration-inherit">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center animate-bounce decoration-inherit">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold">Mesajınız Gönderildi!</h3>
                  <p className="text-slate-400">En kısa sürede size geri dönüş yapacağız.</p>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Adınız</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all decoration-inherit"
                        placeholder="Ad Soyad"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">E-Posta</label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all decoration-inherit"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Mesajınız</label>
                    <textarea
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all decoration-inherit"
                      placeholder="Size nasıl yardımcı olabiliriz?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3 decoration-inherit"
                  >
                    {isSubmitting ? "Gönderiliyor..." : <><Send size={18} /> Mesajı Gönder</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 border-t border-white/5 px-6 text-center text-slate-500">
          <div className="mb-8 flex justify-center gap-6 decoration-inherit">
             <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-blue-600/20 hover:text-blue-500 cursor-pointer transition-all decoration-inherit">X</div>
             <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-blue-600/20 hover:text-blue-500 cursor-pointer transition-all decoration-inherit">in</div>
             <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-blue-600/20 hover:text-blue-500 cursor-pointer transition-all decoration-inherit">ig</div>
          </div>
          <p className="text-sm font-medium">© 2024 NotebookHub. Geleceğin taşınabilir teknolojileri platformu.</p>
        </footer>
      </main>
    </div>
  );
}
