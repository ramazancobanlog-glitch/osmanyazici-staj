"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Edit3, Plus, LogOut, Package, Image as ImageIcon, Mail, Inbox, CheckCircle, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"notebooks" | "messages">("notebooks");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchData();
  }, [activeTab]);

  const checkAuth = async () => {
    const res = await fetch("/api/auth/login");
    const data = await res.json();
    if (!data.authenticated) {
      router.push("/admin/login");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "notebooks") {
        const res = await fetch("/api/notebooks");
        const data = await res.json();
        setNotebooks(data);
      } else {
        const res = await fetch("/api/admin/messages");
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotebook = async (id: string) => {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/notebooks/${id}`, { method: "DELETE" });
      if (res.ok) setNotebooks(notebooks.filter((nb) => nb._id !== id));
    } catch (err) { alert("Silme işlemi başarısız!"); }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Mesajı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setMessages(messages.filter((m) => m._id !== id));
    } catch (err) { alert("Silme işlemi başarısız!"); }
  };

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: !currentStatus }),
      });
      if (res.ok) {
        setMessages(messages.map((m) => m._id === id ? { ...m, isRead: !currentStatus } : m));
      }
    } catch (err) { console.error(err); }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Yönetim Paneli</h1>
            <p className="text-slate-500">Tüm içerikleri ve mesajları buradan yönetin.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleLogout} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 text-red-400 transition-all decoration-inherit">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Tab Selection */}
        <div className="flex gap-2 p-1 bg-white/5 w-fit rounded-2xl mb-12 decoration-inherit">
          <button
            onClick={() => setActiveTab("notebooks")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === "notebooks" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-white"}`}
          >
            <Package size={18} /> Notebooklar
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === "messages" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-white"}`}
          >
            <Mail size={18} /> Mesajlar {messages.filter(m => !m.isRead).length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full decoration-inherit">{messages.filter(m => !m.isRead).length}</span>}
          </button>
        </div>

        {activeTab === "notebooks" ? (
          <>
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-bold">Notebook Envanteri</h2>
               <Link href="/admin/create" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                 <Plus size={20} /> Yeni Ekle
               </Link>
            </div>
            <div className="premium-card overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <th className="px-6 py-5">Görsel</th>
                    <th className="px-6 py-5">Başlık</th>
                    <th className="px-6 py-5">Kategori</th>
                    <th className="px-6 py-5">Yıl</th>
                    <th className="px-6 py-5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Yükleniyor...</td></tr>
                  ) : notebooks.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Kayıt bulunamadı.</td></tr>
                  ) : (
                    notebooks.map((nb) => (
                      <tr key={nb._id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-5">
                          {nb.image ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 decoration-inherit">
                              <img src={nb.image} alt="Notebook" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-slate-700 shrink-0 decoration-inherit">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-bold">{nb.title}</div>
                          <div className="text-xs text-slate-500 truncate max-w-xs">{nb.description}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold uppercase rounded-full tracking-tighter decoration-inherit">{nb.category}</span>
                        </td>
                        <td className="px-6 py-5 font-mono text-slate-400">{nb.historyYear}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex gap-2 justify-end">
                            <Link href={`/admin/edit/${nb._id}`} className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-all decoration-inherit">
                              <Edit3 size={18} />
                            </Link>
                            <button onClick={() => handleDeleteNotebook(nb._id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-all decoration-inherit">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-8">Gelen Kutusu</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-20 text-slate-500">Yükleniyor...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 decoration-inherit">
                  <Inbox size={40} className="mx-auto mb-4 text-slate-700" />
                  <p className="text-slate-500">Henüz hiç mesajınız yok.</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m._id} className={`premium-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start ${!m.isRead ? "border-l-4 border-l-blue-500" : ""}`}>
                    <div className="flex-grow space-y-2">
                       <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">{m.name}</h3>
                          {!m.isRead && <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] uppercase font-black rounded-md decoration-inherit">Yeni</span>}
                       </div>
                       <div className="text-sm text-blue-400 font-medium">{m.email}</div>
                       <div className="text-slate-400 text-sm leading-relaxed pt-2">{m.message}</div>
                       <div className="text-[10px] text-slate-600 pt-4 flex items-center gap-2">
                          <Clock size={12} /> {new Date(m.createdAt).toLocaleString("tr-TR")}
                       </div>
                    </div>
                    <div className="flex gap-2 self-end md:self-center">
                       <button
                         onClick={() => toggleReadStatus(m._id, m.isRead)}
                         className={`p-3 rounded-xl transition-all ${m.isRead ? "bg-slate-800 text-slate-500" : "bg-blue-600/10 text-blue-400 hover:bg-blue-600/20"}`}
                         title={m.isRead ? "Okunmadı olarak işaretle" : "Okundu olarak işaretle"}
                       >
                         <CheckCircle size={20} />
                       </button>
                       <button
                         onClick={() => handleDeleteMessage(m._id)}
                         className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-all decoration-inherit"
                       >
                         <Trash2 size={20} />
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
