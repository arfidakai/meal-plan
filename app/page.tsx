"use client";

import { useState, useEffect } from "react";
import { Profile } from "@/lib/types";
import { ProfileScreen, ProfileViewScreen } from "@/components/ProfileScreen";
import { PlannerScreen } from "@/components/PlannerScreen";
import { ChallengeScreen } from "@/components/ChallengeScreen";
import { TipsScreen } from "@/components/TipsScreen";
import { PreferencesScreen } from "@/components/PreferencesScreen";
import { StockScreen } from "@/components/StockScreen";
import appStyle from "@/styles/appStyle";

type Screen = "profile" | "planner" | "challenge" | "tips" | "preferences" | "stock";

export default function App() {
  const [screen, setScreen] = useState<Screen>("profile");
  const [profile, setProfile] = useState<Profile>({
    nama: "", bb: "", tb: "", usia: "", gender: "",
    aktivitas: "", tujuan: "", budget: "30000", frekuensiMakan: "3",
    likes: [], dislikes: [],
  });
  const [saved, setSaved] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    let id = localStorage.getItem("cleaneat_session");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("cleaneat_session", id);
    }
    setSessionId(id);
    fetch("/api/setup", { method: "POST" }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    fetch("/api/profile", { headers: { "x-session-id": sessionId } })
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setProfile({
            nama: data.nama ?? "",
            bb: data.bb ?? "",
            tb: data.tb ?? "",
            usia: data.usia ?? "",
            gender: data.gender ?? "",
            aktivitas: data.aktivitas ?? "",
            tujuan: data.tujuan ?? "",
            budget: data.budget ?? "30000",
            frekuensiMakan: data.frekuensiMakan ?? "3",
            likes: data.likes ?? [],
            dislikes: data.dislikes ?? [],
          });
          setSaved(true);
          setScreen("planner");
        }
      })
      .catch(() => {});
  }, [sessionId]);

  function handleSave() {
    setSaved(true);
    setEditingProfile(false);
    setScreen("planner");
    if (sessionId) {
      fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify(profile),
      }).catch(() => {});
    }
  }

  const navItems = [
    { key: "profile" as Screen, icon: "👤", label: "Profil" },
    { key: "planner" as Screen, icon: "🥗", label: "Meal Plan" },
    { key: "challenge" as Screen, icon: "🎯", label: "Challenge" },
    { key: "preferences" as Screen, icon: "❤️", label: "Preferensi" },
    { key: "stock" as Screen, icon: "📦", label: "Stock" },
    { key: "tips" as Screen, icon: "💡", label: "Tips" },
  ];

  return (
    <div>
      <style>{appStyle}</style>
      <div className="app">
        <div className="status-bar">
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, color: "var(--sage-dark)" }}>
            CleanEat
          </span>
          <span>●●●</span>
        </div>

        {screen === "profile" && saved && !editingProfile && (
          <ProfileViewScreen profile={profile} onEdit={() => setEditingProfile(true)} />
        )}
        {screen === "profile" && (!saved || editingProfile) && (
          <ProfileScreen
            profile={profile}
            setProfile={setProfile}
            onSave={handleSave}
            saved={saved}
            mode={saved ? "edit" : "onboarding"}
          />
        )}
        {screen === "planner" && saved && <PlannerScreen profile={profile} />}
        {screen === "planner" && !saved && (
          <div className="screen">
            <div className="error-msg" style={{ marginTop: 20 }}>Isi profil dulu ya!</div>
          </div>
        )}
        {screen === "challenge" && <ChallengeScreen sessionId={sessionId} />}
        {screen === "preferences" && <PreferencesScreen sessionId={sessionId} onBack={() => setScreen("planner")} />}
        {screen === "stock" && <StockScreen sessionId={sessionId} onBack={() => setScreen("planner")} />}
        {screen === "tips" && <TipsScreen profile={profile} />}

        <nav className="bottom-nav">
          {navItems.map((n) => {
            const isActive = screen === n.key;
            return (
              <div key={n.key} className="nav-item" onClick={() => setScreen(n.key)}>
                <span className={"nav-icon" + (isActive ? " nav-icon-active" : "")}>{n.icon}</span>
                <span className={"nav-label" + (isActive ? " nav-label-active" : "")}>{n.label}</span>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
