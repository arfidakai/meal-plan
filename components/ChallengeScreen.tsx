"use client";

import { useState, useEffect } from "react";
import { Challenge } from "@/lib/types";

export function ChallengeScreen({ sessionId }: { sessionId: string }) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "avoid" as "avoid" | "streak", target: "", duration: "7" });

  useEffect(() => {
    if (!sessionId) return;
    fetch("/api/challenges", { headers: { "x-session-id": sessionId } })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setChallenges(data); })
      .catch(() => {});
  }, [sessionId]);

  function getTodayIndex(challenge: Challenge) {
    const daysPassed = Math.floor((Date.now() - challenge.createdAt) / 86400000);
    return Math.min(daysPassed, challenge.duration - 1);
  }

  function toggleCheckin(cid: number, dayIndex: number) {
    let updatedCheckins: boolean[] | null = null;
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== cid) return c;
        const today = getTodayIndex(c);
        if (dayIndex > today) return c;
        const next = [...c.checkins];
        next[dayIndex] = !next[dayIndex];
        updatedCheckins = next;
        return { ...c, checkins: next };
      })
    );
    if (sessionId && updatedCheckins !== null) {
      fetch("/api/challenges", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify({ id: cid, checkins: updatedCheckins }),
      }).catch(() => {});
    }
  }

  function deleteChallenge(cid: number) {
    setChallenges((prev) => prev.filter((c) => c.id !== cid));
    if (sessionId) {
      fetch("/api/challenges", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify({ id: cid }),
      }).catch(() => {});
    }
  }

  function addChallenge() {
    if (!form.title || !form.duration) return;
    const dur = parseInt(form.duration, 10);
    if (!dur || dur < 1) return;
    const newC: Challenge = {
      id: Date.now(),
      title: form.title,
      type: form.type,
      target: form.target,
      duration: dur,
      checkins: [],
      createdAt: Date.now(),
    };
    setChallenges((prev) => [newC, ...prev]);
    setForm({ title: "", type: "avoid", target: "", duration: "7" });
    setShowForm(false);
    if (sessionId) {
      fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify(newC),
      }).catch(() => {});
    }
  }

  function getStreak(challenge: Challenge) {
    const today = getTodayIndex(challenge);
    let streak = 0;
    for (let i = today; i >= 0; i--) {
      if (challenge.checkins[i]) streak++;
      else break;
    }
    return streak;
  }

  function getDoneCount(challenge: Challenge) {
    return challenge.checkins.filter(Boolean).length;
  }

  function isCompleted(challenge: Challenge) {
    const today = getTodayIndex(challenge);
    return today >= challenge.duration - 1 && getDoneCount(challenge) === challenge.duration;
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Challenge</h1>
        <p>Buktiin konsistensi kamu!</p>
      </div>

      {challenges.length === 0 && !showForm && (
        <div className="empty-challenge">
          <div style={{ fontSize: 40 }}>🎯</div>
          <p>Belum ada challenge nih.</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Tambahin yang pertama yuk!</p>
        </div>
      )}

      {challenges.map((c) => {
        const today = getTodayIndex(c);
        const done = getDoneCount(c);
        const streak = getStreak(c);
        const pct = Math.round((done / c.duration) * 100);
        const completed = isCompleted(c);

        return (
          <div key={c.id} className="challenge-card">
            <div className="challenge-card-header">
              <div className="challenge-top">
                <div>
                  <div className="challenge-title">{c.title}</div>
                  {c.target && (
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Hindari: {c.target}</div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span
                    className={
                      "challenge-badge " +
                      (completed ? "badge-done" : c.type === "avoid" ? "badge-avoid" : "badge-streak")
                    }
                  >
                    {completed ? "Selesai!" : c.type === "avoid" ? "Hindari" : "Streak"}
                  </span>
                  <button className="btn-danger" onClick={() => deleteChallenge(c.id)}>Hapus</button>
                </div>
              </div>

              {streak > 1 && (
                <div className="streak-badge">
                  <span>🔥 {streak} hari streak!</span>
                </div>
              )}

              <div className="progress-wrap">
                <div
                  className={"progress-bar" + (completed ? " progress-bar-gold" : "")}
                  style={{ width: pct + "%" }}
                />
              </div>
              <div className="challenge-meta">
                <span>{done} / {c.duration} hari</span>
                <span>{pct}% selesai</span>
              </div>
            </div>

            {completed ? (
              <div className="completed-banner">Selamat, lo berhasil! Keep it up!</div>
            ) : (
              <div className="checkin-row">
                {Array.from({ length: c.duration }, (_, i) => {
                  const isPast = i < today;
                  const isToday = i === today;
                  const isFuture = i > today;
                  const checked = !!c.checkins[i];
                  let cls = "day-dot";
                  if (checked) cls += " day-dot-done";
                  else if (isToday) cls += " day-dot-today";
                  else if (isFuture) cls += " day-dot-future";

                  return (
                    <div key={i} className="day-dot-wrap">
                      <div className={cls} onClick={() => { if (!isFuture) toggleCheckin(c.id, i); }}>
                        {checked ? "✓" : i + 1}
                      </div>
                      <div className="day-dot-label">
                        {isToday ? "Hari ini" : isPast ? "H" + (i + 1) : "H" + (i + 1)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {showForm ? (
        <div className="add-challenge-form">
          <div className="form-title">Challenge Baru</div>
          <div className="type-selector">
            <button
              className={"type-btn" + (form.type === "avoid" ? " type-btn-active-avoid" : "")}
              onClick={() => setForm((f) => ({ ...f, type: "avoid" }))}
            >
              Hindari Makanan
            </button>
            <button
              className={"type-btn" + (form.type === "streak" ? " type-btn-active-streak" : "")}
              onClick={() => setForm((f) => ({ ...f, type: "streak" }))}
            >
              Makan Sehat Rutin
            </button>
          </div>
          <div className="input-group" style={{ marginBottom: 10 }}>
            <label>Nama Challenge</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder={form.type === "avoid" ? "Contoh: No Gorengan" : "Contoh: Makan Sehat 7 Hari"}
            />
          </div>
          {form.type === "avoid" && (
            <div className="input-group" style={{ marginBottom: 10 }}>
              <label>Makanan yang dihindari</label>
              <input
                value={form.target}
                onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))}
                placeholder="Contoh: Gorengan, Nasi putih, Sugar..."
              />
            </div>
          )}
          <div className="input-group" style={{ marginBottom: 14 }}>
            <label>Durasi (hari)</label>
            <input
              type="number"
              value={form.duration}
              min="1"
              max="90"
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
              placeholder="7"
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" style={{ flex: 2 }} onClick={addChallenge}>
              Mulai Challenge!
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                background: "var(--bg)",
                border: "1.5px solid var(--border)",
                borderRadius: 16,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "DM Sans",
                cursor: "pointer",
                color: "var(--muted)",
              }}
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Tambah Challenge
        </button>
      )}
    </div>
  );
}
