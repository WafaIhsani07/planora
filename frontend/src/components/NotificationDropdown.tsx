"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Circle, ExternalLink, Calendar, MessageSquare, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { getUnreadCount, getMyNotifications, markAsRead, markAllAsRead } from "@/services/notifications.service";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { language } = useLanguage();

  const fetchUnreadCount = async () => {
    try {
      const result = await getUnreadCount();
      setUnreadCount(result?.count || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const result = await getMyNotifications(1, 10);
      setNotifications(result?.notifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Poll unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif: any) => {
    // Mark as read
    if (!notif.isRead) {
      try {
        await markAsRead(notif.id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      } catch (e) {
        console.error(e);
      }
    }

    setIsOpen(false);

    // Navigate based on type
    const data = notif.data || {};
    if (notif.type === "BOOKING") {
      router.push(data.bookingId ? `/vendor/pesanan/${data.bookingId}` : '/vendor/pesanan');
    } else if (notif.type === "MESSAGE") {
      router.push('/vendor/pesan');
    } else if (notif.type === "PAYMENT" || notif.type === "WITHDRAWAL") {
      router.push('/vendor/keuangan');
    } else if (notif.type === "SYSTEM") {
      router.push('/vendor/pengaturan');
    }
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "BOOKING": return <Calendar className="w-5 h-5 text-indigo-500" />;
      case "MESSAGE": return <MessageSquare className="w-5 h-5 text-emerald-500" />;
      case "PAYMENT": 
      case "WITHDRAWAL": return <Check className="w-5 h-5 text-amber-500" />;
      default: return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgForType = (type: string) => {
    switch (type) {
      case "BOOKING": return "bg-indigo-50";
      case "MESSAGE": return "bg-emerald-50";
      case "PAYMENT": 
      case "WITHDRAWAL": return "bg-amber-50";
      default: return "bg-blue-50";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#2A2A2A]/40 hover:text-[#FF9A9E] transition-colors cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF527B] text-[9px] font-bold text-white border-2 border-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white border border-[#2A2A2A]/5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-[#2A2A2A]">Notifikasi</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-[#FF527B] hover:text-[#FF9A9E] transition-colors"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 text-sm font-medium flex flex-col items-center">
                <div className="w-6 h-6 border-2 border-[#FF9A9E] border-t-transparent rounded-full animate-spin mb-3"></div>
                Memuat notifikasi...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-[#2A2A2A] mb-1">Tidak ada notifikasi</p>
                <p className="text-xs text-slate-400">Anda belum memiliki notifikasi apapun saat ini.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex items-start gap-4 p-4 hover:bg-slate-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-[#FDF1F0]/20' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgForType(notif.type)}`}>
                      {getIconForType(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-sm font-bold truncate ${!notif.isRead ? 'text-[#2A2A2A]' : 'text-[#2A2A2A]/80'}`}>
                          {notif.title}
                        </h4>
                        {!notif.isRead && <Circle className="w-2 h-2 text-[#FF527B] fill-[#FF527B] shrink-0 mt-1.5" />}
                      </div>
                      <p className={`text-xs line-clamp-2 leading-relaxed mb-2 ${!notif.isRead ? 'text-slate-600' : 'text-slate-400'}`}>
                        {notif.message}
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {formatDistanceToNow(new Date(notif.createdAt), { 
                          addSuffix: true,
                          locale: language === 'id' ? localeId : undefined
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
            <button className="text-xs font-bold text-[#A8A8A8] hover:text-[#2A2A2A] transition-colors flex items-center justify-center gap-1.5 w-full">
              Lihat semua notifikasi <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
