export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white font-sans">
      {/* Sleek top loading progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFDED7]/40 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#FF9A9E] via-[#FF527B] to-[#FF9A9E] rounded-full animate-progress" style={{ width: '40%' }} />
      </div>

      <div className="flex flex-col items-center gap-5">
        {/* Pulsing Spinner Icon Container */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100/80" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#FF527B] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <span className="text-xl animate-bounce">✨</span>
        </div>

        {/* Branding text */}
        <div className="text-center mt-2 flex flex-col items-center">
          <span className="font-logo text-3xl italic font-bold leading-none tracking-tighter text-slate-800">
            Planora
          </span>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] mt-2">
            Preparing your experience
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        
        .font-logo {
          font-family: 'Playfair Display', serif;
        }
        
        @keyframes progressAnimation {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(250%); }
        }
        .animate-progress {
          animation: progressAnimation 1.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}