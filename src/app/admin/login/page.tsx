"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Hatalı şifre!");
      }
    } catch (err) {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a] text-white">
      <div className="premium-card w-full max-w-md p-10 decoration-inherit">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
            <Lock size={28} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Giriş yapmak için şifrenizi girin.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Yönetici Şifresi</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-black border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center mt-2 decoration-inherit">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 font-bold rounded-xl transition-all shadow-lg shadow-blue-600/10 active:scale-95"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-slate-600 italic">
          Ş şifre: osman123 (Test Amaçlı)
        </p>
      </div>
    </div>
  );
}
