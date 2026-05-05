"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User, Save, Loader2, CheckCircle } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  full_name: string;
  bio: string;
  hourly_rate: string;
  skills: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    bio: "",
    hourly_rate: "",
    skills: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/");
        return;
      }
      setUser(data.user);
      loadProfile(data.user.id);
    });
  }, []);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) {
      setProfile({
        full_name: data.full_name || "",
        bio: data.bio || "",
        hourly_rate: data.hourly_rate || "",
        skills: data.skills || "",
      });
    }
    setLoading(false);
  }

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="text-center py-20 text-white/30">Loading...</div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-white/50">Your details auto-fill in the Proposal Writer so you don't retype them every time.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4 pb-4 border-b border-white/10">
          <div className="w-14 h-14 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <User className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <p className="font-medium">{profile.full_name || "Your Name"}</p>
            <p className="text-sm text-white/40">{user?.email}</p>
          </div>
        </div>

        {/* Full name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Full Name</label>
          <input
            type="text"
            placeholder="e.g. Elizabeth Komuntaleliz"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Professional Bio</label>
          <p className="text-xs text-white/30">This auto-fills in the Proposal Writer</p>
          <Textarea
            placeholder="e.g. 3 years React and Next.js experience. Built 5+ dashboards for e-commerce clients. Delivered projects on time consistently."
            className="min-h-[100px] resize-none bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500 rounded-xl"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Key Skills</label>
          <input
            type="text"
            placeholder="e.g. React, Next.js, Tailwind CSS, Node.js"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500"
            value={profile.skills}
            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
          />
        </div>

        {/* Hourly rate */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Default Hourly Rate (USD)</label>
          <input
            type="number"
            placeholder="e.g. 50"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500"
            value={profile.hourly_rate}
            onChange={(e) => setProfile({ ...profile, hourly_rate: e.target.value })}
          />
        </div>

        <Button
          onClick={saveProfile}
          disabled={saving}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 font-medium"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckCircle className="w-4 h-4 mr-2" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4 mr-2" /> Save Profile</>
          )}
        </Button>
      </div>
    </main>
  );
}
