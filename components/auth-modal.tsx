"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase"; // Ensure this path is correct
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Facebook, Twitter, Mail } from "lucide-react";

export default function AuthModal() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (provider: 'google' | 'twitter' | 'facebook') => {
    setLoading(true);
    // This redirects the user to the provider
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error(error);
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
          Login / Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Join the Community</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          
          {/* GOOGLE */}
          <Button variant="outline" onClick={() => handleLogin('google')} className="flex items-center gap-3 h-12 text-md border-slate-300 relative">
             <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z"/><path fill="#EA4335" d="M12 4.62c1.61 0 3.06.56 4.23 1.68l3.17-3.17C17.46 1.05 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
             Continue with Google
          </Button>

          {/* TWITTER / X */}
          <Button variant="outline" onClick={() => handleLogin('twitter')} className="flex items-center gap-3 h-12 text-md border-slate-300">
            <Twitter className="w-5 h-5 text-sky-500" fill="currentColor" />
            Continue with Twitter
          </Button>

          {/* FACEBOOK */}
          <Button variant="outline" onClick={() => handleLogin('facebook')} className="flex items-center gap-3 h-12 text-md border-slate-300">
            <Facebook className="w-5 h-5 text-blue-700" fill="currentColor" />
            Continue with Facebook
          </Button>
          
          <p className="text-center text-xs text-slate-400 mt-2">
            By joining, you agree to our Terms of Service.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}