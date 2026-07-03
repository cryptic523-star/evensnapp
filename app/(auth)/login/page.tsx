import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApertureLogo } from "@/components/layout/aperture-logo";

export default function LoginPage() {
  async function signIn(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    });
    if (!error) redirect("/dashboard");
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-[320px]">
        <div className="mb-11 flex items-center gap-2.5">
          <ApertureLogo size={26} />
          <span className="text-lg font-semibold tracking-tight">EventSnap</span>
        </div>
        <h2 className="mb-1 text-xl font-semibold tracking-tight">Sign in</h2>
        <p className="mb-7 text-[13px] text-t3">Create professional marketing content in seconds.</p>
        <form action={signIn} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wide text-t3">Email</label>
            <input type="email" name="email" placeholder="you@business.com" required style={{padding:'10px 13px',background:'#17171a',border:'1px solid #252529',borderRadius:'9px',color:'#f0f0f2',fontFamily:'inherit',fontSize:'14px',outline:'none',width:'100%'}} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wide text-t3">Password</label>
            <input type="password" name="password" placeholder="Enter password" required style={{padding:'10px 13px',background:'#17171a',border:'1px solid #252529',borderRadius:'9px',color:'#f0f0f2',fontFamily:'inherit',fontSize:'14px',outline:'none',width:'100%'}} />
          </div>
          <button type="submit" style={{background:'#2563eb',color:'#fff',border:'none',borderRadius:'9px',padding:'11px',fontSize:'14px',fontWeight:600,cursor:'pointer',width:'100%',fontFamily:'inherit'}}>Sign in</button>
        </form>
        <p style={{textAlign:'center',marginTop:'18px',fontSize:'12px',color:'#55555f'}}>
          No account?{" "}
          <Link href="/signup" style={{color:'#2563eb'}}>Start free trial</Link>
        </p>
      </div>
    </div>
  );
}
