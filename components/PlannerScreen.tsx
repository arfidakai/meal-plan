"use client";

import { useState, useEffect } from "react";
import { DayPlan, Profile } from "@/lib/types";
import { DAYS, MEAL_CONFIGS } from "@/lib/constants";
import { generateMealPlan } from "@/lib/utils";

export function PlannerScreen({ profile }: { profile: Profile }) {
  const [activeDay, setActiveDay] = useState(0);
  const [plans, setPlans] = useState<Record<number, DayPlan>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function loadDay(day: number) {
    setLoading(true);
    setError("");
    generateMealPlan(profile, day)
      .then((result) => {
        setPlans((p) => ({ ...p, [day]: result }));
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal generate. Coba lagi ya!");
        setLoading(false);
      });
  }

  useEffect(() => {
    if (!plans[activeDay]) loadDay(activeDay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay]);

  const plan = plans[activeDay];

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Meal Plan</h1>
        <p>Hi {profile.nama}! Ini jadwal makan sehatmu</p>
      </div>
      <div className="day-tabs">
        {DAYS.map((d, i) => (
          <button
            key={i}
            className={"day-tab" + (activeDay === i ? " day-tab-active" : "")}
            onClick={() => setActiveDay(i)}
          >
            {d}
          </button>
        ))}
      </div>
      {error && <div className="error-msg">{error}</div>}
      {(MEAL_CONFIGS[profile.frekuensiMakan] ?? MEAL_CONFIGS["3"]).map((meal) => {
        const mealData = plan && plan[meal.key];
        return (
          <div key={meal.key} className="meal-slot">
            <div className="meal-slot-header">
              <span className="meal-slot-title">{meal.label}</span>
              <span className="meal-time">{meal.time}</span>
            </div>
            <div className="meal-content">
              {loading ? (
                <div>
                  <div className="skeleton" style={{ width: "60%" }} />
                  <div className="skeleton" style={{ width: "90%" }} />
                  <div className="skeleton" style={{ width: "40%" }} />
                </div>
              ) : mealData ? (
                <div>
                  <div className="meal-name">{mealData.nama}</div>
                  <div className="meal-desc">{mealData.deskripsi}</div>
                  <div className="meal-meta">
                    <span className="meal-pill meal-pill-green">Clean</span>
                    <span className="meal-pill">{mealData.kalori}</span>
                    <span className="meal-pill">{mealData.estimasi_harga}</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 20, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
                  Loading...
                </div>
              )}
            </div>
          </div>
        );
      })}
      {!loading && (
        <button className="btn-regen" onClick={() => loadDay(activeDay)}>
          Generate Ulang Hari Ini
        </button>
      )}
    </div>
  );
}
