import { DayPlan, Profile } from "./types";

export function calcBMI(bb: string, tb: string) {
  if (!bb || !tb) return null;
  const bmi = Number(bb) / Math.pow(Number(tb) / 100, 2);
  const cat =
    bmi < 18.5
      ? "Underweight"
      : bmi < 25
      ? "Normal"
      : bmi < 30
      ? "Overweight"
      : "Obesitas";
  return { val: bmi.toFixed(1), cat };
}

export async function generateMealPlan(profile: Profile, day: number): Promise<DayPlan> {
  const res = await fetch("/api/generate-meal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, day }),
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}
