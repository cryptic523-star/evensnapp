import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApertureLogo } from "@/components/layout/aperture-logo";

export default function SignupPage() {
  async function signUp(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      options: { data: { full_name: String(formData.get("fullName") || "") } },
    });
    if (!error) redirect("/login");
    redirect("/signup");
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
        <form action={signUp} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wide text-t3">Full name</label>
            <Input type="text" name="fullName" placeholder="Jamie Davis" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wide text-t3">Email</label>
            <Input type="email" name="email" placeholder="you@business.com" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wide text-t3">Password</label>
            <Input type="password" name="password" placeholder="Min. 8 characters" minLength={8} required />
          </div>
          <Button type="submit" className="w-full">Create account</Button>
        </form>
      </div>
    </div>
  );
}
