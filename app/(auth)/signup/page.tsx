"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApertureLogo } from "@/components/layout/aperture-logo";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName }),
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-[320px]">
        <div className="mb-11 flex items-center gap-2.5">
          <ApertureLogo size={26} />
          <span className="text-lg font-semibold tracking-tight">EventSnap</span>
        </div>
        <h2 className="mb-1 text-xl font-semibold tracking-tight">Create your account</h2>
        <p className="mb-7 text-[13px] text-t3">Start generating on-brand marketing images in minutes.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wide text-t3">Full name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jamie Davis" style={{padding:'10px 13px',background:'#17171a',border:'1px solid #252529',borderRadius:'9px',color:'#f0f0f2',fontFamily:'inherit',fontSize:'14px',outline:'none',width:'100%'}} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wide text-t3">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@business.com" required style={{padding:'10px 13px',background:'#17171a',border:'1px solid #252529',borderRadius:'9px',color:'#f0f0f2',fontFamily:'inherit',fontSize:'14px',outline:'none',width:'100%'}} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wide text-t3">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" minLength={8} required style={{padding:'10px 13px',background:'#17171a',border:'1px solid #252529',borderRadius:'9px',color:'#f0f0f2',fontFamily:'inherit',fontSize:'14px',outline:'none',width:'100%'}} />
          </div>
          {error && <p style={{fontSize:'12px',color:'#ef4444'}}>{error}</p>}
          <button type="submit" disabled={loading} style={{background:'#2563eb',color:'#fff',border:'none',borderRadius:'9px',padding:'11px',fontSize:'14px',fontWeight:600,cursor:'pointer',width:'100%',fontFamily:'inherit',opacity:loading?0.6:1}}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'18px',fontSize:'12px',color:'#55555f'}}>
          Already have an account? <Link href="/login" style={{color:'#2563eb'}}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
