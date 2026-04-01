"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Type, FileText, Calendar, Tag } from "lucide-react";

export default function CreateNotebook() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "Standard",
    historyYear: 2024,
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/webp", 0.8);
          setFormData((prev) => ({ ...prev, image: compressedBase64 }));
        }
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/notebooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const errData = await res.json().catch(() => ({}));
        const errorMessage = errData.details 
          ? `${errData.error}: ${errData.details}` 
          : (errData.error || errData.message || res.statusText);
        alert(`Kayıt oluşturulamadı! Hata: ${errorMessage}`);
      }
    } catch (err) {
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-8 text-sm font-bold uppercase tracking-widest decoration-inherit">
          <ArrowLeft size={16} />
          Geri Dön
        </Link>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Yeni Notebook Ekle</h1>
          <p className="text-slate-500">Sisteme yeni bir notebook veya tarihçe kaydı ekleyin.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                  <Type size={14} />
                  Başlık
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700 decoration-inherit"
                  placeholder="Örn: Apple PowerBook G4"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                  <Tag size={14} />
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all decoration-inherit"
                >
                  <option value="Laptop" className="bg-slate-900">Laptop</option>
                  <option value="Tarihçe" className="bg-slate-900">Tarihçe</option>
                  <option value="Teknoloji" className="bg-slate-900">Teknoloji</option>
                  <option value="Aksesuar" className="bg-slate-900">Aksesuar</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                  <Calendar size={14} />
                  Yıl
                </label>
                <input
                  type="number"
                  required
                  value={formData.historyYear}
                  onChange={(e) => setFormData({ ...formData, historyYear: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all decoration-inherit"
                />
              </div>
            </div>

            {/* Right Column: Image */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                <Upload size={14} />
                Görsel Yükle
              </label>
              <div className="relative group aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-blue-500/50 transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer decoration-inherit">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {formData.image ? (
                  <img src={formData.image} className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-80" alt="Preview" />
                ) : (
                  <>
                    <div className="p-4 bg-white/5 rounded-2xl mb-4 group-hover:scale-110 transition-transform"><Upload className="text-blue-500" /></div>
                    <p className="font-bold mb-1">Dosya Seçin</p>
                    <p className="text-xs text-slate-600">JPG, PNG veya WEBP (Max 5MB)</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                <FileText size={14} />
                Kısa Açıklama
              </label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700 decoration-inherit"
                placeholder="Listenin altında görünecek kısa metin..."
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                <FileText size={14} />
                Detaylı İçerik (Markdown/HTML Destekli)
              </label>
              <textarea
                rows={8}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all decoration-inherit"
                placeholder="Ürün veya olay hakkında detaylı bilgi..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3 decoration-inherit"
          >
            {loading ? "Kaydediliyor..." : <><Save size={20} /> Kaydı Yayınla</>}
          </button>
        </form>
      </div>
    </div>
  );
}
