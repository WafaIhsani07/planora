"use client";
 
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "../../../lib/categories";
import { useRouter } from "next/navigation";
import { Briefcase, Building, ChevronDown, Eye, EyeOff, Lock, Mail, MapPin, Phone, ShieldCheck, Sparkles, Upload } from "lucide-react";
import api from "@/lib/api";
import { signIn } from "next-auth/react";
import { getAllKategori } from "@/services/admin.service";

export default function RegisterPage() {
  const role = "VENDOR";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [ownerContact, setOwnerContact] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [categoriesList, setCategoriesList] = useState<any[]>(CATEGORIES);

  useEffect(() => {
    getAllKategori().then((data) => {
      if (data && data.length > 0) {
        const mapped = data.map((c: any) => ({
          id: c.slug || c.id,
          name: c.name,
        }));
        setCategoriesList(mapped);
      }
    }).catch(err => console.error("Failed to load categories:", err));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    if (!agreed) {
      setErrorMessage("You must agree to the terms & conditions first.");
      return;
    }

    if (!ownerName.trim()) {
      setErrorMessage("Owner name is required.");
      return;
    }

    if (!businessName.trim()) {
      setErrorMessage("Business name is required.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Password is required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password confirmation does not match.");
      return;
    }

    const contactValue = ownerContact.trim();
    const businessEmailValue = businessEmail.trim();
    let email = businessEmailValue.toLowerCase();
    let phone: string | undefined;

    if (!email) {
      if (contactValue.includes("@")) {
        email = contactValue.toLowerCase();
      } else {
        setErrorMessage("Business email is required.");
        return;
      }
    }

    if (contactValue && !contactValue.includes("@")) {
      phone = contactValue;
    }

    setIsSubmitting(true);
    let createdAccessToken = "";

    try {
      setSuccessMessage("Registering vendor account...");
      const registerResponse = await api.post("/auth/register", {
        name: ownerName.trim(),
        email,
        password,
        role,
        ...(phone ? { phone } : {}),
      });

      const accessToken =
        registerResponse.data?.data?.accessToken ?? registerResponse.data?.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found.");
      }

      createdAccessToken = accessToken;

      setSuccessMessage("Creating business profile...");
      await api.post(
        "/vendors/profile",
        {
          businessName: businessName.trim(),
          ...(city.trim() ? { city: city.trim() } : {}),
          ...(address.trim() ? { address: address.trim() } : {}),
          ...(category ? { description: `Main category: ${category}` } : {}),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setSuccessMessage("Registration successful!");
      setShowSuccessModal(true);
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setErrorMessage(message ?? "Registration failed. Please try again.");

      if (createdAccessToken) {
        try {
          await api.post("/auth/rollback-registration", {}, {
            headers: {
              Authorization: `Bearer ${createdAccessToken}`,
            },
          });
        } catch (rollbackErr) {
          console.error("Failed to rollback registration:", rollbackErr);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans text-slate-900 overflow-hidden bg-white text-base">
      <div className="relative hidden lg:flex lg:w-1/2 flex-col p-16 xl:p-24 justify-between overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80')",
          }}
        />
        <div className="absolute inset-0 z-10 bg-[#FFDED7]/90 backdrop-blur-[1px]" />

        <div className="relative z-20 flex items-center gap-3">
          <Image src="/images/logogmbr.png" alt="Planora" width={160} height={42} className="h-9 w-auto md:h-10" priority />
          <span className="font-logo text-[1.85rem] italic leading-none tracking-tighter text-black md:text-[2.15rem]">Planora</span>
          <Sparkles className="mt-[-6px] h-5 w-5 text-[#E94E77]" />
        </div>

        <div className="relative z-20 mt-10">
          <h1 className="text-5xl xl:text-6xl font-black leading-[1.05] mb-8 text-black tracking-tight">
            Start <br />
            Your Journey <br />
            <span className="text-[#FF527B] italic drop-shadow-md">With Planora</span>
          </h1>
          <p className="text-slate-700 font-bold text-lg max-w-md leading-relaxed opacity-85">
            Register as a vendor to reach thousands of clients and grow your business professionally.
          </p>
        </div>

        <div className="relative z-20 mt-auto space-y-8">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?u=v10" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" alt="User" />
              <img src="https://i.pravatar.cc/100?u=v11" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" alt="User" />
              <img src="https://i.pravatar.cc/100?u=v12" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" alt="User" />
            </div>
            <p className="text-sm font-bold text-slate-700">Join <span className="text-black font-black">10,000+</span> vendors</p>
          </div>
          <div className="max-w-md border-l-4 border-[#FF527B] pl-6">
            <p className="text-lg xl:text-xl font-black text-black leading-snug italic opacity-90">
              "Joining Planora helped me reach more clients and organize orders neatly."
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 md:p-20 overflow-y-auto">
        <div className="w-full max-w-[500px] py-8 md:py-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-slate-500 hover:text-[#FF9A9E] transition-colors text-sm font-semibold">
            ← Back to Home
          </Link>

          <div className="mb-10">
            <p className="text-slate-400 text-[11px] mb-2 font-bold uppercase tracking-[0.15em]">Welcome ✨</p>
            <h2 className="text-3xl md:text-[2rem] font-extrabold text-[#0D121F] mb-3 tracking-tight leading-tight">Planora Vendor <span className="text-[#FF9A9E]">Registration</span></h2>
            <p className="text-slate-400 text-sm font-medium">Already have an account? <Link href="/login" className="font-bold hover:underline" style={{color: '#FF9A9E'}}>Sign In Now</Link></p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {(errorMessage || successMessage) && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    errorMessage
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-[#FF9A9E]/20 bg-[#FF9A9E]/5 text-[#FF527B]"
                  }`}
                >
                  {errorMessage || successMessage}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Owner Name</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 px-6 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400"
                    value={ownerName}
                    onChange={(event) => setOwnerName(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Email / Phone Number</label>
                  <input
                    type="text"
                    placeholder="Email or Phone No."
                    className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 px-6 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400"
                    value={ownerContact}
                    onChange={(event) => setOwnerContact(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Business Name</label>
                <div className="relative group">
                  <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#FF9A9E] transition-colors" />
                  <input
                    type="text"
                    placeholder="e.g. Arkana Photography"
                    className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 pl-12 pr-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400"
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Service Category</label>
                <div className="relative">
                  <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 pl-12 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white transition-all text-slate-600 font-medium text-sm md:text-base cursor-pointer"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option value="">Select main category</option>
                    {categoriesList.map((category) => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Business Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#FF9A9E] transition-colors" />
                  <input
                    type="email"
                    placeholder="email@yourbusiness.com"
                    className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 pl-12 pr-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400"
                    value={businessEmail}
                    onChange={(event) => setBusinessEmail(event.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">City of Domicile</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#FF9A9E] transition-colors" />
                    <input
                      type="text"
                      placeholder="City Name"
                      className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 pl-12 pr-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Full Address</label>
                  <input
                    type="text"
                    placeholder="Address Details"
                    className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 px-6 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                  />
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#FF9A9E] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 Characters"
                    className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 pl-12 pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-300 hover:text-slate-500 transition-colors">{showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}</button>
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  className="w-full bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl py-4.5 px-6 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#FF9A9E]/20 focus:bg-white focus:border-[#FF9A9E] transition-all placeholder:text-slate-400"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-3 px-1 py-2">
              <div className="relative flex items-center mt-1">
                <input type="checkbox" id="agree" className="peer sr-only" checked={agreed} onChange={() => setAgreed(!agreed)} />
                <div className="w-5 h-5 bg-slate-100 border border-slate-300 rounded-md peer-checked:bg-[#FF9A9E] peer-checked:border-[#FF9A9E] transition-all cursor-pointer" onClick={() => setAgreed(!agreed)} />
                <svg className="absolute w-3 h-3 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
              </div>
              <label htmlFor="agree" className="text-sm font-bold text-slate-500 cursor-pointer select-none leading-tight">I agree to the <button type="button" className="text-[#FF9A9E] hover:underline transition-all">Terms & Conditions</button> and <button type="button" className="text-[#FF9A9E] hover:underline transition-all">Planora Policy</button>.</label>
            </div>

            <button
              className="w-full bg-[#0D121F] text-white font-bold py-4.5 rounded-2xl shadow-xl transition-all text-base md:text-lg mt-4 hover:bg-slate-800 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              disabled={isSubmitting || !agreed}
            >
              {isSubmitting ? "Processing..." : "Register Now"}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#EDF2F7]"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.25em] font-black text-slate-300"><span className="bg-white px-4">or register with</span></div>
          </div>

          <button className="w-full bg-white border border-[#E2E8F0] text-slate-700 font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#F7F9FC] transition-all shadow-sm mb-12">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" /> Google
          </button>

          <div className="flex items-center gap-4 bg-[#FF9A9E]/5 p-5 rounded-[24px] border border-[#FF9A9E]/10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"><ShieldCheck className="w-5 h-5 text-[#FF9A9E]" /></div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-bold">Your registration data is secure. We guarantee confidentiality in accordance with Planora's global security standards.</p>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl text-center transform scale-95 transition-all duration-300 ease-out animate-scale-in">
            <div className="mx-auto w-16 h-16 bg-[#FF9A9E]/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-[#FF527B]" />
            </div>

            <h3 className="text-2xl font-extrabold text-[#0D121F] mb-4 tracking-tight leading-tight">
              Account Created Successfully!
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
              Your vendor account has been created and is currently pending verification from our admin. Once your account is verified, a notification email will be sent to your registered address and you will be able to log in.
            </p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full bg-[#0D121F] hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all text-base shadow-lg shadow-slate-900/10 cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        button, input, select, textarea { font-family: inherit; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}