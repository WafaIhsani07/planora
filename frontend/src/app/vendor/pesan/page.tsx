"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/store/authStore';
import { getBookings, getBookingMessages, sendBookingMessage } from '@/services/bookings.service';
import { format } from 'date-fns';

interface ChatUser {
  bookingId: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
  };
}

export default function VendorPesanPage() {
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const [chats, setChats] = useState<ChatUser[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch list of chats (bookings)
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await getBookings();
        const bookings = Array.isArray(res?.data?.data) ? res.data.data : (Array.isArray(res?.data) ? res.data : []);
        
        const uniqueCustomers = new Map<string, ChatUser>();
        
        bookings.forEach((booking: any) => {
          const customerId = booking.customerId;
          if (!customerId) return;
          
          if (!uniqueCustomers.has(customerId)) {
            const customerName = booking.customer?.name || 'Customer';
            const avatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(customerName) + '&background=random';
            
            uniqueCustomers.set(customerId, {
              bookingId: booking.id,
              name: customerName,
              lastMessage: 'Ketuk untuk melihat pesan',
              time: format(new Date(booking.createdAt), 'HH:mm'),
              unread: 0,
              avatar,
            });
          }
        });
        
        setChats(Array.from(uniqueCustomers.values()));
      } catch (error) {
        console.error("Failed to fetch bookings for chats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChats();
  }, []);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChatId) return;
    
    const fetchMessages = async () => {
      try {
        const msgs = await getBookingMessages(activeChatId);
        setMessages(msgs || []);
        setTimeout(() => scrollToBottom(), 100);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    
    fetchMessages();
    // Poll every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [activeChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!messageInput.trim() || !activeChatId) return;
    
    const textToSend = messageInput;
    setMessageInput("");
    
    // Optimistic UI update
    const tempMsg: Message = {
      id: Date.now().toString(),
      bookingId: activeChatId,
      senderId: (user as any)?.id || '',
      content: textToSend,
      isRead: true,
      createdAt: new Date().toISOString(),
      sender: {
        id: (user as any)?.id || '',
        name: user?.name || 'You',
        avatar: (user as any)?.avatar || (user as any)?.image || null,
        role: 'VENDOR'
      }
    };
    
    setMessages(prev => [...prev, tempMsg]);
    setTimeout(() => scrollToBottom(), 100);
    
    try {
      await sendBookingMessage(activeChatId, textToSend);
      // Let the polling fetch the real message
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const activeChat = chats.find(c => c.bookingId === activeChatId);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-8">
      <div className="space-y-1 mb-6">
        <h1 className="text-3xl font-black tracking-tight text-[#2A2A2A]">{t('dashboard.pesan.title') || 'Pesan'}</h1>
        <p className="text-sm font-medium uppercase tracking-widest text-slate-400">
          {t('dashboard.pesan.subtitle') || 'Komunikasi dengan klien Anda'}
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden bg-white rounded-3xl border border-[#2A2A2A]/5 shadow-sm">
        {/* Chat List Sidebar */}
        <div className="w-1/3 border-r border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <div className="relative">
                <input 
                type="text" 
                placeholder={t('dashboard.pesan.searchPlaceholder') || 'Cari pesan...'} 
                className="w-full bg-[#FDF1F0]/50 border border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 focus:bg-white focus:border-[#FF9A9E] transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <span className="text-slate-400 font-medium">Memuat...</span>
              </div>
            ) : chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageCircle className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-sm">Belum ada obrolan.</p>
              </div>
            ) : (
              chats.map((chat) => (
                <div 
                  key={chat.bookingId} 
                  onClick={() => setActiveChatId(chat.bookingId)}
                  className={`flex items-center gap-4 p-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 ${activeChatId === chat.bookingId ? 'bg-[#FDF1F0]/30 border-l-4 border-l-[#FF9A9E]' : 'border-l-4 border-l-transparent'}`}
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
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {activeChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="h-20 border-b border-slate-100 flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <img src={activeChat.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-[#2A2A2A]">{activeChat.name}</h3>
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
                  {t('dashboard.pesan.today') || 'Hari ini'}
                </span>
              </div>
              {messages.length === 0 ? (
                <div className="text-center text-slate-400 py-10">
                  Mulai percakapan dengan {activeChat.name}
                </div>
              ) : (
                messages.map((msg) => {
                  const currentUserId = (user as any)?.id;
                  // Gunakan role sebagai deteksi utama (konsisten dengan pesanan/page.tsx)
                  // Karena halaman ini adalah vendor dashboard, pesan dari VENDOR = milik saya
                  const isMyMessage = msg.sender?.role === 'VENDOR' || 
                    (currentUserId && (msg.senderId === currentUserId || msg.sender?.id === currentUserId));
                  
                  return (
                    <div key={msg.id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                        isMyMessage 
                          ? 'bg-[#FF9A9E] text-white rounded-br-sm' 
                          : 'bg-white border border-slate-100 text-[#2A2A2A] rounded-bl-sm'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <div className={`text-[9px] font-bold mt-2 text-right ${isMyMessage ? 'text-white/70' : 'text-slate-400'}`}>
                          {format(new Date(msg.createdAt), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
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
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t('dashboard.pesan.inputPlaceholder') || 'Ketik pesan...'} 
                    className="w-full bg-[#F7F9FC] border border-transparent rounded-full py-3 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/30 focus:bg-white focus:border-[#FF9A9E] transition-all"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#FF9A9E] transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={handleSend}
                  disabled={!messageInput.trim()}
                  className="p-3 bg-[#2A2A2A] text-white rounded-full hover:bg-black transition-colors shadow-md shadow-black/10 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-[#FAFAFC]">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6">
              <MessageCircle className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-[#2A2A2A] mb-2">{t('dashboard.pesan.emptyTitle') !== 'dashboard.pesan.emptyTitle' ? t('dashboard.pesan.emptyTitle') : 'Pilih Obrolan'}</h3>
            <p className="text-sm">{t('dashboard.pesan.emptySubtitle') !== 'dashboard.pesan.emptySubtitle' ? t('dashboard.pesan.emptySubtitle') : 'Silakan pilih obrolan dari daftar untuk mulai membalas pesan.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
