"use client";

import React, { useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const DUMMY_CHATS = [
  { id: 1, name: "Andi Pratama", lastMessage: "Apakah tanggal 12 Mei masih kosong?", time: "10:30", unread: 2, avatar: "https://i.pravatar.cc/150?img=11" },
  { id: 2, name: "Siti Nurhaliza", lastMessage: "Baik, saya transfer DP-nya ya.", time: "Kemarin", unread: 0, avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 3, name: "Budi Santoso", lastMessage: "Katalog paket yang platinum bisa dikirim?", time: "Senin", unread: 0, avatar: "https://i.pravatar.cc/150?img=12" },
];

const DUMMY_MESSAGES = [
  { id: 1, sender: "client", text: "Halo kak, mau tanya untuk paket Wedding Decoration Pro.", time: "10:00" },
  { id: 2, sender: "vendor", text: "Halo Kak Andi! Ada yang bisa kami bantu? Paket tersebut masih tersedia.", time: "10:05" },
  { id: 3, sender: "client", text: "Apakah tanggal 12 Mei masih kosong?", time: "10:30" },
];

export default function PesanPage() {
  const { t } = useLanguage();
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="space-y-1 mb-6">
          <h1 className="text-3xl font-black tracking-tight text-[#2A2A2A]">{t('dashboard.pesan.title')}</h1>
          <p className="text-sm font-medium uppercase tracking-widest text-slate-400">
            {t('dashboard.pesan.subtitle')}
          </p>
        </div>

        <div className="flex flex-1 overflow-hidden bg-white rounded-3xl border border-[#2A2A2A]/5 shadow-sm">
          {/* Chat List Sidebar */}
          <div className="w-1/3 border-r border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <div className="relative">
                  <input 
                  type="text" 
                  placeholder={t('dashboard.pesan.searchPlaceholder')} 
                  className="w-full bg-[#FDF1F0]/50 border border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 focus:bg-white focus:border-[#FF9A9E] transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {DUMMY_CHATS.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChat(chat.id)}
                  className={`flex items-center gap-4 p-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 ${activeChat === chat.id ? 'bg-[#FDF1F0]/30 border-l-4 border-l-[#FF9A9E]' : 'border-l-4 border-l-transparent'}`}
                >
                  <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-[#2A2A2A] truncate">{chat.name}</h4>
                      <span className="text-[10px] font-bold text-slate-400">{chat.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 bg-[#FF527B] rounded-full flex items-center justify-center text-white text-[10px] font-black">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {activeChat ? (
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="h-20 border-b border-slate-100 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <img src={DUMMY_CHATS.find(c => c.id === activeChat)?.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="text-sm font-bold text-[#2A2A2A]">{DUMMY_CHATS.find(c => c.id === activeChat)?.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <button className="hover:text-[#FF527B] transition-colors"><Phone className="w-5 h-5" /></button>
                  <button className="hover:text-[#FF527B] transition-colors"><Video className="w-5 h-5" /></button>
                  <button className="hover:text-[#FF527B] transition-colors"><MoreVertical className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAFAFC]">
                <div className="text-center mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white px-4 py-1.5 rounded-full border border-slate-100">
                    {t('dashboard.pesan.today')}
                  </span>
                </div>
                {DUMMY_MESSAGES.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'vendor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                      msg.sender === 'vendor' 
                        ? 'bg-[#FF9A9E] text-white rounded-br-sm' 
                        : 'bg-white border border-slate-100 text-[#2A2A2A] rounded-bl-sm'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <div className={`text-[9px] font-bold mt-2 text-right ${msg.sender === 'vendor' ? 'text-white/70' : 'text-slate-400'}`}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-100 bg-white">
                <div className="flex items-center gap-3">
                  <button className="p-3 text-slate-400 hover:text-[#FF9A9E] transition-colors rounded-full hover:bg-slate-50">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={t('dashboard.pesan.inputPlaceholder')} 
                      className="w-full bg-[#F7F9FC] border border-transparent rounded-full py-3 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 focus:bg-white focus:border-[#FF9A9E] transition-all"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#FF9A9E] transition-colors">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <button 
                    onClick={handleSend}
                    className="p-3 bg-[#2A2A2A] text-white rounded-full hover:bg-black transition-colors shadow-md shadow-black/10 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-[#FAFAFC]">
              <MessageCircle className="w-16 h-16 mb-4 text-slate-200" />
              <p className="text-sm font-bold">{t('dashboard.pesan.emptyState')}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
